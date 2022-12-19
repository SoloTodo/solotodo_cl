import { Box, Typography } from "@mui/material";
import Slider from "react-slick";
import RecentCard from "./RecentCard";
import { Slide } from "./types";
import { useWindowWidth } from "@react-hook/window-size";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import { fetchJson } from "src/frontend-utils/network/utils";

export default function RecentSlidesRow({
  categoryId,
}: {
  categoryId?: string;
}) {
  const width = useWindowWidth();
  const [recentSlides, setRecentSlides] = useState<Slide[]>([]);

  useEffect(() => {
    const url = categoryId
      ? `website_slides/?categories=${categoryId}&only_active_categories=1`
      : "website_slides/?only_active_home=1";
    fetchJson(url).then((res) => setRecentSlides(res));
  });

  let settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 500,
    dots: true,
    infinite: false,
    variableWidth: true,
    nextArrow: <></>,
    prevArrow: <></>,
  };

  return (
    <>
      <Typography variant="h2" component="h1" fontWeight={400} gutterBottom>
        {recentSlides.length !== 0 && "Lo más reciente"}
      </Typography>
      <Box
        sx={{
          maxWidth: 1270,
          marginBottom: 5,
          marginTop: 1,
        }}
      >
        <Slider {...settings}>
          {recentSlides.map((d, index) => (
            <RecentCard key={index} recentData={d} />
          ))}
        </Slider>
      </Box>
    </>
  );
}
