import type { GetServerSideProps } from "next";
import { Container, Typography } from "@mui/material";
import Page from "../components/Page";
import ProductsRow from "src/components/product/ProductsRow";
import { constants } from "src/config";
import { fetchJson } from "src/frontend-utils/network/utils";
import currency from "currency.js";
import { Currency } from "src/frontend-utils/redux/api_resources/types";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/store/hooks";

type HomeProps = {
  leads: any[];
  discount: any[];
};

const Home = (props: HomeProps) => {
  const { leads, discount } = props;
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const clp =
    apiResourceObjects[
      `${constants.apiResourceEndpoints.currencies}${constants.clpCurrencyId}/`
    ];
  return (
    <Page title="Cotiza y compara los precios de todas las tiendas">
      <Container maxWidth={false}>
        <Typography variant="h2" component="h1">
          Lo más reciente
        </Typography>
        <ProductsRow
          title="Lo más visto"
          data={leads.slice(0, 4)}
          ribbonFormatter={(value: string) => `Visitas: ${parseInt(value, 10)}`}
        />
        <Typography variant="h3" component="h1">
          Categorías populares
        </Typography>
        <ProductsRow
          title="Ofertas del día"
          data={discount.slice(0, 4)}
          ribbonFormatter={(value: string) =>
            `Bajó ${currency(value, {
              separator: ".",
              precision: 0,
            })
              .multiply((clp as Currency).exchange_rate)
              .format()}`
          }
        />
      </Container>
    </Page>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const prefExcludeRefurbished = context.req.cookies.prefExcludeRefurbished;
  const prefStores = context.req.cookies.prefStores.split('|');
  let storesUrl = "";
    for (const store of prefStores) {
      storesUrl += `&stores=${store}`
    }
  
  const leads = await fetchJson(
    `products/browse/?ordering=leads&websites=${constants.websiteId}&exclude_refurbished=${prefExcludeRefurbished}${storesUrl}`
  );
  const discount = await fetchJson(
    `products/browse/?ordering=discount&websites=${constants.websiteId}&exclude_refurbished=${prefExcludeRefurbished}${storesUrl}`
  );
  return {
    props: {
      leads: leads.results,
      discount: discount.results,
    },
  };
};
