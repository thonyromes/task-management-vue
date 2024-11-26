<template>
  <div class="subtasks-section">
    <h2 class="text-2xl font-bold mb-4">Subtasks</h2>

    <!-- Add Subtask Form -->
    <form @submit.prevent="handleAddSubtask" class="flex gap-2 mb-4">
      <input
        v-model="newSubtaskTitle"
        type="text"
        placeholder="New subtask..."
        class="input input-bordered flex-1"
        required
      />
      <button type="submit" class="btn btn-primary">Add Subtask</button>
    </form>

    <!-- Subtasks List -->
    <div v-if="subtasks.length" class="space-y-2">
      <div
        v-for="subtask in subtasks"
        :key="subtask.id"
        class="flex items-center justify-between bg-base-200 rounded-lg p-3"
      >
        <label class="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            class="checkbox"
            :checked="subtask.completed"
            @change="$emit('toggle', subtask.id, !subtask.completed)"
          />
          <span :class="{ 'line-through opacity-50': subtask.completed }">
            {{ subtask.title }}
          </span>
        </label>
        <button
          @click="$emit('delete', subtask.id)"
          class="btn btn-ghost btn-sm btn-circle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- No Subtasks Message -->
    <div v-else class="alert alert-info">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="stroke-current shrink-0 w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>No subtasks yet. Add one above.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Subtask } from "@/types/task";
import { ref } from "vue";

defineProps<{
  subtasks: Subtask[];
}>();

const emit = defineEmits<{
  (e: "add", title: string): void;
  (e: "toggle", id: number, completed: boolean): void;
  (e: "delete", id: number): void;
}>();

const newSubtaskTitle = ref("");

const handleAddSubtask = () => {
  if (!newSubtaskTitle.value.trim()) return;

  emit("add", newSubtaskTitle.value.trim());
  newSubtaskTitle.value = "";
};
</script>
