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
      overflow="auto"
    >
      {categorySlides.map((d, index) => {
        return (
          <Grid item key={index} xs={12} md={6}>
            <CategoryCard categoryData={d} />
          </Grid>
        );
      })}
    </Grid>
  );
}
