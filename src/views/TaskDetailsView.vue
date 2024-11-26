<template>
  <div
    class="min-h-screen bg-base-200 p-4 sm:p-6"
    role="main"
    aria-labelledby="task-title"
  >
    <div class="container mx-auto max-w-4xl">
      <!-- Header -->
      <div class="mb-8">
        <button
          @click="router.push('/')"
          class="btn btn-ghost gap-2"
          aria-label="Return to dashboard"
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
      <TaskContent
        v-else-if="task"
        :task="task"
        @edit="handleEdit"
        @delete="handleDelete"
        @add-subtask="handleAddSubtask"
        @toggle-subtask="toggleSubtask"
        @delete-subtask="deleteSubtask"
      />

      <!-- Modals -->
      <TaskModal
        v-if="showEditModal"
        :task="task"
        :loading="isEditing"
        @close="closeEditModal"
        @save="handleSaveTask"
      />

      <ConfirmModal
        v-if="showDeleteModal"
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        :loading="isDeleting"
        @close="closeDeleteModal"
        @confirm="confirmDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ErrorState from "@/components/Error/ErrorState.vue";
import LoadingState from "@/components/Loading/LoadingState.vue";
import ConfirmModal from "@/components/Modals/ConfirmModal.vue";
import TaskModal from "@/components/Modals/TaskModal.vue";
import TaskContent from "@/components/Tasks/TaskContent.vue";
import { useTaskStore } from "@/stores/taskStore";
import type { Task } from "@/types/task";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const store = useTaskStore();

const task = ref<Task | undefined>();
const loading = ref(false);
const error = ref<string | undefined>();
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const isDeleting = ref(false);

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
    isEditing.value = true;
    await store.updateTask({ ...task.value, ...taskData });
    task.value = await store.getTaskDetails(task.value.id);
    closeEditModal();
  } catch (err) {
    error.value = "Failed to update task";
  } finally {
    isEditing.value = false;
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
    isDeleting.value = true;
    await store.deleteTask(task.value.id);
    router.push("/");
  } catch (err) {
    error.value = "Failed to delete task";
  } finally {
    isDeleting.value = false;
  }
};

const handleAddSubtask = async (title: string) => {
  if (!task.value?.id) return;

  try {
    const subtask = await store.createSubtask(task.value.id, title);
    task.value.subtasks.push(subtask);
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

// Focus management
onMounted(() => {
  loadTaskDetails();
});

// Update document title when task loads
watch(
  () => task.value?.title,
  (newTitle) => {
    if (newTitle) {
      document.title = `${newTitle} - Task Details`;
    } else {
      document.title = "Task Details";
    }
  },
);
</script>
