<template>
  <div class="task-details-view">
    <div class="header">
      <button class="back-button" @click="router.push('/')">
        ← Back to Dashboard
      </button>
    </div>

    <div v-if="loading" class="loading">
      <span class="spinner"></span>
      Loading task details...
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="loadTaskDetails">Retry</button>
    </div>

    <div v-else-if="task" class="task-content">
      <div class="task-header">
        <h1>{{ task.title }}</h1>
        <div class="actions">
          <button @click="handleEdit">Edit</button>
          <button class="danger" @click="handleDelete">Delete</button>
        </div>
      </div>

      <div class="field">
        <label>Description</label>
        <p>{{ task.description }}</p>
      </div>

      <div class="field">
        <label>Status</label>
        <StatusBadge :status="task.status" />
      </div>

      <div class="field">
        <label>Priority</label>
        <PriorityBadge :priority="task.priority" />
      </div>

      <div class="field">
        <label>Due Date</label>
        <p>{{ formatDate(task.dueDate) }}</p>
      </div>

      <!-- Subtasks Section -->
      <div class="subtasks-section">
        <h2>Subtasks</h2>

        <form @submit.prevent="handleAddSubtask" class="add-subtask-form">
          <input
            v-model="newSubtaskTitle"
            type="text"
            placeholder="New subtask..."
            required
          />
          <button type="submit">Add</button>
        </form>

        <div v-if="task.subtasks.length" class="subtasks-list">
          <div
            v-for="subtask in task.subtasks"
            :key="subtask.id"
            class="subtask-item"
          >
            <label class="checkbox-label">
              <input
                type="checkbox"
                :checked="subtask.completed"
                @change="toggleSubtask(subtask.id, !subtask.completed)"
              />
              <span :class="{ completed: subtask.completed }">
                {{ subtask.title }}
              </span>
            </label>
            <button class="delete-subtask" @click="deleteSubtask(subtask.id)">
              &times;
            </button>
          </div>
        </div>

        <p v-else class="no-subtasks">No subtasks yet. Add one above.</p>
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
</template>

<script setup lang="ts">
import ConfirmModal from "@/components/ConfirmModal.vue";
import PriorityBadge from "@/components/PriorityBadge.vue";
import StatusBadge from "@/components/StatusBadge.vue";
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

<style scoped>
.task-details-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  margin-bottom: 2rem;
}

.back-button {
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-size: 1rem;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
}

/* ... rest of the styles ... */
</style>
