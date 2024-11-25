import Dashboard from "@/views/Dashboard.vue";
import TaskDetailsView from "@/views/TaskDetailsView.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: Dashboard,
      props: (route) => ({
        page: Number(route.query.page) || 1,
        status: route.query.status || "All",
        priority: route.query.priority || "All",
        search: route.query.search || "",
      }),
    },
    {
      path: "/task/:id",
      name: "task-details",
      component: TaskDetailsView,
      props: true,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/views/NotFound.vue"),
    },
  ],
});

export default router;
