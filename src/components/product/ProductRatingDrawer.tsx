import { useState } from "react";
import {
  Grid,
  IconButton,
  Stack,
  TablePagination,
  Typography,
} from "@mui/material";
import { constants } from "src/config";
import { Product } from "src/frontend-utils/types/product";
import ProductComment from "./ProductComment";
import CloseIcon from "@mui/icons-material/Close";
import ProductRatingSummary from "./ProductRatingSummary";
import ProductNewCommentButton from "./ProductNewCommentButton";
import { useEffect } from "react";
import { fetchJson } from "src/frontend-utils/network/utils";

export type PagintationData = {
  count: number;
  next: string;
  previous: string;
  results: any[];
};

export default function ProductRatingDrawer({
  product,
  onClose,
  onNewComment,
}: {
  product: Product;
  onClose: VoidFunction;
  onNewComment: VoidFunction;
}) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PagintationData | null>(null);

  useEffect(() => {
    fetchJson(
      `${constants.apiResourceEndpoints.ratings}?with_product_rating_only=1&products=${product.id}&page_size=5&page=${page}`
    ).then((res) => setData(res));
  }, [page, product.id]);

  return (
    <Stack spacing={1} width={400} padding={1}>
      <IconButton style={{ alignSelf: "end" }} onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <Typography variant="h5">{product.name}</Typography>
      <ProductRatingSummary product={product} />
      <Grid container>
        {data &&
          data.results.map((result, index) => (
            <Grid key={index} item xs={12}>
              <ProductComment
                rating={result.product_rating}
                comment={result.product_comments}
              />
            </Grid>
          ))}
      </Grid>
      <TablePagination
        rowsPerPageOptions={[5]}
        count={data ? data.count : 0}
        page={page - 1}
        rowsPerPage={5}
        onPageChange={(_e, v) => setPage(v + 1)}
        component="div"
      />
      <ProductNewCommentButton onClick={onNewComment} />
    </Stack>
  );
}
