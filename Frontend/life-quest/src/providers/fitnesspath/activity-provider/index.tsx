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

  // const generateActivityTypes = async (requestData: {
  //   age: number;
  //   gender: string;
  //   bodyType: string;
  //   fitnessLevel: string;
  //   limitations: string;
  //   preferredExerciseTypes: string | string[]; // Can be either a string or an array
  //   availableEquipment: string[];
  // }) => {
  //   dispatch(generateActivityTypePending());
  //   const endpoint = `/api/services/app/ActivityType/GenerateExerciseActivityTypes`;

  //   // Ensure preferredExerciseTypes is treated as an array before calling .join()
  //   const preferredExerciseTypesArray =
  //     typeof requestData.preferredExerciseTypes === "string"
  //       ? requestData.preferredExerciseTypes.split(",") // If it's a string, split by commas to make it an array
  //       : requestData.preferredExerciseTypes; // If it's already an array, keep it as is

  //   // Format the request as expected by the backend
  //   const formattedRequest: IGenerateActivityTypeRequest = {
  //     count: 2, // You can adjust this or make it dynamic based on user input
  //     baseRequest: {
  //       age: requestData.age,
  //       gender: requestData.gender,
  //       bodyType: requestData.bodyType,
  //       fitnessLevel: requestData.fitnessLevel,
  //       limitations: requestData.limitations,
  //       preferredExerciseTypes: preferredExerciseTypesArray.join(","), // Now we can safely use join
  //       availableEquipment: requestData.availableEquipment,
  //     },
  //   };

  //   console.log("Sending request:", formattedRequest);

  //   return instance
  //     .post(endpoint, formattedRequest)
  //     .then((res) => {
  //       console.log("Response received:", res.data);
  //       // The response contains a result.items array of activity types
  //       const activityTypes = res.data?.result?.items || [];
  //       dispatch(generateActivityTypeSuccess(activityTypes));
  //       return activityTypes;
  //     })
  //     .catch((err) => {
  //       console.error("Error generating activity types:", err);
  //       dispatch(generateActivityTypeError());
  //       throw err; // Re-throw to handle in the component
  //     });
  // };
  const generateActivityTypes = async (requestData: {
    age: number;
    gender: string;
    bodyType: string;
    fitnessLevel: string;
    limitations: string;
    preferredExerciseTypes: string | string[];
    availableEquipment: string[];
  }) => {
    dispatch(generateActivityTypePending());

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // MOCK DATA: Replace this with your desired static mock objects
      const mockActivityTypes = [
        {
          id: "0196b016-1645-7d52-9ab1-5e58916bf9b8",
          category: "Cardio - HIIT",
          intensityLevel: 3,
          description:
            "High-intensity interval training to improve endurance and burn fat quickly.",
        },
        {
          id: "0196b105-9e61-7570-a8d9-d9ff88415662",
          category: "Strength - Bodyweight",
          intensityLevel: 2,
          description:
            "A mix of push-ups, squats, and planks for full-body conditioning.",
        },
      ];

      dispatch(generateActivityTypeSuccess(mockActivityTypes));
      return mockActivityTypes;
    } catch (err) {
      console.error("Mock error generating activity types:", err);
      dispatch(generateActivityTypeError());
      throw err;
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
