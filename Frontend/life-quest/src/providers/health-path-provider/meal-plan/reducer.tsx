"use client";

import { handleActions } from "redux-actions";
import { IMealPlanStateContext, INITIAL_STATE } from "./context";
import { MealPlanActionEnums } from "./actions";

export const MealPlanReducer = handleActions<
  IMealPlanStateContext,
  Partial<IMealPlanStateContext>
>(
  {
    [MealPlanActionEnums.getPlanPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealPlanActionEnums.getPlanSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealPlanActionEnums.getPlanError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [MealPlanActionEnums.getPlanHistoryPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealPlanActionEnums.getPlanHistorySuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealPlanActionEnums.getPlanHistoryError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [MealPlanActionEnums.createPlanPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealPlanActionEnums.createPlanSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealPlanActionEnums.createPlanError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [MealPlanActionEnums.updatePlanPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealPlanActionEnums.updatePlanSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealPlanActionEnums.updatePlanError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [MealPlanActionEnums.completePlanPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealPlanActionEnums.completePlanSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealPlanActionEnums.completePlanError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),       [MealPlanActionEnums.getMealPlanDaysError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealPlanActionEnums.getMealPlanDaysPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealPlanActionEnums.getMealPlanDaysSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    })
  },
  INITIAL_STATE
);
