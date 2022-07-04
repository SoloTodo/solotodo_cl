import { Button, IconButton, Stack, Typography } from "@mui/material";
import { constants } from "src/config";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import { Product } from "src/frontend-utils/types/product";
import ProductRatingGrid from "./ProductRatingGrid";
import CloseIcon from "@mui/icons-material/Close";

import ProductRatingSummary from "./ProductRatingSummary";
import ProductNewCommentButton from "./ProductNewCommentButton";

export default function ProductRatingDrawer({
  product,
  onClose,
  onNewComment
}: {
  product: Product;
  onClose: VoidFunction;
  onNewComment: VoidFunction;
}) {
  const fieldMetadata = [{ fieldType: "pagination" as "pagination" }];

  return (
    <Stack spacing={1} width={400} padding={1}>
      <IconButton style={{ alignSelf: "end" }} onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <Typography variant="h5">{product.name}</Typography>
      <ProductRatingSummary product={product} />
      <ApiFormComponent
        fieldsMetadata={fieldMetadata}
        endpoint={`${constants.apiResourceEndpoints.ratings}?with_product_rating_only=1&products=${product.id}`}
      >
        <ProductRatingGrid />
      </ApiFormComponent>
      <ProductNewCommentButton onClick={onNewComment} />
    </Stack>
  );
}
