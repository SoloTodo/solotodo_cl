import { GetServerSideProps } from "next/types";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Page from "src/components/Page";
import {
  Alert,
  Card,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/Iconify";
import { LoadingButton } from "@mui/lab";
import { fetchJson } from "src/frontend-utils/network/utils";
import { useRouter } from "next/router";
import { PATH_AUTH, PATH_MAIN } from "src/routes/paths";
import TopBanner from "src/components/TopBanner";

type FormValuesProps = {
  new_password1: string;
  new_password2: string;
  afterSubmit?: string;
};

export default function ResetPassword({
  uid,
  token,
}: {
  uid: string;
  token: string;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [showPasswordNew1, setShowPasswordNew1] = useState(false);
  const [showPasswordNew2, setShowPasswordNew2] = useState(false);

  const ChangePassWordSchema = Yup.object().shape({
    new_password1: Yup.string().required("Nueva contraseña requerida"),
    new_password2: Yup.string().oneOf(
      [Yup.ref("new_password1"), null],
      "Nueva contraseña debe coincidir"
    ),
  });

  const defaultValues = {
    new_password1: "",
    new_password2: "",
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    setError,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await fetchJson("rest-auth/password/reset/confirm/", {
        method: "post",
        body: JSON.stringify({ ...data, uid: uid, token: token }),
      });
      reset();
      enqueueSnackbar(
        "Cambio exitoso. Ahora puedes iniciar sesión con tu nueva contraseña",
        { persist: true }
      );
      await router.push(PATH_AUTH.login);
    } catch (error: any) {
      const json = await error.json();

      const credentialErrors = json["token"] || json["uid"] || [];

      if (credentialErrors.length) {
        enqueueSnackbar("Link de reinicio de contraseña inválido", {
          variant: "error",
          persist: true,
        });
        await router.push(PATH_MAIN.root);
      }

      if ("new_password2" in json) {
        // enqueueSnackbar(json["new_password2"], { variant: "error" });

        const messageError = json["new_password2"].reduce(
          (acc: string, a: string[]) => {
            return acc + " " + a;
          },
          ""
        );
        setError("afterSubmit", {
          message: messageError,
        });
      }
    }
  };

  return (
    <Page title="Cambio de contraseña">
      <Container>
        <TopBanner category="any" />
        <Container sx={{ justifyContent: "center", display: "flex" }}>
          <Card sx={{ p: 3, width: { sx: "100%", md: "75%" } }}>
            <Typography variant="h4" component="h1" paragraph>
              Cambiar Contraseña
            </Typography>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3} alignItems="flex-end">
                {!!errors.afterSubmit && (
                  <Alert severity="error" sx={{ width: "100%" }}>
                    {errors.afterSubmit.message}
                  </Alert>
                )}
                <RHFTextField
                  name="new_password1"
                  label="Nueva Contraseña"
                  type={showPasswordNew1 ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPasswordNew1(!showPasswordNew1)}
                          edge="end"
                        >
                          <Iconify
                            icon={
                              showPasswordNew1
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
                  name="new_password2"
                  label="Confirmar Nueva Contraseña"
                  type={showPasswordNew2 ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPasswordNew2(!showPasswordNew2)}
                          edge="end"
                        >
                          <Iconify
                            icon={
                              showPasswordNew2
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
                  type="submit"
                  variant="contained"
                  color="secondary"
                  loading={isSubmitting}
                  sx={{ borderRadius: 3 }}
                >
                  Enviar
                </LoadingButton>
              </Stack>
            </FormProvider>
          </Card>
        </Container>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { uid, token } = context.query;
  if (typeof uid !== "undefined" && typeof token !== "undefined") {
    return {
      props: {
        uid: uid,
        token: token,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};
