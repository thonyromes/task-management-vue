<template>
  <div class="modal-overlay">
    <div class="modal">
      <h2>{{ task ? "Edit Task" : "Create Task" }}</h2>
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
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div class="form-group">
          <label for="priority">Priority</label>
          <select id="priority" v-model="formData.priority" required>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div class="form-group">
          <label for="dueDate">Due Date</label>
          <input
            id="dueDate"
            v-model="formData.dueDate"
            type="datetime-local"
            required
          />
        </div>

        <div class="modal-actions">
          <button type="button" @click="$emit('close')" class="cancel-btn">
            Cancel
          </button>
          <button type="submit" class="save-btn">
            {{ task ? "Update" : "Create" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from "@/types/task";
import { onMounted, ref } from "vue";

const props = defineProps<{
  task?: Task | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", data: Partial<Task>): void;
}>();

const formData = ref({
  title: "",
  description: "",
  status: "Pending" as Task["status"],
  priority: "Medium" as Task["priority"],
  dueDate: "",
});

onMounted(() => {
  if (props.task) {
    formData.value = {
      ...props.task,
      dueDate: new Date(props.task.dueDate).toISOString().slice(0, 16),
    };
  }
});

const handleSubmit = () => {
  emit("save", {
    ...formData.value,
    dueDate: new Date(formData.value.dueDate).toISOString(),
  });
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

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn,
.save-btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.save-btn {
  background: #0d6efd;
  color: white;
}
</style>
