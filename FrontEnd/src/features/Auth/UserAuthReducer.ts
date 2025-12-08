import {
  createAction,
  createAsyncThunk,
  createReducer,
} from "@reduxjs/toolkit";
import type { SignInData, User, UserAuthAPiType } from "../../Types/User.ts";
import { ApiRequestStatus } from "../../Types/Utilities.ts";
import { type AxiosResponse } from "axios";
import { api } from "../../ApiService/ApiBrain.ts";

export const authUser: UserAuthAPiType = {
  error: null,
  status: ApiRequestStatus.STAND_BY,
  authUser: null,
};

export const setUserFromToken = createAction<User | null>(
  "auth/setUserFromToken"
);
export const resetUser = createAction("auth/resetUser");

export const authApiThunk = createAsyncThunk<
  User,
  SignInData,
  { rejectValue: string }
>("request/UserAuthentication", async (credentials, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<User> = await api.post(
      `/api/users/login`,
      credentials
    );

    localStorage.setItem("accessToken", response.data?.accessToken as string);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Login failed");
  }
});

export const userAuthReducer = createReducer(
  authUser,

  (builder) => {
    builder
      .addCase(authApiThunk.pending, (state) => {
        state.status = ApiRequestStatus.PENTDING;
      })
      .addCase(authApiThunk.fulfilled, (state, action) => {
        state.status = ApiRequestStatus.SUCCESS;
        state.error = null;
        state.authUser = action.payload;
      })
      .addCase(authApiThunk.rejected, (state, action) => {
        state.status = ApiRequestStatus.FAILURE;
        state.error = action.payload;
        state.authUser = null;
      })
      .addCase(setUserFromToken, (state, action) => {
        state.authUser = action.payload;
      })
      .addCase(resetUser, (state) => {
        state.error = null;
        state.status = ApiRequestStatus.STAND_BY;
        state.authUser = null;
      });
  }
);
