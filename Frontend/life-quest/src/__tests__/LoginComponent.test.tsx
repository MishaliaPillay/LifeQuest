import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import LoginComponent from "../components/login/login";
import { useAuthActions } from "@/providers/auth-provider";
import { useUserActions } from "@/providers/user-provider";

// Mock the auth and user providers
vi.mock("@/providers/auth-provider", () => ({
  useAuthActions: vi.fn(),
}));

vi.mock("@/providers/user-provider", () => ({
  useUserActions: vi.fn(),
}));

describe("LoginComponent", () => {
  it("renders and submits the form successfully", async () => {
    const mockSignIn = vi.fn().mockResolvedValue(true);
    const mockGetCurrentUser = vi.fn();

    const onLoginSuccess = vi.fn();

    (useAuthActions as any).mockReturnValue({ signIn: mockSignIn });
    (useUserActions as any).mockReturnValue({ getCurrentUser: mockGetCurrentUser });

    render(<LoginComponent onLoginSuccess={onLoginSuccess} />);

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText("Email Address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Wait for async operations
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        userNameOrEmailAddress: "test@example.com",
        password: "password123",
      });
      expect(mockGetCurrentUser).toHaveBeenCalled();
      expect(onLoginSuccess).toHaveBeenCalled();
    });
  });
});
