import { PRIORITIES, Task, TaskStatus } from "@/types/task";

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
  };
};

export const api = {
  async getTasks(page: number = 1, limit: number = 10) {
    const start = (page - 1) * limit;
    const response = await fetch(
      `${BASE_URL}/todos?_start=${start}&_limit=${limit}`,
    );
    const totalCount = response.headers.get("x-total-count");
    const todos: TodoResponse[] = await response.json();

    return {
      tasks: todos.map(mapTodoToTask),
      totalPages: Math.ceil(Number(totalCount) / limit),
    };
  },

  async createTask(task: Partial<Omit<Task, "id">>) {
    const response = await fetch(`${BASE_URL}/todos`, {
      method: "POST",
      body: JSON.stringify({
        title: task.title,
        completed: task.status === "Completed",
        userId: 1,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const todo = await response.json();
    return {
      ...mapTodoToTask(todo),
      ...task,
    };
  },

  async updateTask(task: Task) {
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
};
