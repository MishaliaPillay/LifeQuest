"use client";

import { handleActions } from "redux-actions";
import { IActivityTypeStateContext, INITIAL_STATE } from "./context";
import { ActivityTypeActionEnums } from "./actions";

// Define the reducer for activity types
export const ActivityTypeReducer = handleActions<
  IActivityTypeStateContext,
  Partial<IActivityTypeStateContext>
>(
  {
    [ActivityTypeActionEnums.getActivityTypesPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [ActivityTypeActionEnums.getActivityTypesSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [ActivityTypeActionEnums.getActivityTypesError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [ActivityTypeActionEnums.createActivityTypePending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [ActivityTypeActionEnums.createActivityTypeSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [ActivityTypeActionEnums.createActivityTypeError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [ActivityTypeActionEnums.updateActivityTypePending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [ActivityTypeActionEnums.updateActivityTypeSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [ActivityTypeActionEnums.updateActivityTypeError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [ActivityTypeActionEnums.deleteActivityTypePending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [ActivityTypeActionEnums.deleteActivityTypeSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [ActivityTypeActionEnums.deleteActivityTypeError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [ActivityTypeActionEnums.generateActivityTypePending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [ActivityTypeActionEnums.generateActivityTypeSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [ActivityTypeActionEnums.generateActivityTypeError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [ActivityTypeActionEnums.getExercisePlanPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [ActivityTypeActionEnums.getExercisePlanSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [ActivityTypeActionEnums.getExercisePlanError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
  },
  INITIAL_STATE
);
