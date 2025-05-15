"use client";

import { getAxiosInstance } from "../../../utils/axiosInstance";
import {
  IMeal,
  INITIAL_STATE,
  MealStateContext,
  IGenerateMealRequest,
  MealActionContext,
  IIngredient,
  IGenerateBaseTypeRequest,
} from "./context";
import { MealReducer } from "./reducer";
import { useReducer, useContext } from "react";
import {
  getMealsPending,
  getMealsSuccess,
  getMealsError,
  createMealPending,
  createMealSuccess,
  createMealError,
  updateMealPending,
  updateMealSuccess,
  updateMealError,
  deleteMealPending,
  deleteMealSuccess,
  deleteMealError,
  generateMealsPending,
  generateMealsSuccess,
  generateMealsError,
  getMealPlanError,
  getMealPlanPending,
  getMealPlanSuccess,
  markCompletePlanPending,
  markCompletePlanSuccess,
  markCompletePlanError,
} from "./actions";

export const MealProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(MealReducer, INITIAL_STATE);
  const instance = getAxiosInstance();

  const getMeals = async () => {
    dispatch(getMealsPending());
    const endpoint = `/api/services/app/Meal/GetAllMeals`;

    return instance
      .get(endpoint)
      .then((res) => {
        dispatch(getMealsSuccess(res.data?.result));
      })
      .catch((err) => {
        console.error("Error fetching meals:", err);
        dispatch(getMealsError());
      });
  };
  const getMeal = async (id: string): Promise<IIngredient> => {
    const endpoint = `/api/services/app/ActivityType/GetActivityTypeById?Id=${id}`;
    try {
      const response = await instance.get(endpoint);
      return response.data?.result as IIngredient;
    } catch (err) {
      console.error("Error fetching activity type by ID:", err);
      throw err;
    }
  };
  const createMeal = async (meal: Partial<IMeal>): Promise<IMeal> => {
    dispatch(createMealPending());
    const endpoint = `/api/services/app/Meal/CreateMeal`;

    try {
      const res = await instance.post(endpoint, meal);

      dispatch(createMealSuccess(res.data?.result));
  
      return res.data?.result; // return the created meal object
    } catch (err) {
      console.error("Error creating meal:", err);
      dispatch(createMealError());
      throw err; // rethrow to handle in caller
    }
  };

  const updateMeal = async (meal: IMeal) => {
    dispatch(updateMealPending());
    const endpoint = `/api/services/app/Meal/UpdateMeal`;

    return instance
      .put(endpoint, meal)
      .then((res) => {
        dispatch(updateMealSuccess(res.data?.result));
      })
      .catch((err) => {
        console.error("Error updating meal:", err);
        dispatch(updateMealError());
      });
  };

  const deleteMeal = async (id: string) => {
    dispatch(deleteMealPending());
    const endpoint = `/api/services/app/Meal/DeleteMeal?Id=${id}`;

    return instance
      .delete(endpoint)
      .then(() => {
        dispatch(deleteMealSuccess(id));
      })
      .catch((err) => {
        console.error("Error deleting meal:", err);
        dispatch(deleteMealError());
      });
  };
  // const realMockMeals: IMeal[] = [
  //   {
  //     id: "0196c15f-070d-706a-945a-e97741d66f75",
  //     name: "Test Meal",
  //     description: "Something to eat",
  //     calories: 95,
  //     ingredientIds: [
  //       "0196c138-e93c-72a3-989d-7b1541cefdb9",
  //       "0196c15e-1687-7503-8fdb-d56c28ecb318",
  //     ],
  //     isComplete: false,
  //     ingredients: [],
  //     score: 0,
  //   },
  //   {
  //     id: "0196c5c8-7b44-7e61-8f24-c1b47ea59f7d",
  //     name: "string",
  //     description: "string",
  //     calories: 0,
  //     ingredientIds: ["0196c15e-1687-7503-8fdb-d56c28ecb318"],
  //     isComplete: false,
  //     ingredients: [],
  //     score: 25,
  //   },
  //   {
  //     id: "0196c655-9897-7738-8ebe-69d633cda3b6",
  //     name: "Quinoa and Black Bean Salad",
  //     description:
  //       "A refreshing and protein-packed salad with quinoa and black beans.",
  //     calories: 300,
  //     ingredientIds: [
  //       "0196c655-9863-7823-aee8-662597f2fe6c",
  //       "0196c655-988d-7238-83de-8ea4c27d2c0b",
  //       "0196c655-988d-7773-b6de-817b8a3e8b31",
  //       "0196c655-988d-78a1-9a6d-4d8f60ec8be6",
  //       "0196c655-988d-7e4d-858d-0c4b13441b1e",
  //       "0196c655-988e-7e6a-a483-6fdaef131dce",
  //     ],
  //     isComplete: false,
  //     ingredients: [],
  //     score: 0,
  //   },
  //   {
  //     id: "0196c869-11b1-7a7e-a4d1-74ab6833ef1c",
  //     name: "Quinoa and Black Bean Salad",
  //     description:
  //       "A nutritious and delicious salad with quinoa, black beans, and fresh vegetables.",
  //     calories: 350,
  //     ingredientIds: [
  //       "0196c869-1175-7128-9c45-16aee22e3bf7",
  //       "0196c869-11a7-76c5-bf4c-36c17968bc57",
  //       "0196c869-11a7-7824-8f71-82cf6a447b19",
  //       "0196c869-11a7-7ee0-b4cc-c282f851b561",
  //       "0196c869-11a8-7205-bbe4-d9277b506ecc",
  //       "0196c869-11a8-7276-956d-82fcff42b43b",
  //       "0196c869-11a8-74d4-a389-ca37e8354913",
  //       "0196c869-11a8-788b-b811-0caa5e0b7d1c",
  //       "0196c869-11a8-7928-a2b5-8f76c560ec99",
  //       "0196c869-11a8-7a1d-89c9-d6c95041e5f4",
  //       "0196c869-11a8-7dca-92ac-c967e1f88f2d",
  //     ],
  //     isComplete: false,
  //     ingredients: [],
  //     score: 0,
  //   },
  //   {
  //     id: "0196c870-370c-713f-b9b4-e40d31627aa5",
  //     name: "Vegan Quinoa Salad",
  //     description: "A tasty vegan quinoa dish full of nutrients.",
  //     calories: 280,
  //     ingredientIds: [],
  //     isComplete: false,
  //     ingredients: [],
  //     score: 0,
  //   },
  // ];

  // const generateMeals = async (
  //   requestData: IGenerateMealRequest,
  //   count = 2
  // ): Promise<IMeal[]> => {
  //   dispatch(generateMealsPending());

  //   // Pick meals from the predefined list
  //   const selectedMeals = realMockMeals.slice(0, count).map((meal) => ({
  //     ...meal,
  //     name: `${requestData.mealType} - ${meal.name}`,
  //     description: `${meal.description} (Cuisine: ${requestData.preferredCuisine}, Diet: ${requestData.dietaryRequirement})`,
  //     calories: Math.min(meal.calories, requestData.maxCalories),
  //   }));

  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       dispatch(generateMealsSuccess(selectedMeals));
  //       resolve(selectedMeals);
  //     }, 300);
  //   });
  // };

  const generateMeals = async (
    requestData: IGenerateMealRequest,
    count = 2
  ) => {
    dispatch(generateMealsPending());

    const endpoint = `/api/services/app/Meal/GenerateAIMealBatch`;

    const formattedRequest: IGenerateBaseTypeRequest = {
      count,
      baseRequest: requestData,
    };

    try {
      const res = await instance.post(endpoint, formattedRequest);
      const meals = res.data?.result?.items ?? res.data?.result ?? [];

      dispatch(generateMealsSuccess(meals));
      return meals;
    } catch (err) {
      console.error("Error generating meals:", err);
      dispatch(generateMealsError());
      return [];
    }
  };

  const getMealPlan = async (id: string): Promise<IMeal[]> => {
    dispatch(getMealPlanPending());
    const endpoint = `/api/services/app/Meal/GetByMealPlanId?mealPlanId=${id}`;
    try {
      const response = await instance.get(endpoint);
      dispatch(getMealPlanSuccess(response.data?.result));

      return response.data?.result;
    } catch (err) {
      console.error("Error fetching meals:", err);
      dispatch(getMealPlanError());
      return [];
    }
  };

  const completeMeal = async (
    mealId: string,
    personId: string
  ): Promise<void> => {
    dispatch(markCompletePlanPending());

    const endpoint = `/api/services/app/Meal/CompleteMeal?mealId=${mealId}&personId=${personId}`;

    try {
      const response = await instance.post(endpoint);
      dispatch(markCompletePlanSuccess(response.data?.result));
    } catch (err) {
      console.error("Error marking meal as complete:", err);
      dispatch(markCompletePlanError());
    }
  };

  return (
    <MealStateContext.Provider value={state}>
      <MealActionContext.Provider
        value={{
          getMeal,
          getMeals,
          createMeal,
          updateMeal,
          deleteMeal,
          generateMeals,
          getMealPlan,
          completeMeal,
        }}
      >
        {children}
      </MealActionContext.Provider>
    </MealStateContext.Provider>
  );
};

// Hook for state
export const useMealState = () => {
  const context = useContext(MealStateContext);
  if (!context) {
    throw new Error("useMealState must be used within a MealProvider");
  }
  return context;
};

// Hook for actions
export const useMealActions = () => {
  const context = useContext(MealActionContext);
  if (!context) {
    throw new Error("useMealActions must be used within a MealProvider");
  }
  return context;
};
