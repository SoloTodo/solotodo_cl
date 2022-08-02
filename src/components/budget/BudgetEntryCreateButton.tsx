import {
  Box,
  Button,
  MenuItem,
  Modal,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { fetchAuth } from "src/frontend-utils/nextjs/utils";
import { Category } from "src/frontend-utils/types/store";
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

export default function BudgetEntryCreateButton({
  budget,
  budgetCategories,
  setBudget,
}: {
  budget: Budget;
  budgetCategories: Category[];
  setBudget: Function;
}) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleClose = () => {
    setOpenModal(false);
    setSelectedCategory("");
  };

  const handleSubmit = () => {
    if (selectedCategory !== "") {
      const formData = {
        budget: budget.url,
        category: selectedCategory,
      };

      fetchAuth(null, "budget_entries/", {
        method: "POST",
        body: JSON.stringify(formData),
      }).then(() => {
        handleClose();
        setBudget();
      });
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => setOpenModal(true)}
      >
        Agreagr componente
      </Button>
      <Modal open={openModal} onClose={handleClose}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h3" component="h2">
            Agregar componente
          </Typography>
          <Select
            value={selectedCategory}
            label=""
            fullWidth
            sx={{ margin: 1 }}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {budgetCategories.map((c) => (
              <MenuItem key={c.id} value={c.url}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
          <br />
          <br />
          <Stack direction="row-reverse" spacing={1}>
            <Button variant="contained" color="error" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="contained" color="success" onClick={handleSubmit}>
              Agregar
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
