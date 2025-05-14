"use client";

import { createAction } from "redux-actions";
import { IMeal, IMealStateContext, IIngredient } from "./context";

// Action enums
export enum MealActionEnums {
  getMealsPending = "GET_MEALS_PENDING",
  getMealsSuccess = "GET_MEALS_SUCCESS",
  getMealsError = "GET_MEALS_ERROR",

  getMealPending = "GET_MEAL_PENDING",
  getMealSuccess = "GET_MEAL_SUCCESS",
  getMealError = "GET_MEAL_ERROR",

  createMealPending = "CREATE_MEAL_PENDING",
  createMealSuccess = "CREATE_MEAL_SUCCESS",
  createMealError = "CREATE_MEAL_ERROR",

  updateMealPending = "UPDATE_MEAL_PENDING",
  updateMealSuccess = "UPDATE_MEAL_SUCCESS",
  updateMealError = "UPDATE_MEAL_ERROR",

  deleteMealPending = "DELETE_MEAL_PENDING",
  deleteMealSuccess = "DELETE_MEAL_SUCCESS",
  deleteMealError = "DELETE_MEAL_ERROR",

  generateMealsPending = "GENERATE_MEALS_PENDING",
  generateMealsSuccess = "GENERATE_MEALS_SUCCESS",
  generateMealsError = "GENERATE_MEALS_ERROR",

  markCompletePlanPending = "MARK_COMPLETE_PENDING",
  markCompletePlanSuccess = "MARK_COMPLETE_SUCCESS",
  markCompletePlanError = "MARK_COMPLETE_ERROR",

  getMealPlanPending = "GET_MEAL_PLAN_PENDING",
  getMealPlanSuccess = "GET_MEAL_PLAN_SUCCESS",
  getMealPlanError = "GET_MEAL_PLAN_ERROR",
}

// GET ALL MEALS
export const getMealsPending = createAction<IMealStateContext>(
  MealActionEnums.getMealsPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getMealsSuccess = createAction<IMealStateContext, IMeal[]>(
  MealActionEnums.getMealsSuccess,
  (meals) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    meals,
  })
);

export const getMealsError = createAction<IMealStateContext>(
  MealActionEnums.getMealsError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// CREATE MEAL
export const createMealPending = createAction<IMealStateContext>(
  MealActionEnums.createMealPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const createMealSuccess = createAction<IMealStateContext, IMeal>(
  MealActionEnums.createMealSuccess,
  (meal) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    meal,
  })
);

export const createMealError = createAction<IMealStateContext>(
  MealActionEnums.createMealError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// UPDATE MEAL
export const updateMealPending = createAction<IMealStateContext>(
  MealActionEnums.updateMealPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const updateMealSuccess = createAction<IMealStateContext, IMeal>(
  MealActionEnums.updateMealSuccess,
  (meal) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    meal,
  })
);

export const updateMealError = createAction<IMealStateContext>(
  MealActionEnums.updateMealError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// DELETE MEAL
export const deleteMealPending = createAction<IMealStateContext>(
  MealActionEnums.deleteMealPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const deleteMealSuccess = createAction<IMealStateContext, IMeal>(
  MealActionEnums.deleteMealSuccess,
  (meal) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    meal,
  })
);

export const deleteMealError = createAction<IMealStateContext>(
  MealActionEnums.deleteMealError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// GENERATE MEALS
export const generateMealsPending = createAction<IMealStateContext>(
  MealActionEnums.generateMealsPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const generateMealsSuccess = createAction<IMealStateContext, IMeal[]>(
  MealActionEnums.generateMealsSuccess,
  (meals) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    meals,
  })
);

export const generateMealsError = createAction<IMealStateContext>(
  MealActionEnums.generateMealsError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);
export const markCompletePlanPending = createAction<IMealStateContext>(
  MealActionEnums.markCompletePlanPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);
export const markCompletePlanError = createAction<IMealStateContext>(
  MealActionEnums.markCompletePlanError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

export const markCompletePlanSuccess = createAction<
  IMealStateContext,
  IIngredient[]
>(MealActionEnums.markCompletePlanSuccess, (ingredient) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  ingredient,
}));

export const getMealPlanPending = createAction<IMealStateContext>(
  MealActionEnums.getMealPlanPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getMealPlanSuccess = createAction<
  IMealStateContext,
  IIngredient[]
>(MealActionEnums.getMealPlanSuccess, (ingredients) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  ingredients,
}));

export const getMealPlanError = createAction<IMealStateContext>(
  MealActionEnums.getMealPlanError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);
