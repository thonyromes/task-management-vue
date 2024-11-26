<template>
  <div
    class="bg-base-100 rounded-box shadow-lg p-4 sm:p-6"
    role="main"
    aria-labelledby="task-title"
  >
    <!-- Task Header -->
    <div
      class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-8 mb-8"
    >
      <h1 id="task-title" class="text-xl sm:text-3xl font-bold break-words">
        {{ task.title }}
      </h1>
      <div
        class="flex flex-col sm:flex-row gap-2"
        role="toolbar"
        aria-label="Task actions"
      >
        <button
          @click="$emit('edit')"
          class="btn btn-info btn-outline gap-2 w-full sm:w-auto"
          aria-label="Edit task"
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit
        </button>
        <button
          @click="$emit('delete')"
          class="btn btn-error btn-outline gap-2 w-full sm:w-auto"
          aria-label="Delete task"
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Delete
        </button>
      </div>
    </div>

    <!-- Task Details -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      role="region"
      aria-label="Task details"
    >
      <div class="form-control">
        <label id="description-label" class="label">
          <span class="label-text font-semibold">Description</span>
        </label>
        <div
          class="bg-base-200 rounded-lg p-4"
          role="textbox"
          aria-labelledby="description-label"
        >
          {{ task.description }}
        </div>
      </div>

      <div class="space-y-4">
        <div class="form-control">
          <label id="status-label" class="label">
            <span class="label-text font-semibold">Status</span>
          </label>
          <Badge
            type="status"
            :value="task.status"
            aria-labelledby="status-label"
          />
        </div>

        <div class="form-control">
          <label id="priority-label" class="label">
            <span class="label-text font-semibold">Priority</span>
          </label>
          <Badge
            type="priority"
            :value="task.priority"
            aria-labelledby="priority-label"
          />
        </div>

        <div class="form-control">
          <label id="due-date-label" class="label">
            <span class="label-text font-semibold">Due Date</span>
          </label>
          <div
            class="badge badge-lg"
            role="text"
            aria-labelledby="due-date-label"
          >
            {{ formatDate(task.dueDate) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Subtasks Section -->
    <div class="divider" role="separator"></div>
    <SubtaskList
      :subtasks="task.subtasks"
      @add="$emit('addSubtask', $event)"
      @toggle="handleToggleSubtask"
      @delete="$emit('deleteSubtask', $event)"
    />
  </div>
</template>

<script setup lang="ts">
  import Badge from "@/components/Badge/Badge.vue";
  import SubtaskList from "@/components/Tasks/SubtaskList.vue";
  import type { Task } from "@/types/task";

  defineProps<{
    task: Task;
  }>();

  const emit = defineEmits<{
    (e: "edit"): void;
    (e: "delete"): void;
    (e: "addSubtask", title: string): void;
    (e: "toggleSubtask", id: number, completed: boolean): void;
    (e: "deleteSubtask", id: number): void;
  }>();

  const handleToggleSubtask = (id: number, completed: boolean) => {
    emit("toggleSubtask", id, completed);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };
</script>
