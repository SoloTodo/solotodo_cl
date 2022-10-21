import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Budget } from "./types";
import { useState } from "react";
import { fetchAuth } from "src/frontend-utils/nextjs/utils";
import { modalStyle } from "src/styles/modal";

export default function BudgetEditName({
  budget,
  setBudget,
}: {
  budget: Budget;
  setBudget: Function;
}) {
  const [openModal, setOpenModal] = useState(false);
  const [budgetName, setBudgetName] = useState<string>(budget.name);

  const handleClose = () => {
    setOpenModal(false);
    setBudgetName(budget.name);
  };

  const handleSubmit = () => {
    if (budgetName !== "" && budgetName !== budget.name) {
      const formData = {
        name: budgetName,
      };

      fetchAuth(null, `budgets/${budget.id}/`, {
        method: "PATCH",
        body: JSON.stringify(formData),
      }).then(() => {
        handleClose();
        setBudget();
      });
    }
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography variant="h5">{budget.name}</Typography>
      <IconButton onClick={() => setOpenModal(true)}>
        <EditIcon />
      </IconButton>
      <Modal open={openModal} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Stack spacing={2}>
            <Typography id="modal-modal-title" variant="h3" component="h2">
              Cambiar nombre
            </Typography>
            <TextField
              label="Nombre"
              value={budgetName}
              fullWidth
              onChange={(e) => setBudgetName(e.target.value)}
            />
            <Stack direction="row-reverse" spacing={1}>
              <Button variant="contained" color="error" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
              >
                Agregar
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </Stack>
  );
}
