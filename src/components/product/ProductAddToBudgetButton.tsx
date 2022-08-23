import {
  Box,
  Button,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Product } from "src/frontend-utils/types/product";
import userSlice, { useUser } from "src/frontend-utils/redux/user";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { MouseEventHandler, useState } from "react";
import { fetchAuth } from "src/frontend-utils/nextjs/utils";
import { useAuth } from "src/frontend-utils/nextjs/JWTContext";
import { useRouter } from "next/router";
import { Budget } from "../budget/types";
import { PATH_AUTH } from "src/routes/paths";
import { useSnackbar } from "notistack";
import MenuPopover from "../MenuPopover";

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

export default function ProductAddToBudgetButton({
  product,
}: {
  product: Product;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { authFetch } = useAuth();
  const dispatch = useAppDispatch();
  const user = useAppSelector(useUser);
  const router = useRouter();
  const [open, setOpen] = useState<HTMLElement | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [value, setValue] = useState("");

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const addToBudget = (budget: Budget) => {
    return fetchAuth(null, `budgets/${budget.id}/add_product/`, {
      method: "POST",
      body: JSON.stringify({ product: product.id }),
    });
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setValue("");
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
        addToBudget(newBudget).then(() =>
          router.push(`/budgets/${newBudget.id}/edit`)
        );
      });
    }
  };

  const handleAnonymousCreateBudgetClick = () => {
    enqueueSnackbar(
      "Regístrate y podrás crear cotizaciones de PCs y chequear su compatibilidad",
      {
        variant: "info",
        persist: true,
      }
    );
    router.push(PATH_AUTH.register);
  };

  const addToBudgetWithNotification = (budget: Budget) => {
    addToBudget(budget).then(() => {
      enqueueSnackbar(`${product.name} agregado a ${budget.name}`, {
        variant: "info",
      });
      setOpen(null);
    });
  };

  const button = (
    child: string,
    onClick: MouseEventHandler<HTMLButtonElement> | undefined
  ) => (
    <Button
      variant="contained"
      color="info"
      sx={{ borderRadius: 4 }}
      onClick={onClick}
      startIcon={<AssignmentIcon />}
    >
      {child}
    </Button>
  );

  if (!user) {
    return button("Crear nueva cotización", handleAnonymousCreateBudgetClick);
  } else {
    if (user.budgets.length) {
      return (
        <>
          {button("Agregar a cotización", handleOpen)}
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
            <Box sx={{ my: 1.5, px: 2.5 }}>
              {user.budgets.map((b) => (
                <MenuItem
                  key={b.id}
                  onClick={() => addToBudgetWithNotification(b as Budget)}
                >
                  {b.name}
                </MenuItem>
              ))}
            </Box>
          </MenuPopover>
        </>
      );
    } else {
      return (
        <>
          {button("Crear nueva cotización", () => setOpenModal(true))}
          <Modal open={openModal} onClose={handleModalClose}>
            <Box sx={style}>
              <Stack spacing={1}>
                <Typography id="modal-modal-title" variant="h3" component="h2">
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
                <Button variant="contained" color="success" onClick={onSubmit}>
                  Crear
                </Button>
              </Stack>
            </Box>
          </Modal>
        </>
      );
    }
  }
}
