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
import ProductNewCommentDrawer from "./ProductNewCommentDrawer";

export default function ProductRating({
  product,
  openNewCommentDrawer,
  setOpenNewCommentDrawer,
}: {
  product: Product;
  openNewCommentDrawer: boolean;
  setOpenNewCommentDrawer: Function;
}) {
  const [ratingsData, setRatingsData] = useState<Rating[]>([]);
  const [openMoreCommentsDrawer, setOpenMoreCommentsDrawer] = useState(false);

  useMemo(() => {
    fetchJson(
      `${constants.apiResourceEndpoints.ratings}?page_size=6&with_product_rating_only=1&products=${product.id}`
    ).then((res) => setRatingsData(res.results));
  }, [product.id]);

  return (
    <Stack spacing={1}>
      {ratingsData.length !== 0 ? (
        <>
          <Typography variant="h5">{product.name}</Typography>
          <ProductRatingSummary product={product} />
          <Grid container>
            {ratingsData.map((result, index) => (
              <Grid key={index} item xs={12} md={6}>
                <ProductComment rating={result} />
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
            <ProductNewCommentButton
              onClick={() => setOpenNewCommentDrawer(true)}
            />
          </Stack>
          <Drawer
            anchor="right"
            open={openMoreCommentsDrawer}
            onClose={() => setOpenMoreCommentsDrawer(false)}
          >
            <ProductRatingDrawer
              product={product}
              onClose={() => setOpenMoreCommentsDrawer(false)}
              onNewComment={() => setOpenNewCommentDrawer(true)}
            />
          </Drawer>
        </>
      ) : null}
      <Drawer
        anchor="right"
        open={openNewCommentDrawer}
        onClose={() => setOpenNewCommentDrawer(false)}
      >
        <ProductNewCommentDrawer
          product={product}
          onClose={() => setOpenNewCommentDrawer(false)}
        />
      </Drawer>
    </Stack>
  );
}
