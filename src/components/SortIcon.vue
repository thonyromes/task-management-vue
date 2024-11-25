<template>
  <span class="sort-icon" :class="{ active: isActive }">
    {{ sortDirection === "asc" ? "↑" : "↓" }}
  </span>
</template>

<script setup lang="ts">
import { useTaskStore } from "@/stores/taskStore";
import type { SortableTaskField } from "@/types/task";
import { computed } from "vue";

const props = defineProps<{
  field: SortableTaskField;
}>();

const store = useTaskStore();

const isActive = computed(() => store.sort.field === props.field);
const sortDirection = computed(() => store.sort.direction);
</script>

<style scoped>
.sort-icon {
  display: inline-block;
  margin-left: 0.5rem;
  opacity: 0.3;
}

.sort-icon.active {
  opacity: 1;
}
</style>
