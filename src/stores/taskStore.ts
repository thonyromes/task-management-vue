import { api } from "@/services/api";
import type {
  SortableTaskField,
  Subtask,
  Task,
  TaskPriority,
  TaskStatus,
} from "@/types/task";
import { defineStore } from "pinia";

interface TaskFilters {
  status: TaskStatus | "All";
  priority: TaskPriority | "All";
  search: string;
}

interface SortConfig {
  field: SortableTaskField | undefined;
  direction: "asc" | "desc";
}

export const useTaskStore = defineStore("tasks", {
  state: () => ({
    tasks: [] as Task[],
    loading: false,
    error: undefined as string | undefined,
    filters: {
      status: "All",
      priority: "All",
      search: "",
    } as TaskFilters,
    sort: {
      field: undefined as SortableTaskField | undefined,
      direction: "asc" as "asc" | "desc",
    } as SortConfig,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,
    },
  }),

  getters: {
    filteredAndSortedTasks: (state) => {
      let result = [...state.tasks];

      // Apply filters
      if (state.filters.status !== "All") {
        result = result.filter((task) => task.status === state.filters.status);
      }
      if (state.filters.priority !== "All") {
        result = result.filter(
          (task) => task.priority === state.filters.priority,
        );
      }
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase();
        result = result.filter(
          (task) =>
            task.title.toLowerCase().includes(searchLower) ||
            task.description.toLowerCase().includes(searchLower),
        );
      }

      // Apply sorting
      if (state.sort.field) {
        result.sort((a, b) => {
          const aValue = a[state.sort.field!];
          const bValue = b[state.sort.field!];

          // Handle different field types
          if (state.sort.field === "dueDate") {
            return (
              (new Date(aValue as string).getTime() -
                new Date(bValue as string).getTime()) *
              (state.sort.direction === "asc" ? 1 : -1)
            );
          }

          // Handle string comparisons
          if (typeof aValue === "string" && typeof bValue === "string") {
            return (
              aValue.localeCompare(bValue) *
              (state.sort.direction === "asc" ? 1 : -1)
            );
          }

          // Handle number comparisons
          if (typeof aValue === "number" && typeof bValue === "number") {
            return (
              (aValue - bValue) * (state.sort.direction === "asc" ? 1 : -1)
            );
          }

          return 0;
        });
      }

      return result;
    },
  },

  actions: {
    setFilters(filters: Partial<TaskFilters>) {
      this.filters = { ...this.filters, ...filters };
    },
    async fetchTasks(page?: number) {
      try {
        this.loading = true;
        this.error = undefined;
        const { tasks, totalPages } = await api.getTasks(
          page || this.pagination.currentPage,
        );
        this.tasks = tasks;
        this.pagination.totalPages = totalPages;
        return tasks;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "Failed to fetch tasks";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createTask(taskData: Partial<Omit<Task, "id">>) {
      try {
        this.loading = true;
        const newTask = await api.createTask(taskData);
        this.tasks.unshift(newTask);
        return newTask;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "Failed to create task";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateTask(task: Task): Promise<Task | undefined> {
      try {
        this.loading = true;
        const updatedTask = await api.updateTask(task);
        const index = this.tasks.findIndex((t) => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        return updatedTask;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "Failed to update task";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    toggleSortOrder() {
      this.sort = {
        ...this.sort,
        direction: this.sort.direction === "asc" ? "desc" : "asc",
      };
    },
    async deleteTask(id: number): Promise<void> {
      try {
        this.loading = true;
        await api.deleteTask(id);
        this.tasks = this.tasks.filter((task) => task.id !== id);
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "Failed to delete task";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    setSort(field: SortableTaskField) {
      if (this.sort.field === field) {
        this.sort.direction = this.sort.direction === "asc" ? "desc" : "asc";
      } else {
        this.sort.field = field;
        this.sort.direction = "asc";
      }
    },
    async getTaskDetails(id: number): Promise<Task> {
      try {
        this.loading = true;
        this.error = undefined;

        const task = await api.getTaskDetails(id);
        const subtasks = await api.getSubtasks(id);
        return { ...task, subtasks };
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : "Failed to fetch task details";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async createSubtask(taskId: number, title: string): Promise<Subtask> {
      try {
        return await api.createSubtask(taskId, title);
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "Failed to create subtask";
        throw error;
      }
    },
    async toggleSubtask(
      taskId: number,
      subtaskId: number,
      completed: boolean,
    ): Promise<void> {
      try {
        await api.toggleSubtask(taskId, subtaskId, completed);
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "Failed to update subtask";
        throw error;
      }
    },
    async deleteSubtask(taskId: number, subtaskId: number): Promise<void> {
      try {
        await api.deleteSubtask(taskId, subtaskId);
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "Failed to delete subtask";
        throw error;
      }
    },
  },
});
