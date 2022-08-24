import * as Yup from "yup";
import { useState } from "react";
// next
import NextLink from "next/link";
// @mui
import { styled } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Typography,
} from "@mui/material";
// components
import Page from "src/components/Page";
import Iconify from "src/components/Iconify";
// hooks
import { FormProvider, RHFTextField } from "src/components/hook-form";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// routes
import { useRouter } from "next/router";
import { PATH_AUTH, PATH_MAIN } from "src/routes/paths";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import { useSnackbar } from "notistack";
import { fetchJson } from "src/frontend-utils/network/utils";
import FacebookButton from "src/components/FacebookButton";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
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
  password1: string;
  password2: string;
  afterSubmit?: string;
};

// ----------------------------------------------------------------------

export default function Register() {
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const RegisterSchema = Yup.object().shape({
    email: Yup.string()
      .email("Ingresa un Email válido")
      .required("Email requerido"),
    password1: Yup.string().required("Contraseña requerida"),
    password2: Yup.string().oneOf(
      [Yup.ref("password1"), null],
      "Contraseña debe coincidir"
    ),
  });

  const defaultValues = {
    email: "",
    password1: "",
    password2: "",
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    console.log(data);
    try {
      const _ = await fetchJson("rest-auth/registration/", {
        method: "POST",
        body: JSON.stringify(data),
      });
      enqueueSnackbar(
        <div>
          <Typography fontWeight={700}>Registro exitoso</Typography>
          <Typography>¡Gracias por registrarte en SoloTodo!</Typography>
          <Typography>
            Te hemos enviado un correo para que puedas validar tu cuenta y así
            puedas empezar a usarla
          </Typography>
        </div>,
        { persist: true }
      );
      const nextPath =
        typeof router.query.next == "string"
          ? router.query.next
          : PATH_MAIN.root;
      router.push(nextPath).then(() => {});
    } catch (err: any) {
      err.json().then((errJson: { [a: string]: string[] }) => {
        const messageError = Object.values(errJson).reduce(
          (acc: string, a: string[]) => {
            return acc + " " + a.reduce((acc2, a2) => acc2 + " " + a2);
          },
          ""
        );
        setError("afterSubmit", {
          message: messageError,
        });
      });
    }
  };

  return (
    <Page title="Registro">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Home", href: PATH_MAIN.root },
            { name: "Crear tu cuenta" },
          ]}
        />
        <RootStyle>
          <Container maxWidth="sm">
            <ContentStyle>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{ mb: 5 }}
              >
                <Typography
                  variant="h3"
                  fontWeight={700}
                  color="#3C5D82"
                  gutterBottom
                >
                  Bienvenid@ a SoloTodo
                </Typography>
                <Typography color="text.secondary">
                  Porfavor ingresa tus datos para crear tu cuenta
                </Typography>
              </Stack>

              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3} paddingX={4}>
                  {!!errors.afterSubmit && (
                    <Alert severity="error">{errors.afterSubmit.message}</Alert>
                  )}

                  <RHFTextField name="email" label="Email" />

                  <RHFTextField
                    name="password1"
                    label="Contraseña"
                    helperText="A lo menos 8 letras, una Mayúscula, un número y un símbolo"
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            <Iconify
                              icon={
                                showPassword
                                  ? "eva:eye-fill"
                                  : "eva:eye-off-fill"
                              }
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <RHFTextField
                    name="password2"
                    label="Confirmar contraseña"
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            <Iconify
                              icon={
                                showPassword
                                  ? "eva:eye-fill"
                                  : "eva:eye-off-fill"
                              }
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
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
                    CREAR CUENTA
                  </LoadingButton>
                </Stack>

                <Stack
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ my: 2, px: 4 }}
                  spacing={1}
                >
                  <Typography variant="h6" fontWeight={400}>
                    ¿Ya tienes una cuenta?{" "}
                    <NextLink href={PATH_AUTH.login} passHref>
                      <Link>Inicia sesión</Link>
                    </NextLink>
                  </Typography>
                </Stack>

                <Divider variant="middle" />

                <Stack
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ my: 2, px: 4 }}
                  spacing={1}
                >
                  <Typography variant="h5" color="text.secondary">
                    Si lo prefieres, puedes crear tu cuenta con
                  </Typography>
                  <FacebookButton />
                </Stack>
              </FormProvider>
            </ContentStyle>
          </Container>
        </RootStyle>
      </Container>
    </Page>
  );
}
