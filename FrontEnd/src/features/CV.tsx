import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import React from "react";
import type { PortfolioFile } from "../Types/PortfolioFileType.ts";
import { handleComponentError } from "../Helpers/ErrorHandler.ts";
import { api } from "../ApiService/ApiBrain.ts";
import type { AxiosResponse } from "axios";
import BackToHome from "./HomeComponents/BackToHome.tsx";

const CV = () => {
  const [cvs, setCvs] = React.useState<PortfolioFile[]>([]);

  const handleFetchCvs = async (): Promise<void> => {
    try {
      const result: AxiosResponse<PortfolioFile[]> = await api.get(
        "/api/files/cvs/fullStoryCV/itCv",
      );
      setCvs(result.data);
    } catch (error) {
      handleComponentError(error);
    }
  };

  React.useEffect(() => {
    handleFetchCvs();
  }, []);

  return (
    <Box>
      <BackToHome/>
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          mt: 6,
          px: 2,
        }}
      >
        <Typography variant="h4" fontWeight={600} mb={4}>
          Curriculum Vitae
        </Typography>

        <Stack spacing={3}>
          {cvs.map((file) => (
            <Card
              key={file.id}
              elevation={3}
              sx={{
                borderRadius: 3,
                transition: "0.3s",
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={500}>
                  {file.fileName === "fullStoryCV"
                    ? "Full Story CV"
                    : file.fileName === "itCv"
                      ? "IT CV"
                      : file.fileName}
                </Typography>

                <Typography variant="body2" color="text.secondary" mt={1}>
                  Last updated:{" "}
                  {file.updatedAt
                    ? new Date(file.updatedAt).toLocaleDateString()
                    : "—"}
                </Typography>
              </CardContent>

              <CardActions sx={{ px: 2, pb: 2 }}>
                {file.publicUrl && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => window.open(file.publicUrl, "_blank")}
                  >
                    View CV
                  </Button>
                )}
              </CardActions>
            </Card>
          ))}
        </Stack>
    </Box>
    </Box>
  );
};

export default CV;
