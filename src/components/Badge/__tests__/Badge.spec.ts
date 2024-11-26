import { render } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import Badge from "../Badge.vue";

describe("Badge", () => {
  describe("Priority Badges", () => {
    it("renders low priority badge correctly", () => {
      const { getByTestId } = render(Badge, {
        props: {
          type: "priority",
          value: "Low",
        },
        global: {
          stubs: {
            // Stub any child components if needed
          },
        },
      });

      const badge = getByTestId("badge");
      const dot = getByTestId("badge-dot");

      expect(badge.textContent).toContain("Low");
      expect(badge.classList.contains("badge-ghost")).toBe(true);
      expect(dot.classList.contains("bg-base-content/50")).toBe(true);
    });

    it("renders medium priority badge correctly", () => {
      const { getByTestId } = render(Badge, {
        props: {
          type: "priority",
          value: "Medium",
        },
      });

      const badge = getByTestId("badge");
      const dot = getByTestId("badge-dot");

      expect(badge.textContent).toContain("Medium");
      expect(badge.classList.contains("badge-warning/10")).toBe(true);
      expect(dot.classList.contains("bg-warning")).toBe(true);
    });

    it("renders high priority badge correctly", () => {
      const { getByTestId } = render(Badge, {
        props: {
          type: "priority",
          value: "High",
        },
      });

      const badge = getByTestId("badge");
      const dot = getByTestId("badge-dot");

      expect(badge.textContent).toContain("High");
      expect(badge.classList.contains("badge-error/10")).toBe(true);
      expect(dot.classList.contains("bg-error")).toBe(true);
    });
  });

  describe("Status Badges", () => {
    it("renders pending status badge correctly", () => {
      const { getByTestId } = render(Badge, {
        props: {
          type: "status",
          value: "Pending",
        },
      });

      const badge = getByTestId("badge");
      const dot = getByTestId("badge-dot");

      expect(badge.textContent).toContain("Pending");
      expect(badge.classList.contains("badge-warning/10")).toBe(true);
      expect(dot.classList.contains("bg-warning")).toBe(true);
    });

    it("renders in progress status badge correctly", () => {
      const { getByTestId } = render(Badge, {
        props: {
          type: "status",
          value: "In Progress",
        },
      });

      const badge = getByTestId("badge");
      const dot = getByTestId("badge-dot");

      expect(badge.textContent).toContain("In Progress");
      expect(badge.classList.contains("badge-info/10")).toBe(true);
      expect(dot.classList.contains("bg-info")).toBe(true);
    });

    it("renders completed status badge correctly", () => {
      const { getByTestId } = render(Badge, {
        props: {
          type: "status",
          value: "Completed",
        },
      });

      const badge = getByTestId("badge");
      const dot = getByTestId("badge-dot");

      expect(badge.textContent).toContain("Completed");
      expect(badge.classList.contains("badge-success/10")).toBe(true);
      expect(dot.classList.contains("bg-success")).toBe(true);
    });
  });

  describe("Accessibility", () => {
    it("has correct aria labels for priority badges", () => {
      const { getByRole } = render(Badge, {
        props: {
          type: "priority",
          value: "High",
        },
      });

      const badge = getByRole("status");
      expect(badge.getAttribute("aria-label")).toBe("Priority: High");
    });

    it("has correct aria labels for status badges", () => {
      const { getByRole } = render(Badge, {
        props: {
          type: "status",
          value: "Completed",
        },
      });

      const badge = getByRole("status");
      expect(badge.getAttribute("aria-label")).toBe("Status: Completed");
    });
  });
});
