"use client";

import { getAxiosInstance } from "../../../utils/axiosInstance";
import {
  IWeight,
  INITIAL_STATE,
  WeightActionContext,
  WeightStateContext,
} from "./context";
import { WeightReducer } from "./reducer";
import { useContext, useReducer } from "react";
import {
  getWeightsPending,
  getWeightsSuccess,
  getWeightsError,
  getWeightPending,
  getWeightSuccess,
  getWeightError,
  createWeightPending,
  createWeightSuccess,
  createWeightError,
  updateWeightPending,
  updateWeightSuccess,
  updateWeightError,
  deleteWeightPending,
  deleteWeightSuccess,
  deleteWeightError,
} from "./actions";

export const WeightProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(WeightReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  // Fetch all weight entries for a person
  const getWeights = async (personId: string) => {
    dispatch(getWeightsPending());
    const endpoint = `/api/services/app/WeightEntry/GetAllForPerson?personId=${personId}`;

    return instance
      .get(endpoint)
      .then((response) => {

        dispatch(getWeightsSuccess(response.data?.result ?? []));
      })
      .catch((error) => {
        console.error("Error fetching weights:", error);
        dispatch(getWeightsError());
      });
  };

  // Get a specific weight entry
  const getWeight = async (id: string) => {
    dispatch(getWeightPending());
    const endpoint = `/api/services/app/WeightEntry/Get?input=${id}`;

    return instance
      .get(endpoint)
      .then((response) => {
        dispatch(getWeightSuccess(response.data?.result));
      })
      .catch((error) => {
        console.error("Error fetching weight:", error);
        dispatch(getWeightError());
      });
  };

  // Create a weight entry
  const createWeight = async (weight: IWeight) => {
    dispatch(createWeightPending());
    const endpoint = `/api/services/app/WeightEntry/Create`;

    return instance
      .post(endpoint, weight)
      .then((response) => {
        dispatch(createWeightSuccess(response.data?.result));
      })
      .catch((error) => {
        console.error("Error creating weight:", error);
        dispatch(createWeightError());
      });
  };

  // Update a weight entry
  const updateWeight = async (weight: IWeight) => {
    dispatch(updateWeightPending());
    const endpoint = `/api/services/app/WeightEntry/Update`;

    return instance
      .put(endpoint, weight)
      .then((response) => {
        dispatch(updateWeightSuccess(response.data?.result));
      })
      .catch((error) => {
        console.error("Error updating weight:", error);
        dispatch(updateWeightError());
      });
  };

  // Delete a weight entry
  const deleteWeight = (id: string) => {
    dispatch(deleteWeightPending());
    const endpoint = `/api/services/app/WeightEntry/Delete?input=${id}`;

    return instance
      .delete(endpoint)
      .then((response) => {
        dispatch(deleteWeightSuccess(response.data?.result));
      })
      .catch((error) => {
        console.error("Error deleting weight:", error);
        dispatch(deleteWeightError());
      });
  };

  return (
    <WeightStateContext.Provider value={state}>
      <WeightActionContext.Provider
        value={{
          getWeights,
          getWeight,
          createWeight,
          updateWeight,
          deleteWeight,
        }}
      >
        {children}
      </WeightActionContext.Provider>
    </WeightStateContext.Provider>
  );
};

// Hook for weight state
export const useWeightState = () => {
  const context = useContext(WeightStateContext);
  if (!context) {
    throw new Error("useWeightState must be used within a WeightProvider");
  }
  return context;
};

// Hook for weight actions
export const useWeightActions = () => {
  const context = useContext(WeightActionContext);
  if (!context) {
    throw new Error("useWeightActions must be used within a WeightProvider");
  }
  return context;
};
