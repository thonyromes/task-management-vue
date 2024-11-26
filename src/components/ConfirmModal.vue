<template>
  <div class="modal modal-open">
    <div
      class="modal-box relative transform transition-all duration-300"
      :class="{
        'scale-100 opacity-100': true,
        'scale-95 opacity-0': loading,
      }"
    >
      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 transition-transform hover:rotate-90"
        :disabled="loading"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
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

      <!-- Modal Content -->
      <div
        class="pt-2 transition-opacity duration-300"
        :class="{ 'opacity-50': loading }"
      >
        <h3 class="font-bold text-lg mb-4">{{ title }}</h3>

        <!-- Warning Icon and Message -->
        <div
          class="alert alert-warning mb-6 transition-all duration-300"
          :class="{ 'animate-pulse': loading }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6 transition-transform duration-300"
            :class="{ 'rotate-180': loading }"
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
          <span>{{ message }}</span>
        </div>

        <!-- Action Buttons -->
        <div class="modal-action">
          <button
            @click="$emit('close')"
            class="btn btn-ghost transition-all duration-300 hover:scale-105"
            :class="{ 'opacity-50': loading }"
            :disabled="loading"
          >
            Cancel
          </button>
          <button
            @click="handleConfirm"
            class="btn btn-error gap-2 transition-all duration-300 hover:scale-105"
            :class="{
              loading: loading,
              'animate-pulse': loading,
            }"
            :disabled="loading"
          >
            <svg
              v-if="!loading"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 transition-transform duration-300 hover:rotate-12"
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
            <span>Confirm Delete</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  message: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "confirm"): void;
}>();

const handleConfirm = () => {
  emit("confirm");
};
</script>
