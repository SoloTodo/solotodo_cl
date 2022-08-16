import { Grid } from "@mui/material";
import CategoryCard from "./CategoryCard";
import { Slide } from "./types";

export default function CategorySlidesRow({
  categorySlides,
}: {
  categorySlides: Slide[];
}) {
  return (
    <Grid
      container
      spacing={1}
      justifyContent="space-between"
      wrap="nowrap"
      overflow="scroll"
    >
      {categorySlides.map((d, index) => {
        return (
          <Grid item key={index} xs={12} sm={6}>
            <CategoryCard categoryData={d} />
          </Grid>
        );
      })}
    </Grid>
  );
}
