import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { Box, Container, Stack, styled, Typography } from "@mui/material";
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

export default function Contacto() {
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
      enqueueSnackbar("Su mensaje ha sido enviado", { persist: true });
    });
  };

  return (
    <Page title="Contacto">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[{ name: "Home", href: PATH_MAIN.root }, { name: "Contacto" }]}
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
                  Contacto
                </Typography>
                <Typography gutterBottom>
                  Antes de contactarnos por favor considere:
                </Typography>
                <Box paddingBottom={1} paddingLeft={6}>
                  <ol>
                    <li>
                      SoloTodo no es una tienda, es un comparador de precios,
                      así que <strong> no vendemos productos.</strong>
                    </li>
                    <li>
                      Las tiendas que catalogamos solo operan en su respectivo
                      país y <strong>no hacen envíos al extranjero.</strong>
                    </li>
                    <li>
                      El formulario de contacto{" "}
                      <strong>
                        no es una línea de ayuda o de asesoría personal en las
                        compras
                      </strong>
                      , puede usar el sistema de comentarios del sitio para
                      dejar dudas y consultas.
                    </li>
                  </ol>
                </Box>
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
                    sx={{
                      my: 2,
                      borderRadius: 3,
                    }}
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
