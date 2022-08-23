import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { Container, Stack, styled, Typography } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
// hooks
import { FormProvider, RHFTextField } from "src/components/hook-form";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Page from "src/components/Page";
import { PATH_MAIN } from "src/routes/paths";
import { fetchJson } from "src/frontend-utils/network/utils";
import { useSnackbar } from "notistack";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 700,
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(5, 0),
  border: "1px solid #EFEFEF",
  borderRadius: 10,
}));

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  name: string;
  subject: string;
  message: string;
  afterSubmit?: string;
};

export default function DataDeletion() {
  const { enqueueSnackbar } = useSnackbar();

  const ContactSchema = Yup.object().shape({
    email: Yup.string()
      .email("Ingresa un Email válido")
      .required("Email requerido"),
    name: Yup.string().required("Nombre requerido"),
    subject: Yup.string().required("Asunto requerido"),
    message: Yup.string().required("Mensaje requerido"),
  });

  const defaultValues = {
    email: "",
    name: "",
    subject: "",
    message: "",
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ContactSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: FormValuesProps) => {
    fetchJson("users/send_contact_email/", {
      method: "POST",
      body: JSON.stringify(data),
    }).then((_) => {
      enqueueSnackbar("Su solicitud ha sido enviado", { persist: true });
    });
  };

  return (
    <Page title="Eliminación de cuenta / datos">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Home", href: PATH_MAIN.root },
            { name: "Eliminación de cuenta / datos" },
          ]}
        />
        <RootStyle>
          <Container>
            <ContentStyle>
              <Stack direction="column" sx={{ mb: 4, px: 4 }}>
                <Typography
                  variant="h3"
                  fontWeight={700}
                  color="#3C5D82"
                  gutterBottom
                >
                  Solicitud de eliminación de cuenta / datos
                </Typography>
                <Typography gutterBottom>
                  Si desea eliminar su cuenta y/o cualquier dato asociado a ella
                  o su correo electrónico por favor utilice el siguiente
                  formulario. Su solicitud será procesada en dos días hábiles o
                  menos.
                </Typography>
              </Stack>

              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3} paddingX={4}>
                  <RHFTextField name="name" label="Nombre" />
                  <RHFTextField name="email" label="Email" />
                  <RHFTextField name="subject" label="Asunto" />
                  <RHFTextField
                    name="message"
                    label="Mensaje"
                    multiline
                    rows={4}
                  />

                  <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="secondary"
                    loading={isSubmitting}
                    sx={{ my: 2, borderRadius: 3 }}
                  >
                    ENVIAR
                  </LoadingButton>
                </Stack>
              </FormProvider>
            </ContentStyle>
          </Container>
        </RootStyle>
      </Container>
    </Page>
  );
}
