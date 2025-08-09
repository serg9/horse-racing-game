<template>
  <div class="game-container">
    <Controls 
      :has-program="hasProgram"
      :is-racing="isRacing"
      :current-round="currentRound"
      :total-rounds="totalRounds"
      :is-game-over="isGameOver"
      @generate-program="handleGenerateProgram"
      @toggle-race="handleToggleRace"
      @restart="handleRestart"
    />

    <div class="game-content">
      <div class="horse-list-section">
        <HorseListContainer />
      </div>
      <div class="track-section">
        <RaceTrackContainer />
      </div>
      <div class="info-section">
        <RaceInfoContainer />
      </div>
    </div>
  </div>
</template>

<script setup>
import Controls from "../components/dumb/Controls.vue";
import HorseListContainer from "../components/smart/HorseListContainer.vue";
import RaceTrackContainer from "../components/smart/RaceTrackContainer.vue";
import RaceInfoContainer from "../components/smart/RaceInfoContainer.vue";
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();

const hasProgram = computed(() => store.getters.hasProgram);
const isRacing = computed(() => store.state.isRacing);
const currentRound = computed(() => store.state.currentRound);
const totalRounds = computed(() => store.getters.totalRounds);
const isGameOver = computed(() => store.getters.isGameOver);

const handleGenerateProgram = async () => {
  await store.dispatch("generateSchedule");
};

const handleToggleRace = () => {
  store.dispatch("toggleRacing");
};

const handleRestart = async () => {
  await store.dispatch("restartGame");
};

store.dispatch("generateHorses");

</script>

<style lang="scss" scoped>
.game-container {
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  padding: 1rem;
  box-sizing: border-box;
}

.game-content {
  display: grid;
  grid-template-columns: 260px 1fr 400px;
  gap: 1rem;
  flex: 1;
  overflow: hidden;
}

.horse-list-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  h2 {
    background-color: #ffeb3b;
    color: #333;
    margin: -1rem -1rem 1rem -1rem;
    padding: 0.5rem 1rem;
    font-size: 1.1rem;
  }
}

.track-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  > * {
    background-color: #fff;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex: 1;
    overflow: hidden;
    
    h2 {
      margin-top: 0;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #eee;
      
      &.program-header {
        color: #2196f3;
      }
      
      &.results-header {
        color: #4caf50;
      }
    }
  }
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .game-content {
    grid-template-columns: 1fr 2fr 1fr;
  }
}

@media (max-width: 900px) {
  .game-content {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }
  
  .info-section {
    flex-direction: row;
    
    > * {
      flex: 1;
    }
  }
}

@media (max-width: 600px) {
  .info-section {
    flex-direction: column;
  }
  
  .header-controls {
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    
    .btn {
      width: 100%;
    }
  }
}
</style>
