import { Grid } from "@mui/material";
import { useContext } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import ProductCard from "../product/ProductCard";
import { ProductsData } from "../product/types";

export default function CategoryBrowse({
  gridWith,
}: {
  gridWith?: number;
}) {
  const context = useContext(ApiFormContext);

  let currentResult = context.currentResult;
  if (currentResult === null) currentResult = { results: [] };

  return (
    <Grid container spacing={3}>
      {(currentResult.results as ProductsData[]).map((r, index) => (
        <Grid key={index} item xs={6} md={4} lg={gridWith ? gridWith : 4}>
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
