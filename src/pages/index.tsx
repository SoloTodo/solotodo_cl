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
import TopBanner from "src/components/TopBanner";

type HomeProps = {
  recentSlides: Slide[];
};

const Home = (props: HomeProps) => {
  const { recentSlides } = props;
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const clp =
    apiResourceObjects[
      `${constants.apiResourceEndpoints.currencies}${constants.clpCurrencyId}/`
    ];

  return (
    <Page title="Cotiza y compara los precios de todas las tiendas">
      <Container>
        <TopBanner category="Any" />
        <Typography variant="h2" component="h1" fontWeight={400} gutterBottom>
          Lo más reciente
        </Typography>
        <RecentSlidesRow recentSlides={recentSlides} />
        <ProductsRow
          title="Lo más visto"
          url={`products/browse/?ordering=leads&websites=${constants.websiteId}`}
          sliceValue={10}
          ribbonFormatter={(value: string) => `${parseInt(value, 10)} visitas`}
          actionHref={`/search?ordering=leads`}
        />
        <Typography variant="h3" component="h1" gutterBottom>
          Categorías populares
        </Typography>
        <CategorySlidesRow categorySlides={categorySlides} />
        <ProductsRow
          title="Ofertas del día"
          url={`products/browse/?ordering=discount&websites=${constants.websiteId}`}
          sliceValue={10}
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
  const recentSlides = await fetchJson("website_slides/?only_active_home=1");
  return {
    props: {
      recentSlides: recentSlides,
    },
  };
};
