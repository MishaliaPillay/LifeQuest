"use client";

import { IStep, IStepsStateContext } from "./context";
import { createAction } from "redux-actions";

// Define action enums
export enum StepsActionEnums {
  getStepsPending = "GET_STEPS_PENDING",
  getStepsSuccess = "GET_STEPS_SUCCESS",
  getStepsError = "GET_STEPS_ERROR",

  getStepPending = "GET_STEP_PENDING",
  getStepSuccess = "GET_STEP_SUCCESS",
  getStepError = "GET_STEP_ERROR",

  createStepPending = "CREATE_STEP_PENDING",
  createStepSuccess = "CREATE_STEP_SUCCESS",
  createStepError = "CREATE_STEP_ERROR",

  updateStepPending = "UPDATE_STEP_PENDING",
  updateStepSuccess = "UPDATE_STEP_SUCCESS",
  updateStepError = "UPDATE_STEP_ERROR",

  deleteStepPending = "DELETE_STEP_PENDING",
  deleteStepSuccess = "DELETE_STEP_SUCCESS",
  deleteStepError = "DELETE_STEP_ERROR",
}

// Get all steps
export const getStepsPending = createAction<IStepsStateContext>(
  StepsActionEnums.getStepsPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getStepsSuccess = createAction<IStepsStateContext, IStep[]>(
  StepsActionEnums.getStepsSuccess,
  (steps) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    steps,
  })
);

export const getStepsError = createAction<IStepsStateContext>(
  StepsActionEnums.getStepsError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Get single step
export const getStepPending = createAction<IStepsStateContext>(
  StepsActionEnums.getStepPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getStepSuccess = createAction<IStepsStateContext, IStep>(
  StepsActionEnums.getStepSuccess,
  (currentStep) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentStep,
  })
);

export const getStepError = createAction<IStepsStateContext>(
  StepsActionEnums.getStepError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Create step
export const createStepPending = createAction<IStepsStateContext>(
  StepsActionEnums.createStepPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const createStepSuccess = createAction<IStepsStateContext, IStep>(
  StepsActionEnums.createStepSuccess,
  (currentStep) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentStep,
  })
);

export const createStepError = createAction<IStepsStateContext>(
  StepsActionEnums.createStepError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Update step
export const updateStepPending = createAction<IStepsStateContext>(
  StepsActionEnums.updateStepPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const updateStepSuccess = createAction<IStepsStateContext, IStep>(
  StepsActionEnums.updateStepSuccess,
  (currentStep) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentStep,
  })
);

export const updateStepError = createAction<IStepsStateContext>(
  StepsActionEnums.updateStepError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Delete step
export const deleteStepPending = createAction<IStepsStateContext>(
  StepsActionEnums.deleteStepPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const deleteStepSuccess = createAction<IStepsStateContext, IStep>(
  StepsActionEnums.deleteStepSuccess,
  (currentStep) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentStep,
  })
);

export const deleteStepError = createAction<IStepsStateContext>(
  StepsActionEnums.deleteStepError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);
