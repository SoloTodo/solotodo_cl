import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchJson } from "src/frontend-utils/network/utils";
import useSettings from "src/hooks/useSettings";
import { Block } from "src/sections/mui/Block";

import ProductCard from "./ProductCard";
import { ProductsData } from "./types";

export default function ProductsRowGrid({
  title,
  url,
  sliceValue,
  ribbonFormatter,
  actionHref,
}: {
  title: string;
  url: string;
  sliceValue: number;
  actionHref?: string;
  ribbonFormatter?: Function;
}) {
  const [data, setData] = useState<ProductsData[]>([]);
  const { prefExcludeRefurbished, prefStores } = useSettings();
  let storesUrl = "";
  for (const store of prefStores) {
    storesUrl += `&stores=${store}`;
  }

  useEffect(() => {
    const myAbortController = new AbortController();

    fetchJson(
      `${url}&exclude_refurbished=${prefExcludeRefurbished}${storesUrl}`,
      { signal: myAbortController.signal }
    )
      .then((response) => setData(response.results))
      .catch((_) => {});

    return () => {
      myAbortController.abort();
    };
  }, [prefExcludeRefurbished, storesUrl, url]);

  return data.length !== 0 &&
    data[0].product_entries[0].metadata.score === 0 ? null : (
    <Block title={title} actionHref={actionHref ? actionHref : "#"}>
      <Box paddingTop={2}>
        <Grid
          container
          spacing={{ xs: 2, lg: 3 }}
          justifyContent="start"
          wrap="nowrap"
          overflow="auto"
        >
          {data.slice(0, sliceValue).map((d, index) => {
            return (
              <Grid item key={index} xs={12}>
                <ProductCard
                  productData={d}
                  ribbonFormatter={ribbonFormatter}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Block>
  );
}
