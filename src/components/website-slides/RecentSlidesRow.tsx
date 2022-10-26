import { Box } from "@mui/material";
import Slider from "react-slick";
import RecentCard from "./RecentCard";
import { Slide } from "./types";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function RecentSlidesRow({
  recentSlides,
}: {
  recentSlides: Slide[];
}) {
  const slidesLen = recentSlides.length;
  var settings = {
    slidesToShow: slidesLen < 3 ? slidesLen : 3,
    speed: 500,
    dots: true,
    arrows: false,
    infinite: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: slidesLen < 2 ? slidesLen : 2,
          centerMode: true,
          centerPadding: "20px",
        },
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "20px",
        },
      },
    ],
  };

  return (
    <Box
      sx={{
        maxWidth: 1270,
        marginBottom: 5,
      }}
    >
      <Slider {...settings}>
        {recentSlides.map((d, index) => (
          <RecentCard key={index} recentData={d} />
        ))}
      </Slider>
    </Box>
  );
}
