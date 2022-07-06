import { Stack, Typography } from "@mui/material";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { Rating } from "src/frontend-utils/types/ratings";
import { useAppSelector } from "src/store/hooks";

const ratingValues: Record<number, string> = {
  1: "Muy malo",
  2: "Malo",
  3: "Normal",
  4: "Muy bueno",
  5: "Excelente",
};

export default function ProductComment({ rating }: { rating: Rating }) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  return (
    <Stack spacing={1} padding={1}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2" color="primary" fontWeight={700}>
          {ratingValues[rating.store_rating]}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {apiResourceObjects[rating.store].name}
        </Typography>
      </Stack>
      <Typography variant="body2">{rating.product_comments}</Typography>
    </Stack>
  );
}
