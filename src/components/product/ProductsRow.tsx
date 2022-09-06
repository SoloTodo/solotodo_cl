import { Grid } from "@mui/material";
import { Block } from "src/sections/mui/Block";

import ProductCard from "./ProductCard";
import { ProductsData } from "./types";

export default function ProductsRow({
  title,
  data,
  ribbonFormatter,
  actionHref,
}: {
  title: string;
  data: ProductsData[];
  actionHref?: string;
  ribbonFormatter?: Function;
}) {
  return data.length !== 0 &&
    data[0].product_entries[0].metadata.score === 0 ? null : (
    <Block title={title} actionHref={actionHref ? actionHref : "#"}>
      <Grid
        container
        spacing={{ xs: 2, lg: 3 }}
        justifyContent="center"
        wrap="nowrap"
        overflow="auto"
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
