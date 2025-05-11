"use client";

import { useContext, useReducer } from "react";
import { getAxiosInstance } from "../../utils/axiosInstance";
import {

  INITIAL_STATE,
  PathsActionContext,
  PathsStateContext,
} from "./context";
import { PathsReducer } from "./reducer";
import {
  getPathsPending,
  getPathsSuccess,
  getPathsError,
  getPathPending,
  getPathSuccess,
  getPathError,
} from "./actions";

export const PathsProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(PathsReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  // Fetch all paths
  const getPaths = async () => {
    dispatch(getPathsPending());
    const endpoint = `/api/services/app/Path/GetAll`;

    return instance
      .get(endpoint)
      .then((response) => {
        dispatch(getPathsSuccess(response.data?.result ?? []));
      })
      .catch((error) => {
        console.error("Error fetching paths:", error);
        dispatch(getPathsError());
      });
  };

  // Fetch a single path by ID
  const getPath = async (id: string) => {
    dispatch(getPathPending());
    const endpoint = `/api/services/app/Path/Get?id=${id}`;

    return instance
      .get(endpoint)
      .then((response) => {
        dispatch(getPathSuccess(response.data?.result));
      })
      .catch((error) => {
        console.error("Error fetching path:", error);
        dispatch(getPathError());
      });
  };

  return (
    <PathsStateContext.Provider value={state}>
      <PathsActionContext.Provider
        value={{
          getPaths,
          getPath,
        }}
      >
        {children}
      </PathsActionContext.Provider>
    </PathsStateContext.Provider>
  );
};

// Hook for paths state
export const usePathsState = () => {
  const context = useContext(PathsStateContext);
  if (!context) {
    throw new Error("usePathsState must be used within a PathsProvider");
  }
  return context;
};

// Hook for paths actions
export const usePathsActions = () => {
  const context = useContext(PathsActionContext);
  if (!context) {
    throw new Error("usePathsActions must be used within a PathsProvider");
  }
  return context;
};
