"use client";

import { getAxiosInstance } from "../../../utils/axiosInstance";
import {
  IExercisePlan,
  INITIAL_STATE,
  ExercisePlanStateContext,
  ExercisePlanActionContext,
} from "./context";
import { ExercisePlanReducer } from "./reducer";
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
} from "./actions";

export const ExercisePlanProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(ExercisePlanReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  // Get current plan for a person
  const getPlan = async (personId: string) => {
    dispatch(getPlanPending());
    const endpoint = `/api/services/app/ExercisePlan/GetPlanForPerson?personId=${personId}`;

    return instance
      .get(endpoint)
      .then((res) => {
        dispatch(getPlanSuccess(res.data?.result));
      })
      .catch((err) => {
        console.error("Error fetching plan:", err);
        dispatch(getPlanError());
      });
  };

  // Get all historical plans for a person
  const getPlanHistory = async (personId: string) => {
    dispatch(getPlanHistoryPending());
    const endpoint = `/api/services/app/ExercisePlan/GetAllHistoryForPerson?personId=${personId}`;

    return instance
      .get(endpoint)
      .then((res) => {
        dispatch(getPlanHistorySuccess(res.data?.result ?? []));
      })
      .catch((err) => {
        console.error("Error fetching plan history:", err);
        dispatch(getPlanHistoryError());
      });
  };

  // Create a new plan
  const createPlan = async (plan: IExercisePlan) => {
    dispatch(createPlanPending());
    const endpoint = `/api/services/app/ExercisePlan/Create`;

    return instance
      .post(endpoint, plan)
      .then((res) => {
        dispatch(createPlanSuccess(res.data?.result));
      })
      .catch((err) => {
        console.error("Error creating plan:", err);
        dispatch(createPlanError());
      });
  };

  // Update an existing plan
  const updatePlan = async (plan: IExercisePlan) => {
    dispatch(updatePlanPending());
    const endpoint = `/api/services/app/ExercisePlan/Update`;

    return instance
      .put(endpoint, plan)
      .then((res) => {
        dispatch(updatePlanSuccess(res.data?.result));
      })
      .catch((err) => {
        console.error("Error updating plan:", err);
        dispatch(updatePlanError());
      });
  };

  // Mark a plan as completed
  const completePlan = async (planId: string) => {
    dispatch(completePlanPending());
    const endpoint = `/api/services/app/ExercisePlan/CompletePlan?planId=${planId}`;

    return instance
      .post(endpoint)
      .then((res) => {
        dispatch(completePlanSuccess(res.data?.result));
      })
      .catch((err) => {
        console.error("Error completing plan:", err);
        dispatch(completePlanError());
      });
  };

  return (
    <ExercisePlanStateContext.Provider value={state}>
      <ExercisePlanActionContext.Provider
        value={{
          getPlan,
          getPlanHistory,
          createPlan,
          updatePlan,
          completePlan,
        }}
      >
        {children}
      </ExercisePlanActionContext.Provider>
    </ExercisePlanStateContext.Provider>
  );
};

// Hook for state
export const useExercisePlanState = () => {
  const context = useContext(ExercisePlanStateContext);
  if (!context) {
    throw new Error(
      "useExercisePlanState must be used within an ExercisePlanProvider"
    );
  }
  return context;
};

// Hook for actions
export const useExercisePlanActions = () => {
  const context = useContext(ExercisePlanActionContext);
  if (!context) {
    throw new Error(
      "useExercisePlanActions must be used within an ExercisePlanProvider"
    );
  }
  return context;
};
