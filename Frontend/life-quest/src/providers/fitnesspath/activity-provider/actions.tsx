"use client";

import { createAction } from "redux-actions";
import { IActivityType, IActivityTypeStateContext } from "./context";

// Action enums
export enum ActivityTypeActionEnums {
  getActivityTypesPending = "GET_ACTIVITY_TYPES_PENDING",
  getActivityTypesSuccess = "GET_ACTIVITY_TYPES_SUCCESS",
  getActivityTypesError = "GET_ACTIVITY_TYPES_ERROR",

  getActivityTypePending = "GET_ACTIVITY_TYPE_PENDING",
  getActivityTypeSuccess = "GET_ACTIVITY_TYPE_SUCCESS",
  getActivityTypeError = "GET_ACTIVITY_TYPE_ERROR",

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
  getExercisePlanPending = "GET_EXERCISE_PLAN_PENDING",
  getExercisePlanSuccess = "GET_EXERCISE_PLAN_SUCCESS",
  getExercisePlanError = "GET_EXERCISE_PLAN_ERROR",
}

// GET ALL
export const getActivityTypesPending = createAction<IActivityTypeStateContext>(
  ActivityTypeActionEnums.getActivityTypesPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getActivityTypesSuccess = createAction<
  IActivityTypeStateContext,
  IActivityType[]
>(ActivityTypeActionEnums.getActivityTypesSuccess, (activityTypes) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  activityTypes,
}));

export const getActivityTypesError = createAction<IActivityTypeStateContext>(
  ActivityTypeActionEnums.getActivityTypesError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// CREATE
export const createActivityTypePending =
  createAction<IActivityTypeStateContext>(
    ActivityTypeActionEnums.createActivityTypePending,
    () => ({ isPending: true, isSuccess: false, isError: false })
  );

export const createActivityTypeSuccess = createAction<
  IActivityTypeStateContext,
  IActivityType
>(ActivityTypeActionEnums.createActivityTypeSuccess, (activityType) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  activityType,
}));

export const createActivityTypeError = createAction<IActivityTypeStateContext>(
  ActivityTypeActionEnums.createActivityTypeError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// UPDATE
export const updateActivityTypePending =
  createAction<IActivityTypeStateContext>(
    ActivityTypeActionEnums.updateActivityTypePending,
    () => ({ isPending: true, isSuccess: false, isError: false })
  );

export const updateActivityTypeSuccess = createAction<
  IActivityTypeStateContext,
  IActivityType
>(ActivityTypeActionEnums.updateActivityTypeSuccess, (activityType) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  activityType,
}));

export const updateActivityTypeError = createAction<IActivityTypeStateContext>(
  ActivityTypeActionEnums.updateActivityTypeError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// DELETE
export const deleteActivityTypePending =
  createAction<IActivityTypeStateContext>(
    ActivityTypeActionEnums.deleteActivityTypePending,
    () => ({ isPending: true, isSuccess: false, isError: false })
  );

export const deleteActivityTypeSuccess = createAction<
  IActivityTypeStateContext,
  IActivityType
>(ActivityTypeActionEnums.deleteActivityTypeSuccess, (activityType) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  activityType,
}));

export const deleteActivityTypeError = createAction<IActivityTypeStateContext>(
  ActivityTypeActionEnums.deleteActivityTypeError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// GENERATE
export const generateActivityTypePending =
  createAction<IActivityTypeStateContext>(
    ActivityTypeActionEnums.generateActivityTypePending,
    () => ({ isPending: true, isSuccess: false, isError: false })
  );

export const generateActivityTypeSuccess = createAction<
  IActivityTypeStateContext,
  IActivityType[]
>(ActivityTypeActionEnums.generateActivityTypeSuccess, (activityTypes) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  activityTypes,
}));

export const generateActivityTypeError =
  createAction<IActivityTypeStateContext>(
    ActivityTypeActionEnums.generateActivityTypeError,
    () => ({ isPending: false, isSuccess: false, isError: true })
  );
export const getExercisePlanPending = createAction<IActivityTypeStateContext>(
  ActivityTypeActionEnums.getExercisePlanPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getExercisePlanSuccess = createAction<
  IActivityTypeStateContext,
  IActivityType[]
>(ActivityTypeActionEnums.getExercisePlanSuccess, (activityTypes) => ({
  isPending: false,
  isSuccess: true,
  isError: false,
  activityTypes,
}));

export const getExercisePlanError = createAction<IActivityTypeStateContext>(
  ActivityTypeActionEnums.getExercisePlanError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);
