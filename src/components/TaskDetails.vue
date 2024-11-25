<template>
  <div class="modal-overlay" @click="handleClose">
    <div class="task-details" @click.stop>
      <header>
        <h2>Task Details</h2>
        <button class="close" @click="handleClose">&times;</button>
      </header>

      <div v-if="!props.taskId" class="error">
        <p>Invalid task ID</p>
        <button @click="handleClose">Close</button>
      </div>

      <div v-else-if="loading" class="loading">
        <span class="spinner"></span>
        Loading task details...
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="loadTaskDetails">Retry</button>
      </div>

      <div v-else-if="task" class="task-content">
        <div class="field">
          <label>Title</label>
          <p>{{ task.title }}</p>
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

        <div class="subtasks-section">
          <h3>Subtasks</h3>

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

        <div class="actions">
          <button @click="handleEdit">Edit</button>
          <button class="danger" @click="handleDelete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from "@/stores/taskStore";
import type { Task } from "@/types/task";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import PriorityBadge from "./PriorityBadge.vue";
import StatusBadge from "./StatusBadge.vue";

const props = defineProps<{
  taskId?: number;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "edit", task: Task): void;
  (e: "delete", id: number): void;
}>();

const store = useTaskStore();
const task = ref<Task | undefined>(undefined);
const loading = ref(false);
const error = ref<string | undefined>(undefined);
const newSubtaskTitle = ref("");
const router = useRouter();

const loadTaskDetails = async () => {
  if (!props.taskId) {
    error.value = "Invalid task ID";
    return;
  }

  try {
    loading.value = true;
    error.value = undefined;
    task.value = await store.getTaskDetails(props.taskId);
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Failed to load task details";
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  router.push({ name: "dashboard" });
};

const handleEdit = () => {
  if (task.value) {
    emit("edit", task.value);
  }
};

const handleDelete = () => {
  if (task.value) {
    emit("delete", task.value.id);
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
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

onMounted(loadTaskDetails);
</script>

<style scoped>
.task-details {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
}

.field {
  margin-bottom: 1.5rem;
}

label {
  font-weight: 600;
  color: #374151;
  display: block;
  margin-bottom: 0.5rem;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
}

.actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.error {
  padding: 1rem;
  background-color: #fee2e2;
  border-radius: 0.5rem;
  color: #991b1b;
  text-align: center;
  margin: 1rem;
}

.error button {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #991b1b;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.error button:hover {
  background-color: #7f1d1d;
}

.subtasks-section {
  margin-top: 2rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

.add-subtask-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.subtask-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  border-radius: 0.25rem;
  background: #f9fafb;
  margin-bottom: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.completed {
  text-decoration: line-through;
  color: #9ca3af;
}

.delete-subtask {
  padding: 0.25rem 0.5rem;
  background: #fee2e2;
  color: #991b1b;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.no-subtasks {
  text-align: center;
  color: #6b7280;
  font-style: italic;
}

/* ... more styles ... */
</style>
