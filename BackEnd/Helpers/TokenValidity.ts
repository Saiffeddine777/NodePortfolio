import { Token } from "../Entities/Token";
import { NullableOrUndefined } from "../Types/UtilityTypes";

export const testValidity: (tokenObject: NullableOrUndefined<Token>) => boolean = (tokenObject) => {
  const recordTime: Date = tokenObject?.createdAt as Date;
  const currentTime = new Date();
  const diffirenceOfTime = currentTime.getTime() - recordTime.getTime();
  const diffirenceOfTimeInMinutes = diffirenceOfTime / (1000 * 60);
  return (diffirenceOfTimeInMinutes <= 30)&&(!tokenObject?.isUsed);
};
