import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import CustomChip from "src/sections/mui/Chip";
import Image from "../Image";
import currency from "currency.js";
import { ProductsData } from "./types";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/store/hooks";
import { useState } from "react";
import { constants } from "src/config";
import Handlebars from "handlebars";
import styles from "../../styles/ProductPage.module.css";
import { Category } from "src/frontend-utils/types/store";

type ProductProps = {
  productData: ProductsData;
  loading?: boolean;
  ribbonFormatter?: Function;
  browsePurpose?: boolean;
  categoryBrowseResult?: Boolean;
};

export default function ProductCard(props: ProductProps) {
  const {
    productData,
    loading,
    browsePurpose,
    ribbonFormatter,
    categoryBrowseResult,
  } = props;
  const [active, setActive] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const { product_entries } = productData;

  const options = product_entries.map((e, index) => {
    const categoryId = apiResourceObjects[e.product.category].id;
    const specName = (
      constants.categoryBrowseParameters as Record<number, any>
    )[categoryId];
    return {
      label:
        typeof specName === "undefined"
          ? e.product.name
          : e.product.specs[specName.bucketProductLabelField],
      value: index,
    };
  });

  const { product, metadata } = product_entries[active];
  const category = apiResourceObjects[product.category] as Category;

  const tags: string[] = product.specs.tags ? product.specs.tags : [];

  const priceCurrency = metadata.prices_per_currency.find((p) =>
    p.currency.includes(`/${constants.clpCurrencyId}/`)
  );
  const offerPrice = priceCurrency ? priceCurrency.offer_price : 0;

  const template = categoryBrowseResult
    ? category.browse_result_template
    : category.short_description_template;

  const formatSpecs = () => {
    let html = "";
    if (template) {
      const templateHandler = Handlebars.compile(template);
      html = templateHandler(product.specs);
    }

    return { __html: html };
  };

  const categoryWithVariants = category.id === 6 || category.id === 14;

  return metadata.score === 0 && !browsePurpose && active === 0 ? null : (
    <Card
      sx={{
        width: { xs: browsePurpose ? 300 : "90%", sm: 270, md: 292 },
        height: "100%",
      }}
    >
      <NextLink href={`/products/${product.id}-${product.slug}`} passHref>
        <CardActionArea
          sx={{
            height: options.length > 1 ? "87%" : "100%",
          }}
        >
          <Box
            height={
              options.length > 1 || !categoryWithVariants ? "100%" : "87%"
            }
            sx={{ position: "relative" }}
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
                src={
                  loading || isLoaded
                    ? "https://zone-assets-api.vercel.app/assets/img_placeholder.svg"
                    : `${product.url}picture/?width=300&height=200`
                }
                alt={
                  loading || isLoaded
                    ? "https://zone-assets-api.vercel.app/assets/img_placeholder.svg"
                    : `${product.url}picture/?width=300&height=200`
                }
                loading="eager"
                onLoad={() => setIsLoaded(false)}
              />
            </Box>
            <CardContent sx={{ p: "1rem" }}>
              <Stack
                direction="row"
                spacing={1}
                height={24}
                sx={{ overflow: "auto", flexWrap: "nowrap" }}
              >
                {tags.map((t, index) => (
                  <CustomChip key={index} label={t} />
                ))}
              </Stack>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                color="text.primary"
                fontWeight={500}
                height={60}
                sx={{
                  paddingTop: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {product.name}
              </Typography>

              <div
                className={
                  browsePurpose ? styles.product_specs : "short-description"
                }
                dangerouslySetInnerHTML={formatSpecs()}
                style={
                  categoryBrowseResult
                    ? {
                        // height: "100%",
                        // overflow: "hidden",
                        // textOverflow: "ellipsis",
                        // display: "-webkit-box",
                        // WebkitLineClamp: "9",
                        // WebkitBoxOrient: "vertical",
                      }
                    : {
                        height: 40,
                        color: "#757b80",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "2",
                        WebkitBoxOrient: "vertical",
                      }
                }
              />
              <Box height={45} />
              <Typography
                variant="h2"
                component="div"
                fontWeight={500}
                sx={{
                  position: "absolute",
                  bottom: 0,
                }}
              >
                {currency(offerPrice, {
                  separator: ".",
                  precision: 0,
                }).format()}
              </Typography>
            </CardContent>
          </Box>
        </CardActionArea>
      </NextLink>
      {categoryWithVariants || !browsePurpose ? (
        options.length > 1 ? (
          <CardActions>
            <Select
              value={options[active].value}
              style={{ width: "100%" }}
              onChange={(evt) => {
                setIsLoaded(true);
                setActive(Number(evt.target.value));
              }}
            >
              {options.map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
          </CardActions>
        ) : (
          <Box height={browsePurpose ? 60 : 70} />
        )
      ) : null}
    </Card>
  );
}
