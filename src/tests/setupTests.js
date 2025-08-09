import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/vue'

afterEach(() => {
  cleanup()
})

if (!global.requestAnimationFrame) {
  global.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16)
}
if (!global.cancelAnimationFrame) {
  global.cancelAnimationFrame = (id) => clearTimeout(id)
}

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = global.ResizeObserver || ResizeObserverMock

const originalError = console.error
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('Avoided redundant navigation')) return
  originalError(...args)
}