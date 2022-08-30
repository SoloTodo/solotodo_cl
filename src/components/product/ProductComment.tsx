import { Button, Stack, Typography } from "@mui/material";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { Rating } from "src/frontend-utils/types/ratings";
import { PATH_MAIN } from "src/routes/paths";
import { useAppSelector } from "src/store/hooks";
import { fDateTime } from "src/utils/formatTime";

const ratingValues: Record<number, string> = {
  1: "Muy malo",
  2: "Malo",
  3: "Normal",
  4: "Muy bueno",
  5: "Excelente",
};

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
          {ratingValues[rating.store_rating]}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isStore
            ? fDateTime(rating.approval_date!)
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
      <Typography variant="body2">{rating.product_comments}</Typography>
    </Stack>
  );
}
