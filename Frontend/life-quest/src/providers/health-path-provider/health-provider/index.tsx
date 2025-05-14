"use client";

import { getAxiosInstance } from "../../../utils/axiosInstance";
import {
  IHealthPath,
  INITIAL_STATE,
  HealthPathActionContext,
  HealthPathStateContext,
} from "./context";
import { HealthPathReducer } from "./reducer";
import { useContext, useReducer } from "react";
import {
  getHealthPathsPending,
  getHealthPathsSuccess,
  getHealthPathsError,
  getHealthPathPending,
  getHealthPathSuccess,
  getHealthPathError,
  createHealthPathPending,
  createHealthPathSuccess,
  createHealthPathError,
  updateHealthPathPending,
  updateHealthPathSuccess,
  updateHealthPathError,
  deleteHealthPathPending,
  deleteHealthPathSuccess,
  deleteHealthPathError,
} from "./actions";

export const HealthPathProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(HealthPathReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  const getHealthPaths = async (
    personId: string
  ): Promise<IHealthPath[] | null> => {
    dispatch(getHealthPathsPending());
    const endpoint = `/api/services/app/HealthPath/GetByPersonId?personId=${personId}`;

    try {
      const response = await instance.get(endpoint);
      const result = response.data?.result ?? [];
      dispatch(getHealthPathsSuccess(result));
      return result;
    } catch (error) {
      console.error("Error fetching health paths:", error);
      dispatch(getHealthPathsError());
      return null;
    }
  };

  const getHealthPath = async (id: string) => {
    dispatch(getHealthPathPending());
    const endpoint = `/api/services/app/HealthPath/Get?input=${id}`;

    try {
      const response = await instance.get(endpoint);
      dispatch(getHealthPathSuccess(response.data?.result));
    } catch (error) {
      console.error("Error fetching health path:", error);
      dispatch(getHealthPathError());
    }
  };

  const createHealthPath = async (
    healthPath: IHealthPath
  ): Promise<IHealthPath> => {
    dispatch(createHealthPathPending());
    const endpoint = `/api/services/app/HealthPath/Create`;

    try {
      const response = await instance.post(endpoint, healthPath);
      const result = response.data?.result;
      console.log("created path", result);
      dispatch(createHealthPathSuccess(result));
      return result;
    } catch (error) {
      console.error("Error creating health path:", error);
      dispatch(createHealthPathError());
      throw error;
    }
  };

  const updateHealthPath = async (healthPath: IHealthPath) => {
    dispatch(updateHealthPathPending());
    const endpoint = `/api/services/app/HealthPath/Update`;

    try {
      const response = await instance.put(endpoint, healthPath);
      dispatch(updateHealthPathSuccess(response.data?.result));
    } catch (error) {
      console.error("Error updating health path:", error);
      dispatch(updateHealthPathError());
    }
  };

  const deleteHealthPath = async (id: string) => {
    dispatch(deleteHealthPathPending());
    const endpoint = `/api/services/app/HealthPath/Delete?input=${id}`;

    try {
      const response = await instance.delete(endpoint);
      dispatch(deleteHealthPathSuccess(response.data?.result));
    } catch (error) {
      console.error("Error deleting health path:", error);
      dispatch(deleteHealthPathError());
    }
  };

  return (
    <HealthPathStateContext.Provider value={state}>
      <HealthPathActionContext.Provider
        value={{
          getHealthPaths,
          getHealthPath,
          createHealthPath,
          updateHealthPath,
          deleteHealthPath,
        }}
      >
        {children}
      </HealthPathActionContext.Provider>
    </HealthPathStateContext.Provider>
  );
};

// Hook for health path state
export const useHealthPathState = () => {
  const context = useContext(HealthPathStateContext);
  if (!context) {
    throw new Error(
      "useHealthPathState must be used within a HealthPathProvider"
    );
  }
  return context;
};

// Hook for health path actions
export const useHealthPathActions = () => {
  const context = useContext(HealthPathActionContext);
  if (!context) {
    throw new Error(
      "useHealthPathActions must be used within a HealthPathProvider"
    );
  }
  return context;
};
