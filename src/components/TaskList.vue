<template>
  <div class="task-list">
    <!-- Search and Filters -->
    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search tasks..."
        class="search-input"
        @input="handleSearch"
      />

      <select
        :value="selectedStatus"
        @change="
          (e) => {
            selectedStatus = (e.target as HTMLSelectElement)
              .value as FilterValue;
            store.setFilters({ status: selectedStatus });
          }
        "
      >
        <option value="All">All Status</option>
        <option v-for="status in STATUSES" :key="status" :value="status">
          {{ status }}
        </option>
      </select>

      <select
        :value="selectedPriority"
        @change="
          (e) => {
            selectedPriority = (e.target as HTMLSelectElement)
              .value as PriorityFilterValue;
            store.setFilters({ priority: selectedPriority });
          }
        "
      >
        <option value="All">All Priorities</option>
        <option
          v-for="priority in PRIORITIES"
          :key="priority"
          :value="priority"
        >
          {{ priority }}
        </option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="store.loading" class="loading">
      <div class="spinner"></div>
      Loading tasks...
    </div>

    <!-- Error State -->
    <div v-else-if="store.error" class="error">
      {{ store.error }}
      <button @click="store.fetchTasks()">Retry</button>
    </div>

    <!-- Tasks Table -->
    <table v-else>
      <thead>
        <tr>
          <th @click="sort('title')" class="sortable">
            Title
            <SortIndicator
              :active="store.sort.field === 'title'"
              :direction="store.sort.direction"
            />
          </th>
          <th>Description</th>
          <th @click="sort('status')" class="sortable">
            Status
            <SortIndicator
              :active="store.sort.field === 'status'"
              :direction="store.sort.direction"
            />
          </th>
          <th @click="sort('priority')" class="sortable">
            Priority
            <SortIndicator
              :active="store.sort.field === 'priority'"
              :direction="store.sort.direction"
            />
          </th>
          <th @click="sort('dueDate')" class="sortable">
            Due Date
            <SortIndicator
              :active="store.sort.field === 'dueDate'"
              :direction="store.sort.direction"
            />
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in store.filteredAndSortedTasks" :key="task.id">
          <td>{{ task.title }}</td>
          <td>{{ task.description }}</td>
          <td>
            <StatusBadge :status="task.status" />
          </td>
          <td>
            <PriorityBadge :priority="task.priority" />
          </td>
          <td>{{ formatDate(task.dueDate) }}</td>
          <td class="actions">
            <button @click="$emit('edit', task)" class="edit">Edit</button>
            <button @click="openDeleteModal(task.id)" class="delete">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- No Results -->
    <div
      v-if="
        !store.loading &&
        !store.error &&
        store.filteredAndSortedTasks.length === 0
      "
      class="no-results"
    >
      No tasks found matching your criteria
    </div>

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
        :disabled="store.pagination.currentPage === store.pagination.totalPages"
        @click="changePage(store.pagination.currentPage + 1)"
      >
        Next
      </button>
    </div>

    <!-- Add New Task button -->
    <button class="add-task" @click="openTaskModal()">Add New Task</button>

    <!-- Task Modal -->
    <TaskModal
      v-if="showTaskModal"
      :task="selectedTask"
      @close="closeTaskModal"
      @save="handleSaveTask"
    />

    <!-- Confirm Delete Modal -->
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
import PriorityBadge from "@/components/PriorityBadge.vue";
import SortIndicator from "@/components/SortIndicator.vue";
import StatusBadge from "@/components/StatusBadge.vue";
import { useTaskStore } from "@/stores/taskStore";
import {
  FilterValue,
  PRIORITIES,
  PriorityFilterValue,
  STATUSES,
  Task,
} from "@/types/task";
import { ref } from "vue";
import ConfirmModal from "./ConfirmModal.vue";
import TaskModal from "./TaskModal.vue";

const store = useTaskStore();
const searchQuery = ref("");
const selectedStatus = ref<FilterValue>("All");
const selectedPriority = ref<PriorityFilterValue>("All");

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const changePage = (page: number) => {
  store.fetchTasks(page);
};

const handleSearch = () => {
  store.setFilters({ search: searchQuery.value });
};

const sort = (field: keyof Task) => {
  store.setSort(field);
};

const showTaskModal = ref(false);
const showDeleteModal = ref(false);
const selectedTask = ref<Task | undefined>(undefined);
const taskToDelete = ref<number | undefined>(undefined);

const openTaskModal = (task?: Task) => {
  selectedTask.value = task;
  showTaskModal.value = true;
};

const closeTaskModal = () => {
  showTaskModal.value = false;
  selectedTask.value = undefined;
};

const handleSaveTask = async (taskData: Partial<Task>) => {
  try {
    if (selectedTask.value) {
      const updatedTask = await store.updateTask({
        ...selectedTask.value,
        ...taskData,
      });
      if (updatedTask) {
        selectedTask.value = updatedTask;
      }
    } else {
      await store.createTask(taskData);
    }
    closeTaskModal();
  } catch (error) {
    console.error("Failed to save task:", error);
  }
};

const openDeleteModal = (taskId: number) => {
  taskToDelete.value = taskId;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  taskToDelete.value = undefined;
};

const confirmDelete = async () => {
  if (taskToDelete.value !== undefined) {
    await store.deleteTask(taskToDelete.value);
    closeDeleteModal();
  }
};
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
