import type { SelectChangeEvent } from "@mui/material";
import type React from "react";

export type ListenerChangerFuntion = (
  e: React.ChangeEvent<HTMLInputElement>
) => void;

export type RefChangerFunction<T> = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  key: Extract<keyof T, string>
) => void;



export enum ApiRequestStatus {
  STAND_BY = "StandBy",
  PENTDING = "Pending",
  SUCCESS = "Success",
  FAILURE = "Failure"
}


export type ObjectRefChangerFunction =<
  T extends Record<string, any>
> (
  store : React.RefObject<T>,
  event:  React.ChangeEvent<{ value: unknown }> | SelectChangeEvent | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  key: Extract<keyof T, string>
) => void;



export type FormDataGeneratorFunction =<T extends Object>(refObject : React.RefObject<T>) => FormData