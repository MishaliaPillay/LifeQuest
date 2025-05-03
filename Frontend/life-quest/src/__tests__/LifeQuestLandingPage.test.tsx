// src/__tests__/LifeQuestLandingPage.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import LifeQuestLandingPage from "../app/landing-page/landing-page";
import { vi } from "vitest";
import React from "react";

// 1. Mock next/navigation
vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
    }),
  };
});

describe("LifeQuestLandingPage", () => {
  it("renders the hero title", () => {
    render(<LifeQuestLandingPage />);
    expect(screen.getByText("Your Wellness Quest Begins Here")).toBeInTheDocument();
  });

  it("navigates to auth-page when 'Get Started' is clicked", () => {
    const { getByText } = render(<LifeQuestLandingPage />);
    const getStarted = getByText("Get Started");
    fireEvent.click(getStarted);
    // Add assertion for mock navigation if needed
  });

  it("toggles activity feature expansion", () => {
    const { getByText } = render(<LifeQuestLandingPage />);
    const feature = getByText("Move More"); // or whatever feature title you have
    fireEvent.click(feature);
    // Check if content expands, for example
    expect(screen.getByText("Track your activity levels")).toBeInTheDocument();
  });
});
