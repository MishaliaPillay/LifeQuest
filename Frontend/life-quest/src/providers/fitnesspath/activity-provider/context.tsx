"use client";
import { createContext } from "react";

// Activity Type interface
export interface IActivityType {
  id: string;
  category: string;
  intensityLevel: number;
  description: string;
}

// Input model for generating activity types
export interface IGenerateActivityTypeRequest {
  count?: number; // Optional count of exercises to generate
  baseRequest: {
    age: number;
    gender: string;
    bodyType: string;
    fitnessLevel: string;
    limitations: string;
    preferredExerciseTypes: string;
    availableEquipment: string[];
  };
}

// State context interface
export interface ActivityTypeState {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;
  activityTypes: IActivityType[];
}

// Action context interface
export interface ActivityTypeActions {
  getActivityTypes: () => void;
  createActivityType: (type: IActivityType) => void;
  updateActivityType: (type: IActivityType) => void;
  deleteActivityType: (id: string) => void;
  generateActivityTypes: (requestData: {
    age: number;
    gender: string;
    bodyType: string;
    fitnessLevel: string;
    limitations: string;
    preferredExerciseTypes: string;
    availableEquipment: string[];
  }) => void;
}

// Initial state
export const INITIAL_STATE: ActivityTypeState = {
  isPending: false,
  isSuccess: false,
  isError: false,
  errorMessage: undefined,
  activityTypes: [],
};

// Create contexts
export const ActivityTypeStateContext =
  createContext<ActivityTypeState>(INITIAL_STATE);
export const ActivityTypeActionContext = createContext<
  ActivityTypeActions | undefined
>(undefined);
