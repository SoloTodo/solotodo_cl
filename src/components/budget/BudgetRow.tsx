import NextLink from "next/link";
import { Box, Button, Grid, Link, MenuItem, Select } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function BudgetRow() {
  const category = { slug: "video_cards", name: "Tarjeta de video" };

  return (
    <Box
      sx={{
        border: "1px solid #F2F2F2",
        borderRadius: "4px",
      }}
    >
      <Box
        sx={{
          bgcolor: "#F2F2F2",
          p: 0.5,
          borderEndEndRadius: 4,
          display: "inline-block",
        }}
      >
        <NextLink
          href={`/browse?category_slug=${category.slug}`}
          as={`/${category.slug}`}
          passHref
        >
          <Link color="secondary">{category.name}</Link>
        </NextLink>
      </Box>
      <Grid container spacing={2} padding={3} paddingTop={2}>
        <Grid item xs={4}>
          <Select name="Producto" fullWidth inputProps={{ sx: { padding: 1 } }}>
            <MenuItem>Producto 1</MenuItem>
            <MenuItem>Producto 2</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={1.5}>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            fullWidth
            sx={{ textTransform: "none", height: "100%" }}
          >
            Ir al producto
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Select
            name="Tienda"
            fullWidth
            native
            inputProps={{ sx: { padding: 1 } }}
          >
            <option>Tienda 1</option>
            <option>Tienda 2</option>
          </Select>
        </Grid>
        <Grid item xs={1.5}>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            fullWidth
            sx={{ textTransform: "none", height: "100%" }}
          >
            Ir a la tienda
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button
            variant="contained"
            color="error"
            size="small"
            fullWidth
            sx={{ textTransform: "none", height: "100%" }}
            endIcon={<ArrowDropDownIcon />}
          >
            Eliminar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
