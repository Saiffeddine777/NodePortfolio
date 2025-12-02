import React from "react";
import type { EmailInterface } from "../../../Types/EmailType.ts";
import type { AxiosResponse } from "axios";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DeleteEmail from "./DeleteEmail.tsx";
import { useNavigate } from "react-router";
import { api } from "../../../ApiService/ApiBrain.ts";

type Props = {};
function EmailList({}: Props) {
  const navigate = useNavigate()
  const [emails, setEmails] = React.useState<EmailInterface[]>([]);
  const [trigg,setTrigg] = React.useState<boolean>(false)
  const handleFetchEmails: () => Promise<void> = async () => {
    try {
      const result: AxiosResponse<EmailInterface[]> = await api.get(
        `/api/emails`
      );
      setEmails(result.data);
    } catch (error) {
      handleComponentError(error);
    }
  };

  const navigateToOneEmail :(id?:number ) =>void = function(id){
    navigate ("/dashboard/onemail" ,{state :{id:id}})
  }
  React.useEffect(() => {
    handleFetchEmails();
  }, [trigg]);
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Database- ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {emails.map((email, index) => {
            return (
              <TableRow key={index}>
                <TableCell>{email.id}</TableCell>
                <TableCell
                 onClick={()=>navigateToOneEmail(email.id)}
                >{email.fromName}</TableCell>
                <TableCell>{email.subject}</TableCell>
                <TableCell>
                  <DeleteEmail id={email.id} setTrigg={setTrigg}/>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EmailList;
