import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Helper to get a fresh store instance for each test run
const getFreshStore = async () => {
  vi.resetModules()
  const mod = await import('../../store/index.js')
  return mod.default
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('Vuex Store: state & mutations', () => {
  let store

  beforeEach(async () => {
    store = await getFreshStore()
  })

  it('has expected initial state', () => {
    expect(store.state.horses).toEqual([])
    expect(store.state.raceSchedule).toEqual([])
    expect(store.state.currentRound).toBe(0)
    expect(store.state.raceResults).toEqual([])
    expect(store.state.isRacing).toBe(false)
    expect(store.state.lapNames).toEqual([])
  })

  it('GENERATE_HORSES populates 20 horses with required fields', () => {
    store.commit('GENERATE_HORSES')
    const { horses } = store.state
    expect(Array.isArray(horses)).toBe(true)
    expect(horses.length).toBe(20)

    horses.forEach((h, idx) => {
      expect(h).toHaveProperty('id', idx + 1)
      expect(typeof h.name).toBe('string')
      expect(typeof h.color).toBe('string')
      expect(typeof h.condition).toBe('number')
      expect(h.condition).toBeGreaterThanOrEqual(1)
      expect(h.condition).toBeLessThanOrEqual(100)
      expect(h).toHaveProperty('position', 0)
    })
  })

  it('GENERATE_SCHEDULE creates 6 rounds with 10 participants each and resets round/results/laps', () => {
    store.commit('GENERATE_HORSES')
    store.commit('GENERATE_SCHEDULE')

    const { raceSchedule, currentRound, raceResults, lapNames, horses } = store.state
    expect(raceSchedule.length).toBe(6)
    expect(currentRound).toBe(0)
    expect(raceResults).toEqual([])
    expect(Array.isArray(lapNames)).toBe(true)
    expect(lapNames.length).toBe(6)

    raceSchedule.forEach(r => {
      expect(typeof r.distance).toBe('number')
      expect(Array.isArray(r.participants)).toBe(true)
      expect(r.participants.length).toBe(10)
      r.participants.forEach(p => {
        expect(horses.find(h => h.id === p.id)).toBeTruthy()
      })
    })
  })

  it('SET_RACING toggles isRacing to provided boolean', () => {
    store.commit('SET_RACING', true)
    expect(store.state.isRacing).toBe(true)
    store.commit('SET_RACING', 0)
    expect(store.state.isRacing).toBe(false)
  })

  it('SET_CURRENT_ROUND clamps within [0, totalRounds-1]', () => {
    store.commit('GENERATE_HORSES')
    store.commit('GENERATE_SCHEDULE')
    const maxIndex = store.state.raceSchedule.length - 1

    store.commit('SET_CURRENT_ROUND', 2)
    expect(store.state.currentRound).toBe(2)

    store.commit('SET_CURRENT_ROUND', -5)
    expect(store.state.currentRound).toBe(0)

    store.commit('SET_CURRENT_ROUND', 999)
    expect(store.state.currentRound).toBe(maxIndex)
  })

  it('SET_CURRENT_ROUND coerces non-number inputs using Number(value) || 0', () => {
    store.commit('GENERATE_HORSES')
    store.commit('GENERATE_SCHEDULE')
    const maxIndex = store.state.raceSchedule.length - 1

    // String number should coerce
    store.commit('SET_CURRENT_ROUND', '2')
    expect(store.state.currentRound).toBe(Math.min(2, maxIndex))

    // Null should become 0 via Number(null)=0
    store.commit('SET_CURRENT_ROUND', null)
    expect(store.state.currentRound).toBe(0)

    // NaN should fall back to 0 due to || 0
    store.commit('SET_CURRENT_ROUND', 'not-a-number')
    expect(store.state.currentRound).toBe(0)
  })

  it('SET_GAME_OVER sets boolean flag', () => {
    expect(store.state.gameOver).toBe(false)
    store.commit('SET_GAME_OVER', true)
    expect(store.state.gameOver).toBe(true)
    store.commit('SET_GAME_OVER', 0)
    expect(store.state.gameOver).toBe(false)
  })

  it('ADD_RACE_RESULT appends payload to raceResults', () => {
    const payload = { round: 1, results: [{ id: 1 }, { id: 2 }] }
    store.commit('ADD_RACE_RESULT', payload)
    expect(store.state.raceResults).toEqual([payload])
    const payload2 = { round: 2, results: [{ id: 3 }] }
    store.commit('ADD_RACE_RESULT', payload2)
    expect(store.state.raceResults).toEqual([payload, payload2])
  })

  it('ADD_RACE_RESULT initializes raceResults to [] when not an array', () => {
    // Manually corrupt state then ensure mutation guards against it
    store.state.raceResults = null
    const payload = { round: 1, results: [] }
    store.commit('ADD_RACE_RESULT', payload)
    expect(store.state.raceResults).toEqual([payload])
  })

  it('ADD_RACE_RESULT sets gameOver when results reach total rounds', () => {
    // Prepare schedule with total rounds
    store.commit('GENERATE_HORSES')
    store.commit('GENERATE_SCHEDULE')
    // Simulate racing state
    store.commit('SET_RACING', true)
    const total = store.state.raceSchedule.length
    // Add results up to total
    for (let i = 1; i <= total; i++) {
      store.commit('ADD_RACE_RESULT', { round: i, results: [] })
    }
    expect(store.state.isRacing).toBe(false)
    expect(store.state.gameOver).toBe(true)
  })
})

describe('Vuex Store: getters', () => {
  let store

  beforeEach(async () => {
    store = await getFreshStore()
  })

  it('hasProgram reflects presence of raceSchedule', () => {
    expect(store.getters.hasProgram).toBe(false)
    store.commit('GENERATE_HORSES')
    store.commit('GENERATE_SCHEDULE')
    expect(store.getters.hasProgram).toBe(true)
  })

  it('totalRounds equals raceSchedule.length', () => {
    expect(store.getters.totalRounds).toBe(0)
    store.commit('GENERATE_HORSES')
    store.commit('GENERATE_SCHEDULE')
    expect(store.getters.totalRounds).toBe(6)
  })

  it('canStartRace is true only when hasProgram and currentRound < totalRounds', () => {
    expect(store.getters.canStartRace).toBe(false)
    store.commit('GENERATE_HORSES')
    store.commit('GENERATE_SCHEDULE')
    expect(store.getters.canStartRace).toBe(true)
    store.commit('SET_CURRENT_ROUND', store.getters.totalRounds - 1)
    expect(store.getters.canStartRace).toBe(true)
    store.commit('SET_CURRENT_ROUND', store.getters.totalRounds)
    expect(store.getters.canStartRace).toBe(true)
  })

  it('raceButtonText switches between START/CONTINUE/PAUSE based on state', () => {
    expect(store.getters.raceButtonText).toBe('START')
    store.commit('SET_RACING', true)
    expect(store.getters.raceButtonText).toBe('PAUSE')
    store.commit('SET_RACING', false)
    // Need a schedule so SET_CURRENT_ROUND can be > 0 (otherwise clamps to 0)
    store.commit('GENERATE_HORSES')
    store.commit('GENERATE_SCHEDULE')
    store.commit('SET_CURRENT_ROUND', 1)
    expect(store.getters.raceButtonText).toBe('CONTINUE')
  })
})

describe('Vuex Store: actions', () => {
  let store

  beforeEach(async () => {
    store = await getFreshStore()
  })

  it('generateHorses populates horses via action', async () => {
    expect(store.state.horses.length).toBe(0)
    await store.dispatch('generateHorses')
    expect(store.state.horses.length).toBe(20)
  })

  it('generateSchedule builds schedule via action', async () => {
    // Typically run after horses exist
    await store.dispatch('generateHorses')
    expect(store.state.raceSchedule.length).toBe(0)
    await store.dispatch('generateSchedule')
    expect(store.state.raceSchedule.length).toBe(6)
  })

  it('toggleRacing flips isRacing', async () => {
    expect(store.state.isRacing).toBe(false)
    await store.dispatch('toggleRacing')
    expect(store.state.isRacing).toBe(true)
    await store.dispatch('toggleRacing')
    expect(store.state.isRacing).toBe(false)
  })

  it('restartGame triggers generateSchedule (via dispatch)', async () => {
    // Ensure horses exist so schedule participants fill properly
    await store.dispatch('generateHorses')
    expect(store.state.raceSchedule.length).toBe(0)
    await store.dispatch('restartGame')
    expect(store.state.raceSchedule.length).toBe(6)
  })
})

