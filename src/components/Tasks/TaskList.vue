<template>
  <div class="task-list p-4" role="region" aria-label="Tasks management">
    <!-- Search and Filters -->
    <TaskFilters />

    <!-- Loading State -->
    <LoadingState
      v-if="store.loading"
      message="Loading tasks..."
      spinner-type="spinner"
      spinner-size="lg"
      spinner-color="primary"
    />

    <!-- Error State -->
    <ErrorState
      v-else-if="store.error"
      :message="store.error"
      @retry="store.fetchTasks(currentPage, itemsPerPage)"
    />

    <!-- Tasks Table -->
    <div v-else>
      <div role="status" aria-live="polite" class="sr-only">
        {{ store.filteredAndSortedTasks.length }} tasks found
      </div>

      <TaskTable
        v-if="store.filteredAndSortedTasks.length > 0"
        :tasks="store.filteredAndSortedTasks"
        @sort="store.setSort"
        @edit="openTaskModal"
        @delete="openDeleteModal"
        @row-click="navigateToTask"
      />

      <!-- No Results -->
      <NoResults v-else message="No tasks found matching your criteria" />
    </div>

    <!-- Pagination -->
    <TaskPagination
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="changePage"
    />

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
import ErrorState from '@/components/Error/ErrorState.vue'
import LoadingState from '@/components/Loading/LoadingState.vue'
import ConfirmModal from '@/components/Modals/ConfirmModal.vue'
import TaskModal from '@/components/Modals/TaskModal.vue'
import NoResults from '@/components/NoResults/NoResults.vue'
import TaskPagination from '@/components/Pagination/Pagination.vue'
import TaskFilters from '@/components/Tasks/TaskFilters.vue'
import TaskTable from '@/components/Tasks/TaskTable.vue'
import { useToast } from '@/composables/useToast'
import { useTaskStore } from '@/stores/taskStore'
import { Task } from '@/types/task'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const store = useTaskStore()

const itemsPerPage = 10
const totalItems = ref(0)

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))
const currentPage = computed(() => Number(route.query.page) || 1)

const changePage = (page: number) => {
  router.push({
    query: {
      ...route.query,
      page: page.toString(),
    },
  })
}

const showTaskModal = ref(false)
const showDeleteModal = ref(false)
const selectedTask = ref<Task | undefined>(undefined)
const taskToDelete = ref<number | undefined>(undefined)
const isDeleting = ref(false)
const isSaving = ref(false)

const { showToast } = useToast()

const openTaskModal = (task?: Task) => {
  selectedTask.value = task
  showTaskModal.value = true
}

const closeTaskModal = () => {
  showTaskModal.value = false
  selectedTask.value = undefined
}

const handleSaveTask = async (taskData: Partial<Task>) => {
  try {
    isSaving.value = true
    if (selectedTask.value) {
      const updatedTask = await store.updateTask({
        ...selectedTask.value,
        ...taskData,
      })
      if (updatedTask) {
        selectedTask.value = updatedTask
        showToast('Task updated successfully', 'success')
      }
    } else {
      await store.createTask(taskData)
      showToast('Task created successfully', 'success')
    }
    closeTaskModal()
  } catch (error) {
    showToast('Failed to save task. Please try again.', 'error')
  } finally {
    isSaving.value = false
  }
}

const navigateToTask = (taskId: number) => {
  router.push({ name: 'task-details', params: { id: taskId.toString() } })
}

const openDeleteModal = (taskId: number) => {
  taskToDelete.value = taskId
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  taskToDelete.value = undefined
}

const confirmDelete = async () => {
  if (taskToDelete.value !== undefined) {
    try {
      isDeleting.value = true
      await store.deleteTask(taskToDelete.value)
      showToast('Task deleted successfully', 'success')
      closeDeleteModal()
    } catch (error) {
      showToast('Failed to delete task. Please try again.', 'error')
    } finally {
      isDeleting.value = false
    }
  }
}

watch(
  () => route.query.page,
  async (newPage) => {
    const page = Number(newPage) || 1
    const response = await store.fetchTasks(page, itemsPerPage)
    totalItems.value = response.total * itemsPerPage
  },
  { immediate: true }
)
</script>
