import { api } from "@/services/api";
import { defineStore } from "pinia";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  dueDate: string;
}

interface TaskFilters {
  status: "All" | "Pending" | "In Progress" | "Completed";
  priority: "All" | "Low" | "Medium" | "High";
}

export const useTaskStore = defineStore("tasks", {
  state: () => ({
    tasks: [] as Task[],
    loading: false,
    error: null as string | null,
    filters: {
      status: "All" as TaskFilters["status"],
      priority: "All" as TaskFilters["priority"],
    },
    sortOrder: "asc" as "asc" | "desc",
    pagination: {
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,
    },
  }),

  getters: {
    filteredTasks: (state) => {
      return [...state.tasks]
        .filter(
          (task) =>
            state.filters.status === "All" ||
            task.status === state.filters.status,
        )
        .filter(
          (task) =>
            state.filters.priority === "All" ||
            task.priority === state.filters.priority,
        )
        .sort((a, b) => {
          const dateA = new Date(a.dueDate).getTime();
          const dateB = new Date(b.dueDate).getTime();
          return state.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
    },
  },

  actions: {
    setFilters(filters: Partial<TaskFilters>) {
      this.filters = { ...this.filters, ...filters };
    },
    async fetchTasks(page?: number) {
      try {
        this.loading = true;
        const newPage = page || this.pagination.currentPage;
        const { tasks, totalPages } = await api.getTasks(
          newPage,
          this.pagination.pageSize,
        );

        this.tasks = tasks;
        this.pagination.currentPage = newPage;
        this.pagination.totalPages = totalPages;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "Failed to fetch tasks";
      } finally {
        this.loading = false;
      }
    },

    async createTask(taskData: Partial<Omit<Task, "id">>) {
      try {
        this.loading = true;
        const newTask = await api.createTask(taskData);
        // Note: JSONPlaceholder doesn't actually create new items,
        // so we're simulating it by adding to the local state
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

    async updateTask(task: Task) {
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
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
    },
    async deleteTask(id: number) {
      try {
        this.loading = true;
        await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
          method: "DELETE",
        });

        // Remove task from local state
        this.tasks = this.tasks.filter((task) => task.id !== id);
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "Failed to delete task";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
