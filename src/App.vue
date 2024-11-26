<template>
  <div class="min-h-screen">
    <!-- Header with Theme Switcher -->
    <div class="navbar bg-base-100">
      <div class="flex-1">
        <RouterLink to="/" class="btn btn-ghost normal-case text-xl">
          Task Manager
        </RouterLink>
      </div>
      <div class="flex-none">
        <ThemeSwitcher />
      </div>
    </div>

    <!-- Main Content -->
    <Toast ref="toastRef" position="bottom" />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
  import ThemeSwitcher from "@/components/Theme/ThemeSwitcher.vue";
  import Toast from "@/components/Toast/Toast.vue";
  import { useToast } from "@/composables/useToast";
  import { RouterLink, RouterView } from "vue-router";

  const { toastRef } = useToast();
</script>
