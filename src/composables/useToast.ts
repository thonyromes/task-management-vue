import { ref } from "vue";

interface Toast {
  message: string;
  type: "success" | "error";
}

const toast = ref<Toast | null>(null);
const timeoutId = ref<number>();

export function useToast() {
  const showToast = (message: string, type: "success" | "error") => {
    if (timeoutId.value) {
      clearTimeout(timeoutId.value);
    }

    toast.value = { message, type };

    timeoutId.value = window.setTimeout(() => {
      toast.value = null;
    }, 3000);
  };

  return {
    toast,
    showToast,
  };
}
