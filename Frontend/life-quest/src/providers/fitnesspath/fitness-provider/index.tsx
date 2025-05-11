"use client";

import { getAxiosInstance } from "../../../utils/axiosInstance";
import {
  IFitnessPath,
  INITIAL_STATE,
  FitnessPathActionContext,
  FitnessPathStateContext,
} from "./context";
import { FitnessPathReducer } from "./reducer";
import { useContext, useReducer } from "react";
import {
  getFitnessPathsPending,
  getFitnessPathsSuccess,
  getFitnessPathsError,
  getFitnessPathPending,
  getFitnessPathSuccess,
  getFitnessPathError,
  createFitnessPathPending,
  createFitnessPathSuccess,
  createFitnessPathError,
  updateFitnessPathPending,
  updateFitnessPathSuccess,
  updateFitnessPathError,
  deleteFitnessPathPending,
  deleteFitnessPathSuccess,
  deleteFitnessPathError,
} from "./actions";

export const FitnessPathProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(FitnessPathReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  // Fetch all fitness paths for a person
  const getFitnessPaths = async (
    personId: string
  ): Promise<IFitnessPath | null> => {
    dispatch(getFitnessPathsPending());
    const endpoint = `/api/services/app/FitnessPath/GetByPersonId?personId=${personId}`;

    try {
      const response = await instance.get(endpoint);
      const result = response.data?.result ?? [];
      dispatch(getFitnessPathsSuccess(result));
      return result;
    } catch (error) {
      console.error("Error fetching fitness paths:", error);
      dispatch(getFitnessPathsError());
      return null; // or throw error if you want stricter handling
    }
  };

  // Get a specific fitness path (if your API supports it)
  const getFitnessPath = async (id: string) => {
    dispatch(getFitnessPathPending());
    const endpoint = `/api/services/app/FitnessPath/Get?input=${id}`;

    return instance
      .get(endpoint)
      .then((response) => {
        dispatch(getFitnessPathSuccess(response.data?.result));
      })
      .catch((error) => {
        console.error("Error fetching fitness path:", error);
        dispatch(getFitnessPathError());
      });
  };

  // Create a fitness path
  const createFitnessPath = async (
    fitnessPath: IFitnessPath
  ): Promise<IFitnessPath> => {
    dispatch(createFitnessPathPending());
    const endpoint = `/api/services/app/FitnessPath/Create`;

    try {
      const response = await instance.post(endpoint, fitnessPath);
      const result = response.data?.result;
      console.log("fit", result);
      dispatch(createFitnessPathSuccess(result));
      return result;
    } catch (error) {
      console.error("Error creating fitness path:", error);
      dispatch(createFitnessPathError());
      throw error;
    }
  };

  // Update a fitness path
  const updateFitnessPath = async (fitnessPath: IFitnessPath) => {
    dispatch(updateFitnessPathPending());
    const endpoint = `/api/services/app/FitnessPath/Update`;

    return instance
      .put(endpoint, fitnessPath)
      .then((response) => {
        dispatch(updateFitnessPathSuccess(response.data?.result));
      })
      .catch((error) => {
        console.error("Error updating fitness path:", error);
        dispatch(updateFitnessPathError());
      });
  };

  // Delete a fitness path
  const deleteFitnessPath = async (id: string) => {
    dispatch(deleteFitnessPathPending());
    const endpoint = `/api/services/app/FitnessPath/Delete?input=${id}`;

    return instance
      .delete(endpoint)
      .then((response) => {
        dispatch(deleteFitnessPathSuccess(response.data?.result));
      })
      .catch((error) => {
        console.error("Error deleting fitness path:", error);
        dispatch(deleteFitnessPathError());
      });
  };

  return (
    <FitnessPathStateContext.Provider value={state}>
      <FitnessPathActionContext.Provider
        value={{
          getFitnessPaths,
          getFitnessPath,
          createFitnessPath,
          updateFitnessPath,
          deleteFitnessPath,
        }}
      >
        {children}
      </FitnessPathActionContext.Provider>
    </FitnessPathStateContext.Provider>
  );
};

// Hook for fitness path state
export const useFitnessPathState = () => {
  const context = useContext(FitnessPathStateContext);
  if (!context) {
    throw new Error(
      "useFitnessPathState must be used within a FitnessPathProvider"
    );
  }
  return context;
};

// Hook for fitness path actions
export const useFitnessPathActions = () => {
  const context = useContext(FitnessPathActionContext);
  if (!context) {
    throw new Error(
      "useFitnessPathActions must be used within a FitnessPathProvider"
    );
  }
  return context;
};
