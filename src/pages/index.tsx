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
import RecentSlidesRow from "src/components/website-slides/RecentSlidesRow";
import CategorySlidesRow from "src/components/website-slides/CaregorySlidesRow";
import { Slide } from "src/components/website-slides/types";
import { categorySlides } from "src/categorySlides";

type HomeProps = {
  leads: any[];
  discount: any[];
  recentSlides: Slide[];
};

const Home = (props: HomeProps) => {
  const { leads, discount, recentSlides } = props;
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const clp =
    apiResourceObjects[
      `${constants.apiResourceEndpoints.currencies}${constants.clpCurrencyId}/`
    ];
  return (
    <Page title="Cotiza y compara los precios de todas las tiendas">
      <Container maxWidth={false}>
        <Typography variant="h2" component="h1" gutterBottom>
          Lo más reciente
        </Typography>
        <RecentSlidesRow recentSlides={recentSlides} />
        <ProductsRow
          title="Lo más visto"
          data={leads.slice(0, 4)}
          ribbonFormatter={(value: string) => `${parseInt(value, 10)} visitas`}
          actionHref={`/search?ordering=leads`}
        />
        <Typography variant="h3" component="h1" gutterBottom>
          Categorías populares
        </Typography>
        <CategorySlidesRow categorySlides={categorySlides} />
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
          actionHref={`/search?ordering=discount`}
        />
      </Container>
    </Page>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const prefExcludeRefurbished = context.req.cookies.prefExcludeRefurbished;
  const preStoresCookie = context.req.cookies.prefStores;
  const prefStores = preStoresCookie ? preStoresCookie.split("|") : [];
  let storesUrl = "";
  for (const store of prefStores) {
    storesUrl += `&stores=${store}`;
  }

  const leads = await fetchJson(
    `products/browse/?ordering=leads&websites=${constants.websiteId}&exclude_refurbished=${prefExcludeRefurbished}${storesUrl}`
  );
  const discount = await fetchJson(
    `products/browse/?ordering=discount&websites=${constants.websiteId}&exclude_refurbished=${prefExcludeRefurbished}${storesUrl}`
  );
  const recentSlides = await fetchJson("website_slides/?only_active_home=1");
  return {
    props: {
      leads: leads.results,
      discount: discount.results,
      recentSlides: recentSlides,
    },
  };
};
