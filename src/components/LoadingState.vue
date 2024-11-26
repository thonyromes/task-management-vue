<template>
  <div class="flex items-center justify-center p-8" :class="containerClass">
    <span
      class="loading"
      :class="[
        spinnerSize ? `loading-${spinnerSize}` : 'loading-lg',
        spinnerType ? `loading-${spinnerType}` : 'loading-spinner',
        spinnerColor ? `text-${spinnerColor}` : 'text-primary',
      ]"
    ></span>
    <span
      v-if="message"
      class="ml-3 text-base-content/70"
      :class="messageClass"
    >
      {{ message }}
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

// Default values are provided in the template using the ternary operators
defineProps<Props>();
</script>
