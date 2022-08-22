import { Grid } from "@mui/material";
import RecentCard from "./RecentCard";
import { Slide } from "./types";

export default function RecentSlidesRow({
  recentSlides,
}: {
  recentSlides: Slide[];
}) {
  return (
    <Grid
      container
      spacing={1}
      justifyContent="space-between"
      wrap="nowrap"
      overflow="auto"
    >
      {recentSlides.map((d, index) => {
        return (
          <Grid item key={index}>
            <RecentCard recentData={d} />
          </Grid>
        );
      })}
    </Grid>
  );
}
