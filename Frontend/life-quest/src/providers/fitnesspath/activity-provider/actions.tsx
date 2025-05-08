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
export const getActivityTypesPending = createAction<ActivityTypeState>(
  ActivityTypeActionEnums.getActivityTypesPending,
  () => ({ loading: true, error: null, activityTypes: [] })
);

export const getActivityTypesSuccess = createAction<ActivityTypeState, IActivityType[]>(
  ActivityTypeActionEnums.getActivityTypesSuccess,
  (activityTypes) => ({ loading: false, error: null, activityTypes })
);

export const getActivityTypesError = createAction<ActivityTypeState, string>(
  ActivityTypeActionEnums.getActivityTypesError,
  (error) => ({ loading: false, error, activityTypes: [] })
);

// Create Activity Type
export const createActivityTypePending = createAction(ActivityTypeActionEnums.createActivityTypePending);
export const createActivityTypeSuccess = createAction<IActivityType>(ActivityTypeActionEnums.createActivityTypeSuccess);
export const createActivityTypeError = createAction<string>(ActivityTypeActionEnums.createActivityTypeError);

// Update Activity Type
export const updateActivityTypePending = createAction(ActivityTypeActionEnums.updateActivityTypePending);
export const updateActivityTypeSuccess = createAction<IActivityType>(ActivityTypeActionEnums.updateActivityTypeSuccess);
export const updateActivityTypeError = createAction<string>(ActivityTypeActionEnums.updateActivityTypeError);

// Delete Activity Type
export const deleteActivityTypePending = createAction(ActivityTypeActionEnums.deleteActivityTypePending);
export const deleteActivityTypeSuccess = createAction<string>(ActivityTypeActionEnums.deleteActivityTypeSuccess); // ID
export const deleteActivityTypeError = createAction<string>(ActivityTypeActionEnums.deleteActivityTypeError);

// Generate Activity Type(s)
export const generateActivityTypePending = createAction(ActivityTypeActionEnums.generateActivityTypePending);
export const generateActivityTypeSuccess = createAction<IActivityType[]>(ActivityTypeActionEnums.generateActivityTypeSuccess);
export const generateActivityTypeError = createAction<string>(ActivityTypeActionEnums.generateActivityTypeError);
