import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import CustomChip from "src/sections/mui/Chip";
import Image from "../Image";
import currency from "currency.js";

type ProductProps = {
  title: string;
  link: string;
  description?: string;
  image_url: string;
  price: string;
  tags: string[];
  ribbonValue?: number;
  ribbonFormatter?: Function;
  rating?: number;
};

export default function ProductCard(props: ProductProps) {
  const {
    title,
    link,
    description,
    image_url,
    price,
    tags,
    ribbonValue,
    ribbonFormatter,
    rating,
  } = props;
  return (
    <Card sx={{ width: 280, height: "100%" }}>
      <CardActionArea href={link} sx={{ height: "100%" }}>
        <Box bgcolor="#fff">
          {ribbonFormatter && (
            <Box
              sx={{
                bgcolor: "#3C5D82",
                p: 0.8,
                borderEndEndRadius: 10,
                display: "inline-block",
              }}
            >
              <Typography variant="h6">
                {ribbonFormatter(ribbonValue)}
              </Typography>
            </Box>
          )}
          <Image ratio="4/3" src={image_url} alt="" />
        </Box>
        <CardContent sx={{ p: "1rem" }}>
          <Stack direction="row" spacing={1}>
            <CustomChip label="Reacondicionado" />
            <CustomChip label="Entel" />
            {/* TODO: que va en los chips? --> categoría */}
          </Stack>
          <Typography gutterBottom variant="h6" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          <Typography gutterBottom variant="h4" component="div">
            {currency(price, {
              separator: '.',
              precision: 0,
            }).format()}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
