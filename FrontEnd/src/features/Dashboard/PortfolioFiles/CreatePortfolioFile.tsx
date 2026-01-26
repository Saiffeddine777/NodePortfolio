import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Input,
  InputLabel,
  Typography,
} from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { api } from "../../../ApiService/ApiBrain.ts";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import { useRef } from "react";
import type { PortfolioFile } from "../../../Types/PortfolioFileType.ts";
import {
  generateFromDataFromRefObject,
  handleInputChangeIntoARefObject,
} from "../../../Helpers/FieldVerifier.ts";
import { handleSuccess } from "../../../Helpers/Sweetalert.ts";
import CreateFullStoryCV from "./CreateComponents/CreateFullStoryCV.tsx";
import CreateITCV from "./CreateComponents/CreateITCV.tsx";

const CreatePortfolioFile = () => {
  const portfolioFileRef = useRef<PortfolioFile>({
    fileName: "",
    file: null,
  });

  const handlePostAPortfolioFile = async (ref: React.RefObject<PortfolioFile>) => {
    try {
      await api.post("/api/files/", generateFromDataFromRefObject(ref));
      handleSuccess("Success", "File inserted successfully");
    } catch (error) {
      handleComponentError(error);
    } finally {
      portfolioFileRef.current = { fileName: "", file: null };
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Typography variant="h5" fontWeight={600}>
        Create Portfolio File
      </Typography>

      <Card elevation={3}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <FormControl fullWidth>
            <InputLabel>File Name</InputLabel>
            <Input
              onChange={(e) =>
                handleInputChangeIntoARefObject(
                  portfolioFileRef,
                  e,
                  "fileName"
                )
              }
            />
          </FormControl>

          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadFile />}
          >
            Upload PDF
            <input
              hidden
              type="file"
              onChange={(e) =>
                handleInputChangeIntoARefObject(
                  portfolioFileRef,
                  e,
                  "file"
                )
              }
            />
          </Button>

          <Button
            variant="contained"
            onClick={() => handlePostAPortfolioFile(portfolioFileRef)}
          >
            Submit
          </Button>
        </CardContent>
      </Card>

      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3}>
        <CreateFullStoryCV handlePostAPortfolioFile={handlePostAPortfolioFile} />
        <CreateITCV handlePostAPortfolioFile={handlePostAPortfolioFile} />
      </Box>
    </Box>
  );
};

export default CreatePortfolioFile;
