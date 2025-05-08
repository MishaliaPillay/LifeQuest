"use client";

import { createAction } from "redux-actions";
import { IActivityType, ActivityTypeState } from "./context";

export enum ActivityTypeActionEnums {
  getActivityTypesPending = "GET_ACTIVITY_TYPES_PENDING",
  getActivityTypesSuccess = "GET_ACTIVITY_TYPES_SUCCESS",
  getActivityTypesError = "GET_ACTIVITY_TYPES_ERROR",

  createActivityTypePending = "CREATE_ACTIVITY_TYPE_PENDING",
  createActivityTypeSuccess = "CREATE_ACTIVITY_TYPE_SUCCESS",
  createActivityTypeError = "CREATE_ACTIVITY_TYPE_ERROR",

  updateActivityTypePending = "UPDATE_ACTIVITY_TYPE_PENDING",
  updateActivityTypeSuccess = "UPDATE_ACTIVITY_TYPE_SUCCESS",
  updateActivityTypeError = "UPDATE_ACTIVITY_TYPE_ERROR",

  deleteActivityTypePending = "DELETE_ACTIVITY_TYPE_PENDING",
  deleteActivityTypeSuccess = "DELETE_ACTIVITY_TYPE_SUCCESS",
  deleteActivityTypeError = "DELETE_ACTIVITY_TYPE_ERROR",

  generateActivityTypePending = "GENERATE_ACTIVITY_TYPE_PENDING",
  generateActivityTypeSuccess = "GENERATE_ACTIVITY_TYPE_SUCCESS",
  generateActivityTypeError = "GENERATE_ACTIVITY_TYPE_ERROR",
}

// Get All Activity Types
// Get All Activity Types
export const createActivityTypePending = createAction<ActivityTypeState>(
  ActivityTypeActionEnums.createActivityTypePending,
  () => ({
    isPending: true,
    isSuccess: false,
    isError: false,
  })
);

export const createActivityTypeSuccess = createAction<
  ActivityTypeState,
  IActivityType
>(ActivityTypeActionEnums.createActivityTypeSuccess, (newActivityType) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  activityTypes: [newActivityType], // Optionally merge with previous list in reducer
}));

export const createActivityTypeError = createAction<ActivityTypeState, string>(
  ActivityTypeActionEnums.createActivityTypeError,
  (error) => ({
    isPending: false,
    isSuccess: false,
    isError: true,
    errorMessage: error,
  })
);
export const updateActivityTypePending = createAction<ActivityTypeState>(
  ActivityTypeActionEnums.updateActivityTypePending,
  () => ({
    isPending: true,
    isSuccess: false,
    isError: false,
  })
);

export const updateActivityTypeSuccess = createAction<
  ActivityTypeState,
  IActivityType
>(ActivityTypeActionEnums.updateActivityTypeSuccess, (updatedActivityType) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  activityTypes: [updatedActivityType], // Will be replaced correctly in reducer
}));

export const updateActivityTypeError = createAction<ActivityTypeState, string>(
  ActivityTypeActionEnums.updateActivityTypeError,
  (error) => ({
    isPending: false,
    isSuccess: false,
    isError: true,
    errorMessage: error,
  })
);
export const deleteActivityTypePending = createAction<ActivityTypeState>(
  ActivityTypeActionEnums.deleteActivityTypePending,
  () => ({
    isPending: true,
    isSuccess: false,
    isError: false,
  })
);

export const deleteActivityTypeSuccess = createAction<
  ActivityTypeState,
  string
>(ActivityTypeActionEnums.deleteActivityTypeSuccess, () => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  activityTypes: [], // Actual deletion will happen in reducer
}));

export const deleteActivityTypeError = createAction<ActivityTypeState, string>(
  ActivityTypeActionEnums.deleteActivityTypeError,
  (error) => ({
    isPending: false,
    isSuccess: false,
    isError: true,
    errorMessage: error,
  })
);

export const getActivityTypesPending = createAction<ActivityTypeState>(
  ActivityTypeActionEnums.getActivityTypesPending,
  () => ({
    isPending: true,
    isSuccess: false,
    isError: false,
    activityTypes: [],
  })
);

export const getActivityTypesSuccess = createAction<
  ActivityTypeState,
  IActivityType[]
>(ActivityTypeActionEnums.getActivityTypesSuccess, (activityTypes) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  activityTypes,
}));

export const getActivityTypesError = createAction<ActivityTypeState, string>(
  ActivityTypeActionEnums.getActivityTypesError,
  (error) => ({
    isPending: false,
    isSuccess: false,
    isError: true,
    errorMessage: error,
    activityTypes: [],
  })
);

// Generate Activity Types
export const generateActivityTypePending = createAction<ActivityTypeState>(
  ActivityTypeActionEnums.generateActivityTypePending,
  () => ({
    isPending: true,
    isSuccess: false,
    isError: false,
    activityTypes: [],
  })
);

export const generateActivityTypeSuccess = createAction<
  ActivityTypeState,
  IActivityType[]
>(ActivityTypeActionEnums.generateActivityTypeSuccess, (activityTypes) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  activityTypes,
}));

export const generateActivityTypeError = createAction<
  ActivityTypeState,
  string
>(ActivityTypeActionEnums.generateActivityTypeError, (error) => ({
  isPending: false,
  isSuccess: false,
  isError: true,
  errorMessage: error,
  activityTypes: [],
}));
