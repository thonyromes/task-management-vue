<template>
  <div
    class="toast toast-end"
    :class="{
      'toast-top': position === 'top',
      'toast-middle': position === 'middle',
      'toast-bottom': position === 'bottom',
    }"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="alert shadow-lg transform transition-all duration-300 max-w-md"
      :class="{
        'alert-success': toast.type === 'success',
        'alert-error': toast.type === 'error',
        'alert-warning': toast.type === 'warning',
        'alert-info': toast.type === 'info',
        'translate-x-0 opacity-100': true,
        'translate-x-full opacity-0': toast.removing,
      }"
    >
      <!-- Success Icon -->
      <svg
        v-if="toast.type === 'success'"
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      <!-- Error Icon -->
      <svg
        v-if="toast.type === 'error'"
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      <!-- Warning Icon -->
      <svg
        v-if="toast.type === 'warning'"
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>

      <!-- Info Icon -->
      <svg
        v-if="toast.type === 'info'"
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      <div class="flex-1">{{ toast.message }}</div>

      <button
        @click="() => removeToast(toast.id)"
        class="btn btn-ghost btn-sm btn-circle"
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

export type ToastType = "success" | "error" | "warning" | "info";
export type ToastPosition = "top" | "middle" | "bottom";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  removing: boolean;
}

interface Props {
  position?: ToastPosition;
  duration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  position: "bottom",
  duration: 3000,
});

let nextId = 0;
const toasts = ref<Toast[]>([]);

const addToast = (message: string, type: ToastType = "info") => {
  const id = nextId++;
  const toast: Toast = {
    id,
    message,
    type,
    removing: false,
  };

  toasts.value.push(toast);

  // Start removal process after duration
  setTimeout(() => {
    removeToast(id);
  }, props.duration);
};

const removeToast = (id: number) => {
  const toast = toasts.value.find((t) => t.id === id);
  if (toast) {
    // Start removal animation
    toast.removing = true;

    // Remove from array after animation
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, 300); // Match the duration in the transition class
  }
};

// Expose methods for external use
defineExpose({
  addToast,
});
</script>

<style scoped>
.toast {
  @apply fixed z-50 p-4 space-y-4;
}

.toast-top {
  @apply top-0;
}

.toast-middle {
  @apply top-1/2 -translate-y-1/2;
}

.toast-bottom {
  @apply bottom-0;
}
</style>
