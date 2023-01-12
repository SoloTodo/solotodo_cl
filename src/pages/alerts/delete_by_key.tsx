import { Container } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import Page from "src/components/Page";
import { constants } from "src/config";
import { fetchJson } from "src/frontend-utils/network/utils";
import { MyNextPageContext } from "src/frontend-utils/redux/with-redux-store";

function AlertDeleteByKey({ alertKey }: { alertKey?: string }) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    if (!alertKey) {
      enqueueSnackbar("Error: Llave no encontrada", {
        persist: true,
        variant: "error",
      });
      router.push("/");
      return;
    }

    fetchJson(`${constants.apiResourceEndpoints.alerts}delete_by_key/`, {
      method: "post",
      body: JSON.stringify({ payload: alertKey }),
    })
      .then((_) =>
        enqueueSnackbar("¡Alerta eliminada exitosamente!", {
          persist: true,
        })
      )
      .catch((_) =>
        enqueueSnackbar(
          "Error: Llave inválida. Puede que esta alerta ya haya sido borrada. Si el problema persiste por favor contáctanos!",
          {
            persist: true,
            variant: "error",
          }
        )
      );
      
    router.push("/");
  }, [alertKey, enqueueSnackbar, router]);

  return (
    <Page title="Eliminando alerta">
      <Container></Container>
    </Page>
  );
}

AlertDeleteByKey.getInitialProps = async (context: MyNextPageContext) => {
  return {
    alertKey: context.query.key,
  };
};

export default AlertDeleteByKey;
