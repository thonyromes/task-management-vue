import { PRIORITIES, Subtask, Task, TaskStatus } from "@/types/task";

const BASE_URL = "https://jsonplaceholder.typicode.com";

// Interface matching JSONPlaceholder's todo structure
interface TodoResponse {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

// Convert JSONPlaceholder todo to our Task format
const mapTodoToTask = (todo: TodoResponse): Task => {
  // Create a more deterministic but varied status based on the todo ID
  let status: TaskStatus;
  const statusIndex = todo.id % 3;
  switch (statusIndex) {
    case 0:
      status = "Pending";
      break;
    case 1:
      status = "In Progress";
      break;
    case 2:
      status = "Completed";
      break;
    default:
      status = "Pending";
  }

  return {
    id: todo.id,
    title: todo.title,
    description: `Task ${todo.id}: ${todo.title}`,
    status,
    priority: PRIORITIES[todo.id % PRIORITIES.length],
    dueDate: new Date(Date.now() + todo.id * 24 * 60 * 60 * 1000).toISOString(),
    subtasks: mockSubtasks[todo.id] || [],
  };
};

// Add this mock data at the top of the file
const mockSubtasks: Record<number, Subtask[]> = {};

export const api = {
  async getTasks(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ tasks: Task[]; totalPages: number }> {
    const start = (page - 1) * limit;
    const response = await fetch(
      `${BASE_URL}/todos?_start=${start}&_limit=${limit}`,
    );
    const totalCount = response.headers.get("x-total-count") || "0";
    const todos: TodoResponse[] = await response.json();

    return {
      tasks: todos.map(mapTodoToTask),
      totalPages: Math.ceil(Number(totalCount) / limit),
    };
  },

  async createTask(taskData: Partial<Omit<Task, "id">>): Promise<Task> {
    const response = await fetch(`${BASE_URL}/todos`, {
      method: "POST",
      body: JSON.stringify({
        title: taskData.title,
        completed: taskData.status === "Completed",
        userId: 1,
        description: taskData.description,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const todo = await response.json();
    return {
      ...mapTodoToTask(todo),
      ...taskData,
    };
  },

  async updateTask(task: Task): Promise<Task> {
    try {
      const response = await fetch(`${BASE_URL}/todos/${task.id}`, {
        method: "PUT",
        body: JSON.stringify(task),
        headers: {
          "Content-type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          response.status === 404 ? "Task not found" : "Failed to update task",
        );
      }

      return await response.json();
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    }
  },

  async deleteTask(id: number): Promise<void> {
    await fetch(`${BASE_URL}/todos/${id}`, {
      method: "DELETE",
    });
  },

  async getTaskDetails(id: number): Promise<Task> {
    const response = await fetch(`${BASE_URL}/todos/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch task details");
    }
    const todo: TodoResponse = await response.json();
    const task = mapTodoToTask(todo);
    task.subtasks = mockSubtasks[id] || [];
    return task;
  },

  async getSubtasks(taskId: number): Promise<Subtask[]> {
    // Return mock subtasks if they exist, otherwise return empty array
    return mockSubtasks[taskId] || [];
  },

  async createSubtask(taskId: number, title: string): Promise<Subtask> {
    const newSubtask: Subtask = {
      id: Date.now(),
      taskId,
      title,
      completed: false,
    };

    if (!mockSubtasks[taskId]) {
      mockSubtasks[taskId] = [];
    }
    mockSubtasks[taskId].push(newSubtask);
    return newSubtask;
  },

  async toggleSubtask(
    taskId: number,
    subtaskId: number,
    completed: boolean,
  ): Promise<void> {
    const subtask = mockSubtasks[taskId]?.find((st) => st.id === subtaskId);
    if (subtask) {
      subtask.completed = completed;
    }
  },

  async deleteSubtask(taskId: number, subtaskId: number): Promise<void> {
    if (mockSubtasks[taskId]) {
      mockSubtasks[taskId] = mockSubtasks[taskId].filter(
        (st) => st.id !== subtaskId,
      );
    }
  },
};
