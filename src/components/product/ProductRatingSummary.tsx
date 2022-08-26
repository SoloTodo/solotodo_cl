import { Divider, Rating, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchJson } from "src/frontend-utils/network/utils";
import { Product } from "src/frontend-utils/types/product";
import { Store } from "src/frontend-utils/types/store";

export default function ProductRatingSummary({ productOrStore }: { productOrStore: Product | Store }) {
  const [ratingsData, setRatingsData] = useState<{
    average: number;
    count?: number;
  } | null>(null);

  useEffect(() => {
    fetchJson(`${productOrStore.url}average_rating/`).then((res) =>
      setRatingsData(res)
    );
  }, [productOrStore.url]);

  if (!ratingsData || !ratingsData.count) return null;
  const roundedAverage = Math.round(ratingsData.average * 10) / 10;
  return (
    <Stack spacing={1} direction="row" alignItems="center">
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
  );
}
