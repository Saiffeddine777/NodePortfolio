export interface EmailInterface {
  subject: string,
  text: string,
  to: string,
  html?: string,
  attachments?: { path: string; fileName: string }[]
}

export type SendEmailFunction = (email :EmailInterface) =>Promise<string>

export type NullableOrUndefined <T> = T |null |undefined

export interface PostGresError {
  code: string;
  detail?: string;
  constraint?: string; 
}



export interface JiraIssueFields{
  summary?: string;
  description?: string;
  priority?: { name: string };
  assignee?: { accountId: string };
  status?: { name: string };
  [key: string]: unknown; 
}
export interface JiraUpdateIssue {
  fields: JiraIssueFields
}