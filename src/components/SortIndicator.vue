<template>
  <span class="sort-indicator" :class="{ active }">
    {{ direction === "asc" ? "↑" : "↓" }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  active: boolean;
  direction: "asc" | "desc";
}>();
</script>

<style scoped>
.sort-indicator {
  margin-left: 0.25rem;
  opacity: 0.3;
}

.sort-indicator.active {
  opacity: 1;
}
</style>
