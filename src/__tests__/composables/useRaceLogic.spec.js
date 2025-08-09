import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { useRaceLogic } from '../../composables/useRaceLogic'

function makeHorses(names) {
  return names.map((name, i) => ({ id: i + 1, name, color: '#000', condition: 100 }))
}

function makeStore(initial = {}) {
  return createStore({
    state: () => ({
      currentRound: initial.currentRound ?? 0,
      raceSchedule: initial.raceSchedule ?? [],
      isRacing: initial.isRacing ?? false,
      lapNames: initial.lapNames ?? ['1ST', '2ND'],
      raceResults: []
    }),
    mutations: {
      SET_RACING(state, v) { state.isRacing = v },
      SET_CURRENT_ROUND(state, r) { state.currentRound = r },
      ADD_RACE_RESULT(state, payload) { state.raceResults.push(payload) }
    }
  })
}

function mountHarness(store) {
  return mount({
    name: 'UseRaceLogicHarness',
    template: '<div />',
    setup() {
      return useRaceLogic()
    }
  }, {
    global: { plugins: [store] }
  })
}

describe('useRaceLogic', () => {
  let rafSpy, cafSpy
  beforeEach(() => {
    vi.useFakeTimers()
    // Mock RAF to advance a synthetic timestamp alongside fake timers
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

  it('initializeRace sets laps from round distance, builds runners and clears placements', () => {
    const schedule = [
      { distance: 300, participants: makeHorses(['A', 'B']) }
    ]
    const store = makeStore({ currentRound: 0, raceSchedule: schedule })
    const wrapper = mountHarness(store)

    // preconditions
    expect(wrapper.vm.totalDistance).toBeDefined()

    // call initialize
    wrapper.vm.initializeRace()

    // laps -> totalDistance should equal current round distance
    expect(wrapper.vm.totalDistance).toBe(300)
    // runners built
    expect(wrapper.vm.runners.length).toBe(2)
    // placements cleared
    // placements is internal to animation, but effects visible by start/finish; at init it's reset
    // No direct access; ensure runners state is reset
    expect(wrapper.vm.runners.every(r => r.progress === 0)).toBe(true)
  })

  it('completes multi-round race and records results, then stops racing', async () => {
    // Small distances for quick finish; condition=100 gives high speed
    const schedule = [
      { distance: 10, participants: makeHorses(['A', 'B', 'C']) },
      { distance: 12, participants: makeHorses(['D', 'E', 'F']) }
    ]
    const store = makeStore({ currentRound: 0, raceSchedule: schedule, isRacing: false })
    const wrapper = mountHarness(store)

    // Ensure track not huge for x; not strictly needed but keeps math simple
    wrapper.vm.setTrackWidth(100)

    // Watchers should initialize and start when racing toggles on
    wrapper.vm.setupWatchers()
    wrapper.vm.initializeRace()

    // Start racing
    store.commit('SET_RACING', true)
    await nextTick() // flush watchers to call start()

    // Drive RAF via fake timers (setupTests maps RAF to setTimeout 16ms)
    // Run enough ticks to complete two short races
    for (let i = 0; i < 200; i++) {
      vi.advanceTimersByTime(16)
    }

    // After completion of both rounds
    expect(store.state.raceResults.length).toBe(2)
    // Each result contains round, distance, placements
    expect(store.state.raceResults[0].round).toBe(1)
    expect(store.state.raceResults[0].distance).toBe(10)
    expect(Array.isArray(store.state.raceResults[0].placements)).toBe(true)
    expect(store.state.raceResults[1].round).toBe(2)
    expect(store.state.raceResults[1].distance).toBe(12)

    // Racing should be turned off at the end of last round
    expect(store.state.isRacing).toBe(false)
  })
})

