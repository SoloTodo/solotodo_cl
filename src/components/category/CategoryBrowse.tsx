import { Grid } from "@mui/material";
import currency from "currency.js";
import { useContext } from "react";
import { constants } from "src/config";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { Category } from "src/frontend-utils/types/store";
import { useGtag4ViewItemList } from "src/hooks/useGtag4";
import { useAppSelector } from "src/store/hooks";
import ProductCard from "../product/ProductCard";
import { ProductsData } from "../product/types";

export default function CategoryBrowse({ category }: { category?: Category }) {
  const context = useContext(ApiFormContext);
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  let currentResult = context.currentResult;
  if (currentResult === null) currentResult = { results: [] };

  useGtag4ViewItemList({
    category: category?.name,
    categoryId: category?.id.toString(),
    items: currentResult.results.map((r: ProductsData, index: number) => {
      const { product_entries } = r;
      const { product, metadata } = product_entries[0];

      const priceCurrency = metadata.prices_per_currency.find((p) =>
        p.currency.includes(`/${constants.clpCurrencyId}/`)
      );
      const offerPrice = priceCurrency ? priceCurrency.offer_price : 0;

      return {
        item_id: product.id,
        item_name: product.name,
        currency: "CLP",
        index: index,
        item_category: apiResourceObjects[product.category].name,
        price: currency(offerPrice, {
          separator: ".",
          precision: 0,
        }).value,
      };
    }),
  });
  return (
    <Grid
      container
      spacing={3}
      justifyContent={{ xs: "space-evenly", sm: "start" }}
    >
      {(currentResult.results as ProductsData[]).map((r, index) => (
        <Grid key={index} item>
          <ProductCard
            productData={r}
            browsePurpose={true}
            loading={context.isLoading}
            categoryBrowseResult
          />
        </Grid>
      ))}
    </Grid>
  );
}
