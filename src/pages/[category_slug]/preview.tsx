import { Container, Typography } from "@mui/material";
import Page from "src/components/Page";
import ProductsRow from "src/components/product/ProductsRow";
import {
  getApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { Currency } from "src/frontend-utils/redux/api_resources/types";
import { Category } from "src/frontend-utils/types/store";
import { wrapper } from "src/store/store";
import currency from "currency.js";
import { useAppSelector } from "src/store/hooks";
import { constants } from "src/config";
import { fetchJson } from "src/frontend-utils/network/utils";

type CategoryPreviewProps = {
  category: Category;
  leads: any[];
  discount: any[];
};

export default function CategoryPreview({
  category,
  leads,
  discount,
}: CategoryPreviewProps) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const clp =
    apiResourceObjects[
      `${constants.apiResourceEndpoints.currencies}${constants.clpCurrencyId}/`
    ];
  return (
    <Page title={category.name}>
      <Container maxWidth={false}>
        <Typography variant="h2" component="h1">
          Lo más reciente
        </Typography>
        <Typography variant="h3" component="h1">
          {category.name}
        </Typography>
        <ProductsRow
          title="Lo más visto"
          data={leads.slice(0, 4)}
          ribbonFormatter={(value: string) => `Visitas: ${parseInt(value, 10)}`}
        />
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
}

export const getServerSideProps = wrapper.getServerSideProps(
  (st) => async (context) => {
    const prefExcludeRefurbished = context.req.cookies.prefExcludeRefurbished;
    const prefStores = context.req.cookies.prefStores.split("|");
    let storesUrl = "";
    for (const store of prefStores) {
      storesUrl += `&stores=${store}`;
    }

    const apiResourceObjects = st.getState().apiResourceObjects;
    const categories = getApiResourceObjects(apiResourceObjects, "categories");
    const category = categories.find(
      (c) => (c as Category).slug === context.params?.category_slug
    );
    if (typeof category === "undefined") {
      return {
        notFound: true,
      };
    } else {
      const leads = await fetchJson(
        `products/browse/?ordering=leads&websites=${constants.websiteId}&categories=${category.id}&exclude_refurbished=${prefExcludeRefurbished}${storesUrl}`
      );
      const discount = await fetchJson(
        `products/browse/?ordering=discount&websites=${constants.websiteId}&categories=${category.id}&exclude_refurbished=${prefExcludeRefurbished}${storesUrl}`
      );
      return {
        props: {
          category: category,
          leads: leads.results,
          discount: discount.results,
        },
      };
    }
  }
);
