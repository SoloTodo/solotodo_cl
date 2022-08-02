import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Box, Button, MenuItem, Modal, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { fetchAuth } from "src/frontend-utils/nextjs/utils";
import { InLineProduct } from "src/frontend-utils/types/entity";
import { Category } from "src/frontend-utils/types/store";
import MenuPopover from "../MenuPopover";
import { PricingEntriesProps } from "../product/types";
import { Entry } from "./types";

type BudgetEntryDeleteProps = {
  matchingPricingEntry: PricingEntriesProps;
  budgetEntry: Entry;
  category: Category;
  setBudget: Function;
};

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

export default function BudgetEntryDeleteButton(props: BudgetEntryDeleteProps) {
  const { budgetEntry, category, matchingPricingEntry, setBudget } = props;
  const [open, setOpen] = useState<HTMLElement | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const removeSelectedProduct = (product: InLineProduct) => {
    fetchAuth(null, `${budgetEntry.budget}remove_product/`, {
      method: "POST",
      body: JSON.stringify({ product: product.id }),
    }).then(() => setBudget());
  };

  const toggleEntryDeleteModal = () => {
    setOpenModal(!openModal);
  };

  const removeComponent = () => {
    fetchAuth(null, `budget_entries/${budgetEntry.id}/`, {
      method: "DELETE",
    }).then(() => setBudget());
  };

  return (
    <>
      <Button
        variant="contained"
        color="error"
        size="small"
        fullWidth
        sx={{
          textTransform: "none",
          padding: 1,
          ...(open && { bgcolor: "error.dark" }),
        }}
        endIcon={<ArrowDropDownIcon />}
        onClick={handleOpen}
      >
        Eliminar
      </Button>
      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          mt: 1.5,
          ml: 0.75,
          "& .MuiMenuItem-root": {
            px: 1,
            typography: "body2",
            borderRadius: 0.75,
          },
        }}
      >
        <Stack spacing={0.75}>
          {matchingPricingEntry && (
            <MenuItem
              onClick={() =>
                removeSelectedProduct(matchingPricingEntry.product)
              }
            >
              Quitar producto seleccionado
            </MenuItem>
          )}
          <MenuItem onClick={toggleEntryDeleteModal}>
            Quitar componente
          </MenuItem>
        </Stack>
      </MenuPopover>
      <Modal open={openModal} onClose={toggleEntryDeleteModal}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h3" component="h2">
            Quitar componente
          </Typography>
          <Typography id="modal-modal-description">
            {`Esta acción removerá el componente "${category.name}" de tu cotización. ¿Estás seguro que deseas continuar?`}
          </Typography>
          <br />
          <Stack direction="row-reverse" spacing={1}>
            <Button variant="contained" color="error" onClick={removeComponent}>
              Quitar
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
