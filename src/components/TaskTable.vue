<template>
  <div class="overflow-x-auto bg-base-100 rounded-box">
    <table class="table table-zebra w-full">
      <!-- Table Header -->
      <thead>
        <tr class="bg-base-200">
          <th
            v-for="column in columns"
            :key="column.field"
            @click="column.sortable ? $emit('sort', column.field) : null"
            class="cursor-pointer hover:bg-base-300 transition-colors"
          >
            <div class="flex items-center gap-2">
              {{ column.label }}
              <SortIcon v-if="column.sortable" :field="column.field" />
            </div>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <!-- Table Body -->
      <tbody>
        <tr
          v-for="task in tasks"
          :key="task.id"
          class="hover:bg-base-200 transition-colors"
        >
          <td
            @click="$emit('rowClick', task.id)"
            class="cursor-pointer font-medium"
          >
            {{ task.title }}
          </td>
          <td
            @click="$emit('rowClick', task.id)"
            class="cursor-pointer max-w-xs truncate"
          >
            {{ task.description }}
          </td>
          <td @click="$emit('rowClick', task.id)" class="cursor-pointer">
            <Badge type="status" :value="task.status" />
          </td>
          <td @click="$emit('rowClick', task.id)" class="cursor-pointer">
            <Badge type="priority" :value="task.priority" />
          </td>
          <td @click="$emit('rowClick', task.id)" class="cursor-pointer">
            {{ formatDate(task.dueDate) }}
          </td>
          <td>
            <div class="flex gap-2">
              <button
                @click="$emit('edit', task)"
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
                @click="$emit('delete', task.id)"
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
  </div>
</template>

<script setup lang="ts">
import Badge from "@/components/Badge.vue";
import SortIcon from "@/components/SortIcon.vue";
import type { Task } from "@/types/task";

// Define sortable fields explicitly
type SortableField =
  | "id"
  | "title"
  | "description"
  | "status"
  | "priority"
  | "dueDate";

interface Column {
  field: SortableField;
  label: string;
  sortable: boolean;
}

const columns: Column[] = [
  { field: "title", label: "Title", sortable: true },
  { field: "description", label: "Description", sortable: true },
  { field: "status", label: "Status", sortable: true },
  { field: "priority", label: "Priority", sortable: true },
  { field: "dueDate", label: "Due Date", sortable: true },
];

defineProps<{
  tasks: Task[];
}>();

defineEmits<{
  (e: "sort", field: SortableField): void;
  (e: "edit", task: Task): void;
  (e: "delete", id: number): void;
  (e: "rowClick", id: number): void;
}>();

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};
</script>
