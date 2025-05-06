"use client";

import { handleActions } from "redux-actions";
import { INITIAL_STATE, IPathsStateContext } from "./context";
import { PathsActionEnums } from "./actions";

export const PathsReducer = handleActions<
  IPathsStateContext,
  Partial<IPathsStateContext>
>(
  {
    [PathsActionEnums.getPathsPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [PathsActionEnums.getPathsSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [PathsActionEnums.getPathsError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),

    [PathsActionEnums.getPathPending]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [PathsActionEnums.getPathSuccess]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
    [PathsActionEnums.getPathError]: (state, action) => ({
      ...state,
      ...(action.payload ?? {}),
    }),
  },
  INITIAL_STATE
);
