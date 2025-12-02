import type { SelectChangeEvent } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { SvgIconTypeMap } from "@mui/material";
import type React from "react";

export type ListenerChangerFuntion = (
  e: React.ChangeEvent<HTMLInputElement>
) => void;

export type MuiIconType =OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string };

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

export type ObjectRefChangerFunction = <
  T extends Record<string, any>
>(
  store: React.RefObject<T>,
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent,
  key: keyof T // <--- keyof T allows autocomplete
) => void;

export type ArrayOfNavigationButtonProperties = {
  text: string;
  navFunction: () => void;
  icon?: MuiIconType;
}[];

export type ArrayOfMenuItems = {name :string , icon : MuiIconType}

export type FormDataGeneratorFunction =<T extends Object>(refObject : React.RefObject<T>) => FormData