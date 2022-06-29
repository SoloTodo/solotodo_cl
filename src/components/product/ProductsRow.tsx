import { Grid } from "@mui/material";
import { Block } from "src/sections/mui/Block";

import ProductCard from "./ProductCard";
import { ProductsData } from "./types";

export default function ProductsRow({
  title,
  data,
  ribbonFormatter,
}: {
  title: string;
  data: ProductsData[];
  ribbonFormatter?: Function;
}) {
  return (
    <Block title={title}>
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
    </Block>
  );
}
