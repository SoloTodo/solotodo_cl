import { Button, Stack, Typography } from "@mui/material";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { Rating } from "src/frontend-utils/types/ratings";
import { PATH_MAIN } from "src/routes/paths";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { fDateTime } from "src/utils/formatTime";
import { ratingValues } from "src/utils/ratingValues";

export default function ProductComment({
  rating,
  isStore,
}: {
  rating: Rating;
  isStore?: boolean;
}) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  return (
    <Stack padding={1}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2" color="primary" fontWeight={700}>
          {ratingValues[isStore ? rating.store_rating : rating.product_rating]}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isStore
            ? fDateTime(rating.creation_date)
            : apiResourceObjects[rating.store].name}
        </Typography>
      </Stack>
      {isStore && (
        <Stack direction="row" spacing={1}>
          <Button
            href={`${PATH_MAIN.products}/${rating.product.id}`}
            size="small"
            color="info"
          >
            {rating.product.name}
          </Button>
        </Stack>
      )}
      <Typography variant="body2">
        {isStore ? rating.store_comments : rating.product_comments}
      </Typography>
    </Stack>
  );
}
