import { Button, Divider, Rating, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchJson } from "src/frontend-utils/network/utils";
import { Product } from "src/frontend-utils/types/product";
import { Store } from "src/frontend-utils/types/store";

export default function ProductRatingSummary({
  productOrStore,
  setOpenMoreCommentsDrawer,
}: {
  productOrStore: Product | Store;
  setOpenMoreCommentsDrawer?: Function;
}) {
  const [ratingsData, setRatingsData] = useState<{
    average: number;
    count?: number;
  } | null>(null);

  useEffect(() => {
    const myAbortController = new AbortController();
    fetchJson(`${productOrStore.url}average_rating/`, {
      signal: myAbortController.signal,
    })
      .then((res) => setRatingsData(res))
      .catch((_) => {});
    return () => {
      myAbortController.abort();
    };
  }, [productOrStore.url]);

  if (!ratingsData || !ratingsData.count || !ratingsData.average) return null;
  const roundedAverage = Math.round(ratingsData.average * 10) / 10;
  return (
    <Stack direction="row">
      <Button
        onClick={() =>
          setOpenMoreCommentsDrawer ? setOpenMoreCommentsDrawer(true) : {}
        }
        sx={{ justifyContent: "start", padding: 0, paddingRight: 1 }}
        disabled={!setOpenMoreCommentsDrawer}
      >
        <Stack spacing={1} direction="row">
          <Rating
            name="read-only"
            value={roundedAverage}
            precision={0.5}
            readOnly
            size="small"
          />
          <Typography color="text.secondary">{roundedAverage}</Typography>
          <Divider orientation="vertical" flexItem />
          <Typography color="text.secondary">
            {ratingsData.count} Comentarios
          </Typography>
        </Stack>
      </Button>
    </Stack>
  );
}
