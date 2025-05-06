"use client";

import { handleActions } from "redux-actions";
import { INITIAL_STATE, IStepsStateContext } from "./context";
import { StepsActionEnums } from "./actions";

export const StepsReducer = handleActions<
  IStepsStateContext,
  Partial<IStepsStateContext>
>(
  {
    [StepsActionEnums.getStepsPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [StepsActionEnums.getStepsSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [StepsActionEnums.getStepsError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [StepsActionEnums.getStepPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [StepsActionEnums.getStepSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [StepsActionEnums.getStepError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [StepsActionEnums.createStepPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [StepsActionEnums.createStepSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [StepsActionEnums.createStepError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [StepsActionEnums.updateStepPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [StepsActionEnums.updateStepSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [StepsActionEnums.updateStepError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [StepsActionEnums.deleteStepPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [StepsActionEnums.deleteStepSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [StepsActionEnums.deleteStepError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
  },
  INITIAL_STATE
);
