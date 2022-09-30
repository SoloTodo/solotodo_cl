import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useAuth } from "src/frontend-utils/nextjs/JWTContext";
import { fetchAuth, saveAuthTokens } from "src/frontend-utils/nextjs/utils";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import userSlice from "src/frontend-utils/redux/user";
import useSettings from "src/hooks/useSettings";
import { PATH_MAIN } from "src/routes/paths";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import FacebookLogin, { ReactFacebookLoginInfo } from "react-facebook-login";
import { constants } from "src/config";
import styles from "../styles/FacebookButton.module.css";
import { Store } from "src/frontend-utils/types/store";

export default function FacebookButton() {
  const { enqueueSnackbar } = useSnackbar();
  const settings = useSettings();
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { authFetch } = useAuth();

  const responseFacebook = (response: ReactFacebookLoginInfo) => {
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
            enqueueSnackbar("Inicio de sesión exitoso");
            saveAuthTokens(null, res.key);
            authFetch("users/me/", {}).then((user) => {
              dispatch(userSlice.actions.setUser(user));
              if (
                Boolean(settings.prefExcludeRefurbished) !==
                Boolean(user.preferred_exclude_refurbished)
              ) {
                settings.onToggleExcludeRefurbished();
              }
              const userStores = user.preferred_stores.reduce(
                (acc: string[], a: string) => {
                  const store = apiResourceObjects[a] as Store;
                  if (store && store.country === constants.defaultCountryUrl) {
                    acc.push(store.id.toString());
                  }
                  return acc;
                },
                []
              );
              settings.onChangeStores(userStores);
              const nextPath =
                typeof router.query.next == "string"
                  ? router.query.next
                  : PATH_MAIN.root;
              router.push(nextPath).then(() => {});
            });
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
        callback={responseFacebook}
        textButton="FACEBOOK"
        redirectUri={`${constants.domain}/login`}
        cssClass={styles.kep_login_facebook}
      />
    </Box>
  );
}
