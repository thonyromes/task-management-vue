<script setup lang="ts">
import Toast from "@/components/Toast.vue";
</script>

<template>
  <div data-theme="light" class="font-sans">
    <RouterView />
    <Toast />
  </div>
</template>
