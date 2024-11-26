import type { RenderOptions } from "@testing-library/vue";
import { render } from "@testing-library/vue";
import { createPinia } from "pinia";
import type { Component } from "vue";
import { createRouter, createWebHistory } from "vue-router";

export function renderWithSetup(
  Component: Component,
  options: RenderOptions<typeof Component> = {}
) {
  const router = createRouter({
    history: createWebHistory(),
    routes: [],
  });

  const pinia = createPinia();

  return render(Component, {
    global: {
      plugins: [router, pinia],
    },
    ...options,
  });
}
