<template>
  <div class="dashboard">
    <header>
      <h1>Task Dashboard</h1>
      <button @click="showCreateModal = true" class="create-btn">
        Create New Task
      </button>
    </header>

    <TaskList @edit="handleEdit" />

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
.dashboard {
  padding: 20px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.create-btn {
  padding: 10px 20px;
  background: #0d6efd;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.create-btn:hover {
  background: #0b5ed7;
}
</style>
