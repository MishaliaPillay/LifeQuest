"use client";

import { handleActions } from "redux-actions";
import { IMealStateContext, INITIAL_STATE } from "./context";
import { MealActionEnums } from "./actions";

// Define the reducer for meals
export const MealReducer = handleActions<
  IMealStateContext,
  Partial<IMealStateContext>
>(
  {
    [MealActionEnums.getMealsPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealActionEnums.getMealsSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealActionEnums.getMealsError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [MealActionEnums.createMealPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealActionEnums.createMealSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealActionEnums.createMealError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [MealActionEnums.updateMealPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealActionEnums.updateMealSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealActionEnums.updateMealError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [MealActionEnums.deleteMealPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealActionEnums.deleteMealSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealActionEnums.deleteMealError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [MealActionEnums.generateMealsPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealActionEnums.generateMealsSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealActionEnums.generateMealsError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [MealActionEnums.getMealPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealActionEnums.getMealSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealActionEnums.getMealError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [MealActionEnums.markCompletePlanPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealActionEnums.markCompletePlanSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [MealActionEnums.markCompletePlanError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
  },
  INITIAL_STATE
);
