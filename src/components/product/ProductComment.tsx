import { Stack, Typography } from "@mui/material";

const ratingValues: Record<number, string> = {
  1: "Muy malo",
  2: "Malo",
  3: "Normal",
  4: "Muy bueno",
  5: "Excelente",
};

export default function ProductComment({
  rating,
  comment,
}: {
  rating: number;
  comment: string;
}) {
  return (
    <Stack spacing={1} padding={1}>
      <Stack>
        <Typography variant="body2" color="primary" fontWeight={700}>
          {ratingValues[rating]}
        </Typography>
        <Typography variant="body2">{comment}</Typography>
      </Stack>
    </Stack>
  );
}
