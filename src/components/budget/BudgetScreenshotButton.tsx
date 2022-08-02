import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Budget } from "./types";
import { useSnackbar } from "notistack";
import { fetchAuth } from "src/frontend-utils/nextjs/utils";
import Image from "../Image";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BudgetScreenshotButton({ budget }: { budget: Budget }) {
  const { enqueueSnackbar } = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const [exportedImageUrl, setExportedImageUrl] = useState("");

  const toggleExportedImageModal = () => {
    setOpenModal(!openModal);
  };

  const exportToImage = () => {
    const url = `budgets/${budget.id}/export/?export_format=img`;

    toggleExportedImageModal();

    fetchAuth(null, url).then((response) => {
      setExportedImageUrl(response.content);
    });
  };

  return (
    <>
      <Button variant="outlined" color="secondary" onClick={exportToImage}>
        Obtener pantallazo
      </Button>
      <Modal open={openModal} onClose={toggleExportedImageModal}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h3" component="h2">
            {exportedImageUrl ? "Pantallazo" : "Obteniendo pantallazo..."}
          </Typography>
          {exportedImageUrl && (
            <>
              <Image src={exportedImageUrl} alt={budget.name} />
              <br />
              <TextField
                multiline
                maxRows={6}
                value={exportedImageUrl}
                disabled
                fullWidth
              />
              <br />
              <br />
              <Stack direction="row-reverse" spacing={1}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={toggleExportedImageModal}
                >
                  Cerrar
                </Button>
                <CopyToClipboard
                  text={exportedImageUrl}
                  onCopy={() => {
                    toggleExportedImageModal();
                    enqueueSnackbar("URL de imagen copiada al portapapeles", {
                      variant: "info",
                    });
                  }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<ContentCopyIcon />}
                  >
                    Copiar URL de imagen
                  </Button>
                </CopyToClipboard>
              </Stack>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}
