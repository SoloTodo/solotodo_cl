import { Stack, Typography } from "@mui/material";
import { Product } from "src/frontend-utils/types/product";
import ProductRatingSummary from "./ProductRatingSummary";

export default function ProductRating({ product }: { product: Product }) {
  return (
    <Stack spacing={1}>
      <Typography variant="h5">{product.name}</Typography>
      <ProductRatingSummary product={product} />
    </Stack>
  );
}
