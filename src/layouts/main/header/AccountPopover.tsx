import { useState } from "react";
import { useRouter } from "next/router";
// @mui
import { alpha } from "@mui/material/styles";
import {
  Box,
  Divider,
  Typography,
  Stack,
  MenuItem,
  Modal,
  Button,
  TextField,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// components
import MenuPopover from "../../../components/MenuPopover";
import { IconButtonAnimate } from "../../../components/animate";
import { useAuth } from "src/frontend-utils/nextjs/JWTContext";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import userSlice, { useUser } from "src/frontend-utils/redux/user";
// // routes
import { PATH_AUTH, PATH_MAIN } from "../../../routes/paths";
import { fetchAuth } from "src/frontend-utils/nextjs/utils";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: "Cambiar contraseña",
    linkTo: PATH_AUTH.change_password,
  },
];

// ----------------------------------------------------------------------

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function AccountPopover() {
  const { authFetch, logout } = useAuth();
  const dispatch = useAppDispatch();
  const user = useAppSelector(useUser);
  const router = useRouter();

  const [open, setOpen] = useState<HTMLElement | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [value, setValue] = useState("");

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = (linkTo: string) => {
    router.push(linkTo);
    setOpen(null);
  };

  const handleModalClose = () => {
    setOpen(null);
    setOpenModal(false);
    setValue("");
  };

  const onLogout = () => {
    logout(false);
    setOpen(null);
    router.push("/");
  };

  const onSubmit = () => {
    if (value !== "") {
      fetchAuth(null, "budgets/", {
        method: "POST",
        body: JSON.stringify({ name: value }),
      }).then((newBudget) => {
        authFetch("users/me/", {}).then((newUser) => {
          dispatch(userSlice.actions.setUser(newUser));
        });
        handleModalClose();
        router.push(`/budgets/${newBudget.id}/edit`);
      });
    }
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme: { palette: { grey: string[] } }) =>
                alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <AccountCircleIcon />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={() => setOpen(null)}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          "& .MuiMenuItem-root": {
            typography: "body2",
            borderRadius: 0.75,
          },
        }}
      >
        {user && user.email !== undefined ? (
          <>
            <Box sx={{ my: 1.5, px: 2.5 }}>
              <Typography variant="subtitle2" noWrap>
                {`${user.first_name} ${user.last_name}`}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
                noWrap
              >
                {user.email}
              </Typography>
            </Box>
            <Divider sx={{ borderStyle: "dashed" }} />

            <Stack sx={{ p: 1 }}>
              {user.budgets.map((b) => (
                <MenuItem
                  key={b.name}
                  onClick={() =>
                    handleClose(`${PATH_MAIN.budgets}/${b.id}/edit`)
                  }
                >
                  {b.name}
                </MenuItem>
              ))}
              <MenuItem
                key={"newCotizacion"}
                onClick={() => setOpenModal(true)}
              >
                <b>Nueva Cotización</b>
              </MenuItem>
            </Stack>

            <Divider sx={{ borderStyle: "dashed" }} />

            <Stack sx={{ p: 1 }}>
              {MENU_OPTIONS.map((option) => (
                <MenuItem
                  key={option.label}
                  onClick={() => handleClose(option.linkTo)}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Stack>

            <Divider sx={{ borderStyle: "dashed" }} />

            <MenuItem sx={{ m: 1 }} onClick={onLogout}>
              Cerrar Sesión
            </MenuItem>

            <Modal open={openModal} onClose={handleModalClose}>
              <Box sx={style}>
                <Stack spacing={1}>
                  <Typography
                    id="modal-modal-title"
                    variant="h3"
                    component="h2"
                  >
                    Crear nueva cotización
                  </Typography>
                  <TextField
                    name="name"
                    label="Nombre"
                    fullWidth
                    onChange={(e) => setValue(e.target.value)}
                  />
                </Stack>
                <br />
                <Stack direction="row-reverse" spacing={1}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleModalClose}
                  >
                    Cerrar
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={onSubmit}
                  >
                    Crear
                  </Button>
                </Stack>
              </Box>
            </Modal>
          </>
        ) : (
          <>
            <MenuItem
              sx={{ m: 1 }}
              onClick={() => {
                setOpen(null);
                router.push(
                  `/login?next=${encodeURIComponent(router.asPath || "")}`
                );
              }}
            >
              Iniciar Sesión
            </MenuItem>
            <MenuItem
              sx={{ m: 1 }}
              onClick={() => {
                setOpen(null);
                router.push(
                  `/register?next=${encodeURIComponent(router.asPath || "")}`
                );
              }}
            >
              Registrarse
            </MenuItem>
          </>
        )}
      </MenuPopover>
    </>
  );
}
