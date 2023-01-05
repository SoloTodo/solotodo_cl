import "../styles/globals.css";
import { ReactElement, ReactNode } from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import { NextPage } from "next/types";
import cookie from "cookie";
import { SettingsProvider } from "../contexts/SettingsContext";
import { getSettings } from "../utils/settings";
import ThemeProvider from "../theme";
import Layout from "../layouts";
import { SettingsValueProps } from "../components/settings/type";
import ProgressBar from "../components/ProgressBar";
import { AuthProvider } from "../frontend-utils/nextjs/JWTContext";
import NotistackProvider from "../components/NotistackProvider";
import { deleteAuthTokens, jwtFetch } from "src/frontend-utils/nextjs/utils";
import userSlice from "src/frontend-utils/redux/user";
import { CollapseDrawerProvider } from "src/contexts/CollapseDrawerContext";
import MotionLazyContainer from "src/components/animate/MotionLazyContainer";
import ThemeColorPresets from "src/components/ThemeColorPresets";
import { constants } from "src/config";
import {
  NavigationProps,
  NavigationProvider,
} from "src/contexts/NavigationContext";
import { fetchJson } from "src/frontend-utils/network/utils";
import apiResourceObjectsSlice from "src/frontend-utils/redux/api_resources/apiResources";
import { ChartStyle } from "src/components/chart";
import { Store } from "src/frontend-utils/types/store";
import { Provider } from "react-redux";
import { AnyAction, Store as ReduxStore } from "redux";
import withReduxStore, {
  MyAppContext,
} from "src/frontend-utils/redux/with-redux-store";
import App from "next/app";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps {
  navigation: NavigationProps[];
  settings: SettingsValueProps;
  reduxStore: ReduxStore<any, AnyAction>;
  Component: NextPageWithLayout;
}

function MyApp({
  Component,
  pageProps,
  settings,
  navigation,
  reduxStore,
}: MyAppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <Provider store={reduxStore}>
        <SettingsProvider defaultSettings={settings}>
          <ThemeProvider>
            <NotistackProvider>
              <AuthProvider>
                <CollapseDrawerProvider>
                  <MotionLazyContainer>
                    <ThemeColorPresets>
                      <NavigationProvider initialNavigation={navigation}>
                        <ChartStyle />
                        <ProgressBar />
                        <Layout>
                          <Component {...pageProps} />
                        </Layout>
                      </NavigationProvider>
                    </ThemeColorPresets>
                  </MotionLazyContainer>
                </CollapseDrawerProvider>
              </AuthProvider>
            </NotistackProvider>
          </ThemeProvider>
        </SettingsProvider>
      </Provider>
    </>
  );
}

MyApp.getInitialProps = async (context: MyAppContext) => {
  const cookies = cookie.parse(
    context.ctx.req ? context.ctx.req.headers.cookie || "" : document.cookie
  );

  const settings = getSettings(cookies);

  const navigation = await fetchJson(
    `${constants.apiResourceEndpoints.countries}${constants.chileId}/navigation/`
  );

  const ctx = context.ctx;

  if (!ctx.req) {
    const appProps = await App.getInitialProps(context);
    return { ...appProps, settings, navigation };
  }

  let user = null;

  try {
    user = await jwtFetch(
      ctx,
      "users/me/"
    );
  } catch (err: any) {
    // Invalid token or some other network error, invalidate the
    // possible auth cookie
    ctx.res?.setHeader("error", err.message);
    deleteAuthTokens(ctx);
  }

  const resources = [
    "categories",
    "countries",
    "store_types",
    "currencies",
    "stores",
    "store_types",
  ];
  const resources_query = resources.reduce((acc, r) => {
    return (acc = `${acc}&names=${r}`);
  }, "");

  try {
    const reduxStore = ctx.reduxStore;
    const apiResources = await fetchJson(`resources/?${resources_query}`);
    reduxStore.dispatch(
      apiResourceObjectsSlice.actions.addApiResourceObjects(apiResources)
    );
    if (settings.prefStores.length == 0) {
      settings.prefStores = (apiResources as Store[])
        .filter(
          (s) =>
            s.url.includes("stores") &&
            s.country === constants.defaultCountryUrl &&
            s.last_activation
        )
        .map((f) => f.id.toString());
    }
    if (user) {
      reduxStore.dispatch(userSlice.actions.setUser(user));

      settings.prefExcludeRefurbished = Boolean(
        user.preferred_exclude_refurbished
      );
      const userStores = user.preferred_stores.reduce(
        (acc: string[], a: string) => {
          const s = apiResources.find(
            (r: { url: string }) => r.url === a
          ) as Store;
          if (s && s.country === constants.defaultCountryUrl) {
            acc.push(s.id.toString());
          }
          return acc;
        },
        []
      );
      settings.prefStores = userStores;
    }
  } catch (err: any) {
    ctx.res?.setHeader("error", err.message);
  }

  const appProps = await App.getInitialProps(context);
  return { ...appProps, settings, navigation };
};

export default withReduxStore(MyApp);
