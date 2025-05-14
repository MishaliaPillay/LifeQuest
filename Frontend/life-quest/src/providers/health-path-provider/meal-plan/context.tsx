"use client";
import { createContext } from "react";

// Ingredient interface
export interface IIngredient {
  id: string;
  name: string;
  servingSize: number;
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
}
export interface IMealPlanDay {
  order: number;
  description: string;
  meals: IMeal[]; // assuming these are meal IDs
  score: number;
}

// Meal interface
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

// Meal Plan interface
export interface IMealPlan {
  id?: string;
  healthPathId: string;
  name: string;
  status: number;
  meals: IMeal[];
  isCompleted?: boolean;
  mealPlanDays?: IMealPlanDay[];
}


// State context interface
export interface IMealPlanStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  currentPlan?: IMealPlan;
  planHistory?: IMealPlan[];
}

// Action context interface
export interface IMealPlanActionContext {
  getPlan: (id: string) => void;
  getPlanHistory: (personId: string) => void;
  createPlan: (plan: IMealPlan) => Promise<void>;
  updatePlan: (plan: IMealPlan) => void;
  completePlan: (id: string) => void;
    getMealPlanDaysByPlanId: (mealPlanId: string) => Promise<void>;
}

// Initial state
export const INITIAL_STATE: IMealPlanStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  planHistory: [],
};

// Create contexts
export const MealPlanStateContext =
  createContext<IMealPlanStateContext>(INITIAL_STATE);
export const MealPlanActionContext = createContext<
  IMealPlanActionContext | undefined
>(undefined);
