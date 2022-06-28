import { useState } from "react";
// @mui
import { Card } from "@mui/material";
// components
import Image, { ImageRato } from "../../components/Image";
import { CarouselArrowIndex } from "../../components/carousel";

// ----------------------------------------------------------------------

export default function CarouselBasic({ images, ratio }: { images: string[] | null, ratio?: ImageRato }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    if (images === null) return;

    if (currentIndex !== 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(images.length - 1);
    }
  };

  const handleNext = () => {
    images !== null && setCurrentIndex((currentIndex + 1) % images.length);
  };

  return (
    <Card>
      <Image
        alt={images!== null && images.length !== 0 ? images[currentIndex] : ""}
        src={images!== null && images.length !== 0 ? images[currentIndex] : ""}
        ratio={ratio ? ratio : "1/1"}
      />

      {images !== null && images.length !== 0 && (
        <CarouselArrowIndex
          index={currentIndex}
          total={images.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
    </Card>
  );
}
