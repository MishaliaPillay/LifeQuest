"use client";
//import { getAxiosInstace } from "../../utils/axiosInstance";

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
} from "./actions";
import axios from "axios";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  const signUp = async (Auth: IAuth): Promise<void> => {
    dispatch(signUpPending());

    const endpoint =
      "https://lifequest-backend.onrender.com/api/services/app/Person/Create";

    try {
      const response = await axios.post<IAuth>(endpoint, Auth);
      dispatch(signUpSuccess(response.data));
    } catch (error: any) {
      console.error("Signup error:", error.response?.data?.message || error);
      throw error; // Throw so component can handle
    }
  };

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

  return (
    <AuthStateContext.Provider value={state}>
      <AuthActionContext.Provider value={{ signIn, signUp }}>
        {children}
      </AuthActionContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (!context) {
    throw new Error("useAuthState must be used within a AuthProvider");
  }
  return context;
};

export const useAuthActions = () => {
  const context = useContext(AuthActionContext);
  if (!context) {
    throw new Error("useAuthActions must be used within a AuthProvider");
  }
  return context;
};
