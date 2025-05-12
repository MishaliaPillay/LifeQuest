"use client";
import { createContext } from "react";

// Context shape interface
export interface IUser {
  email?: string;
  id?: number;
  name: string;
  surname: string;
  emailAddress: string;
  userName: string;
}
export interface IUserStateContext {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  currentUser?: IUser; // Changed for naming consistency
  user?: IUser;
  users?: IUser[]; // Array of users
}
export interface IPerson {
  id: string;
  user: IUser;
  xp: number;
  level: number;
  avatar: string;
  pathId: string;
}
// User action context interface
export interface IUserActionContext {
  getCurrentUser: (token: string) => Promise<IUser>;
  getUsers: () => void; // Fetch all users
  getUser: (id: string) => void; // Fetch a single user
  createUser: (user: IUser) => void; // Create a new user
  updateUser: (user: IPerson) => void; // Delete a user
}

// Initial state with default values
export const INITIAL_STATE: IUserStateContext = {
  isPending: false,
  isSuccess: false,
  isError: false,
  users: [],
};

// Create the state context and the action context
export const UserStateContext = createContext<IUserStateContext>(INITIAL_STATE);
export const UserActionContext = createContext<IUserActionContext | undefined>(
  undefined
);
