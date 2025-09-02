import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "./Store";


export const useAppDispatch : ()=>AppDispatch = useDispatch
export const useAppSelectore : TypedUseSelectorHook<RootState> = useSelector