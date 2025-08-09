import { describe, it, expect } from 'vitest'
import { shallowMount, mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App.vue', () => {
  it('mounts without crashing (smoke test)', () => {
    const wrapper = shallowMount(App)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the root container with class "app"', () => {
    const wrapper = shallowMount(App)
    const root = wrapper.find('div.app')
    expect(root.exists()).toBe(true)
  })

  it('includes HorseRacingGame child (stubbed in shallowMount)', () => {
    const wrapper = shallowMount(App)
    // Vue Test Utils shallowMount auto-stubs child component imported in App
    const childStub = wrapper.find('horse-racing-game-stub')
    expect(childStub.exists()).toBe(true)
  })

  it('can mount with an explicit stub for HorseRacingGame', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          HorseRacingGame: {
            name: 'HorseRacingGame',
            template: '<section data-test="horse-game-stub" />'
          }
        }
      }
    })

    expect(wrapper.find('[data-test="horse-game-stub"]').exists()).toBe(true)
  })

  it('matches the basic HTML structure snapshot', () => {
    const wrapper = shallowMount(App)
    expect(wrapper.html()).toMatchSnapshot()
  })
})

