<template>
  <span :class="['status-badge', status.toLowerCase()]">
    {{ status }}
  </span>
</template>

<script setup lang="ts">
import type { TaskStatus } from "@/types/task";

defineProps<{
  status: TaskStatus;
}>();
</script>

<style scoped>
.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.pending {
  background: #fef3c7;
  color: #92400e;
}

.in-progress {
  background: #dbeafe;
  color: #1e40af;
}

.completed {
  background: #dcfce7;
  color: #166534;
}
</style>
