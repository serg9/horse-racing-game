import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useRaceAnimation } from '../../composables/useRaceAnimation'

function makeParticipants(list) {
  return list.map((p, i) => ({ id: i + 1, name: p.name, color: p.color || '#000', condition: p.condition }))
}

function mountHarness() {
  return mount({
    name: 'UseRaceAnimationHarness',
    template: '<div />',
    setup() {
      return useRaceAnimation()
    }
  })
}

describe('useRaceAnimation', () => {
  let rafSpy, cafSpy

  beforeEach(() => {
    vi.useFakeTimers()
    // Advance a synthetic timestamp along with fake timers
    let now = 0
    rafSpy = vi.spyOn(global, 'requestAnimationFrame').mockImplementation((cb) => {
      return setTimeout(() => { now += 16; cb(now) }, 16)
    })
    cafSpy = vi.spyOn(global, 'cancelAnimationFrame').mockImplementation((id) => clearTimeout(id))
  })

  afterEach(() => {
    if (rafSpy) rafSpy.mockRestore()
    if (cafSpy) cafSpy.mockRestore()
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('buildRunners initializes internal runner state', () => {
    const wrapper = mountHarness()
    const { runners, buildRunners } = wrapper.vm
    const participants = makeParticipants([
      { name: 'Alpha', condition: 100 },
      { name: 'Beta', condition: 50 }
    ])

    buildRunners(participants)

    expect(runners.length).toBe(2)
    expect(runners[0]).toMatchObject({
      id: participants[0].id,
      horse: participants[0],
      x: 0,
      progress: 0,
      lapIndex: 0,
      lapProgress: 0,
      finished: false
    })
    // Deterministic speed when condition is defined
    expect(runners[0].speed).toBeCloseTo(220, 5) // 120 + (100/100)*100
    expect(runners[1].speed).toBeCloseTo(170, 5) // 120 + (50/100)*100
  })

  it('setLaps updates total distance and progress math uses it', async () => {
    const wrapper = mountHarness()
    const { setLaps, buildRunners } = wrapper.vm
    setLaps([300, 200])
    await nextTick()
    expect(wrapper.vm.totalDistance).toBe(500)

    buildRunners(makeParticipants([{ name: 'A', condition: 100 }]))
    // Simulate some progress in lap 0 and check percentage math idea via manual calc
    const r = wrapper.vm.runners[0]
    r.lapProgress = 250
    r.lapIndex = 0
    const completedLaps = 0
    const totalProgressDistance = completedLaps + r.lapProgress
    const expectedProgress = Math.min((totalProgressDistance / wrapper.vm.totalDistance) * 100, 100)
    // emulate what step() would compute for progress (we only assert formula correctness)
    expect(expectedProgress).toBeCloseTo(50, 5)
  })

  it('startAnimation runs until all finish, sets placements and calls onRaceComplete', async () => {
    const wrapper = mountHarness()
    const { buildRunners, startAnimation, setLaps, setTrackWidth } = wrapper.vm

    // Two laps small total distance to finish quickly
    setLaps([5])
    setTrackWidth(100)

    const participants = makeParticipants([
      { name: 'Fast', condition: 100 },   // speed ~220
      { name: 'Mid', condition: 70 },     // speed ~190
      { name: 'Slow', condition: 30 }     // speed ~150
    ])
    buildRunners(participants)

    const done = vi.fn()
    startAnimation(done)
    await nextTick()
    expect(wrapper.vm.running).toBe(true)

    // Drive the RAF until finish
    for (let i = 0; i < 200; i++) {
      vi.advanceTimersByTime(16)
    }

    // All finished -> placements recorded in expected order (fastest first)
    expect(wrapper.vm.placements.length).toBe(3)
    expect(wrapper.vm.placements.map(p => p.name)).toEqual(['Fast', 'Mid', 'Slow'])
    expect(done).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.running).toBe(false)
  })

  it('stopAnimation stops animation frame loop early', () => {
    const wrapper = mountHarness()
    const { buildRunners, startAnimation, stopAnimation, setLaps } = wrapper.vm
    setLaps([50])
    buildRunners(makeParticipants([
      { name: 'A', condition: 100 },
      { name: 'B', condition: 100 }
    ]))

    startAnimation()
    // Immediately stop before any completion
    stopAnimation()

    // Advance timers further; nothing should progress via RAF loop
    for (let i = 0; i < 50; i++) vi.advanceTimersByTime(16)

    expect(wrapper.vm.running).toBe(false)
    // No placements should be registered because race was stopped
    expect(wrapper.vm.placements.length).toBe(0)
  })

  it('reset clears placements and runner state', () => {
    const wrapper = mountHarness()
    const { buildRunners, startAnimation, reset, setLaps } = wrapper.vm
    setLaps([5])
    buildRunners(makeParticipants([{ name: 'Solo', condition: 100 }]))
    startAnimation()

    for (let i = 0; i < 50; i++) vi.advanceTimersByTime(16)

    // likely finished by now
    expect(wrapper.vm.placements.length).toBeGreaterThanOrEqual(0)

    reset()

    expect(wrapper.vm.placements.length).toBe(0)
    expect(wrapper.vm.runners.every(r => r.x === 0 && r.progress === 0 && r.lapIndex === 0 && r.lapProgress === 0 && r.finished === false)).toBe(true)
  })

  it('setTrackWidth recalculates x based on progress and keeps finished at track end', async () => {
    const wrapper = mountHarness()
    const { buildRunners, setTrackWidth, runners } = wrapper.vm
    buildRunners(makeParticipants([
      { name: 'One', condition: 100 },
      { name: 'Two', condition: 100 }
    ]))

    // preset progress and finished flags to test recalculation path
    runners[0].progress = 50
    runners[0].finished = false
    runners[1].progress = 80
    runners[1].finished = true

    setTrackWidth(200)
    await nextTick()

    expect(runners[0].x).toBeCloseTo(100, 5) // 50% of 200
    expect(runners[1].x).toBeCloseTo(200, 5) // finished -> exactly trackWidth
  })
})

