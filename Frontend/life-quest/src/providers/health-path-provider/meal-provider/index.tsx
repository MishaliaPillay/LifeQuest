"use client";

import { getAxiosInstance } from "../../../utils/axiosInstance";
import {
  IMeal,
  INITIAL_STATE,
  MealStateContext,
  IGenerateMealRequest,
  MealActionContext,
  IIngredient,
} from "./context";
import { MealReducer } from "./reducer";
import { useReducer, useContext } from "react";
import {
  getMealsPending,
  getMealsSuccess,
  getMealsError,
  createMealPending,
  createMealSuccess,
  createMealError,
  updateMealPending,
  updateMealSuccess,
  updateMealError,
  deleteMealPending,
  deleteMealSuccess,
  deleteMealError,
  generateMealsPending,
  generateMealsSuccess,
  generateMealsError,
  getMealPlanError,
  getMealPlanPending,
  getMealPlanSuccess,
  markCompletePlanPending,
  markCompletePlanSuccess,
  markCompletePlanError,
} from "./actions";

export const MealProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(MealReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  const getMeals = async () => {
    dispatch(getMealsPending());
    const endpoint = `/api/services/app/Meal/GetAllMeals`;

    return instance
      .get(endpoint)
      .then((res) => {
        dispatch(getMealsSuccess(res.data?.result));
      })
      .catch((err) => {
        console.error("Error fetching meals:", err);
        dispatch(getMealsError());
      });
  };
  const getMeal = async (id: string): Promise<IIngredient> => {
    const endpoint = `/api/services/app/ActivityType/GetActivityTypeById?Id=${id}`;
    try {
      const response = await instance.get(endpoint);
      return response.data?.result as IIngredient;
    } catch (err) {
      console.error("Error fetching activity type by ID:", err);
      throw err;
    }
  };
  const createMeal = async (meal: IMeal) => {
    dispatch(createMealPending());
    const endpoint = `/api/services/app/Meal/CreateMeal`;

    return instance
      .post(endpoint, meal)
      .then((res) => {
        dispatch(createMealSuccess(res.data?.result));
      })
      .catch((err) => {
        console.error("Error creating meal:", err);
        dispatch(createMealError());
      });
  };

  const updateMeal = async (meal: IMeal) => {
    dispatch(updateMealPending());
    const endpoint = `/api/services/app/Meal/UpdateMeal`;

    return instance
      .put(endpoint, meal)
      .then((res) => {
        dispatch(updateMealSuccess(res.data?.result));
      })
      .catch((err) => {
        console.error("Error updating meal:", err);
        dispatch(updateMealError());
      });
  };

  const deleteMeal = async (id: string) => {
    dispatch(deleteMealPending());
    const endpoint = `/api/services/app/Meal/DeleteMeal?Id=${id}`;

    return instance
      .delete(endpoint)
      .then(() => {
        dispatch(deleteMealSuccess(id));
      })
      .catch((err) => {
        console.error("Error deleting meal:", err);
        dispatch(deleteMealError());
      });
  };

  const generateMeals = async (requestData: IGenerateMealRequest) => {
    dispatch(generateMealsPending());

    const endpoint = `/api/services/app/Meal/GenerateMeals`;

    try {
      const res = await instance.post(endpoint, requestData);
      const meals = res.data?.result;

      dispatch(generateMealsSuccess(meals));
      return meals;
    } catch (err) {
      console.error("Error generating meals:", err);
      dispatch(generateMealsError());
      return [];
    }
  };
  const getMealPlan = async (id: string): Promise<IMeal[]> => {
    dispatch(getMealPlanPending());
    const endpoint = `/api/services/app/Meal/GetByMealPlanId?mealPlanId=${id}`;
    try {
      const response = await instance.get(endpoint);
      dispatch(getMealPlanSuccess(response.data?.result));

      return response.data?.result;
    } catch (err) {
      console.error("Error fetching meals:", err);
      dispatch(getMealPlanError());
      return [];
    }
  };

  const completeMeal = async (activityId: string): Promise<void> => {
    dispatch(markCompletePlanPending());

    const endpoint = `/api/services/app/Activity/MarkActivityAsComplete?activityId=${activityId}`;

    try {
      const response = await instance.post(endpoint);
      dispatch(markCompletePlanSuccess(response.data?.result));
    } catch (err) {
      console.error("Error marking activity as complete:", err);
      dispatch(markCompletePlanError());
    }
  };

  return (
    <MealStateContext.Provider value={state}>
      <MealActionContext.Provider
        value={{
          getMeal,
          getMeals,
          createMeal,
          updateMeal,
          deleteMeal,
          generateMeals,
          getMealPlan,
          completeMeal,
        }}
      >
        {children}
      </MealActionContext.Provider>
    </MealStateContext.Provider>
  );
};

// Hook for state
export const useMealState = () => {
  const context = useContext(MealStateContext);
  if (!context) {
    throw new Error("useMealState must be used within a MealProvider");
  }
  return context;
};

// Hook for actions
export const useMealActions = () => {
  const context = useContext(MealActionContext);
  if (!context) {
    throw new Error("useMealActions must be used within a MealProvider");
  }
  return context;
};
