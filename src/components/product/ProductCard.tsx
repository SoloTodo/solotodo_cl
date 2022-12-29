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
  useTheme,
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
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";
  const [active, setActive] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const { product_entries } = productData;

  const options = product_entries.map((e, index) => {
    const category = apiResourceObjects[e.product.category];
    if (typeof category === "undefined") {
      return {};
    }
    const specName = (
      constants.categoryBrowseParameters as Record<number, any>
    )[category.id];
    return {
      label:
        typeof specName === "undefined"
          ? e.product.name
          : e.product.specs[specName.bucketProductLabelField],
      value: index,
    };
  });

  const { product, metadata } = product_entries[active];
  const category = apiResourceObjects[product.category] as Category | undefined;

  const tags: string[] = product.specs.tags ? product.specs.tags : [];

  const priceCurrency = metadata.prices_per_currency.find((p) =>
    p.currency.includes(`/${constants.clpCurrencyId}/`)
  );
  const offerPrice = priceCurrency ? priceCurrency.offer_price : 0;

  const template = category
    ? categoryBrowseResult
      ? category.browse_result_template
      : category.short_description_template
    : null;

  const formatSpecs = () => {
    let html = "";
    if (template) {
      const templateHandler = Handlebars.compile(template);
      html = templateHandler(product.specs);
    }

    return { __html: html };
  };

  const categoryWithVariants = category?.id === 6 || category?.id === 14;

  return metadata.score === 0 && !browsePurpose && active === 0 ? null : (
    <Card
      sx={{
        width: { xs: 270, sm: 280, md: browsePurpose ? 288 : 292 },
        height: "100%",
        border: isLight ? "1px solid #EFEFEF" : "1px solid #303030",
        boxShadow: browsePurpose
          ? "0px 4px 32px 4px rgba(0, 0, 0, 0.05)"
          : "0px 0px 0px 0px rgba(0, 0, 0, 0.05)",
        borderRadius: "10px",
        backgroundColor: "background.neutral",
      }}
    >
      <CardActionArea sx={{ height: "100%" }}>
        <Stack height="100%">
          <NextLink href={`/products/${product.id}-${product.slug}`} passHref>
            <a>
              <Box sx={{ position: "relative" }}>
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
                    ratio="16/9"
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
                    paddingY={1}
                    sx={{
                      borderBottom: "1px solid #EFEFEF",
                    }}
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
                    marginBottom={browsePurpose ? 3 : 1}
                    variant="h5"
                    component="div"
                    color="text.primary"
                    fontWeight={500}
                    height={45}
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
                  {categoryBrowseResult && (
                    <Typography
                      variant="h2"
                      component="div"
                      color="text.dim"
                      sx={{
                        paddingBottom: 2,
                      }}
                    >
                      {currency(offerPrice, {
                        separator: ".",
                        precision: 0,
                      }).format()}
                    </Typography>
                  )}
                  <div
                    className={
                      browsePurpose ? styles.product_specs : "short-description"
                    }
                    dangerouslySetInnerHTML={formatSpecs()}
                    style={
                      categoryBrowseResult
                        ? {
                            lineHeight: "14px",
                            fontSize: "12px",
                          }
                        : {
                            lineHeight: "14px",
                            fontSize: "12px",
                            height: 29,
                            color: "#757b80",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: "2",
                            WebkitBoxOrient: "vertical",
                          }
                    }
                  />
                  {!categoryBrowseResult && (
                    <>
                      <Box height={browsePurpose ? 40 : 20} />
                      <Typography
                        variant="h2"
                        component="div"
                        color="text.dim"
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          paddingBottom: 1,
                        }}
                      >
                        {currency(offerPrice, {
                          separator: ".",
                          precision: 0,
                        }).format()}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Box>
            </a>
          </NextLink>
          <Box flexGrow={1} />
          {categoryWithVariants || !browsePurpose ? (
            options.length > 1 ? (
              <CardActions sx={{ width: "100%" }}>
                <Select
                  size="small"
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
              <Box height={browsePurpose ? 20 : 53} />
            )
          ) : null}
        </Stack>
      </CardActionArea>
    </Card>
  );
}
