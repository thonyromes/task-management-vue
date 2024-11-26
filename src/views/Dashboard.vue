<template>
  <div
    class="min-h-screen bg-base-200 p-4 sm:p-6"
    role="main"
    aria-labelledby="dashboard-title"
  >
    <!-- Header Section -->
    <header class="mb-8">
      <div class="container mx-auto px-2">
        <div class="flex justify-between items-center">
          <div>
            <h1
              id="dashboard-title"
              class="text-xl sm:text-3xl font-bold text-base-content"
              tabindex="-1"
            >
              Task Dashboard
            </h1>
            <p
              class="text-sm sm:text-base text-base-content/70 mt-1"
              role="doc-subtitle"
            >
              Manage your tasks efficiently
            </p>
          </div>
          <button
            @click="showCreateModal = true"
            class="btn btn-primary btn-sm sm:btn-md gap-1 sm:gap-2"
            aria-label="Create new task"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 sm:h-5 sm:w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="hidden sm:inline">Create New Task</span>
            <span class="sm:hidden">New</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-2" role="region" aria-label="Tasks list">
      <div class="bg-base-100 rounded-box shadow-lg overflow-x-auto">
        <div class="min-w-full">
          <TaskList @edit="handleEdit" />
        </div>
      </div>
    </main>

    <!-- Modal -->
    <TaskModal
      v-if="showCreateModal || showEditModal"
      :task="editingTask"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import TaskList from "@/components/TaskList.vue";
import TaskModal from "@/components/TaskModal.vue";
import { useTaskStore } from "@/stores/taskStore";
import type { Task } from "@/types/task";
import { onMounted, ref } from "vue";

const store = useTaskStore();
const showCreateModal = ref(false);
const showEditModal = ref(false);
const editingTask = ref<Task | undefined>();

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  editingTask.value = undefined;
};

const handleEdit = (task: Task) => {
  editingTask.value = task;
  showEditModal.value = true;
};

const handleSave = async (taskData: Partial<Task>) => {
  try {
    if (editingTask.value) {
      await store.updateTask({ ...editingTask.value, ...taskData });
    } else {
      await store.createTask(taskData);
    }
    closeModal();
  } catch (error) {
    console.error("Failed to save task:", error);
  }
};

// Focus management
onMounted(() => {
  // Focus the main heading when the page loads
  const mainHeading = document.getElementById("dashboard-title");
  if (mainHeading) {
    mainHeading.focus();
  }
});
</script>
