<script setup lang="ts">
import Toast from "@/components/Toast.vue";
import { useToast } from "@/composables/useToast";
import { RouterView } from "vue-router";

const { toastRef } = useToast();
</script>

<template>
  <Toast ref="toastRef" position="bottom" />
  <RouterView />
</template>
