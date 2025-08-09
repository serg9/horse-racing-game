<template>
  <div
    v-if="raceState.currentRound < raceState.schedule.length"
    ref="containerRef"
    class="race-track-container"
  >
    <div class="distance-label">
      {{ lapNames[raceState.currentRound] || "1ST" }} {{ totalDistance }}m
    </div>
    <RaceTrack
      v-for="(r, index) in runners"
      :key="r.id"
      :horse="r.horse"
      :id="index + 1"
      :x="r.x"
    />
    <div class="finish-label">Finish</div>
  </div>
  <div ref="containerRef" class="race-track-container" v-else></div>
</template>

<script setup>
import RaceTrack from "../dumb/RaceTrack.vue";
import { useRaceLogic } from "../../composables";
import { onMounted, ref, nextTick } from "vue";

const {
  raceState,
  runners,
  lapNames,
  totalDistance,
  initializeRace,
  setupWatchers,
  setTrackWidth,
} = useRaceLogic();

const containerRef = ref(null);

// Function to calculate and set the track width
const updateTrackWidth = async () => {
  await nextTick();
  if (containerRef.value) {
    // Get the container width and subtract the padding
    const containerWidth = containerRef.value.offsetWidth;
    // Subtract the right padding (40px) and the finish line width (8px)
    const trackWidth = containerWidth - 48;
    setTrackWidth(Math.max(trackWidth, 200)); // Minimum width 200px
  }
};

onMounted(() => {
  initializeRace();
  setupWatchers();
  updateTrackWidth();
  
  // Listen for window resize events
  window.addEventListener('resize', updateTrackWidth);
});

// Clean up the listener when the component is destroyed
import { onBeforeUnmount } from 'vue';
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTrackWidth);
});
</script>

<style lang="scss">
.race-track-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: auto;
  max-height: 634px;
  min-height: 634px;
  position: relative;
  padding-bottom: 0px;
  padding-right: 40px;
}

.race-track-container::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  right: 40px;
  width: 8px;
  background: #e03a3a;
}

.race-track-container::before {
  content: "Please generate the race program";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #111;
  font-weight: bold;
  text-align: center;
}

.finish-label {
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  writing-mode: vertical-rl;
  text-orientation: mixed;
  color: #111;
  background: transparent;
  font-weight: 700;
  letter-spacing: 1px;
  z-index: 10;
  pointer-events: none;
}

.distance-label {
  background-color: #9e9e9e;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;
  pointer-events: none;
  text-align: center;
}
</style>
