import { Grid } from "@mui/material";
import { Product } from "src/frontend-utils/types/product";
import ProductCard from "./ProductCard";

type PricesPerCurrency = {
  currency: string;
  normal_price: string;
  offer_price: string;
};

type metadata = {
  score: number;
  normal_price_usd: string;
  offer_price_usd: string;
  prices_per_currency: PricesPerCurrency[];
};

type ExtendedProduct = Product & {
  brand_id: number;
  brand_name: string;
  name_analyzed: string;
  specs: Record<string, any>;
};

type Data = {
  bucket: string;
  product_entries: {
    metadata: metadata;
    product: ExtendedProduct;
  }[];
};

export default function ProductsRow({
  data,
  ribbonFormatter,
}: {
  data: Data[];
  ribbonFormatter?: Function;
}) {
  return (
    <Grid container spacing={2} justifyContent="space-around">
      {data.map((d, index) => {
        const { product_entries } = d;
        const { metadata, product } = product_entries[0];
        return (
          <Grid item key={index}>
            <ProductCard
              title={product.name}
              link={`/products/${product.id}-${product.slug}`}
              image_url={`${product.url}picture/?width=300&height=200`}
              price={metadata.prices_per_currency[0].offer_price}
              tags={[]}
              ribbonValue={metadata.score}
              ribbonFormatter={ribbonFormatter}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}
