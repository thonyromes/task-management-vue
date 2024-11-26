<template>
  <div
    class="min-h-screen bg-base-200 flex items-center justify-center p-4"
    role="main"
    aria-labelledby="error-title"
  >
    <div class="text-center">
      <h1 id="error-title" class="text-4xl font-bold mb-4" tabindex="-1">
        404 - Page Not Found
      </h1>
      <p class="text-lg mb-8" role="status">
        Sorry, the page you are looking for doesn't exist.
      </p>
      <router-link
        to="/"
        class="btn btn-primary"
        aria-label="Return to dashboard"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
        Return to Dashboard
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

// Focus management
onMounted(() => {
  // Focus the error heading when the page loads
  const errorHeading = document.getElementById("error-title");
  if (errorHeading) {
    errorHeading.focus();
  }
});
</script>
