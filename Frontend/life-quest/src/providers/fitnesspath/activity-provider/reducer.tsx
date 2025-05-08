"use client";

import { handleActions } from "redux-actions";
import { ActivityTypeState, INITIAL_STATE } from "./context";
import { ActivityTypeActionEnums } from "./actions";

// Define the reducer for activity types
export const ActivityTypeReducer = handleActions<
  ActivityTypeState,
  Partial<ActivityTypeState>
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
  },
  INITIAL_STATE
);
