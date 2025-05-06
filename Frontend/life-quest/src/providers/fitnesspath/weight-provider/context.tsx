"use client";
import { createContext } from "react";

// Weight data shape
export interface IWeight {
  id?: string;
  weight: number; // Weight value in kg
  date: string; // ISO string (e.g., "2025-05-06T18:56:13.045Z")
  note: string; // Additional note for tracking
  personId: string; // Unique person ID
}

// State context interface
export interface IWeightStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  currentWeight?: IWeight;         // For currently focused weight record
  weights?: IWeight[];             // All weight records
}

// Action context interface
export interface IWeightActionContext {
  getWeights: (personId: string) => void;                      // Fetch all weight records
  getWeight: (id: string) => void;             // Fetch a single weight record
  createWeight: (weight: IWeight) => void;         // Create a new weight record
  updateWeight: (weight: IWeight) => void;         // Update an existing weight record
  deleteWeight: (id: string) => void;          // Delete a weight record
}

// Initial state
export const INITIAL_STATE: IWeightStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  weights: [],
};

// Create the state context and the action context
export const WeightStateContext = createContext<IWeightStateContext>(INITIAL_STATE);
export const WeightActionContext = createContext<IWeightActionContext | undefined>(undefined);
