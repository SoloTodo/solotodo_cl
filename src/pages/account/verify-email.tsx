import { Container } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import Page from "src/components/Page";
import { fetchJson } from "src/frontend-utils/network/utils";
import { MyNextPageContext } from "src/frontend-utils/redux/with-redux-store";

function VerifyEmail() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    enqueueSnackbar(
      "Ocurrió un error al verificar tu correo, por favor verifica el link que seguiste. Si el problema persiste contáctanos!",
      { persist: true, variant: "error" },
    );
    router.push("/");
  }, [enqueueSnackbar, router]);

  return (
    <Page title="Verificando cuenta">
      <Container></Container>
    </Page>
  );
}

VerifyEmail.getInitialProps = async (context: MyNextPageContext) => {
  const reduxStore = context.reduxStore;
  const user = reduxStore.getState().user;
  if (context.res && user) {
    context.res.writeHead(302, {
      Location: "/",
    });
    context.res.end();
    return;
  }

  let response = null;
  try {
    response = await fetchJson("rest-auth/registration/verify-email/", {
      method: "post",
      body: JSON.stringify({ key: context.query["key"] }),
    });
  } catch {
    if (context.res) {
      context.res.writeHead(302, {
        Location: "/",
      });
      context.res.end();
      return;
    }
  }

  if (context.res && response) {
    context.res.writeHead(302, {
      Location: "/login?post_verify=1",
    });
    context.res.end();
  }

  return;
};

export default VerifyEmail;
