import JiraApi, { JsonResponse } from "jira-client";
import Jira from "../Config/Jira";
import { errorhandler } from "./ErrorHandlers";
import { JiraUpdateIssue } from "../Types/UtilityTypes";

export default class JiraHandler {
  jira!: JiraApi;

  constructor() {
    this.jira = Jira;
  }

  async createIssue(
    keyProject: string,
    summary: string,
    description: string,
    name: string,
  ): Promise<JiraApi.JsonResponse | undefined> {
    try {
      return await this.jira.addNewIssue({
        fields: {
          project: {
            key: keyProject,
          },
          summary: summary,
          description: {
            type: "doc",
            version: 1,
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: description,
                  },
                ],
              },
            ],
          },
          issuetype: {
            name: name,
          },
        },
      });
    } catch (error) {
      errorhandler(error);
      throw error;
    }
  }

  async listAvailableProjects(): Promise<JsonResponse[]> {
    try {
      return await this.jira.listProjects();
    } catch (error) {
      errorhandler(error);
      throw error;
    }
  }

  async serverInfo(): Promise<JsonResponse> {
    try {
      return await this.jira.getServerInfo();
    } catch (error) {
      errorhandler(error);
      throw error;
    }
  }

  async getUser(): Promise<JsonResponse> {
    try {
      return await this.jira.getCurrentUser();
    } catch (error) {
      errorhandler(error);
      throw error;
    }
  }

  async deleteIssue(jiraID: string): Promise<JsonResponse> {
    try {
      return await this.jira.deleteIssue(jiraID);
    } catch (error) {
      errorhandler(error);
      throw error;
    }
  }

  async updateIssue(
    jiraData: JiraUpdateIssue,
    jiraId: string,
  ): Promise<JsonResponse> {
    try {
      if (!jiraId?.trim()) throw new Error("Jira issue ID is required.");
      if (!jiraData?.fields || Object.keys(jiraData.fields).length === 0) {
        throw new Error("Update payload must contain at least one field.");
      }
      return await this.jira.updateIssue(jiraId, jiraData);
    } catch (error) {
      errorhandler(error);
      throw error;
    }
  }
  
  async getTransitions(jiraID :string):Promise<JsonResponse>{
    try {
      if (!jiraID.trim()) throw new Error("Jira ID is need for this method");
      return this.jira.listTransitions(jiraID); 
    } catch (error) {
      errorhandler(error);
      throw error;
    }
  }

  async transitionIssue(jiraID :string , transitionId :string):Promise<JsonResponse>{
     try {
      if (!jiraID.trim()) throw new Error("Jira ID is need for this method");
      if (!transitionId.trim()) throw new Error("Jira ID is need for this method");
      return this.jira.transitionIssue(jiraID,  {transition: { id: transitionId }})
     } catch (error) {
      errorhandler(error);
      throw error;
     }

  }
}



