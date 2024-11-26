<template>
  <div class="flex justify-center mt-6">
    <div class="join">
      <!-- Previous Button -->
      <button
        class="join-item btn"
        :class="{ 'btn-disabled': currentPage === 1 }"
        :disabled="currentPage === 1"
        @click="handlePageChange(currentPage - 1)"
      >
        «
      </button>

      <!-- First Page -->
      <button
        v-if="currentPage > 2"
        class="join-item btn"
        :class="{ 'btn-active': currentPage === 1 }"
        @click="handlePageChange(1)"
      >
        1
      </button>

      <!-- Ellipsis if needed -->
      <button v-if="currentPage > 3" class="join-item btn btn-disabled">
        ...
      </button>

      <!-- Previous Page -->
      <button
        v-if="currentPage > 1"
        class="join-item btn"
        @click="handlePageChange(currentPage - 1)"
      >
        {{ currentPage - 1 }}
      </button>

      <!-- Current Page -->
      <button class="join-item btn btn-active">{{ currentPage }}</button>

      <!-- Next Page -->
      <button
        v-if="currentPage < totalPages"
        class="join-item btn"
        @click="handlePageChange(currentPage + 1)"
      >
        {{ currentPage + 1 }}
      </button>

      <!-- Ellipsis if needed -->
      <button
        v-if="currentPage < totalPages - 2"
        class="join-item btn btn-disabled"
      >
        ...
      </button>

      <!-- Last Page -->
      <button
        v-if="currentPage < totalPages - 1"
        class="join-item btn"
        :class="{ 'btn-active': currentPage === totalPages }"
        @click="handlePageChange(totalPages)"
      >
        {{ totalPages }}
      </button>

      <!-- Next Button -->
      <button
        class="join-item btn"
        :class="{ 'btn-disabled': currentPage === totalPages }"
        :disabled="currentPage === totalPages"
        @click="handlePageChange(currentPage + 1)"
      >
        »
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  (e: "pageChange", page: number): void;
}>();

const handlePageChange = (page: number) => {
  emit("pageChange", page);
};
</script>
