import { watch } from 'vue'
import { useStore } from 'vuex'
import { useRaceState } from './useRaceState.js'
import { useRaceAnimation } from './useRaceAnimation.js'

/**
 * Main composable for race logic
 * Combines useRaceState and useRaceAnimation into a single API for components
 * Encapsulates all race business logic
 */
export function useRaceLogic() {
  const store = useStore()
  
  const { 
    raceState, 
    currentRoundData, 
    currentParticipants, 
    lapNames,
    setRacing, 
    setCurrentRound 
  } = useRaceState()
  
  const { 
    runners, 
    placements, 
    totalDistance,
    trackWidth,
    buildRunners, 
    startAnimation, 
    stopAnimation, 
    setLaps,
    setTrackWidth 
  } = useRaceAnimation()
  
  function initializeRace() {
    if (currentRoundData.value?.distance) {
      setLaps([currentRoundData.value.distance])
    }
    
    buildRunners(currentParticipants.value)

    placements.value = []
  }
  
  function handleRaceComplete() {
    store.commit('ADD_RACE_RESULT', {
      round: raceState.value.currentRound + 1,
      distance: currentRoundData.value?.distance || totalDistance.value,
      placements: placements.value.slice()
    })
    
    const nextRound = raceState.value.currentRound + 1
    
    if (nextRound < raceState.value.schedule.length) {
      setCurrentRound(nextRound)
      
      const nextRoundData = raceState.value.schedule[nextRound]
      if (nextRoundData?.distance) {
        setLaps([nextRoundData.distance])
      }
      
      if (nextRoundData?.participants) {
        const nextParticipants = nextRoundData.participants.map(p => p._custom?.value || p)
        buildRunners(nextParticipants)
        placements.value = []
        
        startAnimation(handleRaceComplete)
      }
    } else {
      setRacing(false)
    }
  }
  
  function start() {
    startAnimation(handleRaceComplete)
  }
  
  function setupWatchers() {
    watch(
      [() => raceState.value.currentRound, () => currentParticipants.value], 
      () => {
        stopAnimation()
        initializeRace()
        
        if (raceState.value.isRacing) {
          start()
        }
      }, 
      { deep: false }
    )
    
    watch(
      () => raceState.value.isRacing, 
      (isRacing) => {
        if (isRacing) {
          start()
        } else {
          stopAnimation()
        }
      }, 
      { immediate: false }
    )
  }
  
  // Public API for components
  return {
    // Reactive state
    raceState,        // Current race state (round, schedule, status)
    runners,          // Array of runners with their positions
    lapNames,         // Lap names ('1ST', '2ND', etc.)
    totalDistance,    // Total distance of the current lap
    trackWidth,       // Track width for synchronization
    
    // Methods for components
    initializeRace,   // Initialize race for the current round
    setTrackWidth,    // Set track width for synchronization
    setupWatchers     // Setup reactive watchers
  }
}
