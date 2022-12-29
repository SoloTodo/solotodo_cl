import { useState } from "react";
import { useRouter } from "next/router";
// @mui
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
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// components
import MenuPopover from "../../../components/MenuPopover";
import { IconButtonAnimate } from "../../../components/animate";
import { useAuth } from "src/frontend-utils/nextjs/JWTContext";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import userSlice, { useUser } from "src/frontend-utils/redux/user";
// // routes
import { PATH_AUTH, PATH_MAIN } from "../../../routes/paths";
import { fetchAuth } from "src/frontend-utils/nextjs/utils";
import useResponsive from "src/hooks/useResponsive";
import NextLink from "next/link";

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
  const isDesktop = useResponsive("up", "md");
  const user = useAppSelector(useUser);
  const router = useRouter();

  const [open, setOpen] = useState<HTMLElement | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [value, setValue] = useState("");

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
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
      {isDesktop ? (
        <Button
          onClick={handleOpen}
          color="secondary"
          sx={{
            ...(open && { bgcolor: "action.selected" }),
          }}
          startIcon={<AccountCircleIcon />}
        >
          <Typography color="text.primary">Perfil</Typography>
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </Button>
      ) : (
        <IconButtonAnimate
          onClick={handleOpen}
          color="secondary"
          sx={{
            width: 40,
            height: 40,
            ...(open && { bgcolor: "action.selected" }),
          }}
        >
          <AccountCircleIcon />
        </IconButtonAnimate>
      )}

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
              {user.first_name && user.last_name && (
                <Typography variant="subtitle2" noWrap>
                  {`${user.first_name} ${user.last_name}`}
                </Typography>
              )}
              <Typography
                variant={
                  user.first_name && user.last_name ? "body2" : "subtitle2"
                }
                sx={{
                  color:
                    user.first_name && user.last_name
                      ? "text.secondary"
                      : "text.primary",
                }}
                noWrap
              >
                {user.email}
              </Typography>
            </Box>
            <Divider sx={{ borderStyle: "dashed" }} />

            {user.budgets.length !== 0 && (
              <Stack sx={{ p: 1, maxHeight: 200, overflow: "scroll" }}>
                {user.budgets.map((b) => (
                  <NextLink
                    key={b.name}
                    href={`${PATH_MAIN.budgets}/${b.id}/edit`}
                    passHref
                  >
                    <MenuItem onClick={() => handleClose()}>
                      <Typography variant="inherit" noWrap>
                        {b.name}
                      </Typography>
                    </MenuItem>
                  </NextLink>
                ))}
              </Stack>
            )}
            <Stack sx={{ p: 1 }}>
              <MenuItem onClick={() => setOpenModal(true)}>
                <b>Nueva Cotización</b>
              </MenuItem>
            </Stack>

            <Divider sx={{ borderStyle: "dashed" }} />

            <Stack sx={{ p: 1 }}>
              {MENU_OPTIONS.map((option) => (
                <NextLink key={option.label} href={option.linkTo} passHref>
                  <MenuItem onClick={() => handleClose()}>
                    {option.label}
                  </MenuItem>
                </NextLink>
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
