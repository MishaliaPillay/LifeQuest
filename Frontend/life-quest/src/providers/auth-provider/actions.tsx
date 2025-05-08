"use client";

import { IAuth, IAuthStateContext } from "./context";
import { createAction } from "redux-actions";

// Define enums for the actions
export enum AuthActionEnums {
  // Define 3 states for each action (pending, success, error)
  signInPending = "SIGN_IN_PENDING",
  signInSuccess = "SIGN_IN_SUCCESS",
  signInError = "SIGN_IN_ERROR",

  signUpPending = "SIGN_UP_PENDING",
  signUpSuccess = "SIGN_UP_SUCCESS",
  signUpError = "SIGN_UP_ERROR",

  signOutPending = "SIGN_OUT_PENDING",
  signOutSuccess = "SIGN_OUT_SUCCESS",
  signOutError = "SIGN_OUT_ERROR",

  getCurrentPersonPending = "GET_CURRENT_PERSON_PENDING", // New action for pending state
  getCurrentPersonSuccess = "GET_CURRENT_PERSON_SUCCESS", // New action for success state
  getCurrentPersonError = "GET_CURRENT_PERSON_ERROR", // New action for error state
}

// SIGN UP ACTIONS
export const signUpPending = createAction<IAuthStateContext>(
  AuthActionEnums.signUpPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const signUpSuccess = createAction<IAuthStateContext, IAuth>(
  AuthActionEnums.signUpSuccess,
  (Auth: IAuth) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    Auth: Auth,
  })
);

export const signUpError = createAction<IAuthStateContext>(
  AuthActionEnums.signUpError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// SIGN IN ACTIONS
export const signInPending = createAction<IAuthStateContext>(
  AuthActionEnums.signInPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const signInSuccess = createAction<IAuthStateContext, string>(
  AuthActionEnums.signInSuccess,
  (token: string) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    token: token,
  })
);

export const signInError = createAction<IAuthStateContext>(
  AuthActionEnums.signInError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// GET CURRENT PERSON ACTIONS
export const getCurrentPersonPending = createAction<IAuthStateContext>(
  AuthActionEnums.getCurrentPersonPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getCurrentPersonSuccess = createAction<IAuthStateContext, IAuth>(
  AuthActionEnums.getCurrentPersonSuccess,
  (Auth: IAuth) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    Auth: Auth,
  })
);

export const getCurrentPersonError = createAction<IAuthStateContext>(
  AuthActionEnums.getCurrentPersonError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);