import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import React, { type RefObject } from "react";
import { UploadFile } from "@mui/icons-material";
import { handleInputChangeIntoARefObject } from "../../../../Helpers/FieldVerifier.ts";
import type { PortfolioFile } from "../../../../Types/PortfolioFileType.ts";
import { api } from "../../../../ApiService/ApiBrain.ts";
import { handleSuccess } from "../../../../Helpers/Sweetalert.ts";
import { handleComponentError } from "../../../../Helpers/ErrorHandler.ts";

type Props = {
  handlePostAPortfolioFile: (ref: RefObject<PortfolioFile>) => Promise<void>;
};

function CreateFullStoryCV({ handlePostAPortfolioFile }: Props) {
  const fullStoryCV = React.useRef<PortfolioFile>({
    fileName: "fullStoryCV",
    file: null,
  });

  const handleUpdatetingtheFile = async () => {
    try {
      await api.delete(`/api/files/delete/${fullStoryCV.current.fileName}`);
      await handlePostAPortfolioFile(fullStoryCV);
      handleSuccess("Success", "Full Story CV updated");
    } catch (error) {
      handleComponentError(error);
    }
  };

  return (
    <Card elevation={3}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Full Story CV
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Upload your complete career story (PDF only)
        </Typography>

        <Button
          component="label"
          variant="outlined"
          startIcon={<UploadFile />}
        >
          Upload Full CV (PDF)
          <input
            hidden
            type="file"
            onChange={(e) =>
              handleInputChangeIntoARefObject(fullStoryCV, e, "file")
            }
          />
        </Button>

        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={handleUpdatetingtheFile}
          >
            Submit Full CV
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default CreateFullStoryCV;
