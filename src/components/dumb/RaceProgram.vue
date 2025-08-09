<template>
  <div class="race-program">
    <h3>Program</h3>
    <div v-for="(race, i) in raceSchedule" :key="race.distance">
      <p class="race-program__lap">{{ lapNames[i] }} Lap - {{ race.distance }}</p>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(horse, index) in race.participants" :key="horse.id">
            <td>{{ index + 1 }}</td>
            <td>{{ horse.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
    raceSchedule: {
        type: Array,
        required: false,
    },
    lapNames: {
        type: Array,
        required: false,
    },
});
</script>

<style lang="scss">
.race-program {
  display: flex;
  flex-direction: column;
  overflow: auto;
  max-height: 700px;
}

.race-program__lap {
  font-weight: bold;
  margin-bottom: 1rem;
}
</style>
