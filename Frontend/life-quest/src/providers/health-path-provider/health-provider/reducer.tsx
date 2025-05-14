"use client";

import { handleActions } from "redux-actions";
import { INITIAL_STATE, IHealthPathStateContext } from "./context";
import { HealthPathActionEnums } from "./actions";

export const HealthPathReducer = handleActions<
  IHealthPathStateContext,
  Partial<IHealthPathStateContext>
>(
  {
    [HealthPathActionEnums.getHealthPathsPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [HealthPathActionEnums.getHealthPathsSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [HealthPathActionEnums.getHealthPathsError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [HealthPathActionEnums.getHealthPathPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [HealthPathActionEnums.getHealthPathSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [HealthPathActionEnums.getHealthPathError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [HealthPathActionEnums.createHealthPathPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [HealthPathActionEnums.createHealthPathSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [HealthPathActionEnums.createHealthPathError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [HealthPathActionEnums.updateHealthPathPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [HealthPathActionEnums.updateHealthPathSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [HealthPathActionEnums.updateHealthPathError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [HealthPathActionEnums.deleteHealthPathPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [HealthPathActionEnums.deleteHealthPathSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [HealthPathActionEnums.deleteHealthPathError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
  },
  INITIAL_STATE
);
