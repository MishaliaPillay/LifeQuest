"use client";

import { getAxiosInstance } from "../../../utils/axiosInstance";
import {
  IActivityType,
  INITIAL_STATE,
  ActivityTypeStateContext,
  ActivityTypeActionContext,
  IGenerateActivityTypeRequest,
} from "./context";

import { ActivityTypeReducer } from "./reducer";
import { useReducer, useContext } from "react";
import {
  getActivityTypesPending,
  getActivityTypesSuccess,
  getActivityTypesError,
  createActivityTypePending,
  createActivityTypeSuccess,
  createActivityTypeError,
  updateActivityTypePending,
  updateActivityTypeSuccess,
  updateActivityTypeError,
  deleteActivityTypePending,
  deleteActivityTypeSuccess,
  deleteActivityTypeError,
  generateActivityTypePending,
  generateActivityTypeSuccess,
  generateActivityTypeError,
} from "./actions";

export const ActivityTypeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(ActivityTypeReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  const getActivityTypes = async () => {
    dispatch(getActivityTypesPending());
    const endpoint = `/api/services/app/ActivityType/GetAllActivityTypes`;

    return instance
      .get(endpoint)
      .then((res) => {
        dispatch(getActivityTypesSuccess(res.data?.result));
      })
      .catch((err) => {
        console.error("Error fetching activity types:", err);
        dispatch(getActivityTypesError(err));
      });
  };

  const createActivityType = async (activityType: IActivityType) => {
    dispatch(createActivityTypePending());
    const endpoint = `/api/services/app/ActivityType/CreateActivityType`;

    return instance
      .post(endpoint, activityType)
      .then((res) => {
        dispatch(createActivityTypeSuccess(res.data?.result));
      })
      .catch((err) => {
        console.error("Error creating activity type:", err);
        dispatch(createActivityTypeError(err));
      });
  };

  const updateActivityType = async (activityType: IActivityType) => {
    dispatch(updateActivityTypePending());
    const endpoint = `/api/services/app/ActivityType/UpdateActivityType`;

    return instance
      .put(endpoint, activityType)
      .then((res) => {
        dispatch(updateActivityTypeSuccess(res.data?.result));
      })
      .catch((err) => {
        console.error("Error updating activity type:", err);
        dispatch(updateActivityTypeError(err));
      });
  };

  const deleteActivityType = async (activityTypeId: string) => {
    dispatch(deleteActivityTypePending());
    const endpoint = `/api/services/app/ActivityType/DeleteActivityType?Id=${activityTypeId}`;

    return instance
      .delete(endpoint)
      .then(() => {
        dispatch(deleteActivityTypeSuccess(activityTypeId));
      })
      .catch((err) => {
        console.error("Error deleting activity type:", err);
        dispatch(deleteActivityTypeError(err));
      });
  };

  const generateActivityTypes = async (
    requestData: IGenerateActivityTypeRequest
  ) => {
    dispatch(generateActivityTypePending());
    const endpoint = `/api/services/app/ActivityType/GenerateExerciseActivityTypes`;

    return instance
      .post(endpoint, requestData)
      .then((res) => {
        // The response contains a result.items array of activity types
        const activityTypes = res.data?.result?.items || [];
        dispatch(generateActivityTypeSuccess(activityTypes));
      })
      .catch((err) => {
        console.error("Error generating activity types:", err);
        dispatch(generateActivityTypeError(err));
      });
  };
  return (
    <ActivityTypeStateContext.Provider value={state}>
      <ActivityTypeActionContext.Provider
        value={{
          getActivityTypes,
          createActivityType,
          updateActivityType,
          deleteActivityType,
          generateActivityTypes,
        }}
      >
        {children}
      </ActivityTypeActionContext.Provider>
    </ActivityTypeStateContext.Provider>
  );
};

// Hook for state
export const useActivityTypeState = () => {
  const context = useContext(ActivityTypeStateContext);
  if (!context) {
    throw new Error(
      "useActivityTypeState must be used within an ActivityTypeProvider"
    );
  }
  return context;
};

// Hook for actions
export const useActivityTypeActions = () => {
  const context = useContext(ActivityTypeActionContext);
  if (!context) {
    throw new Error(
      "useActivityTypeActions must be used within an ActivityTypeProvider"
    );
  }
  return context;
};
