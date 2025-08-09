import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// We will dynamically import '../main.js' after setting up mocks in each test

// Helper factory to create fresh spies for createApp chain per test
const createVueMocks = () => {
  const mount = vi.fn()
  const use = vi.fn(() => ({ use, mount }))
  const appInstance = { use, mount }
  const createApp = vi.fn(() => appInstance)
  return { createApp, appInstance, use, mount }
}

// Keep references for inspection in tests
let vueSpies
// Use static import branches so Vite can analyze them at build time
const importMain = async (n) => {
  if (n === 1) return import('../main.js?test=1')
  if (n === 2) return import('../main.js?test=2')
  if (n === 3) return import('../main.js?test=3')
  return import('../main.js')
}

beforeEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
  vueSpies = createVueMocks()

  // Mock 'vue' to intercept createApp/use/mount
  vi.mock('vue', () => ({
    createApp: vueSpies.createApp
  }))

  // Mock App and Store imported by '../main.js'
  vi.mock('../App.vue', () => ({
    default: { name: 'AppMock' }
  }))

  vi.mock('../store', () => ({
    default: { __isStoreMock: true }
  }))
})

afterEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
  // Clean up any #app containers created
  document.querySelectorAll('#app').forEach((el) => el.remove())
})

describe.sequential('main.js app bootstrap', () => {
  it('creates app with App.vue and mounts to #app', async () => {
    // Ensure a container exists (not strictly needed since mount is mocked)
    const container = document.createElement('div')
    container.id = 'app'
    document.body.appendChild(container)

    const mod = await importMain(1)
    expect(mod).toBeTruthy() // import side-effect ran

    // Assert createApp called with mocked App component
    expect(vueSpies.createApp).toHaveBeenCalledTimes(1)
    const [[passedApp]] = vueSpies.createApp.mock.calls
    expect(passedApp).toEqual({ name: 'AppMock' })

    // Assert chaining: .use(store).mount('#app')
    expect(vueSpies.use).toHaveBeenCalledTimes(1)
    const [[passedStore]] = vueSpies.use.mock.calls
    expect(passedStore).toEqual({ __isStoreMock: true })

    expect(vueSpies.mount).toHaveBeenCalledTimes(1)
    expect(vueSpies.mount).toHaveBeenCalledWith('#app')
  })
})
