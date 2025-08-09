<template>
  <header class="game-header">
    <h1>
      {{ title }}
      <span v-if="isGameOver" class="badge program-complete">PROGRAM COMPLETE</span>
    </h1>
    <div class="header-controls">
      <button class="btn generate-btn" @click="handleGenerateProgram">
        GENERATE PROGRAM
      </button>
      <button class="btn start-btn" :disabled="!canStartRace" @click="handleToggleRace">
        {{ raceButtonText }}
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed, defineProps, defineEmits } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "Horse Racing",
  },
  hasProgram: {
    type: Boolean,
    required: true,
  },
  isRacing: {
    type: Boolean,
    required: true,
  },
  currentRound: {
    type: Number,
    required: true,
  },
  totalRounds: {
    type: Number,
    required: true,
  },
  isGameOver: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["generate-program", "toggle-race", "restart"]);

const canStartRace = computed(() => {
  return props.hasProgram && (props.currentRound < props.totalRounds || props.isGameOver);
});

const raceButtonText = computed(() => {
  if (props.isGameOver) return "NEW PROGRAM";
  if (props.isRacing) return "PAUSE";
  return props.currentRound > 0 ? "CONTINUE" : "START";
});

const handleGenerateProgram = () => {
  emit("generate-program");
};

const handleToggleRace = () => {
  if (!canStartRace.value) return;
  if (props.isGameOver) emit("restart");
  else emit("toggle-race");
};
</script>

<style lang="scss">
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h1 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

.badge.program-complete {
  background-color: #4caf50;
  color: #fff;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.header-controls {
  display: flex;
  gap: 1rem;

  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;

    &.generate-btn {
      background-color: #e0e0e0;
      color: #333;

      &:hover {
        background-color: #d0d0d0;
      }
      &:disabled {
        background-color: #d0d0d0;
        cursor: not-allowed;
      }
    }

    &.start-btn {
      background-color: #4caf50;
      color: white;

      &:hover {
        background-color: #43a047;
      }
      &:disabled {
        background-color: #d0d0d0;
        cursor: not-allowed;
      }
    }
  }
}
</style>
