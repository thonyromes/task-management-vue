<template>
  <div
    class="inline-flex items-center transition-opacity duration-200"
    :class="{ 'opacity-30': !isActive }"
    role="img"
    :aria-label="`Sort by ${field} ${isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : ''}`"
  >
    <div class="flex flex-col" aria-hidden="true">
      <!-- Up Arrow -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-3 w-3 -mb-1"
        :class="{ 'text-primary': isActive && sortDirection === 'asc' }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 15l7-7 7 7"
        />
      </svg>
      <!-- Down Arrow -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-3 w-3 -mt-1"
        :class="{ 'text-primary': isActive && sortDirection === 'desc' }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  </div>
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
