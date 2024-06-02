import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "./ImageSliderModal.css";

const ImageSliderModal = ({ photos, isOpen, onClose }) => {
  if (!isOpen) return null;

  const images = photos.map((photo) => ({
    original: photo,
    thumbnail: photo,
  }));

  return (
    <div className="sliderModal">
      <div className="sliderOverlay" onClick={onClose}></div>
      <div className="sliderContent">
        <button className="closeButton" onClick={onClose}>
          Закрыть
        </button>
        <ImageGallery items={images} />
      </div>
    </div>
  );
};

export default ImageSliderModal;
