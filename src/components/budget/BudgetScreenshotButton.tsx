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
import { modalStyle } from "src/styles/modal";

export default function BudgetScreenshotButton({ budget }: { budget: Budget }) {
  const { enqueueSnackbar } = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const [exportedImageUrl, setExportedImageUrl] = useState("");

  const toggleExportedImageModal = () => {
    setOpenModal(!openModal);
  };

  const exportToImage = () => {
    const url = `budgets/${budget.id}/export/?export_format=img`;
    setExportedImageUrl("");
    toggleExportedImageModal();

    fetchAuth(null, url).then((response) => {
      setExportedImageUrl(response.content);
    });
  };

  return (
    <>
      <Button variant="outlined" color="info" onClick={exportToImage} fullWidth>
        Obtener pantallazo
      </Button>
      <Modal open={openModal} onClose={toggleExportedImageModal}>
        <Box
          sx={{
            ...modalStyle,
            width: { xs: 450, md: 700 },
          }}
        >
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
                    color="info"
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
