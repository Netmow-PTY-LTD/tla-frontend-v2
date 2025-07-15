import React, { useState } from 'react';
import styles from './carousel.module.css';
const slidesData = [
  {
    image: 'https://picsum.photos/id/1015/1200/500',
    caption: 'Legal Services for Everyone',
  },
  {
    image: 'https://picsum.photos/id/1025/1200/500',
    caption: 'Protecting Your Rights',
  },
  {
    image: 'https://picsum.photos/id/1033/1200/500',
    caption: 'Family Law Experts',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const updateSlides = (index) => {
    setCurrent(index);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slidesData.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slidesData.length) % slidesData.length);
  };

  const getSlideClass = (index) => {
    const total = slidesData.length;
    if (index === current) return styles.active;
    if (index === (current - 1 + total) % total) return styles.prev;
    if (index === (current + 1) % total) return styles.next;
    return '';
  };

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.carouselContainer}>
        {slidesData.map((slide, index) => (
          <div
            key={index}
            className={`${styles.carouselSlide} ${getSlideClass(index)}`}
          >
            <img src={slide.image} alt={slide.caption} />
            <div className={styles.caption}>{slide.caption}</div>
          </div>
        ))}
      </div>
      <button
        className={`${styles.carouselButton} ${styles.prev}`}
        onClick={prevSlide}
      >
        &#10094;
      </button>
      <button
        className={`${styles.carouselButton} ${styles.next}`}
        onClick={nextSlide}
      >
        &#10095;
      </button>
    </div>
  );
}
