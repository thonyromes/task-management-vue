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
    description: `Task ${todo.id}: ${todo.title}`, // More meaningful description
    status,
    priority: PRIORITIES[todo.id % PRIORITIES.length],
    dueDate: new Date(Date.now() + todo.id * 24 * 60 * 60 * 1000).toISOString(), // Spread out due dates
    subtasks: [], // Initialize empty subtasks array
  };
};

// Update the getTasks response type if needed
interface TasksResponse {
  data: Task[];
  total: number;
}

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
    const response = await fetch(`${BASE_URL}/todos/${task.id}`, {
      method: "PUT",
      body: JSON.stringify({
        id: task.id,
        title: task.title,
        completed: task.status === "Completed",
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const todo: TodoResponse = await response.json();
    return mapTodoToTask(todo);
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
    return mapTodoToTask(todo);
  },

  async getSubtasks(taskId: number): Promise<Subtask[]> {
    const response = await fetch(`${BASE_URL}/todos/${taskId}/subtasks`);
    if (!response.ok) {
      throw new Error("Failed to fetch subtasks");
    }
    return await response.json();
  },

  async createSubtask(taskId: number, title: string): Promise<Subtask> {
    const response = await fetch(`${BASE_URL}/todos/${taskId}/subtasks`, {
      method: "POST",
      body: JSON.stringify({
        taskId,
        title,
        completed: false,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    return await response.json();
  },

  async toggleSubtask(
    taskId: number,
    subtaskId: number,
    completed: boolean,
  ): Promise<void> {
    await fetch(`${BASE_URL}/todos/${taskId}/subtasks/${subtaskId}`, {
      method: "PATCH",
      body: JSON.stringify({ completed }),
      headers: {
        "Content-type": "application/json",
      },
    });
  },

  async deleteSubtask(taskId: number, subtaskId: number): Promise<void> {
    await fetch(`${BASE_URL}/todos/${taskId}/subtasks/${subtaskId}`, {
      method: "DELETE",
    });
  },
};
