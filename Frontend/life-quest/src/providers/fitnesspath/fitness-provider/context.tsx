"use client";
import { createContext } from "react";

// FitnessPath data shape
export interface IFitnessPath {
  id?: string;
  title: string;
  description: string;
  stepEntryIds: string[];    // IDs of linked step entries
  weightEntryIds: string[];  // IDs of linked weight entries
  activityIds: string[];     // IDs of linked activities
}

// State context interface
export interface IFitnessPathStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  currentPath?: IFitnessPath;        // Currently focused fitness path
  fitnessPaths?: IFitnessPath[];     // All fitness paths
}

// Action context interface
export interface IFitnessPathActionContext {
  getFitnessPaths: (persinId:string) => void;                            // Fetch all fitness paths
  getFitnessPath: (id: string) => void;                  // Fetch a single fitness path
  createFitnessPath: (path: IFitnessPath) => void;       // Create a new fitness path
  updateFitnessPath: (path: IFitnessPath) => void;       // Update an existing fitness path
  deleteFitnessPath: (id: string) => void;               // Delete a fitness path
}

// Initial state
export const INITIAL_STATE: IFitnessPathStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  fitnessPaths: [],
};

// Create the state context and the action context
export const FitnessPathStateContext = createContext<IFitnessPathStateContext>(INITIAL_STATE);
export const FitnessPathActionContext = createContext<IFitnessPathActionContext | undefined>(undefined);
