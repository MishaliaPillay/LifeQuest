"use client";

import { IWeight, IWeightStateContext } from "./context";
import { createAction } from "redux-actions";

// Define action enums
export enum WeightActionEnums {
  getWeightsPending = "GET_WEIGHTS_PENDING",
  getWeightsSuccess = "GET_WEIGHTS_SUCCESS",
  getWeightsError = "GET_WEIGHTS_ERROR",

  getWeightPending = "GET_WEIGHT_PENDING",
  getWeightSuccess = "GET_WEIGHT_SUCCESS",
  getWeightError = "GET_WEIGHT_ERROR",

  createWeightPending = "CREATE_WEIGHT_PENDING",
  createWeightSuccess = "CREATE_WEIGHT_SUCCESS",
  createWeightError = "CREATE_WEIGHT_ERROR",

  updateWeightPending = "UPDATE_WEIGHT_PENDING",
  updateWeightSuccess = "UPDATE_WEIGHT_SUCCESS",
  updateWeightError = "UPDATE_WEIGHT_ERROR",

  deleteWeightPending = "DELETE_WEIGHT_PENDING",
  deleteWeightSuccess = "DELETE_WEIGHT_SUCCESS",
  deleteWeightError = "DELETE_WEIGHT_ERROR",
}

// Get all weights
export const getWeightsPending = createAction<IWeightStateContext>(
  WeightActionEnums.getWeightsPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getWeightsSuccess = createAction<IWeightStateContext, IWeight[]>(
  WeightActionEnums.getWeightsSuccess,
  (weights) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    weights,
  })
);

export const getWeightsError = createAction<IWeightStateContext>(
  WeightActionEnums.getWeightsError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Get single weight
export const getWeightPending = createAction<IWeightStateContext>(
  WeightActionEnums.getWeightPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getWeightSuccess = createAction<IWeightStateContext, IWeight>(
  WeightActionEnums.getWeightSuccess,
  (currentWeight) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentWeight,
  })
);

export const getWeightError = createAction<IWeightStateContext>(
  WeightActionEnums.getWeightError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Create weight
export const createWeightPending = createAction<IWeightStateContext>(
  WeightActionEnums.createWeightPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const createWeightSuccess = createAction<IWeightStateContext, IWeight>(
  WeightActionEnums.createWeightSuccess,
  (currentWeight) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentWeight,
  })
);

export const createWeightError = createAction<IWeightStateContext>(
  WeightActionEnums.createWeightError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Update weight
export const updateWeightPending = createAction<IWeightStateContext>(
  WeightActionEnums.updateWeightPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const updateWeightSuccess = createAction<IWeightStateContext, IWeight>(
  WeightActionEnums.updateWeightSuccess,
  (currentWeight) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentWeight,
  })
);

export const updateWeightError = createAction<IWeightStateContext>(
  WeightActionEnums.updateWeightError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Delete weight
export const deleteWeightPending = createAction<IWeightStateContext>(
  WeightActionEnums.deleteWeightPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const deleteWeightSuccess = createAction<IWeightStateContext, IWeight>(
  WeightActionEnums.deleteWeightSuccess,
  (currentWeight) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentWeight,
  })
);

export const deleteWeightError = createAction<IWeightStateContext>(
  WeightActionEnums.deleteWeightError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);
