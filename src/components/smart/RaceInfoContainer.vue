<template>
  <div class="race-info-container">
    <RaceProgram
      :raceSchedule="raceSchedule"
      :lapNames="lapNames"
      class="race-component"
    />
    <RaceResults
      :raceResults="raceResults"
      :lapNames="lapNames"
      class="race-component"
    />
  </div>
</template>

<script setup>
import RaceResults from "../dumb/RaceResults.vue";
import RaceProgram from "../dumb/RaceProgram.vue";
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();

const raceSchedule = computed(() => store.state.raceSchedule);

const lapNames = computed(() => store.state.lapNames);

const raceResults = computed(() => store.state.raceResults);
</script>

<style lang="scss" scoped>
.race-info-container {
  display: flex;
  gap: 20px;
}

.race-component {
  flex: 1;
}
</style>
