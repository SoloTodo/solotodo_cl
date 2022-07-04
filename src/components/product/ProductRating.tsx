import { useMemo, useState } from "react";
import { Button, Drawer, Grid, Stack, Typography } from "@mui/material";
import { constants } from "src/config";
import { fetchJson } from "src/frontend-utils/network/utils";
import { Product } from "src/frontend-utils/types/product";
import { Rating } from "src/frontend-utils/types/ratings";
import ProductComment from "./ProductComment";
import ProductRatingSummary from "./ProductRatingSummary";
import ProductRatingDrawer from "./ProductRatingDrawer";
import ProductNewCommentButton from "./ProductNewCommentButton";

export default function ProductRating({ product }: { product: Product }) {
  const [ratingsData, setRatingsData] = useState<Rating[]>([]);
  const [openMoreCommentsDrawer, setOpenMoreCommentsDrawer] = useState(false);

  useMemo(() => {
    fetchJson(
      `${constants.apiResourceEndpoints.ratings}?page_size=6&with_product_rating_only=1&products=${product.id}`
    ).then((res) => setRatingsData(res.results));
  }, [product.id]);

  return ratingsData.length !== 0 ? (
    <Stack spacing={1}>
      <Typography variant="h5">{product.name}</Typography>
      <ProductRatingSummary product={product} />
      <Grid container>
        {ratingsData.map((result, index) => (
          <Grid key={index} item xs={12} md={6}>
            <ProductComment
              rating={result.product_rating}
              comment={result.product_comments}
            />
          </Grid>
        ))}
      </Grid>
      <Stack spacing={2} mt={2} alignItems="center">
        <Button>
          <Typography
            variant="h5"
            color="text.primary"
            onClick={() => setOpenMoreCommentsDrawer(true)}
          >
            Ver más comentarios
          </Typography>
        </Button>
        <ProductNewCommentButton onClick={() => {}} />
      </Stack>
      <Drawer
        anchor="right"
        open={openMoreCommentsDrawer}
        onClose={() => setOpenMoreCommentsDrawer(false)}
      >
        <ProductRatingDrawer
          product={product}
          onClose={() => setOpenMoreCommentsDrawer(false)}
          onNewComment={() => {}}
        />
      </Drawer>
    </Stack>
  ) : null;
}
