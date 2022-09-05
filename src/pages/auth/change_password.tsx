import { useState } from "react";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { Stack, Card, Container, Typography, InputAdornment, IconButton } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import { FormProvider, RHFTextField } from "../../components/hook-form";
import Page from "src/components/Page";
import Iconify from "src/components/Iconify";
// hooks
import { useAuth } from "src/frontend-utils/nextjs/JWTContext";
import { useRouter } from "next/router";
// routes
import { PATH_MAIN } from "src/routes/paths";

type FormValuesProps = {
  old_password: string;
  new_password1: string;
  new_password2: string;
};

export default function ChangePassword() {
  const { enqueueSnackbar } = useSnackbar();
  const { authFetch } = useAuth();
  const router = useRouter();

  const [showPasswordOld, setShowPasswordOld] = useState(false);
  const [showPasswordNew1, setShowPasswordNew1] = useState(false);
  const [showPasswordNew2, setShowPasswordNew2] = useState(false);

  const ChangePassWordSchema = Yup.object().shape({
    old_password: Yup.string().required("Contraseña antigua requerida"),
    new_password1: Yup.string()
      .required("Nueva contraseña requerida"),
    new_password2: Yup.string().oneOf(
      [Yup.ref("new_password1"), null],
      "Nueva contraseña debe coincidir"
    ),
  });

  const defaultValues = {
    old_password: "",
    new_password1: "",
    new_password2: "",
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await authFetch("rest-auth/password/change/", {
        headers: {},
        method: "post",
        body: JSON.stringify(data),
      });
      reset();
      enqueueSnackbar("Contraseña cambiada exitosamente!");
      await router.push(PATH_MAIN.root);
    } catch (error: any) {
      const json = await error.json();
      if ("old_password" in json)
        enqueueSnackbar("Contraseña actual equivocada", { variant: "error" });
      else if ("new_password2" in json)
        enqueueSnackbar(json["new_password2"], { variant: "error" });
      console.error(error);
    }
  };

  return (
    <Page title="Cambiar Contraseña">
      <Container sx={{ justifyContent: "center", display: "flex" }}>
        <Card sx={{ p: 3, width: { sx: '100%', md: '75%' } }}>
          <Typography variant="h4" component="h1" paragraph>
            Cambiar Contraseña
          </Typography>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3} alignItems="flex-end">
              <RHFTextField
                name="old_password"
                label="Antigua Contraseña"
                type={showPasswordOld ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPasswordOld(!showPasswordOld)}
                          edge="end"
                        >
                          <Iconify
                            icon={
                              showPasswordOld ? "eva:eye-fill" : "eva:eye-off-fill"
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
              />

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
                              showPasswordNew1 ? "eva:eye-fill" : "eva:eye-off-fill"
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
                              showPasswordNew2 ? "eva:eye-fill" : "eva:eye-off-fill"
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
                Guardar cambios
              </LoadingButton>
            </Stack>
          </FormProvider>
        </Card>
      </Container>
    </Page>
  );
}
