import { render } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import ErrorState from "../ErrorState.vue";

describe("ErrorState", () => {
  it("renders with default props", () => {
    const { getByTestId } = render(ErrorState);

    const errorState = getByTestId("error-state");
    const errorTitle = getByTestId("error-title");
    const errorMessage = getByTestId("error-message");

    expect(errorState).toBeTruthy();
    expect(errorTitle.textContent).toBe("Something went wrong");
    expect(errorMessage.textContent).toBe(
      "An error occurred while processing your request."
    );
  });

  it("renders with custom title and message", () => {
    const customTitle = "Custom Error";
    const customMessage = "This is a custom error message";

    const { getByTestId } = render(ErrorState, {
      props: {
        title: customTitle,
        message: customMessage,
      },
    });

    const errorTitle = getByTestId("error-title");
    const errorMessage = getByTestId("error-message");

    expect(errorTitle.textContent).toBe(customTitle);
    expect(errorMessage.textContent).toBe(customMessage);
  });

  it("does not render retry button when retryAction is not provided", () => {
    const { queryByTestId } = render(ErrorState, {
      props: {
        showRetry: false,
      },
    });

    const retryButton = queryByTestId("retry-button");
    expect(retryButton).toBeNull();
  });

  it("maintains visual hierarchy with all elements", () => {
    const { getByTestId } = render(ErrorState, {
      props: {
        showRetry: true,
      },
    });

    const errorState = getByTestId("error-state");
    const errorIcon = getByTestId("error-icon");
    const errorTitle = getByTestId("error-title");
    const errorMessage = getByTestId("error-message");
    const retryButton = getByTestId("retry-button");

    // Check if all elements are present
    expect(errorState).toBeTruthy();
    expect(errorIcon).toBeTruthy();
    expect(errorTitle).toBeTruthy();
    expect(errorMessage).toBeTruthy();
    expect(retryButton).toBeTruthy();

    // Verify error icon styling
    expect(errorIcon.classList.contains("text-error")).toBe(true);

    // Verify container styling
    expect(errorState.classList.contains("flex")).toBe(true);
    expect(errorState.classList.contains("flex-col")).toBe(true);
    expect(errorState.classList.contains("items-center")).toBe(true);
  });

  describe("Accessibility", () => {
    it("has proper heading structure", () => {
      const { getByRole } = render(ErrorState);

      const heading = getByRole("heading", { level: 2 });
      expect(heading).toBeTruthy();
      expect(heading.textContent).toBe("Something went wrong");
    });

    it("has accessible button when retry is provided", () => {
      const { getByRole } = render(ErrorState, {
        props: {
          showRetry: true,
        },
      });

      const button = getByRole("button");
      expect(button).toBeTruthy();
    });
  });
});
