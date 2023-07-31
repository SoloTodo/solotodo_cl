import * as Yup from "yup";
import {useEffect, useState} from "react";
// next
import NextLink from "next/link";
// @mui
import {styled} from "@mui/material/styles";
import {LoadingButton} from "@mui/lab";
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
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
// hooks
import {FormProvider, RHFTextField} from "src/components/hook-form";
// form
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
// auth
import {authenticate} from "src/frontend-utils/network/auth";
import {saveAuthTokens} from "src/frontend-utils/nextjs/utils";
import {useAuth} from "src/frontend-utils/nextjs/JWTContext";
import userSlice from "src/frontend-utils/redux/user";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "src/frontend-utils/redux/hooks";
import useSettings from "src/hooks/useSettings";
// routes
import {PATH_AUTH, PATH_MAIN} from "src/routes/paths";
import {useApiResourceObjects} from "src/frontend-utils/redux/api_resources/apiResources";
import {useSnackbar} from "notistack";
import FacebookButton from "src/components/FacebookButton";
import TopBanner from "src/components/TopBanner";
import {useGtag3} from "src/hooks/useGtag3";
import {useGtag4} from "src/hooks/useGtag4";
import GoogleButton from "../components/GoogleButton";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({theme}) => ({
    [theme.breakpoints.up("md")]: {
        display: "flex",
    },
}));

const ContentStyle = styled("div")(({theme}) => ({
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
    password: string;
    afterSubmit?: string;
};

// ----------------------------------------------------------------------

export default function Login() {
    const {enqueueSnackbar} = useSnackbar();
    const settings = useSettings();
    const apiResourceObjects = useAppSelector(useApiResourceObjects);
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useAppDispatch();
    const router = useRouter();
    const {authFetch} = useAuth();

    useEffect(() => {
        const params = router.query;
        const justVerifiedEmail = parseInt(params.post_verify as string, 10);
        if (justVerifiedEmail)
            enqueueSnackbar(
                "Cuenta verificada, por favor ingrese con su correo y contraseña.",
                {persist: true, variant: "info"}
            );
        const singInRequired = params.budget_sign_in_required;
        if (singInRequired) {
            enqueueSnackbar(
                "Por favor inicia sesion para poder acceder a las cotizaciones.",
                {persist: true, variant: "info"}
            );
        }
    }, [enqueueSnackbar, router.query]);

    const LoginSchema = Yup.object().shape({
        email: Yup.string()
            .email("Ingresa un Email válido")
            .required("Email requerido"),
        password: Yup.string().required("Contraseña requerida"),
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
        formState: {errors, isSubmitting},
    } = methods;

    const onSubmit = async (data: FormValuesProps) => {
        await authenticate(data.email, data.password)
            .then(async (authToken) => {
                saveAuthTokens(null, authToken);
                await authFetch("users/me/", {}).then(async (user) => {
                    dispatch(userSlice.actions.setUser(user));
                    const nextPath =
                        typeof router.query.next == "string"
                            ? router.query.next
                            : PATH_MAIN.root;
                    await router.push(nextPath).then(() => {
                    });
                });
            })
            .catch(() => {
                setError("afterSubmit", {
                    message: "Email y/o contraseña incorrectos",
                });
            });
    };

    useGtag3({});
    useGtag4({pageTitle: "Iniciar Sesión"});
    return (
        <Page title="Iniciar Sesión">
            <Container>
                <TopBanner category="Any"/>
                <HeaderBreadcrumbs
                    heading=""
                    links={[
                        {name: "Home", href: PATH_MAIN.root},
                        {name: "Iniciar Sesión"},
                    ]}
                />
                <RootStyle>
                    <Container maxWidth="sm">
                        <ContentStyle>
                            <Stack
                                direction="column"
                                alignItems="center"
                                justifyContent="center"
                                sx={{mb: 5}}
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
                                    Porfavor ingresa tus datos para entrar al sitio
                                </Typography>
                            </Stack>

                            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                                <Stack spacing={3} paddingX={4}>
                                    {!!errors.afterSubmit && (
                                        <Alert severity="error">{errors.afterSubmit.message}</Alert>
                                    )}

                                    <RHFTextField name="email" label="Email"/>

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
                                        loadingIndicator="INGRESANDO..."
                                        sx={{my: 2, borderRadius: 3}}
                                    >
                                        INICIAR SESIÓN
                                    </LoadingButton>
                                </Stack>

                                <Stack
                                    direction="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    sx={{my: 2, px: 4}}
                                    spacing={1}
                                >
                                    <NextLink href={PATH_AUTH.reset_password} passHref>
                                        <Link variant="h5" fontWeight={400} color="info.main">
                                            ¿Olvidaste tu contraseña?
                                        </Link>
                                    </NextLink>
                                    <Typography variant="h6" fontWeight={400}>
                                        ¿Necesitas una cuenta?{" "}
                                        <NextLink href={PATH_AUTH.register} passHref>
                                            <Link color="info.main">Regístrate</Link>
                                        </NextLink>
                                    </Typography>
                                </Stack>

                                <Divider variant="middle"/>

                                <Stack
                                    direction="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    sx={{my: 2, px: 4}}
                                    spacing={1}
                                >
                                    <Typography variant="h5" color="text.secondary">
                                        Si lo prefieres, puedes ingresar con
                                    </Typography>
                                    {/*<GoogleButton />*/}
                                    <FacebookButton/>
                                </Stack>
                            </FormProvider>
                        </ContentStyle>
                    </Container>
                </RootStyle>
            </Container>
        </Page>
    );
}
