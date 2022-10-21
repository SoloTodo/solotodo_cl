import { Alert, Stack, Typography } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import { Product } from "src/frontend-utils/types/product";

export default function ProductWarnings({ product }: { product: Product }) {
  return product.specs.warnings ? (
    <Stack spacing={0.5}>
      {Array.isArray(product.specs.warnings) &&
        product.specs.warnings.map((w, index) => (
          // <Alert key={index} severity="warning">
          //   {w}
          // </Alert>
          <Stack
            key={index}
            direction="row"
            spacing={1}
            sx={{
              background: "rgba(217, 142, 44, 0.1)",
              borderRadius: 0.5,
              padding: 1
            }}
          >
            <WarningIcon color="warning" fontSize="small" />
            <Typography variant="body2">{w}</Typography>
          </Stack>
        ))}
    </Stack>
  ) : null;
}
