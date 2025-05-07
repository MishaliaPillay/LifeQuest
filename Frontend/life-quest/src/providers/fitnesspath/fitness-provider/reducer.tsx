"use client";

import { handleActions } from "redux-actions";
import { INITIAL_STATE, IFitnessPathStateContext } from "./context";
import { FitnessPathActionEnums } from "./actions";

export const FitnessPathReducer = handleActions<
  IFitnessPathStateContext,
  Partial<IFitnessPathStateContext>
>(
  {
    [FitnessPathActionEnums.getFitnessPathsPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [FitnessPathActionEnums.getFitnessPathsSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [FitnessPathActionEnums.getFitnessPathsError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [FitnessPathActionEnums.getFitnessPathPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [FitnessPathActionEnums.getFitnessPathSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [FitnessPathActionEnums.getFitnessPathError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [FitnessPathActionEnums.createFitnessPathPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [FitnessPathActionEnums.createFitnessPathSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [FitnessPathActionEnums.createFitnessPathError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [FitnessPathActionEnums.updateFitnessPathPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [FitnessPathActionEnums.updateFitnessPathSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [FitnessPathActionEnums.updateFitnessPathError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [FitnessPathActionEnums.deleteFitnessPathPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [FitnessPathActionEnums.deleteFitnessPathSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [FitnessPathActionEnums.deleteFitnessPathError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
  },
  INITIAL_STATE
);
