<template>
  <div class="min-h-screen flex items-center justify-center bg-base-100 p-4">
    <div class="text-center">
      <h1 class="text-primary text-9xl font-bold mb-4">404</h1>
      <div class="mb-8">
        <h2 class="text-2xl font-semibold text-primary mb-2">Page Not Found</h2>
        <p class="text-neutral-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <RouterLink
        to="/"
        class="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
        Back to Home
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
