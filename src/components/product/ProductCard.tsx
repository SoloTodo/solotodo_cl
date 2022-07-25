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
import { CategoryTemplate, ProductsData } from "./types";
import {
  getApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/store/hooks";
import { useState } from "react";
import { constants } from "src/config";
import Handlebars from "handlebars";

type ProductProps = {
  productData: ProductsData;
  ribbonFormatter?: Function;
  browsePurpose?: boolean;
};

export default function ProductCard(props: ProductProps) {
  const { productData, browsePurpose, ribbonFormatter } = props;
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
  const priceCurrency = metadata.prices_per_currency.find((p) =>
    p.currency.includes(`/${constants.clpCurrencyId}/`)
  );
  const offerPrice = priceCurrency ? priceCurrency.offer_price : 0;

  const template =
    (
      getApiResourceObjects(
        apiResourceObjects,
        "category_templates"
      ) as unknown as CategoryTemplate[]
    ).filter(
      (ct) =>
        ct.category == product.category &&
        ct.website === `${constants.apiResourceEndpoints.websites}2/` &&
        ct.purpose ===
          (browsePurpose
            ? constants.categoryBrowseResultPurposeUrl
            : constants.shortDescriptionPurposeUrl)
    )[0] || null;

  const formatSpecs = () => {
    let html = "";
    if (template) {
      const templateHandler = Handlebars.compile(template.body);
      html = templateHandler(product.specs);
    }

    return { __html: html };
  };

  return (
    <Card sx={{ width: 280, height: "100%" }}>
      <CardActionArea
        href={`/products/${product.id}-${product.slug}`}
        sx={options.length > 1 ? { height: "85%" } : { height: "100%" }}
      >
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
              <Typography variant="h5" fontWeight={440} color="#fff">
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
            {/* Ver el css en el tipo browse */}
            <div
              className="short-description"
              dangerouslySetInnerHTML={formatSpecs()}
              style={{ color: "#757b80" }}
            />
          </Stack>
          <Typography variant="h2" component="div" fontWeight={500}>
            {currency(offerPrice, {
              separator: ".",
              precision: 0,
            }).format()}
          </Typography>
        </CardContent>
      </CardActionArea>
      {options.length > 1 && (
        <CardActions>
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
        </CardActions>
      )}
    </Card>
  );
}
