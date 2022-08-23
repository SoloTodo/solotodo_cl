import { Box, Button, MenuItem } from "@mui/material";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import { Product } from "src/frontend-utils/types/product";
import MenuPopover from "../MenuPopover";
import { useState } from "react";
import { constants } from "src/config";
import { useSnackbar } from "notistack";
import { fetchAuth } from "src/frontend-utils/nextjs/utils";

export default function ProductStaffActionButton({
  product,
}: {
  product: Product;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState<HTMLElement | null>(null);
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const cloneProduct = () => {
    enqueueSnackbar("Clonando...", { variant: "info" });
    fetchAuth(null, `products/${product.id}/clone/`, { method: "POST" }).then(
      (res) => {
        const win: Window = window;
        win.location = `${constants.endpoint}metamodel/instances/${res.instance_id}`;
      }
    );
  };

  return (
    <>
      <Button
        variant="contained"
        color="info"
        sx={{ borderRadius: 4 }}
        onClick={handleOpen}
        startIcon={<DisplaySettingsIcon />}
      >
        Opciones Staff
      </Button>
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
          <MenuItem onClick={() => {}}>
            <a
              href={`${constants.endpoint}metamodel/instances/${product.instance_model_id}`}
              target="_blank"
              rel="noreferrer"
            >
              Editar producto
            </a>
          </MenuItem>
          <MenuItem onClick={cloneProduct}>Clonar</MenuItem>
          <MenuItem>
            <a
              href={`${constants.backendUrl}products/${product.id}`}
              target="_blank"
              rel="noreferrer"
            >
              Ver en backend
            </a>
          </MenuItem>
        </Box>
      </MenuPopover>
    </>
  );
}
