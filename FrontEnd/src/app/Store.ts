import { configureStore } from "@reduxjs/toolkit";
import { userAuthReducer } from "../features/Auth/UserAuthReducer.ts";


export const Store = configureStore({
    reducer:{ 
        userAuth:userAuthReducer
    }
})


export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch
export type AppStore = typeof Store 