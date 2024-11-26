<template>
  <div
    class="modal modal-open"
    role="dialog"
    aria-labelledby="modal-title"
    aria-modal="true"
  >
    <div
      class="modal-box relative max-w-2xl transform transition-all duration-300 bg-base-100"
      :class="{
        'scale-100 opacity-100': true,
        'scale-95 opacity-0': loading,
      }"
    >
      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 transition-transform hover:rotate-90"
        :disabled="loading"
        aria-label="Close modal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
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

      <!-- Modal Content -->
      <div class="pt-2">
        <h3 id="modal-title" class="text-2xl font-bold mb-6">
          {{ task ? "Edit Task" : "Create New Task" }}
        </h3>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Title Input -->
          <div class="form-control w-full">
            <label for="title" class="label">
              <span class="label-text font-medium">Title</span>
              <span class="label-text-alt text-error" aria-hidden="true"
                >Required</span
              >
            </label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              placeholder="Enter task title"
              class="input input-bordered w-full"
              :class="{ 'input-disabled': loading }"
              required
              :disabled="loading"
              aria-required="true"
              aria-invalid="false"
            />
          </div>

          <!-- Description Input -->
          <div class="form-control w-full">
            <label for="description" class="label">
              <span class="label-text font-medium">Description</span>
              <span class="label-text-alt text-error" aria-hidden="true"
                >Required</span
              >
            </label>
            <textarea
              id="description"
              v-model="formData.description"
              class="textarea textarea-bordered h-24"
              :class="{ 'textarea-disabled': loading }"
              placeholder="Enter task description"
              required
              :disabled="loading"
              aria-required="true"
              aria-invalid="false"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Status Select -->
            <div class="form-control w-full">
              <label for="status" class="label">
                <span class="label-text font-medium">Status</span>
              </label>
              <select
                id="status"
                v-model="formData.status"
                class="select select-bordered w-full"
                :class="{ 'select-disabled': loading }"
                required
                :disabled="loading"
                aria-required="true"
              >
                <option
                  v-for="status in STATUSES"
                  :key="status"
                  :value="status"
                >
                  {{ status }}
                </option>
              </select>
            </div>

            <!-- Priority Select -->
            <div class="form-control w-full">
              <label for="priority" class="label">
                <span class="label-text font-medium">Priority</span>
              </label>
              <select
                id="priority"
                v-model="formData.priority"
                class="select select-bordered w-full"
                :class="{ 'select-disabled': loading }"
                required
                :disabled="loading"
                aria-required="true"
              >
                <option
                  v-for="priority in PRIORITIES"
                  :key="priority"
                  :value="priority"
                >
                  {{ priority }}
                </option>
              </select>
            </div>
          </div>

          <!-- Due Date Input -->
          <div class="form-control w-full">
            <label for="dueDate" class="label">
              <span class="label-text font-medium">Due Date</span>
              <span class="label-text-alt text-error" aria-hidden="true"
                >Required</span
              >
            </label>
            <input
              id="dueDate"
              v-model="formData.dueDate"
              type="date"
              class="input input-bordered w-full"
              :class="{ 'input-disabled': loading }"
              required
              :disabled="loading"
              aria-required="true"
              aria-invalid="false"
            />
          </div>

          <!-- Modal Actions -->
          <div class="modal-action">
            <button
              type="button"
              @click="$emit('close')"
              class="btn btn-ghost transition-all duration-300 hover:scale-105"
              :class="{ 'opacity-50': loading }"
              :disabled="loading"
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary gap-2 transition-all duration-300 hover:scale-105"
              :class="{ loading: loading }"
              :disabled="loading"
              :aria-label="task ? 'Save changes' : 'Create task'"
            >
              <svg
                v-if="!loading"
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {{ task ? "Save Changes" : "Create Task" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PRIORITIES,
  STATUSES,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from "@/types/task";
import { onMounted, ref } from "vue";

const props = defineProps<{
  task?: Task;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", task: Partial<Task>): void;
}>();

interface FormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

const formData = ref<FormData>({
  title: "",
  description: "",
  status: "Pending",
  priority: "Low",
  dueDate: new Date().toISOString().split("T")[0],
});

onMounted(() => {
  if (props.task) {
    formData.value = {
      title: props.task.title,
      description: props.task.description,
      status: props.task.status,
      priority: props.task.priority,
      dueDate: new Date(props.task.dueDate).toISOString().split("T")[0],
    };
  }
});

const handleSubmit = () => {
  emit("save", formData.value);
};
</script>
