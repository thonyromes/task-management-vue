import { useTaskStore } from "@/stores/taskStore";
import { renderWithSetup } from "@/test/utils";
import type { SortableTaskField } from "@/types/task";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SortIcon from "../SortIcon.vue";

// Create a minimal mock store with only the properties we need
const createMockStore = (
  field: SortableTaskField = "title",
  direction: "asc" | "desc" = "asc"
) => ({
  sort: {
    field,
    direction,
  },
});

// Mock the store module
vi.mock("@/stores/taskStore", () => ({
  useTaskStore: vi.fn(() => createMockStore()),
}));

describe("SortIcon", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("renders correctly with active ascending sort", () => {
    const { getByTestId } = renderWithSetup(SortIcon, {
      props: {
        field: "title",
      },
    });

    const container = getByTestId("sort-icon-container");
    const upArrow = getByTestId("up-arrow");
    const downArrow = getByTestId("down-arrow");

    expect(container).toBeTruthy();
    expect(upArrow.classList.contains("text-primary")).toBe(true);
    expect(downArrow.classList.contains("text-primary")).toBe(false);
  });

  it("has correct accessibility attributes", () => {
    const { getByTestId } = renderWithSetup(SortIcon, {
      props: {
        field: "title",
      },
    });

    const container = getByTestId("sort-icon-container");
    const arrowsContainer = getByTestId("arrows-container");

    expect(container.getAttribute("role")).toBe("img");
    expect(container.getAttribute("aria-label")).toBe(
      "Sort by title ascending"
    );
    expect(arrowsContainer.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders with correct opacity when inactive", () => {
    // Update mock store to simulate inactive state
    vi.mocked(useTaskStore).mockImplementation(() =>
      // @ts-expect-error - this is a mock
      createMockStore("dueDate", "asc")
    );

    const { getByTestId } = renderWithSetup(SortIcon, {
      props: {
        field: "title",
      },
    });

    const container = getByTestId("sort-icon-container");
    expect(container.classList.contains("opacity-30")).toBe(true);
  });

  it("renders with descending sort direction", () => {
    // Update mock store to simulate descending sort
    vi.mocked(useTaskStore).mockImplementation(() =>
      // @ts-expect-error - this is a mock
      createMockStore("title", "desc")
    );

    const { getByTestId } = renderWithSetup(SortIcon, {
      props: {
        field: "title",
      },
    });

    const upArrow = getByTestId("up-arrow");
    const downArrow = getByTestId("down-arrow");

    expect(upArrow.classList.contains("text-primary")).toBe(false);
    expect(downArrow.classList.contains("text-primary")).toBe(true);
  });

  describe("SVG Properties", () => {
    it("maintains consistent SVG attributes", () => {
      const { getByTestId } = renderWithSetup(SortIcon, {
        props: {
          field: "title",
        },
      });

      const upArrow = getByTestId("up-arrow");
      const downArrow = getByTestId("down-arrow");

      [upArrow, downArrow].forEach((arrow) => {
        expect(arrow.getAttribute("fill")).toBe("none");
        expect(arrow.getAttribute("viewBox")).toBe("0 0 24 24");
        expect(arrow.getAttribute("stroke")).toBe("currentColor");
      });
    });
  });

  describe("State Changes", () => {
    it("updates aria-label based on sort direction", async () => {
      const { getByTestId, rerender } = renderWithSetup(SortIcon, {
        props: {
          field: "title",
        },
      });

      const container = getByTestId("sort-icon-container");
      expect(container.getAttribute("aria-label")).toBe(
        "Sort by title descending"
      );

      // Update mock store to simulate direction change
      vi.mocked(useTaskStore).mockImplementation(() =>
        // @ts-expect-error - this is a mock
        createMockStore("title", "desc")
      );

      await rerender({ field: "title" });
      expect(container.getAttribute("aria-label")).toBe(
        "Sort by title descending"
      );
    });

    it("handles inactive state correctly", async () => {
      const { getByTestId, rerender } = renderWithSetup(SortIcon, {
        props: {
          field: "title",
        },
      });

      // Update mock store to simulate inactive state
      vi.mocked(useTaskStore).mockImplementation(() =>
        // @ts-expect-error - this is a mock
        createMockStore("dueDate", "asc")
      );

      await rerender({ field: "title" });
      const container = getByTestId("sort-icon-container");
      expect(container.getAttribute("aria-label")).toBe(
        "Sort by title descending"
      );
    });
  });
});
