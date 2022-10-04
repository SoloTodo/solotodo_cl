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
  var settings = {
    dots: true,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 850,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box
      sx={{
        maxWidth: 1270,
        marginBottom: 1,
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
