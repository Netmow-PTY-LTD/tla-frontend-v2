'use client';

import { useEffect, useRef, useState } from 'react';
import '@/styles/slider.css';
import ResponseSkeleton from '@/app/lawyer/dashboard/my-responses/_components/ResponseSkeleton';

const testimonials = [
  {
    image: '/assets/img/testimonials/testimonial-1.webp',
    name: 'Alicia Green',
    rating: 5,
    text: 'Amazing legal service. Fast and professional.',
  },
  {
    image: '/assets/img/testimonials/testimonial-2.webp',
    name: 'Mark Benson',
    rating: 4,
    text: 'Best legal experience I’ve had. Highly recommend.',
  },
  {
    image: '/assets/img/testimonials/testimonial-3.webp',
    name: 'Sara Lee',
    rating: 5,
    text: 'Very supportive and timely updates.',
  },
  {
    image: '/assets/img/testimonials/testimonial-4.webp',
    name: 'John Smith',
    rating: 4,
    text: 'Confident, clear, and trustworthy advice.',
  },
  {
    image: '/assets/img/testimonials/testimonial-5.webp',
    name: 'Emily Reed',
    rating: 5,
    text: 'Truly helpful legal team. Great results.',
  },
  {
    image: '/assets/img/testimonials/testimonial-6.webp',
    name: 'Paul Stone',
    rating: 3,
    text: 'Listened, understood, and delivered perfectly.',
  },
  {
    image: '/assets/img/testimonials/testimonial-7.webp',
    name: 'Jasmine Wu',
    rating: 5,
    text: 'Professional, friendly, and results-driven.',
  },
];

