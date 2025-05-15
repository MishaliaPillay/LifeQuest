"use client";

import { handleActions } from "redux-actions";
import { INITIAL_STATE, IAuthStateContext } from "./context";
import { AuthActionEnums } from "./actions";

export const AuthReducer = handleActions<IAuthStateContext, IAuthStateContext>(
  {
    [AuthActionEnums.signInPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [AuthActionEnums.signInSuccess]: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    [AuthActionEnums.signInError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    [AuthActionEnums.signUpError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [AuthActionEnums.signUpSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [AuthActionEnums.signUpPending]: (state, action) => ({
      ...state,
      ...action.payload,
    }),

    // Handling getCurrentPerson actions
    [AuthActionEnums.getCurrentPersonPending]: (state) => ({
      ...state,
      isPending: true,
      isSuccess: false,
      isError: false,
    }),

    [AuthActionEnums.getCurrentPersonSuccess]: (state, action) => ({
      ...state,
      isPending: false,
      isSuccess: true,
      isError: false,
      Auth: action.payload.Auth, // Update the current user info in the state
    }),

    [AuthActionEnums.getCurrentPersonError]: (state) => ({
      ...state,
      isPending: false,
      isSuccess: false,
      isError: true,
    }),
    [AuthActionEnums.updateDescriptionError]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    [AuthActionEnums.updateDescriptionPending]: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    [AuthActionEnums.updateDescriptionSuccess]: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
  INITIAL_STATE
);
