export interface EmailInterface {
  subject: string,
  text: string,
  to: string,
  html?: string,
  attachments?: { path: string; fileName: string }[]
}

export type SendEmailFunction = (email :EmailInterface) =>Promise<string>

export type NullableOrUndefined <T> = T |null |undefined