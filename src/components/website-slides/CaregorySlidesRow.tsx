import { Grid } from "@mui/material";
import { NavigationItemProps } from "src/contexts/NavigationContext";
import CategoryCard from "./CategoryCard";

export default function CategorySlidesRow({
  categorySlides,
}: {
  categorySlides: NavigationItemProps[];
}) {
  return (
    <Grid
      container
      spacing={{ xs: 3, md: 4 }}
      overflow="auto"
      maxWidth={1270}
      paddingBottom={5}
      paddingTop={1}
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
