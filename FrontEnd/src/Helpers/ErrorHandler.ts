import { AxiosError } from "axios";
import { handleError } from "./Sweetalert.ts"

export const handleComponentError: (error: unknown) => void = (error) => {
  if (error instanceof Error) {
    handleError("Error", error.message);
  } else if (error instanceof AxiosError) {
    handleError("Api Error", error.message);
  } else handleError("Unknown Error", error as string);
};
