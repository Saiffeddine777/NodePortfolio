import {
  Box,
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Button,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import React from "react";
import type { User } from "../../../Types/User.tsx";
import type { RefChangerFunction } from "../../../Types/Utilities.ts";
import type { AxiosResponse } from "axios";
import { handleComponentError } from "../../../Helpers/ErrorHandler.ts";
import { handleSuccess } from "../../../Helpers/Sweetalert.ts";
import { generateData } from "../../../Helpers/FieldVerifier.ts";
import { useLocation, useNavigate, type Location } from "react-router";
import { api } from "../../../ApiService/ApiBrain.ts";

type Props = {};

const ModifyUser = ({}: Props) => {
  const location: Location<{ id?: number }> = useLocation();
  const id = location.state.id;
  const [selectedFileName, setSelectedFileName] = React.useState<string | null>(
    null,
  );
  const navigate = useNavigate();

  const signInRef = React.useRef<User>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    occupation: "",
    userName: "",
    file: null,
  });

  const [userToModify, setUserToModify] = React.useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    occupation: "",
    userName: "",
  });

  const [trigg, setTrigg] = React.useState<boolean>(false);

  const navigateToUsers = () => {
    navigate(
      location.pathname !== "/modifyyourprofile" ? "/dashboard/userlist" : "/",
    );
  };

  const handleChange: RefChangerFunction<User> = (event, key) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    if (target instanceof HTMLInputElement && target.type === "file") {
      const files = target.files;
      if (files && files[0] && key === "file") {
        signInRef.current[key] = files[0];
      }
    } else {
      signInRef.current[key] = event.target.value as never;
    }
  };

  const handleSubmitModification: () => Promise<void | string> = async () => {
    try {
      const {
        email,
        userName,
        lastName,
        phoneNumber,
        occupation,
        firstName,
        file,
      } = signInRef.current;

      const nonEmptUserObject = generateData({
        email,
        userName,
        lastName,
        phoneNumber,
        occupation,
        firstName,
        file,
      });

      let formData: FormData = new FormData();
      Object.entries(nonEmptUserObject).forEach(([key, value]) => {
        if (value instanceof Blob) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      });

      await api.put(
        `/api/users/${id}`,
        nonEmptUserObject.file ? formData : nonEmptUserObject,
        formData.has("file")
          ? { headers: { "Content-Type": "multipart/form-data" } }
          : undefined,
      );

      handleSuccess("User Update", "User updated successfully");
      setTrigg(!trigg);
    } catch (error) {
      handleComponentError(error);
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const fetchUserToModify: () => Promise<void> = async () => {
    try {
      const result: AxiosResponse<User> = await api.get(`/api/users/${id}`);
      setUserToModify(result.data);
    } catch (error) {
      handleComponentError(error);
    }
  };

  React.useEffect(() => {
    fetchUserToModify();
  }, [trigg]);

  return (
    <>
      <Button onClick={navigateToUsers} sx={{ mb: 2, textTransform: "none" }}>
        {location.pathname !== "/modifyyourprofile"
          ? "← Back to Users"
          : "Back Home"}
      </Button>

      <Paper
        elevation={2}
        sx={{
          maxWidth: 600,
          mx: "auto",
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Modify User
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Leave fields empty to keep the current values.
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <FormControl fullWidth>
            <InputLabel>Email address</InputLabel>
            <Input onChange={(e) => handleChange(e, "email")} />
            <FormHelperText>Current: {userToModify.email}</FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>First Name</InputLabel>
            <Input onChange={(e) => handleChange(e, "firstName")} />
            <FormHelperText>Current: {userToModify.firstName}</FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Last Name</InputLabel>
            <Input onChange={(e) => handleChange(e, "lastName")} />
            <FormHelperText>Current: {userToModify.lastName}</FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>User Name</InputLabel>
            <Input onChange={(e) => handleChange(e, "userName")} />
            <FormHelperText>Current: {userToModify.userName}</FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Phone Number</InputLabel>
            <Input onChange={(e) => handleChange(e, "phoneNumber")} />
            <FormHelperText>Current: {userToModify.phoneNumber}</FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Occupation</InputLabel>
            <Input onChange={(e) => handleChange(e, "occupation")} />
            <FormHelperText>Current: {userToModify.occupation}</FormHelperText>
          </FormControl>

          <Divider sx={{ my: 2 }} />

          <Box
            onClick={() =>
              document.getElementById("file-upload-input")?.click()
            }
            sx={{
              border: "2px dashed",
              borderColor: "primary.main",
              borderRadius: 2,
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              transition: "all 0.2s ease",
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "primary.main",
                "& .upload-icon": { transform: "translateY(-3px)" },
                "& .upload-text": { color: "white" },
                "& .upload-sub": { color: "rgba(255,255,255,0.8)" },
              },
            }}
          >
            <input
              id="file-upload-input"
              type="file"
              hidden
              onChange={(e) => {
                handleChange(e, "file");
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) setSelectedFileName(file.name);
              }}
            />
            <Typography
              className="upload-icon"
              fontSize="2rem"
              sx={{ transition: "transform 0.2s ease" }}
            >
              📷
            </Typography>
            <Typography
              className="upload-text"
              variant="body2"
              fontWeight="bold"
              color="primary.main"
              sx={{ transition: "color 0.2s ease" }}
            >
              {selectedFileName ?? "Click to upload a profile image"}
            </Typography>
            <Typography
              className="upload-sub"
              variant="caption"
              color="text.secondary"
              sx={{ transition: "color 0.2s ease" }}
            >
              PNG, JPG, WEBP accepted — replaces current image
            </Typography>
          </Box>

          <Button
            onClick={handleSubmitModification}
            type="button"
            variant="contained"
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
    </>
  );
};

export default ModifyUser;
