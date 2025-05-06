"use client";

import { handleActions } from "redux-actions";
import { INITIAL_STATE, IWeightStateContext } from "./context";
import { WeightActionEnums } from "./actions";

export const WeightReducer = handleActions<
  IWeightStateContext,
  Partial<IWeightStateContext>
>(
  {
    [WeightActionEnums.getWeightsPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [WeightActionEnums.getWeightsSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [WeightActionEnums.getWeightsError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [WeightActionEnums.getWeightPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [WeightActionEnums.getWeightSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [WeightActionEnums.getWeightError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [WeightActionEnums.createWeightPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [WeightActionEnums.createWeightSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [WeightActionEnums.createWeightError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [WeightActionEnums.updateWeightPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [WeightActionEnums.updateWeightSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [WeightActionEnums.updateWeightError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [WeightActionEnums.deleteWeightPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [WeightActionEnums.deleteWeightSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [WeightActionEnums.deleteWeightError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
  },
  INITIAL_STATE
);
