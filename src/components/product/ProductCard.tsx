import {
  Autocomplete,
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CustomChip from "src/sections/mui/Chip";
import Image from "../Image";
import currency from "currency.js";
import { ProductsData } from "./types";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/store/hooks";
import { useState } from "react";
import { constants } from "src/config";

type ProductProps = {
  productData: ProductsData;
  ribbonFormatter?: Function;
};

export default function ProductCard(props: ProductProps) {
  const { productData, ribbonFormatter } = props;
  const [active, setActive] = useState(0);
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const { product_entries } = productData;

  const options = product_entries.map((e, index) => ({
    label: e.product.name,
    value: index,
  }));

  const { product, metadata } = product_entries[active];
  const categoryName = apiResourceObjects[product.category].name;

  const tags = [categoryName];
  const priceCurrency = metadata.prices_per_currency.find((p) => p.currency.includes(`/${constants.clpCurrencyId}/`))
  const offerPrice = priceCurrency ? priceCurrency.offer_price : 0;

  return (
    <Card sx={{ width: 280, height: '100%' }}>
      <CardActionArea href={`/products/${product.id}-${product.slug}`}>
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
              <Typography variant="h5" fontWeight={440}>
                {ribbonFormatter(metadata.score)}
              </Typography>
            </Box>
          )}
          <Image
            ratio="4/3"
            src={`${product.url}picture/?width=300&height=200`}
            alt=""
          />
        </Box>
        <CardContent sx={{ p: "1rem" }}>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1}>
              {tags.map((t, index) => (
                <CustomChip key={index} label={t} />
              ))}
            </Stack>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              color="text.secondary"
              fontWeight={500}
            >
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            </Typography>
          </Stack>
          <Typography variant="h2" component="div" fontWeight={500}>
            {currency(offerPrice, {
              separator: ".",
              precision: 0,
            }).format()}
          </Typography>
        </CardContent>
      </CardActionArea>
      { options.length > 1 && <CardActions>
        <Autocomplete
          value={options[active]}
          options={options}
          renderInput={(params) => <TextField {...params} />}
          renderOption={(props, option) => (
            <li {...props} key={option.value}>
              {option.label}
            </li>
          )}
          disableClearable={true}
          style={{ width: "100%" }}
          onChange={(_evt, newValues) => setActive(newValues.value)}
        />
      </CardActions>}
    </Card>
  );
}
