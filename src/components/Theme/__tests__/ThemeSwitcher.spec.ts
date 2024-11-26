import { fireEvent, render } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import ThemeSwitcher from "../ThemeSwitcher.vue";

describe("ThemeSwitcher", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");

    // Default to light mode preference
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  it("renders with light theme by default when no preference is set", () => {
    const { getByTestId } = render(ThemeSwitcher);

    const button = getByTestId("theme-switcher");
    const darkIcon = getByTestId("dark-icon");

    expect(button).toBeTruthy();
    expect(darkIcon).toBeTruthy();
    expect(button.getAttribute("aria-label")).toBe("Switch to dark mode");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("toggles theme when clicked", async () => {
    const { getByTestId } = render(ThemeSwitcher);
    const button = getByTestId("theme-switcher");

    // Initial state should be light
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(getByTestId("dark-icon")).toBeTruthy();

    // Click to toggle to dark mode
    await fireEvent.click(button);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(getByTestId("light-icon")).toBeTruthy();

    // Click to toggle back to light mode
    await fireEvent.click(button);
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(getByTestId("dark-icon")).toBeTruthy();
  });

  it("respects system dark mode preference", async () => {
    // Mock system dark mode preference before mounting component
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes("dark") ? true : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { getByTestId } = render(ThemeSwitcher);

    // Wait for next tick to ensure component has mounted and processed preferences
    await nextTick();

    const button = getByTestId("theme-switcher");

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(getByTestId("light-icon")).toBeTruthy();
    expect(button.getAttribute("aria-label")).toBe("Switch to light mode");
  });

  it("persists theme choice in localStorage", async () => {
    const { getByTestId } = render(ThemeSwitcher);
    const button = getByTestId("theme-switcher");

    // Toggle to dark mode
    await fireEvent.click(button);
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(getByTestId("light-icon")).toBeTruthy();

    // Toggle back to light mode
    await fireEvent.click(button);
    expect(localStorage.getItem("theme")).toBe("light");
    expect(getByTestId("dark-icon")).toBeTruthy();
  });

  it("respects saved theme from localStorage over system preference", async () => {
    // Set dark mode system preference
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes("dark") ? true : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    // Set light theme in localStorage
    localStorage.setItem("theme", "light");

    const { getByTestId } = render(ThemeSwitcher);

    // Wait for next tick to ensure component has mounted and processed preferences
    await nextTick();

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(getByTestId("dark-icon")).toBeTruthy();
  });
});
