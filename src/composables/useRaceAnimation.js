import { ref, reactive, computed, onBeforeUnmount } from 'vue'

/**
 * Composable for managing horse racing animation
 * Encapsulates all animation logic, runner state and calculations
 * Used internally in useRaceLogic
 */
export function useRaceAnimation() {
  // Animation state
  const runners = reactive([])
  const placements = ref([])
  const running = ref(false)
  const laps = ref([1200]) // Default distance
  const trackWidth = ref(800) // Track width in pixels (will be updated dynamically)
  
  // Private variables for animation
  let animationFrameId = 0
  let lastTimestamp = 0
  
  // Computed properties
  const totalDistance = computed(() => 
    laps.value.reduce((a, b) => a + b, 0)
  )
  
  /**
   * Builds an array of runners from participants
   * @param {Array} participants - Array of participants
   */
  function buildRunners(participants) {
    // Clear previous runners and create new ones
    runners.splice(0, runners.length, ...participants.map(horse => ({
      id: horse.id,
      horse,
      x: 0,
      progress: 0, // Progress in percentage (0-100)
      lapIndex: 0,
      lapProgress: 0,
      finished: false,
      speed: 120 + (horse.condition ? (horse.condition / 100) * 100 : Math.random() * 100)
    })))
  }
  
  /**
   * Main animation loop
   * @param {number} timestamp - Timestamp from requestAnimationFrame
   * @param {Function} onRaceComplete - Callback function for handling race completion
   */
  function step(timestamp, onRaceComplete = null) {
    if (!running.value) return
    
    if (!lastTimestamp) lastTimestamp = timestamp
    const deltaTime = (timestamp - lastTimestamp) / 1000 // Time in seconds
    lastTimestamp = timestamp
    
    let activeRunners = 0
    
    // Update each runner's position
    for (const runner of runners) {
      if (runner.finished) continue
      activeRunners++
      
      const currentLapDistance = laps.value[runner.lapIndex]
      const remainingDistance = currentLapDistance - runner.lapProgress
      const stepDistance = Math.min(runner.speed * deltaTime, remainingDistance)
      
      runner.lapProgress += stepDistance
      
      // Calculate total progress and position X
      const completedLapsDistance = laps.value
        .slice(0, runner.lapIndex)
        .reduce((total, lapDistance) => total + lapDistance, 0)
      const totalProgressDistance = completedLapsDistance + runner.lapProgress
      
      // Calculate progress in percentage (0-100)
      runner.progress = Math.min((totalProgressDistance / totalDistance.value) * 100, 100)
      
      // Calculate position X based on track width and progress
      runner.x = (runner.progress / 100) * trackWidth.value
      
      // Check for lap completion
      if (runner.lapProgress >= currentLapDistance - 0.0001) {
        runner.lapIndex++
        runner.lapProgress = 0
        
        // Check for race completion
        if (runner.lapIndex >= laps.value.length) {
          runner.finished = true
          runner.progress = 100
          runner.x = trackWidth.value
          activeRunners--
          
          // Register placement in the table
          const place = placements.value.length + 1
          placements.value.push({
            id: runner.horse.id,
            name: runner.horse.name,
            color: runner.horse.color,
            place
          })
        }
      }
    }
    
    // Continue animation if there are active runners
    if (activeRunners > 0) {
      animationFrameId = requestAnimationFrame((timestamp) => step(timestamp, onRaceComplete))
    } else {
      running.value = false
      // Call callback if all runners have finished
      if (onRaceComplete && typeof onRaceComplete === 'function') {
        onRaceComplete()
      }
    }
  }
  
  /**
   * Starts the animation
   * @param {Function} onRaceComplete - Callback function for handling race completion
   */
  function startAnimation(onRaceComplete = null) {
    if (running.value) return
    
    running.value = true
    lastTimestamp = 0
    placements.value = []
    
    animationFrameId = requestAnimationFrame((timestamp) => step(timestamp, onRaceComplete))
  }
  
  /**
   * Stops the animation
   */
  function stopAnimation() {
    running.value = false
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = 0
    }
  }
  
  /**
   * Resets the animation state
   */
  function reset() {
    stopAnimation()
    placements.value = []
    runners.forEach(runner => {
      runner.x = 0
      runner.progress = 0
      runner.lapIndex = 0
      runner.lapProgress = 0
      runner.finished = false
    })
  }
  
  /**
   * Sets the laps distance
   * @param {Array} newLaps - Array of lap distances
   */
  function setLaps(newLaps) {
    laps.value = [...newLaps]
  }

  /**
   * Sets the track width for correct position calculation
   * @param {number} width - Track width in pixels
   */
  function setTrackWidth(width) {
    trackWidth.value = width
    // Recalculate positions of all runners when track width changes
    runners.forEach(runner => {
      if (!runner.finished) {
        runner.x = (runner.progress / 100) * trackWidth.value
      } else {
        runner.x = trackWidth.value
      }
    })
  }
  
  // Clean up on component destruction
  onBeforeUnmount(() => {
    stopAnimation()
  })
  
  // Public API (only used externally in useRaceLogic)
  return {
    // Reactive state
    runners,
    placements,
    running,
    totalDistance,
    trackWidth,
    
    // Methods (internal to useRaceLogic)
    buildRunners,
    startAnimation,
    stopAnimation,
    reset,
    setLaps,
    setTrackWidth
  }
}
