"use client";
import { createContext } from "react";

// Exercise Plan Interfaces
export interface IExerciseDay {
  description: string;
  activityTypeIds: string[]; // References to predefined activity types
  duration: number; // Duration in minutes
  calories: number; // Estimated calories burned
}

export interface IExercisePlan {
  id?: string;
  fitnessPathId: string;
  name: string;
  days: IExerciseDay[];
  
  isCompleted?: boolean;
}

// State context interface
export interface IExercisePlanStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  currentPlan?: IExercisePlan;
  planHistory?: IExercisePlan[]; // Comes from /GetHistory
}

// Action context interface
export interface IExercisePlanActionContext {
  getPlan: (id: string) => void;
  getPlanHistory: (personId: string) => void;
  createPlan: (plan: IExercisePlan) => Promise<void>;
  updatePlan: (plan: IExercisePlan) => void;
  completePlan: (id: string) => void;
}

// Initial state
export const INITIAL_STATE: IExercisePlanStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  planHistory: [],
};

// Create contexts
export const ExercisePlanStateContext = createContext<IExercisePlanStateContext>(INITIAL_STATE);
export const ExercisePlanActionContext = createContext<IExercisePlanActionContext | undefined>(undefined);
