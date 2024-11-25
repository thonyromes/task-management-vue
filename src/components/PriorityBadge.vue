<template>
  <span :class="['priority-badge', priority.toLowerCase()]">
    {{ priority }}
  </span>
</template>

<script setup lang="ts">
import type { TaskPriority } from "@/types/task";

defineProps<{
  priority: TaskPriority;
}>();
</script>

<style scoped>
.priority-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.low {
  background: #e5e7eb;
  color: #374151;
}

.medium {
  background: #fef3c7;
  color: #92400e;
}

.high {
  background: #fee2e2;
  color: #991b1b;
}
</style>
