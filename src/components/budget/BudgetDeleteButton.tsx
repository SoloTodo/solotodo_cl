import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useAuth } from "src/frontend-utils/nextjs/JWTContext";
import { fetchAuth } from "src/frontend-utils/nextjs/utils";
import userSlice from "src/frontend-utils/redux/user";
import { useAppDispatch } from "src/store/hooks";
import { modalStyle } from "src/styles/modal";
import { Budget } from "./types";

export default function BudgetDeleteButton({ budget }: { budget: Budget }) {
  const { authFetch } = useAuth();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleSubmit = () => {
    fetchAuth(null, `budgets/${budget.id}/`, {
      method: "DELETE",
    }).then(() => {
      authFetch("users/me/", {}).then((newUser) => {
        dispatch(userSlice.actions.setUser(newUser));
      });
      router.push("/").then(() =>
        enqueueSnackbar("Cotización eliminada", {
          variant: "info",
        })
      );
    });
  };

  return (
    <>
      <Button
        variant="contained"
        color="error"
        onClick={() => setOpenModal(true)}
        fullWidth
      >
        Eliminar
      </Button>
      <Modal open={openModal} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h3" component="h2">
            Eliminar cotización
          </Typography>
          <Typography id="modal-modal-description">
            Esto eliminará tu cotización. ¿Estás seguro que deseas continuar?
          </Typography>
          <br />
          <Stack direction="row-reverse" spacing={1}>
            <Button variant="contained" color="info" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="contained" color="error" onClick={handleSubmit}>
              Eliminar
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
