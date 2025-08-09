import { computed } from 'vue'
import { useStore } from 'vuex'

/**
 * Composable for managing race state
 * Encapsulates access to Vuex store and provides reactive computed properties
 * Used internally in useRaceLogic
 */
export function useRaceState() {
  const store = useStore()
  
  const raceState = computed(() => ({
    currentRound: store.state.currentRound || 0,
    schedule: store.state.raceSchedule || [],
    isRacing: store.state.isRacing || false
  }))
  
  const currentRoundData = computed(() => 
    raceState.value.schedule[raceState.value.currentRound] || null
  )
  
  const currentParticipants = computed(() => 
    currentRoundData.value?.participants?.map(p => p._custom?.value || p) || []
  )
  
  const lapNames = computed(() => store.state.lapNames || [])
  
  const setRacing = (isRacing) => {
    store.commit('SET_RACING', isRacing)
  }
  
  const setCurrentRound = (round) => {
    store.commit('SET_CURRENT_ROUND', round)
  }
  
  return {
    raceState,
    currentRoundData,
    currentParticipants,
    lapNames,
    setRacing,
    setCurrentRound
  }
}
