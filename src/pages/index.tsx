import { Container, Typography } from "@mui/material";
import Page from "../components/Page";
import ProductsRow from "src/components/product/ProductsRow";
import { constants } from "src/config";
import currency from "currency.js";
import { Currency } from "src/frontend-utils/redux/api_resources/types";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import RecentSlidesRow from "src/components/website-slides/RecentSlidesRow";
import CategorySlidesRow from "src/components/website-slides/CaregorySlidesRow";
import { categorySlides } from "src/categorySlides";
import TopBanner from "src/components/TopBanner";
import { useGtag3 } from "src/hooks/useGtag3";
import { useGtag4 } from "src/hooks/useGtag4";

const Home = () => {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const clp =
    apiResourceObjects[
      `${constants.apiResourceEndpoints.currencies}${constants.clpCurrencyId}/`
    ];

  useGtag3({});
  useGtag4({ pageTitle: "Cotiza y compara los precios de todas las tiendas" });
  return (
    <Page title="Cotiza y compara los precios de todas las tiendas">
      <Container>
        <TopBanner category="Any" />
        <RecentSlidesRow />
        <ProductsRow
          title="Lo más visto"
          url={`products/browse/?ordering=leads&websites=${constants.websiteId}`}
          sliceValue={10}
          ribbonFormatter={(value: string) => `${parseInt(value, 10)} visitas`}
          actionHref={`/search?ordering=leads`}
        />
        <Typography
          variant="h3"
          component="h1"
          color="text.subtitle"
          gutterBottom
        >
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