const MAX_VISIBLE_DOTS = 7;
const fixedSlots = ['img1', 'img2', 'img3', 'img4', 'img5', 'img6'];

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [allLoaded, setAllLoaded] = useState(false);
  const intervalRef = useRef(null);
  const sliderRef = useRef(null);
  const activeCardRef = useRef(null);

  // 1️⃣ Preload all images and set initial images only once
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = testimonials.map((t) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = t.image;
          img.onload = resolve;
          img.onerror = resolve;
        });
      });

      await Promise.all(imagePromises);
      setImages(fixedSlots.map((_, i) => testimonials[i + 1]));
      setAllLoaded(true);
    };

    loadImages();
  }, []);

  // 2️⃣ Slide rendering and interval only when all images are loaded
  useEffect(() => {
    if (!allLoaded) return;

    const nextSlide = () => {
      const nextIndex =
        currentIndex + 1 >= MAX_VISIBLE_DOTS ||
        currentIndex + 1 >= testimonials.length
          ? 0
          : currentIndex + 1;
      fadeToSlide(nextIndex);
    };

    intervalRef.current = setInterval(nextSlide, 2000);
    const slider = sliderRef.current;

    const pause = () => clearInterval(intervalRef.current);
    const resume = () => (intervalRef.current = setInterval(nextSlide, 2000));

    slider.addEventListener('mouseenter', pause);
    slider.addEventListener('mouseleave', resume);

    let startX = 0;
    const onTouchStart = (e) => (startX = e.touches[0].clientX);
    const onTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      if (endX < startX - 50 || endX > startX + 50) nextSlide();
    };

    slider.addEventListener('touchstart', onTouchStart);
    slider.addEventListener('touchend', onTouchEnd);

    return () => {
      clearInterval(intervalRef.current);
      slider.removeEventListener('mouseenter', pause);
      slider.removeEventListener('mouseleave', resume);
      slider.removeEventListener('touchstart', onTouchStart);
      slider.removeEventListener('touchend', onTouchEnd);
    };
  }, [allLoaded, currentIndex]);

  const updateSlide = (index) => {
    const targetImage = images.slice();
    targetImage[(step - 1) % 6] = testimonials[currentIndex];
    setImages(targetImage);
    setCurrentIndex(index);
    setStep((prev) => (prev % 6) + 1);
  };

  const fadeToSlide = (index) => {
    if (index === currentIndex) return;
    const slider = sliderRef.current;
    const currentCard = activeCardRef.current;
    if (!slider || !currentCard) return;

    // Clone current card for outgoing animation
    const outgoingCard = currentCard.cloneNode(true);
    outgoingCard.style.position = 'absolute';
    outgoingCard.style.top = currentCard.offsetTop + 'px';
    outgoingCard.style.left = currentCard.offsetLeft + 'px';
    outgoingCard.style.width = currentCard.offsetWidth + 'px';
    outgoingCard.style.height = currentCard.offsetHeight + 'px';
    outgoingCard.style.transition = 'opacity 0.4s ease-in-out';
    outgoingCard.style.opacity = 1;
    outgoingCard.style.zIndex = 2;
    slider.appendChild(outgoingCard);

    // Update state immediately for new content
    setCurrentIndex(index);

    // Ensure the new card starts invisible and fades in
    requestAnimationFrame(() => {
      if (activeCardRef.current) {
        activeCardRef.current.style.opacity = 0;
        activeCardRef.current.style.transition = 'opacity 0.4s ease-in-out';
        activeCardRef.current.style.zIndex = 1;

        requestAnimationFrame(() => {
          activeCardRef.current.style.opacity = 1; // fade in new
          outgoingCard.style.opacity = 0; // fade out old
        });
      }
    });

    // Remove outgoing card after transition
    setTimeout(() => {
      if (slider.contains(outgoingCard)) {
        slider.removeChild(outgoingCard);
      }
    }, 2000);
  };

  // If your objects have a stable `id`, prefer matching by `id`.
  const findGlobalIndex = (thumb) => {
    // image-based fallback; use `t.id === thumb.id` if you have ids
    return testimonials.findIndex((t) => t.image === thumb.image);
  };

  const handleThumbClick = (slotIndex) => {
    const thumb = images[slotIndex];
    if (!thumb) return;

    const targetIdx = findGlobalIndex(thumb);
    if (targetIdx === -1 || targetIdx === currentIndex) return;

    // Prevent the interval from firing mid-fade
    clearInterval(intervalRef.current);
    fadeToSlide(targetIdx);
  };

  const cardHTML = (t) => (
    <>
      <div className="testimonial-icon text-4xl w-10 h-10 bg-[var(--primary-color)] text-white flex items-center justify-center rounded-full mb-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="14"
          viewBox="0 0 24 14"
          fill="none"
        >
          <path
            d="M13.2782 8.64693C13.3215 7.21891 13.5595 5.89908 13.9922 4.68743C14.4249 3.43251 14.8576 2.43723 15.2904 1.70158C15.7664 0.922662 16.0044 0.533203 16.0044 0.533203L20.1586 0.598112C20.1586 0.598112 20.0072 0.901024 19.7042 1.50685C19.4013 2.11267 19.0984 2.9565 18.7955 4.03833C19.9639 4.21143 20.9592 4.75234 21.7814 5.66108C22.6036 6.56981 23.0146 7.63001 23.0146 8.84166C23.0146 10.1831 22.5386 11.3299 21.5866 12.2819C20.6346 13.2339 19.4879 13.7099 18.1464 13.7099C16.8049 13.7099 15.6582 13.2339 14.7062 12.2819C13.7542 11.2866 13.2782 10.0749 13.2782 8.64693ZM0.945312 8.64693C0.988586 7.21891 1.22659 5.89908 1.65932 4.68743C2.09205 3.43251 2.52478 2.43723 2.95752 1.70158C3.43352 0.922662 3.67153 0.533203 3.67153 0.533203L7.82575 0.598112C7.82575 0.598112 7.6743 0.901024 7.37138 1.50685C7.06847 2.11267 6.76556 2.9565 6.46265 4.03833C7.63102 4.21143 8.62631 4.75234 9.4485 5.66108C10.2707 6.56981 10.6818 7.63001 10.6818 8.84166C10.6818 10.1831 10.2058 11.3299 9.25377 12.2819C8.30176 13.2339 7.15502 13.7099 5.81355 13.7099C4.47208 13.7099 3.32534 13.2339 2.37333 12.2819C1.42132 11.2866 0.945312 10.0749 0.945312 8.64693Z"
            fill="white"
          />
        </svg>
      </div>

      <img src={t.image} alt={t.name} />
      <div className="text mt-10">{t.text}</div>
      <div className="name">{t.name}</div>
      <div className="stars">
        {'★'.repeat(t.rating)}
        {'☆'.repeat(5 - t.rating)}
      </div>
    </>
  );

  const imageHTML = (t) => <img src={t.image} alt={t.name} />;

  // 3️⃣ Show nothing until images are fully loaded
  if (!allLoaded) return null;

  return (
    <section className="slider-wrapper">
      <div className="slider" ref={sliderRef}>
        {fixedSlots.map((id, i) => (
          <div
            key={id}
            id={id}
            className="img-box"
            style={{
              opacity: 1,
              transition: 'opacity 0.3s ease-in-out',
              cursor: 'pointer', // indicate it's clickable
            }}
            onClick={() => handleThumbClick(i)}
          >
            {images[i] && imageHTML(images[i])}
          </div>
        ))}

        <div
          className="active-card"
          id="img0"
          ref={activeCardRef}
          style={{ opacity: 1 }}
        >
          {cardHTML(testimonials[currentIndex])}
        </div>
      </div>

      <div className="dots">
        {Array(MAX_VISIBLE_DOTS)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className={`dot ${i === currentIndex ? 'active' : ''}`}
              style={
                i >= testimonials.length
                  ? { opacity: 0.3, pointerEvents: 'none' }
                  : { cursor: 'pointer' }
              }
              onClick={() => fadeToSlide(i)}
            />
          ))}
      </div>
    </section>
  );
}
