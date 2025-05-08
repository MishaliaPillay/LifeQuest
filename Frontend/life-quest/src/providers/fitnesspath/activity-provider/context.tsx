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
  age: number;
  gender: string;
  bodyType: string;
  fitnessLevel: string;
  limitations: string;
  preferredExerciseTypes: string;
  availableEquipment: string[];
}

// Response model from the backend when generating activity types
export interface IGenerateActivityTypeResponse {
  count: number;
  baseRequest: IGenerateActivityTypeRequest;
  activityTypes: IActivityType[];
}

// State context interface
export interface ActivityTypeState {
  loading: boolean;
  error: string | null;
  activityTypes: IActivityType[];
  generatedActivityTypesResponse?: IGenerateActivityTypeResponse;
}

// Action context interface
export interface ActivityTypeActions {
  getActivityTypes: () => void;
  createActivityType: (type: IActivityType) => void;
  updateActivityType: (type: IActivityType) => void;
  deleteActivityType: (id: string) => void;
  generateActivityTypes: (request: IGenerateActivityTypeRequest) => void;
}

// Initial state
export const INITIAL_STATE: ActivityTypeState = {
  loading: false,
  error: null,
  activityTypes: [],
  generatedActivityTypesResponse: undefined,
};

// Create contexts
export const ActivityTypeStateContext = createContext<ActivityTypeState>(INITIAL_STATE);
export const ActivityTypeActionContext = createContext<ActivityTypeActions | undefined>(undefined);
