import { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { useAppSelector } from "src/store/hooks";
import { useUser } from "src/frontend-utils/redux/user";
import { useSnackbar } from "notistack";
import { fetchJson } from "src/frontend-utils/network/utils";
import { constants } from "src/config";
import { FormProvider, RHFTextField } from "../hook-form";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import useSettings from "src/hooks/useSettings";

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

type FormValuesProps = {
  email: string;
};

export default function ProductAlertButton({
  productId,
  available
}: {
  productId: number;
  available: boolean
}) {
  const { enqueueSnackbar } = useSnackbar();
  const { prefStores } = useSettings();
  const user = useAppSelector(useUser);
  const [open, setOpen] = useState(false);

  const FormSchema = Yup.object().shape({
    email: Yup.string().required("Por favor ingrese un correo de contacto"),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(FormSchema),
    defaultValues: { email: user ? user.email : "" },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data: FormValuesProps) => {
    fetchJson(constants.apiResourceEndpoints.alerts, {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        product: productId,
        stores: prefStores,
      }),
    })
      .then((_) => {
        enqueueSnackbar("¡Alerta creada exitosamente!");
        handleClose();
      })
      .catch((err) => {
        err
          .json()
          .then((errorJson: any) => {
            errorJson.non_field_errors &&
              enqueueSnackbar("¡El correo ya está suscrito a este producto!", {
                variant: "error",
              });
          })
          .catch(() => {
            enqueueSnackbar("Error al crear alerta", {
              variant: "error",
            });
          });
      });
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        sx={{ borderRadius: 4 }}
        startIcon={<EmailIcon />}
        onClick={() => setOpen(true)}
      >
        {available ? 'Avísame cuando baje de precio' : 'Avísame cuando este disponible'}
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={1}>
              <Typography id="modal-modal-title" variant="h3" component="h2">
                Alertas de cambios de precio
              </Typography>
              <Typography id="modal-modal-description">
                Ingresa tu correo y te notificaremos cuando este producto cambie
                de precio o disponibilidad.
              </Typography>
              <RHFTextField name="email" label="Email" fullWidth />
            </Stack>
            <br />
            <Stack direction="row-reverse" spacing={1}>
              <Button variant="outlined" color="error" onClick={handleClose}>
                Cerrar
              </Button>
              <LoadingButton
                type="submit"
                loading={isSubmitting}
                variant="contained"
                color="success"
              >
                Subscribirse
              </LoadingButton>
            </Stack>
          </FormProvider>
        </Box>
      </Modal>
    </>
  );
}
