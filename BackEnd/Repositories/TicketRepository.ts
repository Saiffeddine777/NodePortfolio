import { DataSource } from "../EnvDataSource";
import {Ticket} from "../Entities/Ticket";

export const TicketRepository =  DataSource.getRepository(Ticket);