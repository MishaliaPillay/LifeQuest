"use client";

// Importing necessary dependencies
import {
  INITIAL_STATE,
  AuthActionContext,
  AuthStateContext,
  IAuth,
  ISignInResponse,
  ISignInRequest,
} from "./context";
import { AuthReducer } from "./reducer";
import { useContext, useReducer } from "react";
import {
  signInError,
  signInPending,
  signInSuccess,
  signUpPending,
  signUpSuccess,
  getCurrentPersonPending,
  getCurrentPersonSuccess,
  getCurrentPersonError,
} from "./actions";
import axios from "axios";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  // SignUp Function
  const signUp = async (Auth: IAuth): Promise<void> => {
    dispatch(signUpPending());

    const endpoint =
      "https://lifequest-backend.onrender.com/api/services/app/Person/Create";

    try {
      const response = await axios.post<IAuth>(endpoint, Auth);
      dispatch(signUpSuccess(response.data));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Signup error:", error.response?.data?.message || error.message);
      } else if (error instanceof Error) {
        console.error("Signup error:", error.message);
      } else {
        console.error("Signup error:", error);
      }
      throw error;
    }
  };

  // SignIn Function
  const signIn = async (
    SignInRequest: ISignInRequest
  ): Promise<ISignInResponse> => {
    dispatch(signInPending());

    const endpoint =
      "https://lifequest-backend.onrender.com/api/TokenAuth/Authenticate";
    return axios
      .post(endpoint, SignInRequest)
      .then((response) => {
        const token = response.data.result.accessToken;
        if (token) {
          sessionStorage.setItem("jwt", token);
          dispatch(signInSuccess(token));
          return response.data;
        } else {
          throw new Error("There is no response");
        }
      })
      .catch((error) => {
        console.error(
          "Error during signIn:",
          error.response?.data?.message || error
        );
        dispatch(signInError());
        throw error;
      });
  };

  // Get Current Person Function (now returning IAuth)
  const getCurrentPerson = async (userId: number): Promise<IAuth> => {
    dispatch(getCurrentPersonPending());

    const endpoint = `https://lifequest-backend.onrender.com/api/services/app/Person/GetCurrentPerson?userId=${userId}`;

    try {
      const response = await axios.get(endpoint);
      const authData: IAuth = {
        user: response.data.user,
        xp: response.data.xp,
        level: response.data.level,
        avatar: response.data.avatar,
      };
      dispatch(getCurrentPersonSuccess({ Auth: authData }));
      return authData; // Return IAuth
    } catch (error) {
      console.error(
        "Error during getCurrentPerson:",
        error.response?.data?.message || error
      );
      dispatch(getCurrentPersonError());
      throw error;
    }
  };

  return (
    <AuthStateContext.Provider value={state}>
      <AuthActionContext.Provider value={{ signIn, signUp, getCurrentPerson }}>
        {children}
      </AuthActionContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (!context) {
    throw new Error("useAuthState must be used within an AuthProvider");
  }
  return context;
};

export const useAuthActions = () => {
  const context = useContext(AuthActionContext);
  if (!context) {
    throw new Error("useAuthActions must be used within an AuthProvider");
  }
  return context;
};
