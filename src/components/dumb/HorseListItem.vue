<template>
  <td>{{ horse.name }}</td>
  <td>{{ horse.condition }}</td>
  <td><div :style="{ backgroundColor: horse.color }" class="color-indicator"></div></td>
</template>

<script setup>
defineProps({
  horse: {
    type: Object,
    required: false,
  },
});
</script>

<style lang="scss">
.color-indicator {
  width: 20px;
  height: 20px;
  display: inline-block;
  margin-top: 4px;
}
</style>
