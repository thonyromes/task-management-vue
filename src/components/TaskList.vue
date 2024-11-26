<template>
  <div class="task-list p-4">
    <!-- Search and Filters -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
      <!-- Search -->
      <div class="md:col-span-6">
        <div class="form-control">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search tasks..."
              class="input input-bordered w-full pl-10"
              @input="handleSearch"
            />
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="md:col-span-6 flex gap-4">
        <select
          :value="selectedStatus"
          @change="
            (e) => {
              selectedStatus = (e.target as HTMLSelectElement)
                .value as FilterValue;
              store.setFilters({ status: selectedStatus });
            }
          "
          class="select select-bordered flex-1"
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
          class="select select-bordered flex-1"
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
    </div>

    <!-- Loading State -->
    <div v-if="store.loading" class="flex items-center justify-center p-8">
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <span class="ml-3 text-base-content/70">Loading tasks...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="store.error" class="alert alert-error shadow-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{{ store.error }}</span>
      <button
        @click="store.fetchTasks(currentPage, itemsPerPage)"
        class="btn btn-sm btn-ghost"
      >
        Retry
      </button>
    </div>

    <!-- Tasks Table -->
    <div v-else class="overflow-x-auto bg-base-100 rounded-box">
      <table class="table table-zebra w-full">
        <!-- Table Header -->
        <thead>
          <tr class="bg-base-200">
            <th
              @click="store.setSort('title')"
              class="cursor-pointer hover:bg-base-300 transition-colors"
            >
              <div class="flex items-center gap-2">
                Title
                <SortIcon field="title" />
              </div>
            </th>
            <th
              @click="store.setSort('description')"
              class="cursor-pointer hover:bg-base-300 transition-colors"
            >
              <div class="flex items-center gap-2">
                Description
                <SortIcon field="description" />
              </div>
            </th>
            <th
              @click="store.setSort('status')"
              class="cursor-pointer hover:bg-base-300 transition-colors"
            >
              <div class="flex items-center gap-2">
                Status
                <SortIcon field="status" />
              </div>
            </th>
            <th
              @click="store.setSort('priority')"
              class="cursor-pointer hover:bg-base-300 transition-colors"
            >
              <div class="flex items-center gap-2">
                Priority
                <SortIcon field="priority" />
              </div>
            </th>
            <th
              @click="store.setSort('dueDate')"
              class="cursor-pointer hover:bg-base-300 transition-colors"
            >
              <div class="flex items-center gap-2">
                Due Date
                <SortIcon field="dueDate" />
              </div>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <!-- Table Body -->
        <tbody>
          <tr
            v-for="task in store.filteredAndSortedTasks"
            :key="task.id"
            class="hover:bg-base-200 transition-colors"
          >
            <td
              @click="navigateToTask(task.id)"
              class="cursor-pointer font-medium"
            >
              {{ task.title }}
            </td>
            <td
              @click="navigateToTask(task.id)"
              class="cursor-pointer max-w-xs truncate"
            >
              {{ task.description }}
            </td>
            <td @click="navigateToTask(task.id)" class="cursor-pointer">
              <div
                class="badge badge-lg"
                :class="{
                  'badge-warning': task.status === 'Pending',
                  'badge-info': task.status === 'In Progress',
                  'badge-success': task.status === 'Completed',
                }"
              >
                {{ task.status }}
              </div>
            </td>
            <td @click="navigateToTask(task.id)" class="cursor-pointer">
              <div
                class="badge badge-lg"
                :class="{
                  'badge-ghost': task.priority === 'Low',
                  'badge-warning': task.priority === 'Medium',
                  'badge-error': task.priority === 'High',
                }"
              >
                {{ task.priority }}
              </div>
            </td>
            <td @click="navigateToTask(task.id)" class="cursor-pointer">
              {{ formatDate(task.dueDate) }}
            </td>
            <td>
              <div class="flex gap-2">
                <button
                  @click="openTaskModal(task)"
                  class="btn btn-sm btn-info btn-outline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
                <button
                  @click="openDeleteModal(task.id)"
                  class="btn btn-sm btn-error btn-outline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- No Results -->
      <div
        v-if="store.filteredAndSortedTasks.length === 0"
        class="alert alert-info shadow-lg m-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="stroke-current shrink-0 w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>No tasks found matching your criteria</span>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-6">
      <div class="join shadow-lg">
        <button
          class="join-item btn"
          :class="{ 'btn-disabled': currentPage === 1 }"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          «
        </button>
        <button class="join-item btn btn-neutral">
          Page {{ currentPage }} of {{ totalPages }}
        </button>
        <button
          class="join-item btn"
          :class="{ 'btn-disabled': currentPage === totalPages }"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          »
        </button>
      </div>
    </div>

    <!-- Modals -->
    <TaskModal
      v-if="showTaskModal"
      :task="selectedTask"
      :loading="isSaving"
      @close="closeTaskModal"
      @save="handleSaveTask"
    />

    <ConfirmModal
      v-if="showDeleteModal"
      title="Delete Task"
      message="Are you sure you want to delete this task?"
      :loading="isDeleting"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import SortIcon from "@/components/SortIcon.vue";
import { useToast } from "@/composables/useToast";
import { useTaskStore } from "@/stores/taskStore";
import {
  FilterValue,
  PRIORITIES,
  PriorityFilterValue,
  STATUSES,
  Task,
} from "@/types/task";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ConfirmModal from "./ConfirmModal.vue";
import TaskModal from "./TaskModal.vue";

const router = useRouter();
const route = useRoute();

const store = useTaskStore();
const searchQuery = ref("");
const selectedStatus = ref<FilterValue>("All");
const selectedPriority = ref<PriorityFilterValue>("All");

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const itemsPerPage = 10;
const totalItems = ref(0);

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));
const currentPage = computed(() => Number(route.query.page) || 1);

const changePage = (page: number) => {
  router.push({
    query: {
      ...route.query,
      page: page.toString(),
    },
  });
};

const handleSearch = () => {
  store.setFilters({ search: searchQuery.value });
};

const showTaskModal = ref(false);
const showDeleteModal = ref(false);
const selectedTask = ref<Task | undefined>(undefined);
const taskToDelete = ref<number | undefined>(undefined);
const isDeleting = ref(false);
const isSaving = ref(false);

const { showToast } = useToast();

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
    isSaving.value = true;
    if (selectedTask.value) {
      const updatedTask = await store.updateTask({
        ...selectedTask.value,
        ...taskData,
      });
      if (updatedTask) {
        selectedTask.value = updatedTask;
        showToast("Task updated successfully", "success");
      }
    } else {
      await store.createTask(taskData);
      showToast("Task created successfully", "success");
    }
    closeTaskModal();
  } catch (error) {
    showToast("Failed to save task. Please try again.", "error");
  } finally {
    isSaving.value = false;
  }
};

const navigateToTask = (taskId: number) => {
  router.push({ name: "task-details", params: { id: taskId.toString() } });
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
    try {
      isDeleting.value = true;
      await store.deleteTask(taskToDelete.value);
      showToast("Task deleted successfully", "success");
      closeDeleteModal();
    } catch (error) {
      showToast("Failed to delete task. Please try again.", "error");
    } finally {
      isDeleting.value = false;
    }
  }
};

watch(
  () => route.query.page,
  async (newPage) => {
    const page = Number(newPage) || 1;
    const response = await store.fetchTasks(page, itemsPerPage);
    totalItems.value = response.total * itemsPerPage;
  },
  { immediate: true },
);
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
