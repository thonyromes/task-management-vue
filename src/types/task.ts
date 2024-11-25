export const STATUSES = ["Pending", "In Progress", "Completed"] as const;
export const PRIORITIES = ["Low", "Medium", "High"] as const;

export type TaskStatus = (typeof STATUSES)[number];
export type TaskPriority = (typeof PRIORITIES)[number];

export type FilterValue = "All" | TaskStatus;
export type PriorityFilterValue = "All" | TaskPriority;

export interface TaskFilters {
  status: FilterValue;
  priority: PriorityFilterValue;
  search: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}
