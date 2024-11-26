<template>
  <div
    class="flex items-center justify-center p-8"
    :class="containerClass"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <span
      class="loading"
      :class="[
        spinnerSize ? `loading-${spinnerSize}` : 'loading-lg',
        spinnerType ? `loading-${spinnerType}` : 'loading-spinner',
        spinnerColor ? `text-${spinnerColor}` : 'text-primary',
      ]"
      aria-hidden="true"
    ></span>
    <span
      v-if="message"
      class="ml-3 text-base-content/70"
      :class="messageClass"
    >
      {{ message }}
    </span>
    <!-- Hidden text for screen readers -->
    <span class="sr-only">
      {{ message || "Loading content" }}. Please wait.
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string;
  spinnerSize?: "xs" | "sm" | "md" | "lg";
  spinnerType?: "spinner" | "dots" | "ring" | "ball" | "bars" | "infinity";
  spinnerColor?:
    | "primary"
    | "secondary"
    | "accent"
    | "neutral"
    | "info"
    | "success"
    | "warning"
    | "error";
  containerClass?: string;
  messageClass?: string;
}

defineProps<Props>();
</script>
