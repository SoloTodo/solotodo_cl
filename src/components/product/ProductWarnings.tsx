import { Alert, Stack } from "@mui/material";
import { Product } from "src/frontend-utils/types/product";

export default function ProductWarnings({ product }: { product: Product }) {
  return product.specs.warnings ? (
    <Stack spacing={0.5}>
      {Array.isArray(product.specs.warnings) &&
        product.specs.warnings.map((w, index) => (
          <Alert key={index} severity="warning">
            {w}
          </Alert>
        ))}
    </Stack>
  ) : null;
}
