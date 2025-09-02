import { createAsyncThunk, createReducer } from "@reduxjs/toolkit";
import type { SignInData, User, UserAuthAPiType } from "../../Types/User";
import { ApiRequestStatus } from "../../Types/Utilities";
import axios, { type AxiosResponse } from "axios";

const apiUrl: string = import.meta.env.VITE_API_URL;

export const authUser: UserAuthAPiType = {
  error: null,
  status: ApiRequestStatus.STAND_BY,
  authUser: null,
};

export const authApiThunk = createAsyncThunk<
  User,
  SignInData,
  { rejectValue: string }
>("request/UserAuthentication", async (credentials, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<User> = await axios.post(
      `${apiUrl}/api/users/login`,
      credentials
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Login failed");
  }
});

export const userAuthReducer = createReducer(authUser, (builder) => {
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
    });
});
