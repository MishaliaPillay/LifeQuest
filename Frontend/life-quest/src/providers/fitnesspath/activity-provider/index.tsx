"use client";
 import { defaultActivityTypes } from "../../../utils/defaultActivityTypes"; // Adjust path as needed

import { getAxiosInstance } from "../../../utils/axiosInstance";
import {
  IActivityType,
  INITIAL_STATE,
  ActivityTypeStateContext,
  IGenerateActivityTypeRequest,
  ActivityTypeActionContext,
  IExercisePlanDay,
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
  
  getExercisePlanError,
  getExercisePlanPending,
  getExercisePlanSuccess,
  markCompletePlanPending,
  markCompletePlanSuccess,
  markCompletePlanError,
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
        dispatch(getActivityTypesError());
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
        dispatch(createActivityTypeError());
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
        dispatch(updateActivityTypeError());
      });
  };

  const deleteActivityType = async (activityTypeId: IActivityType) => {
    dispatch(deleteActivityTypePending());
    const endpoint = `/api/services/app/ActivityType/DeleteActivityType?Id=${activityTypeId}`;

    return instance
      .delete(endpoint)
      .then(() => {
        dispatch(deleteActivityTypeSuccess(activityTypeId));
      })
      .catch((err) => {
        console.error("Error deleting activity type:", err);
        dispatch(deleteActivityTypeError());
      });
  };



const generateActivityTypes = async (requestData: {
  age: number;
  gender: string;
  bodyType: string;
  fitnessLevel: string;
  currentWeight: number;
  limitations: string;
  preferredExerciseTypes: string | string[];
  availableEquipment: string[];
}) => {
  dispatch(generateActivityTypePending());

  const endpoint = `/api/services/app/ActivityType/GenerateExerciseActivityTypes`;

  const preferredExerciseTypesArray =
    typeof requestData.preferredExerciseTypes === "string"
      ? requestData.preferredExerciseTypes.split(",")
      : requestData.preferredExerciseTypes;

  const formattedRequest: IGenerateActivityTypeRequest = {
    count: 2,
    baseRequest: {
      age: requestData.age,
      gender: requestData.gender,
      bodyType: requestData.bodyType,
      fitnessLevel: requestData.fitnessLevel,
      currentWeight: requestData.currentWeight,
      limitations: requestData.limitations,
      preferredExerciseTypes: preferredExerciseTypesArray.join(","),
      availableEquipment: requestData.availableEquipment,
    },
  };

  try {
    const res = await instance.post(endpoint, formattedRequest);
    const activityTypes = res.data?.result?.items;

    if (!activityTypes || activityTypes.length === 0) {
      dispatch(generateActivityTypeSuccess(defaultActivityTypes));
      return defaultActivityTypes;
    }

    dispatch(generateActivityTypeSuccess(activityTypes));
    return activityTypes;
  } catch (err) {
    console.error("Error generating activity types:", err);
    dispatch(generateActivityTypeSuccess(defaultActivityTypes));
    return defaultActivityTypes;
  }
};

  

  const getActivityType = async (id: string): Promise<IActivityType> => {
    const endpoint = `/api/services/app/ActivityType/GetActivityTypeById?Id=${id}`;
    try {
      const response = await instance.get(endpoint);
      return response.data?.result as IActivityType;
    } catch (err) {
      console.error("Error fetching activity type by ID:", err);
      throw err;
    }
  };

  const getExercisePlan = async (id: string): Promise<IExercisePlanDay[]> => {
    dispatch(getExercisePlanPending());
    const endpoint = `/api/services/app/Activity/GetByExercisePlanId?exercisePlanId=${id}`;
    try {
      const response = await instance.get(endpoint);
      const plan = response.data?.result || [];
      dispatch(getExercisePlanSuccess({ exercisePlan: plan }));
      return plan;
    } catch (err) {
      console.error("Error fetching exercise plan by ID:", err);
      dispatch(getExercisePlanError());
      throw err;
    }
  };

  const completeActivity = async (activityId: string) => {
    dispatch(markCompletePlanPending());

    const endpoint = `/api/services/app/Activity/MarkActivityAsComplete?activityId=${activityId}`;

    return instance
      .post(endpoint)
      .then((res) => {
        dispatch(markCompletePlanSuccess(res.data?.result));
      })
      .catch((err) => {
        console.error("Error marking activity as complete:", err);
        dispatch(markCompletePlanError());
      });
  };

  return (
    <ActivityTypeStateContext.Provider value={state}>
      <ActivityTypeActionContext.Provider
        value={{
          getActivityTypes,
          getActivityType,
          createActivityType,
          updateActivityType,
          deleteActivityType,
          generateActivityTypes,
          getExercisePlan,
          completeActivity,
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
