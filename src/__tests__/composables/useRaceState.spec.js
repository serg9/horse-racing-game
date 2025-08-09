import { createStore } from 'vuex'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { useRaceState } from '../../composables/useRaceState'

function makeStore(initial = {}) {
  return createStore({
    state: () => ({
      currentRound: initial.currentRound ?? 0,
      raceSchedule: initial.raceSchedule ?? [],
      isRacing: initial.isRacing ?? false,
      lapNames: initial.lapNames ?? ['1ST', '2ND']
    }),
    mutations: {
      SET_RACING(state, v) { state.isRacing = v },
      SET_CURRENT_ROUND(state, r) { state.currentRound = r }
    }
  })
}

function mountUsingComposable(store) {
  return mount({
    name: 'UseRaceStateHarness',
    template: '<div />',
    setup() {
      return useRaceState()
    }
  }, {
    global: { plugins: [store] }
  })
}

describe('useRaceState', () => {
  it('exposes computed state and reacts to mutations', async () => {
    const store = makeStore({
      currentRound: 1,
      raceSchedule: [
        { distance: 1200, participants: [{ name: 'A' }] },
        { distance: 1400, participants: [{ name: 'B' }] }
      ],
      isRacing: false
    })

    const wrapper = mountUsingComposable(store)
    const { raceState, currentRoundData, currentParticipants, lapNames, setRacing, setCurrentRound } = wrapper.vm

    // Initial values
    expect(raceState.currentRound).toBe(1)
    expect(raceState.isRacing).toBe(false)
    expect(Array.isArray(raceState.schedule)).toBe(true)
    expect(currentRoundData.distance).toBe(1400)
    expect(currentParticipants.map(p => p.name)).toEqual(['B'])
    expect(lapNames).toEqual(['1ST', '2ND'])

    // Commit via composable helpers
    setRacing(true)
    expect(store.state.isRacing).toBe(true)

    setCurrentRound(0)
    // Vuex mutation should update derived computeds
    expect(store.state.currentRound).toBe(0)
    expect(wrapper.vm.currentRoundData.distance).toBe(1200)
    expect(wrapper.vm.currentParticipants.map(p => p.name)).toEqual(['A'])
  })

  it('handles empty schedule and maps _custom.value participants', async () => {
    // Round with _custom participants mapping and an empty schedule case
    const schedule = [
      {
        distance: 1600,
        participants: [
          { name: 'Plain' },
          { _custom: { value: { name: 'FromCustom' } } }
        ]
      }
    ]
    const store = makeStore({ currentRound: 0, raceSchedule: schedule })
    const wrapper = mountUsingComposable(store)

    expect(wrapper.vm.currentParticipants.map(p => p.name)).toEqual(['Plain', 'FromCustom'])

    // Switch to a round that does not exist -> null and []
    wrapper.vm.setCurrentRound(5)
    expect(store.state.currentRound).toBe(5)
    expect(wrapper.vm.currentRoundData).toBe(null)
    expect(wrapper.vm.currentParticipants).toEqual([])
  })
})