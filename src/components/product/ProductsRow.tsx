import { Grid } from "@mui/material";

import ProductCard from "./ProductCard";
import { ProductsData } from "./types";

export default function ProductsRow({
  data,
  ribbonFormatter,
}: {
  data: ProductsData[];
  ribbonFormatter?: Function;
}) {
  return (
    <Grid
      container
      spacing={2}
      justifyContent="space-between"
      wrap="nowrap"
      overflow="scroll"
    >
      {data.map((d, index) => {
        return (
          <Grid item key={index}>
            <ProductCard productData={d} ribbonFormatter={ribbonFormatter} />
          </Grid>
        );
      })}
    </Grid>
  );
}
