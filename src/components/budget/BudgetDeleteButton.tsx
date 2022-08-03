import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useAuth } from "src/frontend-utils/nextjs/JWTContext";
import { fetchAuth } from "src/frontend-utils/nextjs/utils";
import userSlice from "src/frontend-utils/redux/user";
import { useAppDispatch } from "src/store/hooks";
import { Budget } from "./types";

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
      >
        Eliminar
      </Button>
      <Modal open={openModal} onClose={handleClose}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h3" component="h2">
            Eliminar cotización
          </Typography>
          <Typography id="modal-modal-description">
            Esto eliminará tu cotización. ¿Estás seguro que deseas continuar?
          </Typography>
          <br />
          <Stack direction="row-reverse" spacing={1}>
            <Button variant="contained" color="secondary" onClick={handleClose}>
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
