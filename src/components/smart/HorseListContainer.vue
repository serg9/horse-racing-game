<template>
  <div>
    <h3>Horse List 1-20</h3>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Condition</th>
          <th>Color</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="horse in horses" :key="horse.id">
          <HorseListItem :horse="horse" />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import HorseListItem from "../dumb/HorseListItem.vue";
import { useStore } from "vuex";

const store = useStore();
const horses = store.state.horses;
</script>
