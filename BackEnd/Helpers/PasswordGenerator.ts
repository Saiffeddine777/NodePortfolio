export const passwordGenerator: () => string = () => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let returnedString: string = "";
  const min: number = 0;
  const max: number = chars.length - 1;
  for (let i = 0; i < 10; i++) {
    returnedString += chars[Math.floor(Math.random() * (max - min + 1)) + min];
  }
  return returnedString;
};
