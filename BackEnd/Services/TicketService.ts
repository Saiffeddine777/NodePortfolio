import { JsonResponse } from "jira-client";
import { Ticket } from "../Entities/Ticket";
import { errorhandler } from "../Handlers/ErrorHandlers";
import JiraHandler from "../Handlers/JiraHandler";
import { TicketRepository } from "../Repositories/TicketRepository";
import { AppRepository, JiraIssueFields, NullableOrUndefined } from "../Types/UtilityTypes";
import { DeleteResult, UpdateResult } from "typeorm";
import { handlePagination } from "../Handlers/PaginationHandler";

const jiraHandler: JiraHandler = new JiraHandler();

export const createJiraTicketAndStoreReference: (
  keyProject: string,
  summary: string,
  description: string,
  name: string,
  userId: number,
) => Promise<Ticket | void> = async (
  keyProject,
  summary,
  description,
  name,
  userId,
) => {
  try {
    const jiraTicket = (await jiraHandler.createIssue(
      keyProject,
      summary,
      description,
      name,
    )) as JsonResponse;

    if (!jiraTicket) {
      throw new Error("Jira ticket creation returned no data");
    }

    const ticket = TicketRepository.create({
      jiraID: jiraTicket.id,
      issueKey: jiraTicket.key,
      issueUrl: jiraTicket.self,
      summary,
      description,
      projectKey: keyProject,
      issueType: name,
      status: "To Do",
      user: { id: userId },
    } as Partial<Ticket>);
    return await TicketRepository.save(ticket);
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};

export const loadProjects: () => Promise<JsonResponse[]> = async () => {
  try {
    return await jiraHandler.listAvailableProjects();
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};

export const loadTickets: () => Promise<Ticket[]> = async () => {
  try {
    return await TicketRepository.find({
      select: {
        user: {
          id: true,
          firstName: true,
          lastName: true,
          imageUrl: true,
          email: true,
        },
      },
      relations: { user: true },
    });
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};

export const removeOneIssue: (id: string) => Promise<DeleteResult> = async (id) => {
  try {
    const ticket = await TicketRepository.findOneBy({ id });
    if (!ticket) throw new Error(`Ticket with id "${id}" not found in database.`);
    if (!ticket.jiraID) throw new Error(`Ticket "${id}" has no Jira id.`);
    await jiraHandler.deleteIssue(ticket.jiraID);
    return await TicketRepository.delete({ id });
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};

export const findOneTicket: (
  id: string,
) => Promise<NullableOrUndefined<Ticket>> = async (id) => {
  try {
    return await TicketRepository.findOne({
      select: {
        user: {
          id: true,
          firstName: true,
          lastName: true,
          imageUrl: true,
          email: true,
        },
      
      },
      where: { id },
      relations: { user: true , emails : true},
    });
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};


export const updateSolvingOneTicket: (
  id: string, data:Partial<Ticket>
) => Promise<UpdateResult | void> = async (id, data) => {
  try {
    const {jiraID,status} = data;
    const reformedData = {jiraID,status}
    const {transitions} = await jiraHandler.getTransitions(jiraID as string) as {transitions :Array<{id:string, name :string}>};
    const doneTransitionId = transitions.find((element)=>element.name==="Done")?.id as string;
    if (!doneTransitionId) throw new Error(`"Done" transition not found for issue ${jiraID}`);
    await jiraHandler.transitionIssue(jiraID as string, doneTransitionId);
    return  await TicketRepository.update(id, reformedData);
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};

export const findTicketsWithPagination : (limit :number , page:number)=>Promise<any> = async(limit , page)=>{
  try {
    return await handlePagination(limit , page , TicketRepository as AppRepository)
  } catch (error) {
    errorhandler(error);
    throw error ;
  }
}