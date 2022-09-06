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
import { Store } from "src/frontend-utils/types/store";

export type PagintationData = {
  count: number;
  next: string;
  previous: string;
  results: any[];
};

export default function ProductOrStoreRatingDrawer({
  productOrStore,
  onClose,
  onNewComment,
  isStore,
}: {
  productOrStore: Product | Store;
  onClose: VoidFunction;
  onNewComment?: VoidFunction;
  isStore?: boolean;
}) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PagintationData | null>(null);

  useEffect(() => {
    const urlExtension = isStore
      ? `stores=${productOrStore.id}`
      : `with_product_rating_only=1&products=${productOrStore.id}`;
    fetchJson(
      `${constants.apiResourceEndpoints.ratings}?${urlExtension}&page_size=5&page=${page}`
    ).then((res) => setData(res));
  }, [isStore, page, productOrStore.id]);

  return (
    <Stack spacing={1} width={{ sx: "100%", sm: 400 }} padding={2}>
      <IconButton style={{ alignSelf: "end" }} onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <Typography variant="h5" color="text.extra" fontWeight={700}>
        {productOrStore.name}
      </Typography>
      {!isStore && <ProductRatingSummary productOrStore={productOrStore} />}
      <Grid container>
        {data &&
          data.results.map((result, index) => (
            <Grid key={index} item xs={12}>
              <ProductComment rating={result} isStore={isStore} />
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
      {onNewComment && <ProductNewCommentButton onClick={onNewComment} />}
    </Stack>
  );
}
