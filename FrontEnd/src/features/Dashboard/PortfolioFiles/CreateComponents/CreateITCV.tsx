import { Button, Card, CardContent, Typography } from "@mui/material";
import React from "react";
import { UploadFile } from "@mui/icons-material";
import { handleInputChangeIntoARefObject } from "../../../../Helpers/FieldVerifier.ts";
import type { PortfolioFile } from "../../../../Types/PortfolioFileType.ts";
import { api } from "../../../../ApiService/ApiBrain.ts";
import { handleSuccess } from "../../../../Helpers/Sweetalert.ts";
import { handleComponentError } from "../../../../Helpers/ErrorHandler.ts";

type Props = {
  handlePostAPortfolioFile: (ref: React.RefObject<PortfolioFile>) => Promise<void>;
};

function CreateITCV({ handlePostAPortfolioFile }: Props) {
  const itcvRef = React.useRef<PortfolioFile>({
    fileName: "itCv",
    file: null,
  });

  const handleUpdate = async () => {
    try {
      await api.delete(`/api/files/delete/${itcvRef.current.fileName}`);
      await handlePostAPortfolioFile(itcvRef);
      handleSuccess("Success", "IT CV updated");
    } catch (error) {
      handleComponentError(error);
    }
  };

  return (
    <Card elevation={3}>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6">IT CV</Typography>

        <Button
          component="label"
          variant="outlined"
          startIcon={<UploadFile />}
        >
          Upload IT CV (PDF)
          <input
            hidden
            type="file"
            onChange={(e) =>
              handleInputChangeIntoARefObject(itcvRef, e, "file")
            }
          />
        </Button>

        <Button variant="contained" onClick={handleUpdate}>
          Submit IT CV
        </Button>
      </CardContent>
    </Card>
  );
}

export default CreateITCV;
