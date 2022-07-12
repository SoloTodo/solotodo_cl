import { useState } from "react";
import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "98%", md: "80%" },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ProductPriceHistory() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        sx={{ borderRadius: 4 }}
        startIcon={<ShowChartIcon />}
        onClick={() => setOpen(true)}
      >
        Precio histórico
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Stack
            spacing={1}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h2" component="h2">
              Precio histórico
            </Typography>
            <Typography id="modal-modal-description">Desde - Hasta</Typography>
            <Button variant="contained">Ver detalle</Button>
          </Stack>
          gráfico
        </Box>
      </Modal>
    </>
  );
}
