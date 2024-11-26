<template>
  <div class="badge badge-lg" :class="badgeClass">
    <div class="flex items-center gap-2">
      <span class="w-3 h-3 rounded-full inline-block" :class="dotClass"></span>
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TaskPriority, TaskStatus } from "@/types/task";
import { computed } from "vue";

interface Props {
  type: "priority" | "status";
  value: TaskPriority | TaskStatus;
}

const props = defineProps<Props>();

const badgeClass = computed(() => {
  if (props.type === "priority") {
    return {
      "badge-ghost": props.value === "Low",
      "badge-warning/10": props.value === "Medium",
      "badge-error/10": props.value === "High",
    };
  }
  return {
    "badge-warning/10": props.value === "Pending",
    "badge-info/10": props.value === "In Progress",
    "badge-success/10": props.value === "Completed",
  };
});

const dotClass = computed(() => {
  if (props.type === "priority") {
    return {
      "bg-base-content/50": props.value === "Low",
      "bg-warning": props.value === "Medium",
      "bg-error": props.value === "High",
    };
  }
  return {
    "bg-warning": props.value === "Pending",
    "bg-info": props.value === "In Progress",
    "bg-success": props.value === "Completed",
  };
});

const label = computed(() => props.value);
</script>
