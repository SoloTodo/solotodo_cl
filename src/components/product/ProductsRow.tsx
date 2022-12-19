import { useEffect, useState } from "react";
import Slider from "react-slick";
import { fetchJson } from "src/frontend-utils/network/utils";
import { useWindowWidth } from "@react-hook/window-size";
import useSettings from "src/hooks/useSettings";
import { Block } from "src/sections/mui/Block";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import ProductCard from "./ProductCard";
import { ProductsData } from "./types";
import { Box, IconButton } from "@mui/material";
import styles from "../../styles/ProductsRow.module.css";

function SampleNextArrow(props: any) {
  const { onClick } = props;
  return (
    <IconButton
      size="large"
      sx={{
        padding: 2,
        top: "45%",
        position: "absolute",
        right: "-4%",
      }}
      onClick={onClick}
    >
      <ArrowForwardIosIcon />
    </IconButton>
  );
}

function SamplePrevArrow(props: any) {
  const { onClick } = props;
  return (
    <IconButton
      size="large"
      sx={{
        padding: 2,
        top: "45%",
        position: "absolute",
        left: "-4%",
        zIndex: 1,
      }}
      onClick={onClick}
    >
      <ArrowBackIosIcon />
    </IconButton>
  );
}

export default function ProductsRow({
  title,
  url,
  sliceValue,
  ribbonFormatter,
  actionHref,
}: {
  title: string;
  url: string;
  sliceValue: number;
  actionHref?: string;
  ribbonFormatter?: Function;
}) {
  const width = useWindowWidth();
  const [data, setData] = useState<ProductsData[]>([]);
  const { prefExcludeRefurbished, prefStores } = useSettings();
  let storesUrl = "";
  for (const store of prefStores) {
    storesUrl += `&stores=${store}`;
  }

  useEffect(() => {
    const myAbortController = new AbortController();

    fetchJson(
      `${url}&exclude_refurbished=${prefExcludeRefurbished}${storesUrl}`,
      { signal: myAbortController.signal }
    )
      .then((response) => setData(response.results))
      .catch((_) => {});

    return () => {
      myAbortController.abort();
    };
  }, [prefExcludeRefurbished, storesUrl, url]);

  let settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 500,
    dots: true,
    infinite: false,
    variableWidth: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  if (width < 550)
    settings = {
      ...settings,
      nextArrow: <></>,
      prevArrow: <></>,
    };

  return data.length !== 0 &&
    data[0].product_entries[0].metadata.score === 0 ? null : (
    <Block
      title={title}
      actionHref={actionHref ? actionHref : "#"}
      sx={{ maxWidth: 1270, position: "relative" }}
    >
      <Box paddingX={{ xs: 0, sm: 3 }} marginBottom={5}>
        <Slider {...settings} className={styles.slick_dots}>
          {data.slice(0, sliceValue).map((d, index) => {
            return (
              <Box key={index} paddingRight={3}>
                <ProductCard
                  productData={d}
                  ribbonFormatter={ribbonFormatter}
                />
              </Box>
            );
          })}
        </Slider>
      </Box>
    </Block>
  );
}
