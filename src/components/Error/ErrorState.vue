<template>
  <div
    class="flex flex-col items-center justify-center p-4 text-center min-h-[200px]"
    data-testid="error-state"
  >
    <div class="text-error mb-4 w-16 h-16" data-testid="error-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    </div>
    <h2 class="text-xl font-semibold mb-2" data-testid="error-title">
      {{ title }}
    </h2>
    <p class="text-base-content/60" data-testid="error-message">
      {{ message }}
    </p>
    <button
      v-if="showRetry"
      @click="$emit('retry')"
      class="btn btn-error mt-4"
      data-testid="retry-button"
    >
      Try Again
    </button>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    title?: string;
    message?: string;
    showRetry?: boolean;
  }

  withDefaults(defineProps<Props>(), {
    title: "Something went wrong",
    message: "An error occurred while processing your request.",
    showRetry: true,
  });

  defineEmits<{
    (e: "retry"): void;
  }>();
</script>
