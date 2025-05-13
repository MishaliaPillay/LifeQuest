"use client";
import { createContext } from "react";

// Path data shape
export interface IPath {
  id?: string;
  title: string;
  pathType: string; // e.g., "FitnessPath", "NutritionPath", etc.
}

// State context interface
export interface IPathsStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  currentPath?: IPath; // Currently focused path record
  paths?: IPath[]; // All path records
}

// Action context interface
export interface IPathsActionContext {
  getPaths: () => void; // Fetch all path records
  getPath: (id: string) => Promise<IPath>; // Fetch a single path record
}

// Initial state
export const INITIAL_STATE: IPathsStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  paths: [],
};

// Create the state context and the action context
export const PathsStateContext =
  createContext<IPathsStateContext>(INITIAL_STATE);
export const PathsActionContext = createContext<
  IPathsActionContext | undefined
>(undefined);
