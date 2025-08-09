<template>
    <div class="race-results">
    <h3>Results</h3>
    <div v-for="(race, i) in raceResults" :key="race.distance">
    <p class="race-results__lap">{{ lapNames[i] }} Lap - {{ race.distance }}</p>
    <table>
      <thead>
        <tr>
          <th>Position</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="horse in race.placements" :key="horse.id">
          <td>{{ horse.place }}</td>
          <td>{{ horse.name }}</td>
        </tr>
      </tbody>
    </table>     
    </div>
    </div>
</template>

<script setup>
const props = defineProps({
    raceResults: {
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
.race-results {
    display: flex;
    flex-direction: column;
    overflow: auto;
    max-height: 700px;
}

.race-results__lap {
    font-weight: bold;
    margin-bottom: 1rem;
}
</style>
