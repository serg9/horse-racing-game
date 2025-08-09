import { describe, it, expect, vi, afterEach } from 'vitest'

// We will mock the underlying modules that index.js re-exports from,
// then dynamically import the index to assert the bindings are correctly wired.

const logicMockFn = vi.fn()
const stateMockFn = vi.fn()
const animMockFn = vi.fn()

// Reset modules between tests so that fresh import() picks up mocks per test
afterEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
})

describe('composables/index re-exports', () => {
  it('re-exports useRaceLogic from useRaceLogic.js', async () => {
    vi.mock('../../composables/useRaceLogic.js', () => ({
      useRaceLogic: logicMockFn
    }))
    vi.mock('../../composables/useRaceState.js', () => ({
      useRaceState: stateMockFn
    }))
    vi.mock('../../composables/useRaceAnimation.js', () => ({
      useRaceAnimation: animMockFn
    }))

    const api = await import('../../composables/index.js')

    expect(typeof api.useRaceLogic).toBe('function')
    expect(api.useRaceLogic).toBe(logicMockFn)
  })

  it('re-exports useRaceState from useRaceState.js', async () => {
    vi.mock('../../composables/useRaceLogic.js', () => ({
      useRaceLogic: logicMockFn
    }))
    vi.mock('../../composables/useRaceState.js', () => ({
      useRaceState: stateMockFn
    }))
    vi.mock('../../composables/useRaceAnimation.js', () => ({
      useRaceAnimation: animMockFn
    }))

    const api = await import('../../composables/index.js')

    expect(typeof api.useRaceState).toBe('function')
    expect(api.useRaceState).toBe(stateMockFn)
  })

  it('re-exports useRaceAnimation from useRaceAnimation.js', async () => {
    vi.mock('../../composables/useRaceLogic.js', () => ({
      useRaceLogic: logicMockFn
    }))
    vi.mock('../../composables/useRaceState.js', () => ({
      useRaceState: stateMockFn
    }))
    vi.mock('../../composables/useRaceAnimation.js', () => ({
      useRaceAnimation: animMockFn
    }))

    const api = await import('../../composables/index.js')

    expect(typeof api.useRaceAnimation).toBe('function')
    expect(api.useRaceAnimation).toBe(animMockFn)
  })

  it('has only named exports (no default export)', async () => {
    // Minimal mocks to satisfy the re-exported modules on import
    vi.mock('../../composables/useRaceLogic.js', () => ({ useRaceLogic: logicMockFn }))
    vi.mock('../../composables/useRaceState.js', () => ({ useRaceState: stateMockFn }))
    vi.mock('../../composables/useRaceAnimation.js', () => ({ useRaceAnimation: animMockFn }))

    const api = await import('../../composables/index.js')

    expect('default' in api).toBe(false)
    expect(api.default).toBeUndefined()
  })
})

