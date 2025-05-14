"use client";
import { createContext } from "react";

// Meal model
export interface IIngredient {
  id?: string;
  name: string;
  servingSize: number;
  calories: number;
  c: number;
  carbohydrates: number;
  fats: number;
}

export interface IMeal {
  id?: string;
  name: string;
  description: string;
  calories: number;
  ingredientIds: string[];
  isComplete?: boolean;
  ingredients?: IIngredient[];
  score?: number;
}

// Request model for generating meals
export interface IGenerateMealRequest {
  dietaryRequirement: string;
  preferredCuisine: string;
  mealType: string;
  maxCalories: number;
}
export interface IGenerateBaseTypeRequest {
  count?: number;
  baseRequest: IGenerateMealRequest;
}

// State context interface for meals
export interface IMealStateContext {
  meals?: IMeal[];
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;
}

// Action context interface for meal actions
export interface IMealActionContext {
  getMeals: () => void;
  getMeal: (id: string) => void;
  createMeal: (meal: IMeal) => void;
  updateMeal: (meal: IMeal) => void;
  deleteMeal: (id: string) => void;
  generateMeals: (requestData: IGenerateMealRequest) => void;
  getMealPlan: (id: string) => Promise<IMeal[]>;
  completeMeal: (id: string) => void;
}

// Initial state for meals
export const INITIAL_STATE: IMealStateContext = {
  meals: [],
  isPending: false,
  isSuccess: false,
  isError: false,
};

// Contexts
export const MealStateContext = createContext<IMealStateContext>(INITIAL_STATE);

export const MealActionContext = createContext<IMealActionContext>(undefined);
