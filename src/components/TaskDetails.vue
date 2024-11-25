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
  emit("close");
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

/* ... more styles ... */
</style>
