import { Stack } from "@mui/material";
import { Product } from "src/frontend-utils/types/product";
import { Category } from "src/frontend-utils/types/store";
import ProductPriceCard from "./ProductPriceCard";

type ProductPricesProps = {
  product: Product;
  category: Category;
};

export default function ProductPrices({
  product,
  category,
}: ProductPricesProps) {
  return (
    <Stack direction="column" spacing={1}>
      {[1, 2, 3, 4, 5].map((i) => (
        <ProductPriceCard key={i} />
      ))}
    </Stack>
  );
}
