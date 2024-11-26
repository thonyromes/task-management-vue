<template>
  <div
    class="alert alert-error shadow-lg w-fit mx-auto"
    role="alert"
    aria-live="assertive"
  >
    <div class="flex items-center gap-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div class="flex-1">
        <h2 class="text-lg font-semibold sr-only">Error</h2>
        <p>{{ message }}</p>
      </div>
      <button
        @click="$emit('retry')"
        class="btn btn-ghost gap-2"
        aria-label="Retry operation"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span>Retry</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    message: string;
  }>();

  defineEmits<{
    (e: "retry"): void;
  }>();
</script>
