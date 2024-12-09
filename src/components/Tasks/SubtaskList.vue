<template>
  <div
    class="subtasks-section"
    role="region"
    aria-labelledby="subtasks-heading"
  >
    <h2 id="subtasks-heading" class="text-2xl font-bold mb-4">Subtasks</h2>

    <!-- Add Subtask Form -->
    <form
      @submit.prevent="handleAddSubtask"
      class="flex gap-2 mb-4 flex-col sm:flex-row"
      aria-label="Add new subtask"
    >
      <input
        v-model="newSubtaskTitle"
        type="text"
        placeholder="New subtask..."
        class="input input-bordered flex-1 min-h-12"
        required
        aria-label="Subtask title"
      />
      <button type="submit" class="btn btn-primary" aria-label="Add subtask">
        Add Subtask
      </button>
    </form>

    <!-- Subtasks List -->
    <div
      v-if="subtasks.length"
      class="space-y-2"
      role="list"
      aria-label="Subtasks list"
    >
      <div
        v-for="subtask in subtasks"
        :key="subtask.id"
        class="flex items-center justify-between bg-base-200 rounded-lg p-3"
        role="listitem"
      >
        <label class="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            class="checkbox"
            :checked="subtask.completed"
            @change="$emit('toggle', subtask.id, !subtask.completed)"
            :aria-label="`Mark ${subtask.title} as ${subtask.completed ? 'incomplete' : 'complete'}`"
          />
          <span
            :class="{ 'line-through opacity-50': subtask.completed }"
            :aria-checked="subtask.completed"
          >
            {{ subtask.title }}
          </span>
        </label>
        <button
          @click="$emit('delete', subtask.id)"
          class="btn btn-ghost btn-sm btn-circle"
          :aria-label="`Delete subtask: ${subtask.title}`"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
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
    <NoResults v-else message="No subtasks yet. Add one above." />
  </div>
</template>

<script setup lang="ts">
  import NoResults from "@/components/NoResults/NoResults.vue";
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
