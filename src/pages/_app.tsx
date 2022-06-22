import "../styles/globals.css";
import { ReactElement, ReactNode } from "react";
import App from "next/app";
import Head from "next/head";
import type { AppProps } from "next/app";
import { GetServerSidePropsContext, NextPage } from "next/types";
import cookie from "cookie";
import { SettingsProvider } from "../contexts/SettingsContext";
import { getSettings } from "../utils/settings";
import ThemeProvider from "../theme";
import Layout from "../layouts";
import { SettingsValueProps } from "../components/settings/type";
import ProgressBar from "../components/ProgressBar";
import { AuthProvider } from "../frontend-utils/nextjs/JWTContext";
import { wrapper } from "../store/store";
import NotistackProvider from "../components/NotistackProvider";
import { deleteAuthTokens, jwtFetch } from "src/frontend-utils/nextjs/utils";
import userSlice from "src/frontend-utils/redux/user";
import { CollapseDrawerProvider } from "src/contexts/CollapseDrawerContext";
import MotionLazyContainer from "src/components/animate/MotionLazyContainer";
import ThemeColorPresets from "src/components/ThemeColorPresets";
import { apiSettings } from "src/frontend-utils/settings";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps {
  settings: SettingsValueProps;
  Component: NextPageWithLayout;
}

class MyApp extends App<MyAppProps> {
  public static getInitialProps = wrapper.getInitialAppProps(
    (store) => async (context) => {
      const cookies = cookie.parse(
        context.ctx.req ? context.ctx.req.headers.cookie || "" : document.cookie
      );

      const settings = getSettings(cookies);

      const ctx = context.ctx;

      if (!ctx.req) {
        return { pageProps: {}, settings };
      }

      let user = null;

      try {
        user = await jwtFetch(
          ctx as unknown as GetServerSidePropsContext,
          "users/me/"
        );
      } catch (err: any) {
        // Invalid token or some other network error, invalidate the
        // possible auth cookie
        ctx.res?.setHeader("error", err.message);
        deleteAuthTokens(ctx as unknown as GetServerSidePropsContext);
      }

      // const navigation = await jwtFetch(
      //   ctx as unknown as GetServerSidePropsContext,
      //   `${apiSettings.apiResourceEndpoints.countries}`
      // )

      // const store = initializeStore();
      if (user) {
        // Store in redux api resources
        // try {
        //   const apiResources = await jwtFetch(
        //     ctx as unknown as GetServerSidePropsContext,
        //     `resources/with_permissions/?${resources_query}`
        //   );
        //   store.dispatch(
        //     apiResourceObjectsSlice.actions.addApiResourceObjects(apiResources)
        //   );
        // } catch (err) {
        //   ctx.res?.setHeader("error", err.message);
        // }

        store.dispatch(userSlice.actions.setUser(user));
        const resultProps = {
          user,
          initialReduxState: store.getState(),
        };

        return { pageProps: resultProps, settings };
      } else {
        return { pageProps: {}, settings };
      }
    }
  );

  public render() {
    const { Component, pageProps, settings } = this.props;

    return (
      <>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>

        <SettingsProvider defaultSettings={settings}>
          <ThemeProvider>
            <NotistackProvider>
              <AuthProvider>
                <CollapseDrawerProvider>
                  <MotionLazyContainer>
                    <ThemeColorPresets>
                      <ProgressBar />
                      <Layout>
                        <Component {...pageProps} />
                      </Layout>
                    </ThemeColorPresets>
                  </MotionLazyContainer>
                </CollapseDrawerProvider>
              </AuthProvider>
            </NotistackProvider>
          </ThemeProvider>
        </SettingsProvider>
      </>
    );
  }
}

export default wrapper.withRedux(MyApp);