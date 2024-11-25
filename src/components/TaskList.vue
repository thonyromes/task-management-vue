<template>
  <div class="task-list">
    <div v-if="store.loading">Loading...</div>
    <div v-else-if="store.error">{{ store.error }}</div>
    <template v-else>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in store.filteredTasks" :key="task.id">
            <td>{{ task.title }}</td>
            <td>{{ task.description }}</td>
            <td>
              <span :class="['status', task.status.toLowerCase()]">
                {{ task.status }}
              </span>
            </td>
            <td>
              <span :class="['priority', task.priority.toLowerCase()]">
                {{ task.priority }}
              </span>
            </td>
            <td>{{ formatDate(task.dueDate) }}</td>
            <td>
              <button @click="$emit('edit', task)">Edit</button>
              <button @click="store.deleteTask(task.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination">
        <button
          :disabled="store.pagination.currentPage === 1"
          @click="changePage(store.pagination.currentPage - 1)"
        >
          Previous
        </button>
        <span
          >Page {{ store.pagination.currentPage }} of
          {{ store.pagination.totalPages }}</span
        >
        <button
          :disabled="
            store.pagination.currentPage === store.pagination.totalPages
          "
          @click="changePage(store.pagination.currentPage + 1)"
        >
          Next
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from "@/stores/taskStore";
import { onMounted } from "vue";

const store = useTaskStore();

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const changePage = (page: number) => {
  store.fetchTasks(page);
};

onMounted(() => {
  store.fetchTasks();
});
</script>

<style scoped>
.status,
.priority {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
}

.status.pending {
  background: #fef3c7;
}
.status.in-progress {
  background: #dbeafe;
}
.status.completed {
  background: #dcfce7;
}

.priority.low {
  background: #e5e7eb;
}
.priority.medium {
  background: #fef3cd;
}
.priority.high {
  background: #fee2e2;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

th,
td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.pagination button {
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 0.25rem;
}

.pagination button:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}
</style>
