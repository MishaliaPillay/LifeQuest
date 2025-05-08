"use client";

import { createAction } from "redux-actions";
import { IExercisePlan, IExercisePlanStateContext } from "./context";

// Define action enums
export enum ExercisePlanActionEnums {
  getPlanPending = "GET_PLAN_PENDING",
  getPlanSuccess = "GET_PLAN_SUCCESS",
  getPlanError = "GET_PLAN_ERROR",

  getPlanHistoryPending = "GET_PLAN_HISTORY_PENDING",
  getPlanHistorySuccess = "GET_PLAN_HISTORY_SUCCESS",
  getPlanHistoryError = "GET_PLAN_HISTORY_ERROR",

  createPlanPending = "CREATE_PLAN_PENDING",
  createPlanSuccess = "CREATE_PLAN_SUCCESS",
  createPlanError = "CREATE_PLAN_ERROR",

  updatePlanPending = "UPDATE_PLAN_PENDING",
  updatePlanSuccess = "UPDATE_PLAN_SUCCESS",
  updatePlanError = "UPDATE_PLAN_ERROR",

  completePlanPending = "COMPLETE_PLAN_PENDING",
  completePlanSuccess = "COMPLETE_PLAN_SUCCESS",
  completePlanError = "COMPLETE_PLAN_ERROR",
}

// Get a single plan
export const getPlanPending = createAction<IExercisePlanStateContext>(
  ExercisePlanActionEnums.getPlanPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getPlanSuccess = createAction<IExercisePlanStateContext, IExercisePlan>(
  ExercisePlanActionEnums.getPlanSuccess,
  (currentPlan) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentPlan,
  })
);

export const getPlanError = createAction<IExercisePlanStateContext>(
  ExercisePlanActionEnums.getPlanError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Get plan history
export const getPlanHistoryPending = createAction<IExercisePlanStateContext>(
  ExercisePlanActionEnums.getPlanHistoryPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getPlanHistorySuccess = createAction<IExercisePlanStateContext, IExercisePlan[]>(
  ExercisePlanActionEnums.getPlanHistorySuccess,
  (planHistory) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    planHistory,
  })
);

export const getPlanHistoryError = createAction<IExercisePlanStateContext>(
  ExercisePlanActionEnums.getPlanHistoryError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Create a new plan
export const createPlanPending = createAction<IExercisePlanStateContext>(
  ExercisePlanActionEnums.createPlanPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const createPlanSuccess = createAction<IExercisePlanStateContext, IExercisePlan>(
  ExercisePlanActionEnums.createPlanSuccess,
  (currentPlan) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentPlan,
  })
);

export const createPlanError = createAction<IExercisePlanStateContext>(
  ExercisePlanActionEnums.createPlanError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Update a plan
export const updatePlanPending = createAction<IExercisePlanStateContext>(
  ExercisePlanActionEnums.updatePlanPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const updatePlanSuccess = createAction<IExercisePlanStateContext, IExercisePlan>(
  ExercisePlanActionEnums.updatePlanSuccess,
  (currentPlan) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentPlan,
  })
);

export const updatePlanError = createAction<IExercisePlanStateContext>(
  ExercisePlanActionEnums.updatePlanError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Complete a plan
export const completePlanPending = createAction<IExercisePlanStateContext>(
  ExercisePlanActionEnums.completePlanPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const completePlanSuccess = createAction<IExercisePlanStateContext, IExercisePlan>(
  ExercisePlanActionEnums.completePlanSuccess,
  (currentPlan) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentPlan,
  })
);

export const completePlanError = createAction<IExercisePlanStateContext>(
  ExercisePlanActionEnums.completePlanError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);
