"use client";
import { createContext } from "react";

// Ingredient
export interface IIngredient {
  id: string;
  name: string;
  servingSize: number;
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
}

// Meal
export interface IMeal {
  id: string;
  name: string;
  description: string;
  calories: number;
  ingredientIds: string[];
  isComplete: boolean;
  ingredients: IIngredient[];
  score: number;
}

// MealPlan
export interface IMealPlan {
  id: string;
  name: string;
  status: number;
  meals: IMeal[];
}

// Weight Entry
export interface IWeightEntry {
  id: string;
  personId: string;
  weight: number;
  date: string;
  note: string;
}

// HealthPath
export interface IHealthPath {
  id?: string;
  title: string;
  description: string;
  personId: string;
  mealPlans: IMealPlan[];
  weightEntries: IWeightEntry[];
}

// State Context
export interface IHealthPathStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  currentPath?: IHealthPath;
  healthPaths?: IHealthPath[];
}

// Action Context
export interface IHealthPathActionContext {
  getHealthPaths: (personId: string) => Promise<IHealthPath[]>;
  getHealthPath: (id: string) => void;
  createHealthPath: (path: IHealthPath) => Promise<IHealthPath>;
  updateHealthPath: (path: IHealthPath) => void;
  deleteHealthPath: (id: string) => void;
}

// Initial State
export const INITIAL_STATE: IHealthPathStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  healthPaths: [],
};

// Contexts
export const HealthPathStateContext =
  createContext<IHealthPathStateContext>(INITIAL_STATE);

export const HealthPathActionContext = createContext<
  IHealthPathActionContext | undefined
>(undefined);
