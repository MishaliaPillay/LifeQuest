"use client";

import { getAxiosInstance } from "../../../utils/axiosInstance";
import {
  IMealPlan,
  INITIAL_STATE,
  MealPlanStateContext,
  MealPlanActionContext,
  IMealPlanDay,
} from "./context";
import { MealPlanReducer } from "./reducer";
import { useReducer, useContext } from "react";
import {
  getPlanPending,
  getPlanSuccess,
  getPlanError,
  getPlanHistoryPending,
  getPlanHistorySuccess,
  getPlanHistoryError,
  createPlanPending,
  createPlanSuccess,
  createPlanError,
  updatePlanPending,
  updatePlanSuccess,
  updatePlanError,
  completePlanPending,
  completePlanSuccess,
  completePlanError,
  getMealPlanDaysError,
  getMealPlanDaysPending,
  getMealPlanDaysSuccess,
} from "./actions";

export const MealPlanProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(MealPlanReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  const getPlan = async (personId: string) => {
    dispatch(getPlanPending());
    const endpoint = `/api/services/app/MealPlan/GetPlanForPerson?personId=${personId}`;

    return instance
      .get(endpoint)
      .then((res) => {
        dispatch(getPlanSuccess(res.data?.result));
      })
      .catch((err) => {
        console.error("Error fetching meal plan:", err);
        dispatch(getPlanError());
      });
  };
  const getMealPlanDaysByPlanId = async (
    mealPlanId: string
  ): Promise<{ result: IMealPlanDay[] }> => {
    dispatch(getMealPlanDaysPending());
    const endpoint = `/api/services/app/MealPlan/GetMealPlanDaysWithMealsByPlanId?mealPlanId=${mealPlanId}`;

    try {
      const res = await instance.get(endpoint);
  
      dispatch(getMealPlanDaysSuccess(res.data?.result));
      return { result: res.data?.result }; // return it so consumer can use it
    } catch (err) {
      console.error("Error fetching meal plan days:", err);
      dispatch(getMealPlanDaysError());
      return { result: [] }; // fallback to match the return type
    }
  };

  const getPlanHistory = async (personId: string) => {
    dispatch(getPlanHistoryPending());
    const endpoint = `/api/services/app/MealPlan/GetAllHistoryForPerson?personId=${personId}`;

    return instance
      .get(endpoint)
      .then((res) => {
        dispatch(getPlanHistorySuccess(res.data?.result ?? []));
      })
      .catch((err) => {
        console.error("Error fetching meal plan history:", err);
        dispatch(getPlanHistoryError());
      });
  };

  const createPlan = async (plan: IMealPlan) => {
    dispatch(createPlanPending());
    const endpoint = `/api/services/app/MealPlan/Create`;

    return instance
      .post(endpoint, plan)
      .then((res) => {
     
        dispatch(createPlanSuccess(res.data?.result));
      })
      .catch((err) => {
        console.error("Error creating meal plan:", err);
        dispatch(createPlanError());
      });
  };

  const updatePlan = async (plan: IMealPlan) => {
    dispatch(updatePlanPending());
    const endpoint = `/api/services/app/MealPlan/Update`;

    return instance
      .put(endpoint, plan)
      .then((res) => {
        dispatch(updatePlanSuccess(res.data?.result));
      })
      .catch((err) => {
        console.error("Error updating meal plan:", err);
        dispatch(updatePlanError());
      });
  };

  const completePlan = async (planId: string) => {
    dispatch(completePlanPending());
    const endpoint = `/api/services/app/MealPlan/CompletePlan?planId=${planId}`;

    return instance
      .post(endpoint)
      .then((res) => {
        dispatch(completePlanSuccess(res.data?.result));
      })
      .catch((err) => {
        console.error("Error completing meal plan:", err);
        dispatch(completePlanError());
      });
  };

  return (
    <MealPlanStateContext.Provider value={state}>
      <MealPlanActionContext.Provider
        value={{
          getPlan,
          getPlanHistory,
          createPlan,
          updatePlan,
          completePlan,
          getMealPlanDaysByPlanId,
        }}
      >
        {children}
      </MealPlanActionContext.Provider>
    </MealPlanStateContext.Provider>
  );
};

// Hook for state
export const useMealPlanState = () => {
  const context = useContext(MealPlanStateContext);
  if (!context) {
    throw new Error("useMealPlanState must be used within a MealPlanProvider");
  }
  return context;
};

// Hook for actions
export const useMealPlanActions = () => {
  const context = useContext(MealPlanActionContext);
  if (!context) {
    throw new Error(
      "useMealPlanActions must be used within a MealPlanProvider"
    );
  }
  return context;
};
