import {
  Box,
  Button,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MenuPopover from "../MenuPopover";
import { Budget } from "./types";
import { fetchAuth } from "src/frontend-utils/nextjs/utils";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSnackbar } from "notistack";

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

export default function BudgetExportButton({ budget }: { budget: Budget }) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState<HTMLElement | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [bbCode, setBbCode] = useState("");

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const toggleEntryExportModal = () => {
    setOpenModal(!openModal);
  };

  const exportToBBCode = () => {
    let url = `budgets/${budget.id}/export/?export_format=bbcode`;

    toggleEntryExportModal();
    handleClose();

    fetchAuth(null, url).then((response) => {
      setBbCode(response.content);
    });
  };

  const exportToXls = () => {
    const url = `budgets/${budget.id}/export/?export_format=xls`;

    fetchAuth(null, url).then(
      (response) => (window.location = response.content)
    );
    handleClose();
  };

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        sx={{
          textTransform: "none",
          padding: 1,
          ...(open && { bgcolor: "secondary.light" }),
        }}
        endIcon={<ArrowDropDownIcon />}
        onClick={handleOpen}
      >
        Exportar
      </Button>
      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          mt: 1.5,
          ml: 0.75,
          "& .MuiMenuItem-root": {
            typography: "body2",
            borderRadius: 0.75,
          },
        }}
      >
        <Stack spacing={0.75}>
          <MenuItem onClick={exportToBBCode}>Exportar a Capa9</MenuItem>
          <MenuItem onClick={exportToXls}>Exportar a Excel</MenuItem>
        </Stack>
      </MenuPopover>
      <Modal open={openModal} onClose={toggleEntryExportModal}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h3" component="h2">
            Código para foro de Capa9
          </Typography>
          {bbCode && (
            <>
              <Typography id="modal-modal-description">
                Copia y pega este código en el foro de Capa9 para compartir tu
                cotización
              </Typography>
              <br />
              <TextField
                multiline
                maxRows={6}
                value={bbCode}
                disabled
                fullWidth
              />
              <br />
              <br />
              <Stack direction="row-reverse" spacing={1}>
                <CopyToClipboard
                  text={bbCode}
                  onCopy={() => {
                    toggleEntryExportModal();
                    enqueueSnackbar("Código copiado al portapapeles", {
                      variant: "info",
                    });
                  }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<ContentCopyIcon />}
                  >
                    Copiar código
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
