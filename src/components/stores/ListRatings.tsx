import { Stack } from "@mui/material";
import { Key, useContext } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { Rating } from "src/frontend-utils/types/ratings";
import RatingCard from "./RatingCard";

export default function ApiFormListRatings() {
  const context = useContext(ApiFormContext);
  const data = context.currentResult ? context.currentResult.results : [];

  return (
    <Stack spacing={2}>
      {data.map((d: Rating, index: Key) => (
        <RatingCard key={index} rating={d} />
      ))}
    </Stack>
  );
}
