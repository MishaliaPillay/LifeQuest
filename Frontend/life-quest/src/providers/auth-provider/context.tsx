"use client";
import { createContext } from "react";

// Context shape interface

export interface UserRequestDto {
  id?: number;
  name: string;
  surname: string;
  emailAddress: string;
  userName: string;
  password: string;
}

export interface IAuth {
  user: UserRequestDto;
  xp?: number;
  level?: number;
  avatar?: string;
  id?: string;
  pathId?: string;
  avatarDescription?: string;
}

export interface ISignInRequest {
  userNameOrEmailAddress: string;
  password: string;
  rememberClient: boolean;
}

export interface ISignInResponse {
  result: {
    accessToken: string;
  };
}

export interface IAuthStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  Auth?: IAuth;
  Auths?: IAuth[]; // Array of Auths
}

// Auth action context interface
export interface IAuthActionContext {
  signIn: (SignInRequest: ISignInRequest) => Promise<ISignInResponse>;
  signUp: (Auth: IAuth) => Promise<void>;
  getCurrentPerson: (userId: number) => Promise<IAuth | null>; // Get the current user by ID
  updateDescription: (id: string, description: string) => Promise<void>;
  createAvatar: (id: string) => Promise<void>;
}

// Initial state with default values
export const INITIAL_STATE: IAuthStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  Auths: [],
};

// Create the state context and the action context
export const AuthStateContext = createContext<IAuthStateContext>(INITIAL_STATE);
export const AuthActionContext = createContext<IAuthActionContext | undefined>(
  undefined
);
