"use client";
import { createContext } from "react";

// Step data shape
export interface IStep {
  id?: string;
  steps: number;
  date: string; // ISO string (e.g., "2025-05-05T20:10:59.776Z")
  note: string;
  caloriesBurned: number;
  personId: string;
}

// State context interface
export interface IStepsStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  currentStep?: IStep;         // For currently focused step record
  steps?: IStep[];             // All step records
}

// Action context interface
export interface IStepsActionContext {
  getSteps: (personId: string) => void;                      // Fetch all step records
  getStep: (id: string) => void;             // Fetch a single step record
  createStep: (step: IStep) => void;         // Create a new step record
  updateStep: (step: IStep) => void;         // Update an existing step record
  deleteStep: (id: string) => void;          // Delete a step record
}

// Initial state
export const INITIAL_STATE: IStepsStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  steps: [],
};

// Create the state context and the action context
export const StepsStateContext = createContext<IStepsStateContext>(INITIAL_STATE);
export const StepsActionContext = createContext<IStepsActionContext | undefined>(undefined);
