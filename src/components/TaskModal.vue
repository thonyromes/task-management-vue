<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <h2>{{ isEdit ? "Edit Task" : "New Task" }}</h2>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">Title</label>
          <input id="title" v-model="formData.title" type="text" required />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="formData.description"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label for="status">Status</label>
          <select id="status" v-model="formData.status" required>
            <option v-for="status in STATUSES" :key="status" :value="status">
              {{ status }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="priority">Priority</label>
          <select id="priority" v-model="formData.priority" required>
            <option
              v-for="priority in PRIORITIES"
              :key="priority"
              :value="priority"
            >
              {{ priority }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="dueDate">Due Date</label>
          <input id="dueDate" v-model="formData.dueDate" type="date" required />
        </div>

        <div class="form-actions">
          <button type="button" @click="$emit('close')">Cancel</button>
          <button type="submit">{{ isEdit ? "Save" : "Create" }}</button>
        </div>
      </form>
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

interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

const props = defineProps<{
  task?: Task | undefined;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", task: TaskFormData): void;
}>();

const isEdit = !!props.task;
const formData = ref<TaskFormData>({
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

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

textarea {
  height: 100px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"] {
  background: #3b82f6;
  color: white;
  border: none;
}

button[type="button"] {
  background: white;
  border: 1px solid #e5e7eb;
}
</style>
