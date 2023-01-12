import { Button, Card, CardHeader, Stack, Typography } from "@mui/material";
import { Rating } from "src/frontend-utils/types/ratings";
import { PATH_MAIN } from "src/routes/paths";
import { fDateTime } from "src/utils/formatTime";
import { ratingValues } from "src/utils/ratingValues";

export default function RatingCard({ rating }: { rating: Rating }) {
  return (
    <Stack padding={1} maxWidth={700}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body1" color="primary" fontWeight={700}>
          {ratingValues[rating.store_rating]}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {fDateTime(rating.approval_date!)}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1}>
        <Button
          href={`${PATH_MAIN.products}/${rating.product.id}`}
          size="small"
          color="info"
        >
          {rating.product.name}
        </Button>
      </Stack>

      <Typography variant="body1">{rating.store_comments}</Typography>
    </Stack>
  );
}
