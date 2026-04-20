import { Repository } from "typeorm";
import { Email } from "../Entities/Email";
import { PortfolioFile } from "../Entities/PortfolioFile";
import Project from "../Entities/Project";
import { Technology } from "../Entities/Technology";
import { Ticket } from "../Entities/Ticket";
import { User } from "../Entities/User";


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


export type AppRepository = Repository<
  Ticket | Email | User | Project | Technology | PortfolioFile
>;

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