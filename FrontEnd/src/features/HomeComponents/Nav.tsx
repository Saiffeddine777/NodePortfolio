import {
  ContactMail,
  Dashboard,
  ListAltOutlined,
  Login,
  AppRegistration,
  Logout
} from "@mui/icons-material";
import { Box, Button, Container, type SvgIconTypeMap } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import { useNavigate } from "react-router";
import type { UserAuthAPiType, UserRole } from "../../Types/User.ts";
import { useAppDispatch, useAppSelector } from "../../app/Hooks.ts";
import { api } from "../../ApiService/ApiBrain.ts";
import { handleSuccess } from "../../Helpers/Sweetalert.ts";
import { handleComponentError } from "../../Helpers/ErrorHandler.ts";
import { resetUser } from "../Auth/UserAuthReducer.ts";

type ArrayOfNavigationButtonProperties = (
  | {
      text: string;
      navFunction: () => void;
      icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
        muiName: string;
      };
    }
  | undefined
)[];

const Nav = () => {
  const navigate = useNavigate();
  const navigateTo = (path: string) => () => navigate(path);
  const dispatch = useAppDispatch();

  const user: UserAuthAPiType = useAppSelector((state) => state.userAuth);
  const role: UserRole | undefined = user.authUser
    ? user.authUser.role
    : undefined;

  const logout: () => void = () => {
    api
      .post(`api/users/logout`)
      .then((res) => handleSuccess("Logout Succes", res.data.message))
      .catch((err) => handleComponentError(err))
      .finally(() => {
        localStorage.removeItem("accessToken");
        dispatch(resetUser());
      });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const buttonTexts: ArrayOfNavigationButtonProperties = [
    role === "Admin"
      ? {
          text: "Dashboard",
          navFunction: navigateTo("/dashboard"),
          icon: Dashboard,
        }
      : undefined,
    { text: "CV", navFunction: navigateTo("/cv"), icon: ListAltOutlined },
    {
      text: "Contact Us",
      navFunction: navigateTo("/contactus"),
      icon: ContactMail,
    },
  ];

  const userAuthButtons: ArrayOfNavigationButtonProperties = [
    !user.authUser
      ? { text: "Sign-Up", navFunction: navigateTo("/signup"), icon: Login }
      : undefined,
    user.authUser
      ? { text: "Logout", navFunction: logout, icon: Logout }
      : {
          text: "Login",
          navFunction: navigateTo("/login"),
          icon: AppRegistration,
        },
  ];

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", py: 2, boxShadow: 1 }}>
      <Container
        maxWidth="lg"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          {buttonTexts.map((btn, i) => {
            const Icon = btn?.icon;
            return btn ? (
              <Button
                key={i}
                variant="text"
                onClick={btn?.navFunction}
                startIcon={Icon ? <Icon /> : undefined}
              >
                {btn?.text}
              </Button>
            ) : (
              <></>
            );
          })}
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          {userAuthButtons.map((btn, i) => {
            const Icon = btn?.icon;
            return btn ? (
              <Button
                key={i}
                variant="contained"
                onClick={btn?.navFunction}
                startIcon={Icon ? <Icon /> : undefined}
              >
                {btn?.text}
              </Button>
            ) : (
              <></>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default Nav;
