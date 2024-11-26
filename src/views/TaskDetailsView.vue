<template>
  <div class="min-h-screen bg-base-200 p-4 sm:p-6">
    <div class="container mx-auto max-w-4xl">
      <!-- Header -->
      <div class="mb-8">
        <button @click="router.push('/')" class="btn btn-ghost gap-2">
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Dashboard
        </button>
      </div>

      <!-- Loading State -->
      <LoadingState
        v-if="loading"
        message="Loading task details..."
        spinner-type="spinner"
        spinner-size="lg"
      />

      <!-- Error State -->
      <ErrorState v-else-if="error" :message="error" @retry="loadTaskDetails" />

      <!-- Task Content -->
      <div v-else-if="task" class="bg-base-100 rounded-box shadow-lg p-6">
        <!-- Task Header -->
        <div class="flex justify-between items-start mb-8">
          <h1 class="text-3xl font-bold">{{ task.title }}</h1>
          <div class="flex gap-2">
            <button @click="handleEdit" class="btn btn-info btn-outline gap-2">
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>
            <button
              @click="handleDelete"
              class="btn btn-error btn-outline gap-2"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          </div>
        </div>

        <!-- Task Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">Description</span>
            </label>
            <div class="bg-base-200 rounded-lg p-4">{{ task.description }}</div>
          </div>

          <div class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Status</span>
              </label>
              <Badge type="status" :value="task.status" />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Priority</span>
              </label>
              <Badge type="priority" :value="task.priority" />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">Due Date</span>
              </label>
              <div class="badge badge-lg">{{ formatDate(task.dueDate) }}</div>
            </div>
          </div>
        </div>

        <!-- Subtasks Section -->
        <div class="divider"></div>
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
          <div v-if="task.subtasks.length" class="space-y-2">
            <div
              v-for="subtask in task.subtasks"
              :key="subtask.id"
              class="flex items-center justify-between bg-base-200 rounded-lg p-3"
            >
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  class="checkbox"
                  :checked="subtask.completed"
                  @change="toggleSubtask(subtask.id, !subtask.completed)"
                />
                <span :class="{ 'line-through opacity-50': subtask.completed }">
                  {{ subtask.title }}
                </span>
              </label>
              <button
                @click="deleteSubtask(subtask.id)"
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
      </div>

      <!-- Modals -->
      <TaskModal
        v-if="showEditModal"
        :task="task"
        @close="closeEditModal"
        @save="handleSaveTask"
      />

      <ConfirmModal
        v-if="showDeleteModal"
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        @close="closeDeleteModal"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Badge from "@/components/Badge.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import ErrorState from "@/components/ErrorState.vue";
import LoadingState from "@/components/LoadingState.vue";
import TaskModal from "@/components/TaskModal.vue";
import { useTaskStore } from "@/stores/taskStore";
import type { Task } from "@/types/task";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const store = useTaskStore();

const task = ref<Task | undefined>();
const loading = ref(false);
const error = ref<string | undefined>();
const newSubtaskTitle = ref("");
const showEditModal = ref(false);
const showDeleteModal = ref(false);

const loadTaskDetails = async () => {
  const id = Number(route.params.id);
  if (!id) {
    error.value = "Invalid task ID";
    return;
  }

  try {
    loading.value = true;
    error.value = undefined;
    task.value = await store.getTaskDetails(id);
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to load task details";
  } finally {
    loading.value = false;
  }
};

const handleEdit = () => {
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const handleSaveTask = async (taskData: Partial<Task>) => {
  if (!task.value) return;

  try {
    await store.updateTask({ ...task.value, ...taskData });
    task.value = await store.getTaskDetails(task.value.id);
    closeEditModal();
  } catch (err) {
    error.value = "Failed to update task";
  }
};

const handleDelete = () => {
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

const confirmDelete = async () => {
  if (!task.value) return;

  try {
    await store.deleteTask(task.value.id);
    router.push("/");
  } catch (err) {
    error.value = "Failed to delete task";
  }
};

const handleAddSubtask = async () => {
  if (!task.value?.id || !newSubtaskTitle.value.trim()) return;

  try {
    const subtask = await store.createSubtask(
      task.value.id,
      newSubtaskTitle.value.trim(),
    );
    task.value.subtasks.push(subtask);
    newSubtaskTitle.value = "";
  } catch (err) {
    error.value = "Failed to create subtask";
  }
};

const toggleSubtask = async (subtaskId: number, completed: boolean) => {
  if (!task.value?.id) return;

  try {
    await store.toggleSubtask(task.value.id, subtaskId, completed);
    const subtask = task.value.subtasks.find((s) => s.id === subtaskId);
    if (subtask) {
      subtask.completed = completed;
    }
  } catch (err) {
    error.value = "Failed to update subtask";
  }
};

const deleteSubtask = async (subtaskId: number) => {
  if (!task.value?.id) return;

  try {
    await store.deleteSubtask(task.value.id, subtaskId);
    task.value.subtasks = task.value.subtasks.filter((s) => s.id !== subtaskId);
  } catch (err) {
    error.value = "Failed to delete subtask";
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

onMounted(loadTaskDetails);
</script>
