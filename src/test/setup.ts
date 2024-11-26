import "@testing-library/jest-dom";
import { config } from "@vue/test-utils";
import { afterEach, beforeAll } from "vitest";

// Setup Vue Test Utils global config
config.global.stubs = {
  transition: false,
};

beforeAll(() => {
  // Add any global test setup
});

afterEach(() => {
  // Cleanup after each test
  document.body.innerHTML = "";
});
