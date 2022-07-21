import * as Yup from "yup";
import { useState } from "react";
// import { capitalCase } from "change-case";
// next
import Image from "next/image";
import NextLink from "next/link";
// @mui
import { styled } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  // Card,
  Container,
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
import useIsMountedRef from "src/hooks/useIsMountedRef";
import {
  FormProvider,
  // RHFCheckbox,
  RHFTextField,
} from "src/components/hook-form";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// auth
import { authenticate } from "src/frontend-utils/network/auth";
import { jwtFetch, saveAuthTokens } from "src/frontend-utils/nextjs/utils";
import { useAuth } from "src/frontend-utils/nextjs/JWTContext";
import userSlice from "src/frontend-utils/redux/user";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import useSettings from "src/hooks/useSettings";
// routes
import { PATH_AUTH, PATH_MAIN } from "src/routes/paths";
import apiResourceObjectsSlice, {
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const HeaderStyle = styled("header")(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  position: "absolute",
  padding: theme.spacing(3),
  justifyContent: "space-between",
  [theme.breakpoints.up("md")]: {
    alignItems: "flex-start",
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  password: string;
  afterSubmit?: string;
};

// ----------------------------------------------------------------------

export default function Login() {
  const isMountedRef = useIsMountedRef();
  const settings = useSettings();
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { authFetch } = useAuth();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Ingresa un Email válido")
      .required("Email requerido"),
    password: Yup.string().required("Contraseña requerido"),
  });

  const defaultValues = {
    email: "",
    password: "",
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = (data: FormValuesProps) => {
    authenticate(data.email, data.password)
      .then((authToken) => {
        saveAuthTokens(null, authToken);
        authFetch("users/me/", {}).then((user) => {
          dispatch(userSlice.actions.setUser(user));
          if (
            Boolean(settings.prefExcludeRefurbished) !==
            Boolean(user.preferred_exclude_refurbished)
          ) {
            settings.onToggleExcludeRefurbished();
          }
          settings.onChangeStores(
            user.preferred_stores.map((s: string) =>
              apiResourceObjects[s].id.toString()
            )
          );
          const nextPath =
            typeof router.query.next == "string"
              ? router.query.next
              : PATH_MAIN.root;
          router.push(nextPath).then(() => {});
        });
      })
      .catch(() => {
        if (isMountedRef.current) {
          setError("afterSubmit", {
            message: "Email y/o contraseña incorrectos",
          });
        }
      });
  };

  return (
    <Page title="Login">
      <RootStyle>
        {/* <HeaderStyle>
          {
            settings.themeMode === 'dark' ?
              <Image alt={"Logo"} src="/logo_fondo_oscuro.svg" width={200} height={51} />
            :
              <Image alt={"Logo"} src="/logo_fondo_claro.svg" width={200} height={51} />
          }
        </HeaderStyle> */}
        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Ingresar a SoloTodo
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  Usar credenciales de ingreso.
                </Typography>
              </Box>
            </Stack>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                {!!errors.afterSubmit && (
                  <Alert severity="error">{errors.afterSubmit.message}</Alert>
                )}

                <RHFTextField name="email" label="Email" />

                <RHFTextField
                  name="password"
                  label="Contraseña"
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
                              showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ my: 2 }}
              >
                <NextLink href={PATH_AUTH.reset_password} passHref>
                  <Link variant="subtitle2">Olvidaste tu contraseña?</Link>
                </NextLink>
              </Stack>

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Ingresar
              </LoadingButton>
            </FormProvider>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
