import { AxiosError } from "axios";
import { handleError } from "./Sweetalert.ts";

export const handleComponentError: (error: unknown) => void = (error) => {
  console.log(error);
  if (error instanceof AxiosError) {
    handleError("Api Error", error.status ===409? error.response?.data.duplicate : error.message);
    return;
  }
  if (error instanceof Error) {
    handleError("Error",error.message);
    return;
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    handleError("Error", (error as any).message);
    return;
  }
  
  handleError("Unknown Error", String(error));
};
