import { api } from "@/services/api";
import type { Task, TaskPriority, TaskStatus } from "@/types/task";
import { defineStore } from "pinia";

interface TaskFilters {
  status: TaskStatus | "All";
  priority: TaskPriority | "All";
  search: string;
}

interface SortConfig {
  field: keyof Task | null;
  direction: "asc" | "desc";
}

export const useTaskStore = defineStore("tasks", {
  state: () => ({
    tasks: [] as Task[],
    loading: false,
    error: null as string | null,
    filters: {
      status: "All",
      priority: "All",
      search: "",
    } as TaskFilters,
    sort: {
      field: null as keyof Task | null,
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
      if (state.sort.field !== null) {
        result.sort((a, b) => {
          const aValue = a[state.sort.field!];
          const bValue = b[state.sort.field!];
          const modifier = state.sort.direction === "asc" ? 1 : -1;

          if (state.sort.field === "dueDate") {
            const dateA = aValue ? new Date(aValue).getTime() : 0;
            const dateB = bValue ? new Date(bValue).getTime() : 0;
            return (dateA - dateB) * modifier;
          }

          if (aValue === undefined || aValue === null) return 1;
          if (bValue === undefined || bValue === null) return -1;
          return aValue > bValue ? modifier : -modifier;
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
    setSort(field: keyof Task) {
      if (this.sort.field === field) {
        // If clicking the same field, toggle direction
        this.sort.direction = this.sort.direction === "asc" ? "desc" : "asc";
      } else {
        // If clicking a new field, set it and default to ascending
        this.sort.field = field;
        this.sort.direction = "asc";
      }
    },
  },
});
