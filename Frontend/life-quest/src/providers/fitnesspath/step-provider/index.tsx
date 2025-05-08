"use client";

import { getAxiosInstance } from "../../../utils/axiosInstance";
import {
  IStep,
  INITIAL_STATE,
  StepsActionContext,
  StepsStateContext,
} from "./context";
import { StepsReducer } from "./reducer";
import { useContext, useReducer } from "react";
import {
  getStepsPending,
  getStepsSuccess,
  getStepsError,
  getStepPending,
  getStepSuccess,
  getStepError,
  createStepPending,
  createStepSuccess,
  createStepError,
  updateStepPending,
  updateStepSuccess,
  updateStepError,
  deleteStepPending,
  deleteStepSuccess,
  deleteStepError,
} from "./actions";

export const StepsProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(StepsReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  // Fetch all steps for a person
  const getSteps = async (personId: string) => {
    dispatch(getStepsPending());
    const endpoint = `/api/services/app/StepEntry/GetAllForPerson?personId=${personId}`;

    return instance
      .get(endpoint)
      .then((response) => {
       
        dispatch(getStepsSuccess(response.data?.result ?? []));
      })
      .catch((error) => {
        console.error("Error fetching steps:", error);
        dispatch(getStepsError());
      });
  };

  // Get a specific step entry (assuming endpoint exists; if not, remove this)
  const getStep = async (id: string) => {
    dispatch(getStepPending());
    const endpoint = `/api/services/app/StepEntry/Get?input=${id}`;

    return instance
      .get(endpoint)
      .then((response) => {
        dispatch(getStepSuccess(response.data?.result));
      })
      .catch((error) => {
        console.error("Error fetching step:", error);
        dispatch(getStepError());
      });
  };

  // Create a step entry
  const createStep = async (step: IStep) => {
    dispatch(createStepPending());
    const endpoint = `/api/services/app/StepEntry/Create`;

    return instance
      .post(endpoint, step)
      .then((response) => {
        dispatch(createStepSuccess(response.data?.result));
      })
      .catch((error) => {
        console.error("Error creating step:", error);
        dispatch(createStepError());
      });
  };

  // Update a step entry
  const updateStep = async (step: IStep) => {
    dispatch(updateStepPending());
    const endpoint = `/api/services/app/StepEntry/Update`;

    return instance
      .put(endpoint, step)
      .then((response) => {
        dispatch(updateStepSuccess(response.data?.result));
      })
      .catch((error) => {
        console.error("Error updating step:", error);
        dispatch(updateStepError());
      });
  };

  // Delete a step entry
  const deleteStep = (id: string) => {
    dispatch(deleteStepPending());
    const endpoint = `/api/services/app/StepEntry/Delete?input=${id}`;

    return instance
      .delete(endpoint)
      .then((response) => {
        dispatch(deleteStepSuccess(response.data?.result));
      })
      .catch((error) => {
        console.error("Error deleting step:", error);
        dispatch(deleteStepError());
      });
  };

  return (
    <StepsStateContext.Provider value={state}>
      <StepsActionContext.Provider
        value={{
          getSteps,
          getStep,
          createStep,
          updateStep,
          deleteStep,
        }}
      >
        {children}
      </StepsActionContext.Provider>
    </StepsStateContext.Provider>
  );
};

// Hook for steps state
export const useStepsState = () => {
  const context = useContext(StepsStateContext);
  if (!context) {
    throw new Error("useStepsState must be used within a StepsProvider");
  }
  return context;
};

// Hook for steps actions
export const useStepsActions = () => {
  const context = useContext(StepsActionContext);
  if (!context) {
    throw new Error("useStepsActions must be used within a StepsProvider");
  }
  return context;
};
