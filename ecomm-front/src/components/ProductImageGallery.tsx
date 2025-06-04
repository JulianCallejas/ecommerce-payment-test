import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Box, IconButton, Slide, } from "@mui/material";

interface ProductImageGalleryProps {
  images: string[];
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"right" | "left" | "up" >("right");
  const initialDragX = useRef(0);

  const handlePrevious = () => {
    setDirection("right");
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setDirection("left");
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setDirection("up");
    setCurrentIndex(index);
  };

  const handleOnTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    initialDragX.current = e.touches[0].clientX;
  };

  const handleOnTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const dragX = e.touches[0].clientX;
    if (dragX > initialDragX.current){
      setDirection("right");
      return;
    } 
    handlePrevious();
    
  };

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
        <p>No images available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative h-80 md:h-96 bg-white rounded-lg overflow-hidden">
          <Slide direction={direction} in={true} key={`slide-${images[currentIndex]}`}>
          <img
            src={images[currentIndex]}
            alt={`Product view ${currentIndex + 1}`}
            className="w-full h-full object-contain transition-opacity duration-300 "
            onTouchStart={handleOnTouchStart}
            onTouchMove={handleOnTouchMove}
          />
          </Slide>
        <div className="absolute inset-0 flex items-center justify-between">
          <IconButton
            onClick={handlePrevious}
            className="bg-white bg-opacity-70 hover:bg-opacity-100 transition-all"
            size="large"
          >
            <ChevronLeft className="h-6 w-6" />
          </IconButton>

          <IconButton
            onClick={handleNext}
            className="bg-white bg-opacity-70 hover:bg-opacity-100 transition-all"
            size="large"
          >
            <ChevronRight className="h-6 w-6" />
          </IconButton>
        </div>
      </div>

      <Box className="flex space-x-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <div
            key={index}
            className={`
              h-16 w-16 md:h-20 md:w-20 flex-shrink-0 cursor-pointer rounded-md overflow-hidden transition-all
              ${index === currentIndex && "border-b-2 border-[#172B3C] scale-105 "}
            `}
            onClick={() => handleThumbnailClick(index)}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </Box>
    </div>
  );
};

export default ProductImageGallery;
