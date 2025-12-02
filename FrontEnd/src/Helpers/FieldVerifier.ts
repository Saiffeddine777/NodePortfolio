import type { SelectChangeEvent } from "@mui/material";
import type { FormDataGeneratorFunction } from "../Types/Utilities.ts";
export const verifyEmptiness = <T extends Record<string, unknown>>(obj: T) => {
  Object.entries(obj).forEach(([key, value]) => {
    if (
      key !== "userImage" &&
      (value === "" || value === undefined || value === null)
    ) {
      throw new Error(`${key} can not be an empty value`);
    }
  });
  return obj;
};

export const generateData = <T extends Record<string, unknown>>(obj: T) => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]) => value !== null && value !== "" && value !== undefined
    )
  );
};

export function handleInputChangeIntoARefObject<
  T extends Record<string, any>,
  K extends keyof T
>(
  refObject: React.RefObject<T>,
 event:  Event |SelectChangeEvent | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  key: K
): void {
  if (!refObject.current) return;

  const target = event.target;

  // Handle file input
  if (target instanceof HTMLInputElement && target.type === "file") {
    const files = target.files;
    if (key === "file" && files?.length) {
      refObject.current[key] = files[0] as T[K];
    }
    return;
  }

  // Determine type dynamically
  let value: unknown = (target as HTMLInputElement | HTMLTextAreaElement).value ;
  const currentValue = refObject.current[key];

  if (typeof currentValue === "number") value = Number(value);
  if (typeof currentValue === "boolean") value = value === "true" || value === true;

  refObject.current[key] = value as T[K];
}

export const generateFromDataFromRefObject : FormDataGeneratorFunction =(refObject)=>{
    console.log (refObject)
    const formData = new FormData()
    Object.entries(refObject.current).forEach(([key, value])=>{
      formData.append(key, value)
    })
    return formData
}