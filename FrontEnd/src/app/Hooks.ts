import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./Store";


export const useAppDispatch = useDispatch.withTypes<AppDispatch>
export const useAppSelectore = useSelector.withTypes<RootState>