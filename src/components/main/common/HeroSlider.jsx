import React, { useEffect, useState } from 'react';
import styles from './carousel.module.css';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const slidesData = [
  {
    image: '/assets/img/services/service-slider-1.webp',
    caption: 'Family Law',
  },
  {
    image: '/assets/img/services/service-slider-2.webp',
    caption: 'Property Law',
  },
  {
    image: '/assets/img/services/service-slider-3.webp',
    caption: 'Traffic Law',
  },
  {
    image: '/assets/img/services/service-slider-4.webp',
    caption: 'Administrative Law',
  },
  {
    image: '/assets/img/services/service-slider-5.webp',
    caption: 'Criminal Law',
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

  // 🔁 Autoplay effect
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // 5000ms = 5 seconds
    return () => clearInterval(interval); // Clean up on unmount
  }, [current]);

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

      {/* Controls Wrapper */}
      <div className={styles.controlsWrapper}>
        <button
          className={`${styles.carouselButton} ${styles.prev}`}
          onClick={prevSlide}
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>

        <div className={styles.sliderDots}>
          {slidesData.map((_, index) => (
            <span
              key={index}
              className={`${styles.sliderDot} ${
                index === current ? styles.activeDot : ''
              }`}
              onClick={() => updateSlides(index)}
            />
          ))}
        </div>

        <button
          className={`${styles.carouselButton} ${styles.next}`}
          onClick={nextSlide}
        >
          <ArrowRight className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}
