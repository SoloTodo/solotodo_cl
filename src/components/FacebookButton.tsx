import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useAuth } from "src/frontend-utils/nextjs/JWTContext";
import { fetchAuth, saveAuthTokens } from "src/frontend-utils/nextjs/utils";
import userSlice from "src/frontend-utils/redux/user";
import { PATH_MAIN } from "src/routes/paths";
import { useAppDispatch, useAppSelector } from "src/frontend-utils/redux/hooks";
import FacebookLogin, {
  SuccessResponse
} from '@greatsumini/react-facebook-login';
import { constants } from "src/config";

export default function FacebookButton() {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { authFetch } = useAuth();

  const responseFacebook = (response:SuccessResponse) => {
    if (response.accessToken) {
      fetchAuth(null, "rest-auth/facebook/", {
        method: "POST",
        body: JSON.stringify({ access_token: response.accessToken }),
      })
        .catch((err) => {
          return err.json();
        })
        .then((res) => {
          if (res.key) {
            fetchAuth(null, "auth/get_jwt_tokens/", {
              method: "POST",
              headers: {'Authorization': `Token ${res.key}`}
            }).then(res => {
              enqueueSnackbar("Inicio de sesión exitoso");
              saveAuthTokens(null, res);
              authFetch("users/me/", {}).then((user) => {
                dispatch(userSlice.actions.setUser(user));
                const nextPath =
                  typeof router.query.next == "string"
                    ? router.query.next
                    : PATH_MAIN.root;
                router.push(nextPath).then(() => {});
              });
            })
          } else {
            // Something failed
            if (res.non_field_errors) {
              enqueueSnackbar(res.non_field_errors[0], {
                persist: true,
                variant: "error",
              });
            }
          }
        });
    }
  };

  return (
    <Box width={"100%"}>
      <FacebookLogin
        appId={constants.facebookAppId}
        fields="name,email"
        onSuccess={responseFacebook}
        style={{
          backgroundColor: '#4267b2',
          color: '#fff',
          fontSize: '16px',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '4px',
        }}
      />
    </Box>
  );
}
