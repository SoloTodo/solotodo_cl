import { CircularProgress, Grid, Stack } from "@mui/material";
import { useContext } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import ApiFormPaginationComponent from "src/frontend-utils/api_form/fields/pagination/ApiFormPaginationComponent";
import ProductComment from "./ProductComment";

export type PagintationData = {
  count: number;
  next: string;
  previous: string;
  results: any[];
};

export default function ProductRatingGrid() {
  const context = useContext(ApiFormContext);
  const data = context.currentResult as PagintationData;

  return context.isLoading ? (
    <div style={{ textAlign: "center" }}>
      <CircularProgress color="inherit" />
    </div>
  ) : (
    <div>
      <Grid container>
        {data.results.map((result, index) => (
          <Grid key={index} item xs={12}>
            <ProductComment
              rating={result.product_rating}
              comment={result.product_comments}
            />
          </Grid>
        ))}
      </Grid>
      <ApiFormPaginationComponent />
    </div>
  );
}
