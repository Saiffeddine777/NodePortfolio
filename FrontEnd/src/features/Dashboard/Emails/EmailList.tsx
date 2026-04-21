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
  Paper,
  Typography,
  Pagination,
  Box,
} from "@mui/material";
import DeleteEmail from "./DeleteEmail.tsx";
import { useNavigate } from "react-router";
import { api } from "../../../ApiService/ApiBrain.ts";

const EmailList = () => {
  const navigate = useNavigate();
  const [emails, setEmails] = React.useState<EmailInterface[]>([]);
  const [trigg, setTrigg] = React.useState(false);
  const [total, setTotal] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);
  const limit: number = 6;

  const handleFetchEmails = async (): Promise<void> => {
    try {
      const result: AxiosResponse<{
        total: number;
        page: number;
        lastPage: number;
        data: EmailInterface[];
      }> = await api.get(`/api/emails/getpaginatedemails/${limit}/${page}`);
      setEmails(result.data.data);
      setTotal(result.data.total);
    } catch (error) {
      handleComponentError(error);
    }
  };

  const navigateToOneEmail = (id?: number) => {
    navigate("/dashboard/onemail", { state: { id } });
  };

  React.useEffect(() => {
    handleFetchEmails();
  }, [trigg, page]);

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Emails
      </Typography>

      {emails.length === 0 ? (
        <Typography color="text.secondary">No emails found.</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={120}>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell align="right" width={120}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {emails.map((email) => (
                <TableRow
                  key={email.id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <TableCell color="text.secondary">#{email.id}</TableCell>

                  <TableCell
                    onClick={() => navigateToOneEmail(email.id)}
                    sx={{
                      cursor: "pointer",
                      fontWeight: 500,
                      color: "primary.main",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {email.fromName}
                  </TableCell>

                  <TableCell>{email.subject}</TableCell>

                  <TableCell align="right">
                    <DeleteEmail id={email.id} setTrigg={setTrigg} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box sx={{ pb: 4 }}>
        {" "}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(total / limit)}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default EmailList;
