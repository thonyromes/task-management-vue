<template>
  <div class="min-h-screen bg-base-200 p-4 sm:p-6">
    <!-- Header Section -->
    <header class="mb-8">
      <div class="container mx-auto px-2">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-base-content">Task Dashboard</h1>
            <p class="text-base-content/70 mt-1">
              Manage your tasks efficiently
            </p>
          </div>
          <button @click="showCreateModal = true" class="btn btn-primary gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            Create New Task
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-2">
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
import { ref } from "vue";

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
</script>

<style scoped>
/* Remove existing styles as we're using Tailwind/DaisyUI classes */
</style>
