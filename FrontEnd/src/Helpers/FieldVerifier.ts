import type { FormDataGeneratorFunction, ObjectRefChangerFunction } from "../Types/Utilities";

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

export const handleInputChangeIntoARefObject: ObjectRefChangerFunction = (
  refObject,
  event,
  key
) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;

  if (target instanceof HTMLInputElement && target.type === "file") {
    const files = target.files;
    if (key === "file" && files?.length) {
      refObject.current![key] = files[0] as any;
    }
  } else {
    refObject.current![key] =isNaN(parseInt(target.value))? target.value as any: parseInt(target.value) 
  }

};



export const generateFromDataFromRefObject : FormDataGeneratorFunction =(refObject)=>{
    const formData = new FormData()
    Object.entries(refObject.current).forEach(([key, value])=>{
      formData.append(key, value)
    })

    return formData
}