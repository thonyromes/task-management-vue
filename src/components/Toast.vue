<template>
  <Transition name="toast">
    <div v-if="toast" :class="['toast', toast.type]">
      {{ toast.message }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useToast } from "@/composables/useToast";

const { toast } = useToast();
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 1rem;
  border-radius: 4px;
  color: white;
  z-index: 1000;
}

.success {
  background: #10b981;
}

.error {
  background: #ef4444;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
