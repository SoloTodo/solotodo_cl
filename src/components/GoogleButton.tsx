import {Box} from '@mui/material';
import {useRouter} from 'next/router';
import {useSnackbar} from 'notistack';
import {useAuth} from 'src/frontend-utils/nextjs/JWTContext';
import {fetchAuth, saveAuthTokens} from 'src/frontend-utils/nextjs/utils';
import userSlice from 'src/frontend-utils/redux/user';
import {PATH_MAIN} from 'src/routes/paths';
import {useAppDispatch} from 'src/frontend-utils/redux/hooks';
import {CredentialResponse, GoogleLogin} from '@react-oauth/google';


export default function GoogleButton() {
    const {enqueueSnackbar} = useSnackbar();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {authFetch} = useAuth();

    const responseGoogle = (response: CredentialResponse) => {
        if (!response.credential) {
            onError()
        }

        fetchAuth(null, 'rest-auth/google/', {
            method: 'POST',
            body: JSON.stringify({access_token: response.credential}),
        }).catch((err) => {
            return err.json();
        }).then((res) => {
            if (res.key) {
                fetchAuth(null, 'auth/get_jwt_tokens/', {
                    method: 'POST',
                    headers: {'Authorization': `Token ${res.key}`}
                }).then(res => {
                    enqueueSnackbar('Inicio de sesión exitoso');
                    saveAuthTokens(null, res);
                    authFetch('users/me/', {}).then((user) => {
                        dispatch(userSlice.actions.setUser(user));
                        const nextPath =
                            typeof router.query.next == 'string'
                                ? router.query.next
                                : PATH_MAIN.root;
                        router.push(nextPath).then(() => {
                        });
                    });
                })
            } else {
                // Something failed
                if (res.non_field_errors) {
                    enqueueSnackbar(res.non_field_errors[0], {
                        persist: true,
                        variant: 'error',
                    });
                } else {
                    onError()
                }
            }
        });
    };

    const onError = () => {
        enqueueSnackbar('Ocurrió un error, lo sentimos! Por favor usa el ' +
            'formulario de contacto para que podamos resolver el problema', {
            persist: true,
            variant: 'error',
        });
    }

    return (
        <Box>
            <GoogleLogin onSuccess={responseGoogle} onError={onError}/>
        </Box>
    );
}
