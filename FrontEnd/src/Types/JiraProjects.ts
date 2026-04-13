import type { Email } from "./EmailType.ts";
import type { User } from "./User.ts";

export type JiraProject= {
  id: string;
  key: string;
  name: string;
  self: string;
  avatarUrls: {
    "48x48": string;
    "24x24": string;
    "16x16": string;
    "32x32": string;
  };
  projectTypeKey: string;
  simplified: boolean;
  style: string;
  isPrivate: boolean;
  properties: Record<string, unknown>;
  entityId: string;
  uuid: string;
}   

export type JiraIssue = {
  userId : number |undefined;
  keyProject: string;
  summary: string;
  description: string;
  name: string;
};

export type Ticket ={
        id: string,
        jiraID: string,
        issueKey: string,
        issueUrl: string,
        summary: string,
        description: string,
        status: string,
        issueType: string,
        projectKey: string,
        priority: string ,
        assigneeName: String,
        createdAt: Date,
        updatedAt: Date,
        user: Partial<User>,
        emails:Email[]
    }