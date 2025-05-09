"use client";
import { createContext } from "react";

// Activity Type model
export interface IActivityType {
  id?: string;
  category: string;
  intensityLevel: number;
  description: string;
}

// Input model for generating activity types
export interface IBaseActivityTypeRequest {
  age: number;
  gender: string;
  bodyType: string;
  fitnessLevel: string;
  limitations: string;
  preferredExerciseTypes: string;
  availableEquipment: string[];
}

export interface IGenerateActivityTypeRequest {
  count?: number;
  baseRequest: IBaseActivityTypeRequest;
}

// State context interface
export interface IActivityTypeStateContext {
  activityTypes?: IActivityType[];
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;
}

// Action context interface
export interface IActivityTypeActionContext {
  getActivityTypes: () => void;
  getActivityType: (id: string) => void;
  createActivityType: (type: IActivityType) => void;
  updateActivityType: (type: IActivityType) => void;
  deleteActivityType: (id: IActivityType) => void;
  generateActivityTypes: (requestData: IBaseActivityTypeRequest) => void;
}

// Initial state
export const INITIAL_STATE: IActivityTypeStateContext = {
  activityTypes: [],
  isPending: false,
  isSuccess: false,
  isError: false,
};

// Contexts
export const ActivityTypeStateContext =
  createContext<IActivityTypeStateContext>(INITIAL_STATE);

export const ActivityTypeActionContext =
  createContext<IActivityTypeActionContext>(undefined);
