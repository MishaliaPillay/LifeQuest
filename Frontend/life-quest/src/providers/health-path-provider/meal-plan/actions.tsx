"use client";

import { createAction } from "redux-actions";
import { IMealPlan, IMealPlanDay, IMealPlanStateContext } from "./context";

// Define action enums
export enum MealPlanActionEnums {
  getPlanPending = "GET_MEAL_PLAN_PENDING",
  getPlanSuccess = "GET_MEAL_PLAN_SUCCESS",
  getPlanError = "GET_MEAL_PLAN_ERROR",

  getPlanHistoryPending = "GET_MEAL_PLAN_HISTORY_PENDING",
  getPlanHistorySuccess = "GET_MEAL_PLAN_HISTORY_SUCCESS",
  getPlanHistoryError = "GET_MEAL_PLAN_HISTORY_ERROR",

  createPlanPending = "CREATE_MEAL_PLAN_PENDING",
  createPlanSuccess = "CREATE_MEAL_PLAN_SUCCESS",
  createPlanError = "CREATE_MEAL_PLAN_ERROR",

  updatePlanPending = "UPDATE_MEAL_PLAN_PENDING",
  updatePlanSuccess = "UPDATE_MEAL_PLAN_SUCCESS",
  updatePlanError = "UPDATE_MEAL_PLAN_ERROR",

  completePlanPending = "COMPLETE_MEAL_PLAN_PENDING",
  completePlanSuccess = "COMPLETE_MEAL_PLAN_SUCCESS",
  completePlanError = "COMPLETE_MEAL_PLAN_ERROR",

  getMealPlanDaysPending = "GET_MEAL_PLAN_DAYS_PENDING",
getMealPlanDaysSuccess = "GET_MEAL_PLAN_DAYS_SUCCESS",
getMealPlanDaysError = "GET_MEAL_PLAN_DAYS_ERROR",

}

// Get a single meal plan
export const getPlanPending = createAction<IMealPlanStateContext>(
  MealPlanActionEnums.getPlanPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getPlanSuccess = createAction<IMealPlanStateContext, IMealPlan>(
  MealPlanActionEnums.getPlanSuccess,
  (currentPlan) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentPlan,
  })
);

export const getPlanError = createAction<IMealPlanStateContext>(
  MealPlanActionEnums.getPlanError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Get meal plan history
export const getPlanHistoryPending = createAction<IMealPlanStateContext>(
  MealPlanActionEnums.getPlanHistoryPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getPlanHistorySuccess = createAction<
  IMealPlanStateContext,
  IMealPlan[]
>(MealPlanActionEnums.getPlanHistorySuccess, (planHistory) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  planHistory,
}));

export const getPlanHistoryError = createAction<IMealPlanStateContext>(
  MealPlanActionEnums.getPlanHistoryError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Create a new meal plan
export const createPlanPending = createAction<IMealPlanStateContext>(
  MealPlanActionEnums.createPlanPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const createPlanSuccess = createAction<IMealPlanStateContext, IMealPlan>(
  MealPlanActionEnums.createPlanSuccess,
  (currentPlan) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentPlan,
  })
);

export const createPlanError = createAction<IMealPlanStateContext>(
  MealPlanActionEnums.createPlanError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Update a meal plan
export const updatePlanPending = createAction<IMealPlanStateContext>(
  MealPlanActionEnums.updatePlanPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const updatePlanSuccess = createAction<IMealPlanStateContext, IMealPlan>(
  MealPlanActionEnums.updatePlanSuccess,
  (currentPlan) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentPlan,
  })
);

export const updatePlanError = createAction<IMealPlanStateContext>(
  MealPlanActionEnums.updatePlanError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Complete a meal plan
export const completePlanPending = createAction<IMealPlanStateContext>(
  MealPlanActionEnums.completePlanPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const completePlanSuccess = createAction<
  IMealPlanStateContext,
  IMealPlan
>(MealPlanActionEnums.completePlanSuccess, (currentPlan) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  currentPlan,
}));

export const completePlanError = createAction<IMealPlanStateContext>(
  MealPlanActionEnums.completePlanError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);
// Get meal plan days
export const getMealPlanDaysPending = createAction<IMealPlanStateContext>(
  MealPlanActionEnums.getMealPlanDaysPending,
  () => ({
    isPending: true,
    isSuccess: false,
    isError: false,
  })
);

export const getMealPlanDaysSuccess = createAction<
  IMealPlanStateContext,
  IMealPlanDay[]
>(MealPlanActionEnums.getMealPlanDaysSuccess, (mealPlanDays) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  mealPlanDays,
}));

export const getMealPlanDaysError = createAction<IMealPlanStateContext>(
  MealPlanActionEnums.getMealPlanDaysError,
  () => ({
    isPending: false,
    isSuccess: false,
    isError: true,
  })
);
