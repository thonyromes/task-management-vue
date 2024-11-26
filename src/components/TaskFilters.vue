<template>
  <div
    class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6"
    role="search"
    aria-label="Task filters"
  >
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
            aria-label="Search tasks"
            role="searchbox"
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
              aria-hidden="true"
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
    <div
      class="md:col-span-6 flex gap-4"
      role="group"
      aria-label="Task filters"
    >
      <div class="flex-1">
        <label id="status-filter-label" class="sr-only">Filter by status</label>
        <select
          :value="selectedStatus"
          @change="handleStatusChange"
          class="select select-bordered w-full"
          aria-labelledby="status-filter-label"
        >
          <option value="All">All Status</option>
          <option v-for="status in STATUSES" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </div>

      <div class="flex-1">
        <label id="priority-filter-label" class="sr-only"
          >Filter by priority</label
        >
        <select
          :value="selectedPriority"
          @change="handlePriorityChange"
          class="select select-bordered w-full"
          aria-labelledby="priority-filter-label"
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
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from "@/stores/taskStore";
import {
  FilterValue,
  PRIORITIES,
  PriorityFilterValue,
  STATUSES,
} from "@/types/task";
import { ref } from "vue";

const store = useTaskStore();
const searchQuery = ref("");
const selectedStatus = ref<FilterValue>("All");
const selectedPriority = ref<PriorityFilterValue>("All");

const handleSearch = () => {
  store.setFilters({ search: searchQuery.value });
};

const handleStatusChange = (e: Event) => {
  selectedStatus.value = (e.target as HTMLSelectElement).value as FilterValue;
  store.setFilters({ status: selectedStatus.value });
};

const handlePriorityChange = (e: Event) => {
  selectedPriority.value = (e.target as HTMLSelectElement)
    .value as PriorityFilterValue;
  store.setFilters({ priority: selectedPriority.value });
};
</script>
