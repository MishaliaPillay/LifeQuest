"use client";

import { IFitnessPath, IFitnessPathStateContext } from "./context";
import { createAction } from "redux-actions";

// Define action enums
export enum FitnessPathActionEnums {
  getFitnessPathsPending = "GET_FITNESS_PATHS_PENDING",
  getFitnessPathsSuccess = "GET_FITNESS_PATHS_SUCCESS",
  getFitnessPathsError = "GET_FITNESS_PATHS_ERROR",

  getFitnessPathPending = "GET_FITNESS_PATH_PENDING",
  getFitnessPathSuccess = "GET_FITNESS_PATH_SUCCESS",
  getFitnessPathError = "GET_FITNESS_PATH_ERROR",

  createFitnessPathPending = "CREATE_FITNESS_PATH_PENDING",
  createFitnessPathSuccess = "CREATE_FITNESS_PATH_SUCCESS",
  createFitnessPathError = "CREATE_FITNESS_PATH_ERROR",

  updateFitnessPathPending = "UPDATE_FITNESS_PATH_PENDING",
  updateFitnessPathSuccess = "UPDATE_FITNESS_PATH_SUCCESS",
  updateFitnessPathError = "UPDATE_FITNESS_PATH_ERROR",

  deleteFitnessPathPending = "DELETE_FITNESS_PATH_PENDING",
  deleteFitnessPathSuccess = "DELETE_FITNESS_PATH_SUCCESS",
  deleteFitnessPathError = "DELETE_FITNESS_PATH_ERROR",
}

// Get all fitness paths
export const getFitnessPathsPending = createAction<IFitnessPathStateContext>(
  FitnessPathActionEnums.getFitnessPathsPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getFitnessPathsSuccess = createAction<IFitnessPathStateContext, IFitnessPath[]>(
  FitnessPathActionEnums.getFitnessPathsSuccess,
  (fitnessPaths) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    fitnessPaths,
  })
);

export const getFitnessPathsError = createAction<IFitnessPathStateContext>(
  FitnessPathActionEnums.getFitnessPathsError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Get single fitness path
export const getFitnessPathPending = createAction<IFitnessPathStateContext>(
  FitnessPathActionEnums.getFitnessPathPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getFitnessPathSuccess = createAction<IFitnessPathStateContext, IFitnessPath>(
  FitnessPathActionEnums.getFitnessPathSuccess,
  (currentPath) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentPath,
  })
);

export const getFitnessPathError = createAction<IFitnessPathStateContext>(
  FitnessPathActionEnums.getFitnessPathError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Create fitness path
export const createFitnessPathPending = createAction<IFitnessPathStateContext>(
  FitnessPathActionEnums.createFitnessPathPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const createFitnessPathSuccess = createAction<IFitnessPathStateContext, IFitnessPath>(
  FitnessPathActionEnums.createFitnessPathSuccess,
  (currentPath) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentPath,
  })
);

export const createFitnessPathError = createAction<IFitnessPathStateContext>(
  FitnessPathActionEnums.createFitnessPathError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Update fitness path
export const updateFitnessPathPending = createAction<IFitnessPathStateContext>(
  FitnessPathActionEnums.updateFitnessPathPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const updateFitnessPathSuccess = createAction<IFitnessPathStateContext, IFitnessPath>(
  FitnessPathActionEnums.updateFitnessPathSuccess,
  (currentPath) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentPath,
  })
);

export const updateFitnessPathError = createAction<IFitnessPathStateContext>(
  FitnessPathActionEnums.updateFitnessPathError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Delete fitness path
export const deleteFitnessPathPending = createAction<IFitnessPathStateContext>(
  FitnessPathActionEnums.deleteFitnessPathPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const deleteFitnessPathSuccess = createAction<IFitnessPathStateContext, IFitnessPath>(
  FitnessPathActionEnums.deleteFitnessPathSuccess,
  (currentPath) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentPath,
  })
);

export const deleteFitnessPathError = createAction<IFitnessPathStateContext>(
  FitnessPathActionEnums.deleteFitnessPathError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);
