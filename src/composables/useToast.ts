import type { ToastType } from "@/components/Toast.vue";
import { ref } from "vue";

const toastRef = ref();

export function useToast() {
  const showToast = (message: string, type: ToastType = "info") => {
    if (toastRef.value) {
      toastRef.value.addToast(message, type);
    }
  };

  return {
    toastRef,
    showToast,
  };
}
