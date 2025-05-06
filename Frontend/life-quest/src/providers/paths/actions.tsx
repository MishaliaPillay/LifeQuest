"use client";

import { IPath, IPathsStateContext } from "./context";
import { createAction } from "redux-actions";

// Define action enums
export enum PathsActionEnums {
  getPathsPending = "GET_PATHS_PENDING",
  getPathsSuccess = "GET_PATHS_SUCCESS",
  getPathsError = "GET_PATHS_ERROR",

  getPathPending = "GET_PATH_PENDING",
  getPathSuccess = "GET_PATH_SUCCESS",
  getPathError = "GET_PATH_ERROR",
}

// Get all paths
export const getPathsPending = createAction<IPathsStateContext>(
  PathsActionEnums.getPathsPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getPathsSuccess = createAction<IPathsStateContext, IPath[]>(
  PathsActionEnums.getPathsSuccess,
  (paths) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    paths,
  })
);

export const getPathsError = createAction<IPathsStateContext>(
  PathsActionEnums.getPathsError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);

// Get single path
export const getPathPending = createAction<IPathsStateContext>(
  PathsActionEnums.getPathPending,
  () => ({ isPending: true, isSuccess: false, isError: false })
);

export const getPathSuccess = createAction<IPathsStateContext, IPath>(
  PathsActionEnums.getPathSuccess,
  (currentPath) => ({
    isPending: false,
    isSuccess: true,
    isError: false,
    currentPath,
  })
);

export const getPathError = createAction<IPathsStateContext>(
  PathsActionEnums.getPathError,
  () => ({ isPending: false, isSuccess: false, isError: true })
);
