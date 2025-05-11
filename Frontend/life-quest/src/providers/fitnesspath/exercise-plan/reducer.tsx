"use client";

import { handleActions } from "redux-actions";
import { IExercisePlanStateContext, INITIAL_STATE } from "./context";
import { ExercisePlanActionEnums } from "./actions";

export const ExercisePlanReducer = handleActions<
  IExercisePlanStateContext,
  Partial<IExercisePlanStateContext>
>(
  {
    [ExercisePlanActionEnums.getPlanPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [ExercisePlanActionEnums.getPlanSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [ExercisePlanActionEnums.getPlanError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [ExercisePlanActionEnums.getPlanHistoryPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [ExercisePlanActionEnums.getPlanHistorySuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [ExercisePlanActionEnums.getPlanHistoryError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [ExercisePlanActionEnums.createPlanPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [ExercisePlanActionEnums.createPlanSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [ExercisePlanActionEnums.createPlanError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [ExercisePlanActionEnums.updatePlanPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [ExercisePlanActionEnums.updatePlanSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [ExercisePlanActionEnums.updatePlanError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [ExercisePlanActionEnums.completePlanPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [ExercisePlanActionEnums.completePlanSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [ExercisePlanActionEnums.completePlanError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
  },
  INITIAL_STATE
);
