"use client";

import { createAction } from "redux-actions";
import { IHealthPath, IHealthPathStateContext } from "./context";

// Action Enums
export enum HealthPathActionEnums {
  getHealthPathsPending = "GET_HEALTH_PATHS_PENDING",
  getHealthPathsSuccess = "GET_HEALTH_PATHS_SUCCESS",
  getHealthPathsError = "GET_HEALTH_PATHS_ERROR",

  getHealthPathPending = "GET_HEALTH_PATH_PENDING",
  getHealthPathSuccess = "GET_HEALTH_PATH_SUCCESS",
  getHealthPathError = "GET_HEALTH_PATH_ERROR",

  createHealthPathPending = "CREATE_HEALTH_PATH_PENDING",
  createHealthPathSuccess = "CREATE_HEALTH_PATH_SUCCESS",
  createHealthPathError = "CREATE_HEALTH_PATH_ERROR",

  updateHealthPathPending = "UPDATE_HEALTH_PATH_PENDING",
  updateHealthPathSuccess = "UPDATE_HEALTH_PATH_SUCCESS",
  updateHealthPathError = "UPDATE_HEALTH_PATH_ERROR",

  deleteHealthPathPending = "DELETE_HEALTH_PATH_PENDING",
  deleteHealthPathSuccess = "DELETE_HEALTH_PATH_SUCCESS",
  deleteHealthPathError = "DELETE_HEALTH_PATH_ERROR",
}

// Get all health paths
export const getHealthPathsPending = createAction<IHealthPathStateContext>(
  HealthPathActionEnums.getHealthPathsPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getHealthPathsSuccess = createAction<
  IHealthPathStateContext
 
>(HealthPathActionEnums.getHealthPathsSuccess, () => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  
}));

export const getHealthPathsError = createAction<IHealthPathStateContext>(
  HealthPathActionEnums.getHealthPathsError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Get single health path
export const getHealthPathPending = createAction<IHealthPathStateContext>(
  HealthPathActionEnums.getHealthPathPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getHealthPathSuccess = createAction<
  IHealthPathStateContext
>(HealthPathActionEnums.getHealthPathSuccess, () => ({
  isPending: false,
  isSuccess: true,
  isError: false,

}));

export const getHealthPathError = createAction<IHealthPathStateContext>(
  HealthPathActionEnums.getHealthPathError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Create health path
export const createHealthPathPending = createAction<IHealthPathStateContext>(
  HealthPathActionEnums.createHealthPathPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const createHealthPathSuccess = createAction<
  IHealthPathStateContext,
  IHealthPath
>(HealthPathActionEnums.createHealthPathSuccess, (currentPath) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  currentPath,
}));

export const createHealthPathError = createAction<IHealthPathStateContext>(
  HealthPathActionEnums.createHealthPathError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Update health path
export const updateHealthPathPending = createAction<IHealthPathStateContext>(
  HealthPathActionEnums.updateHealthPathPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const updateHealthPathSuccess = createAction<
  IHealthPathStateContext,
  IHealthPath
>(HealthPathActionEnums.updateHealthPathSuccess, (currentPath) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  currentPath,
}));

export const updateHealthPathError = createAction<IHealthPathStateContext>(
  HealthPathActionEnums.updateHealthPathError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Delete health path
export const deleteHealthPathPending = createAction<IHealthPathStateContext>(
  HealthPathActionEnums.deleteHealthPathPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const deleteHealthPathSuccess = createAction<
  IHealthPathStateContext,
  IHealthPath
>(HealthPathActionEnums.deleteHealthPathSuccess, (currentPath) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  currentPath,
}));

export const deleteHealthPathError = createAction<IHealthPathStateContext>(
  HealthPathActionEnums.deleteHealthPathError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);
