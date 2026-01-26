import { FileOpen } from "@mui/icons-material";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate, type NavigateFunction } from "react-router";
import type { PortfolioFile } from "../../../Types/PortfolioFileType.ts";
import { api } from "../../../ApiService/ApiBrain.ts";
import type { AxiosResponse } from "axios";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import DeletePortfolioFile from "./DeletePortfolioFile.tsx";

type Props = {};

const PortfolioFileList = ({}: Props) => {
  const navigate: NavigateFunction = useNavigate();
  const [portfolioFiles, setPortfolioFiles] = React.useState<PortfolioFile[]>([]);
  const [trigger, setTrigger] = React.useState<boolean>(false);

  const tableHeadTitles: string[] = [
    "ID",
    "File Name",
    "Cloudinary ID",
    "Actions",
  ];

  const handleFetchFiles: () => Promise<void> = async () => {
    try {
      const result: AxiosResponse<PortfolioFile[]> = await api.get("/api/files");
      setPortfolioFiles(result.data);
    } catch (error) {
      handleComponentError(error);
    }
  };

  const getPureID: (str: string) => string | undefined = (str) => {
    return str.split("/")[1];
  };

  const navigateToCreateOnePortfolio: () => void = () => {
    navigate("/dashboard/createportfoliofile");
  };

  React.useEffect(() => {
    handleFetchFiles();
  }, [trigger]);

  return (
    <Box>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Portfolio Files
        </Typography>

        <Button
          startIcon={<FileOpen />}
          variant="contained"
          onClick={navigateToCreateOnePortfolio}
          sx={{ textTransform: "none", fontWeight: "bold" }}
        >
          Create File
        </Button>
      </Box>

      {/* TABLE */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              {tableHeadTitles.map((title, index) => (
                <TableCell
                  key={index}
                  sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                >
                  {title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {portfolioFiles.map((file, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <TableCell>{file.id}</TableCell>
                <TableCell>{file.fileName}</TableCell>
                <TableCell>
                  {getPureID(file.publicId as string)}
                </TableCell>
                <TableCell>
                  <DeletePortfolioFile
                    setTrigger={setTrigger}
                    id={file.id}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PortfolioFileList;
