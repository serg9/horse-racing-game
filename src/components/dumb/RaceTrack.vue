<template>
  <div class="race-track">
    <div class="horse-name-background">{{ horse?.name }}</div>
    <div class="horse-position">{{ id }}</div>
    <div class="lane">
      <RacingHorse :horse="horse" :id="id" :style="{ transform: `translateX(${x}px)` }" />
    </div>
  </div>
</template>

<script setup>
import RacingHorse from "./RacingHorse.vue";
const props = defineProps({
  horse: {
    type: Object,
    required: false,
  },
  id: {
    type: Number,
    required: false,
  },
  x: {
    type: Number,
    default: 0,
  },
});
</script>

<style lang="scss" scoped>
.race-track {
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 48px;
  background-color: var(--color-surface-dark);
  margin-top: 4px;
  position: relative;
}

.horse-name-background {
  position: absolute;
  top: -26%;
  left: 45px;
  font-size: 8px;
  font-weight: bold;
  color: #fff;
  pointer-events: none;
  background: var(--color-surface-dark);
  z-index: 0;
  white-space: nowrap;
  padding: 0 3px;
  user-select: none;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.horse-position {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  writing-mode: vertical-lr;
  text-orientation: mixed;
  background-color: var(--color-accent-green);
  padding: 0.5rem;
  height: 100%;
  margin: 0;
}

.lane {
  position: relative;
  flex: 1;
  height: 40px;
  overflow: hidden;
}

.lane .racing-horse {
  position: absolute;
  left: 0;
  top: 0;
  will-change: transform;
}
</style>
