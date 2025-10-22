'use client';

import { useEffect, useRef, useState } from 'react';
import '@/styles/slider.css';
import { useGetAllTestimonialsQuery } from '@/store/features/testimonials/testimonialsService';

// const testimonials = [
//   {
//     id: 1,
//     image: '/assets/img/testimonials/testimonial-1.webp',
//     name: 'Alicia Green',
//     text: 'Amazing legal service. Fast and professional.',
//   },
//   {
//     id: 2,
//     image: '/assets/img/testimonials/testimonial-2.webp',
//     name: 'Mark Benson',
//     text: 'Best legal experience I’ve had. Highly recommend.',
//   },
//   {
//     id: 3,
//     image: '/assets/img/testimonials/testimonial-3.webp',
//     name: 'Sara Lee',
//     text: 'Very supportive and timely updates.',
//   },
//   {
//     id: 4,
//     image: '/assets/img/testimonials/testimonial-4.webp',
//     name: 'John Smith',
//     text: 'Confident, clear, and trustworthy advice.',
//   },
//   {
//     id: 5,
//     image: '/assets/img/testimonials/testimonial-5.webp',
//     name: 'Emily Reed',
//     text: 'Truly helpful legal team. Great results.',
//   },
//   {
//     id: 6,
//     image: '/assets/img/testimonials/testimonial-6.webp',
//     name: 'Paul Stone',
//     text: 'Listened, understood, and delivered perfectly.',
//   },
//   {
//     id: 7,
//     image: '/assets/img/testimonials/testimonial-7.webp',
//     name: 'Jasmine Wu',
//     text: 'Professional, friendly, and results-driven.',
//   },
//   {
//     id: 8,
//     image: '/assets/img/testimonials/testimonial-8.webp',
//     name: 'Carlos Rivera',
//     text: 'Exceeded expectations at every step.',
//   },
//   {
//     id: 9,
//     image: '/assets/img/testimonials/testimonial-9.webp',
//     name: 'Nina Patel',
//     text: 'Clear communication and great outcome.',
//   },
//   {
//     id: 10,
//     image: '/assets/img/testimonials/testimonial-10.webp',
//     name: 'David Kim',
//     text: 'Handled my case with expertise and care.',
//   },
//   {
//     id: 11,
//     image: '/assets/img/testimonials/testimonial-11.webp',
//     name: 'Olivia Moore',
//     text: 'Incredible team—highly professional and reliable.',
//   },
//   {
//     id: 12,
//     image: '/assets/img/testimonials/testimonial-12.webp',
//     name: 'Anthony Brooks',
//     text: 'Supportive and knowledgeable throughout the case.',
//   },
//   {
//     id: 13,
//     image: '/assets/img/testimonials/testimonial-13.webp',
//     name: 'Lena Ortiz',
//     text: 'Courteous service and outstanding representation.',
//   },
//   {
//     id: 14,
//     image: '/assets/img/testimonials/testimonial-14.webp',
//     name: 'George Allen',
//     text: 'Highly efficient legal team that gets results.',
//   },
//   {
//     id: 15,
//     image: '/assets/img/testimonials/testimonial-15.webp',
//     name: 'Maya Chen',
//     text: 'Always available and willing to help.',
//   },
//   {
//     id: 16,
//     image: '/assets/img/testimonials/testimonial-16.webp',
//     name: 'Derek Nguyen',
//     text: 'Professional, precise, and incredibly helpful.',
//   },
// ];

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [allLoaded, setAllLoaded] = useState(false);
  const intervalRef = useRef(null);
  const sliderRef = useRef(null);
  const activeCardRef = useRef(null);

  const { data: testimonialsData, isLoading } = useGetAllTestimonialsQuery({
    page: 1,
    limit: 20,
    search: '',
  }); // Replace with actual data fetching logic
  const testimonials = testimonialsData?.data || [];
  // console.log('testimonials', testimonials);

  const MAX_VISIBLE_DOTS = testimonials?.length;
  const fixedSlots = [
    'img1',
    'img2',
    'img3',
    'img4',
    'img5',
    'img6',
    'img7',
    'img8',
    'img9',
    'img10',
    'img11',
    'img12',
    'img13',
    'img14',
    'img15',
    'img16',
  ];
  // ✅ Load all images
  useEffect(() => {
    if (!testimonials?.length) return; // don't run if testimonials is empty

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
      setImages(fixedSlots.map((_, i) => testimonials[i])); // map only after testimonials loaded
      setAllLoaded(true);
    };

    loadImages();
  }, [testimonials]);

  // ✅ Helper: Advance to next slide
  const nextSlide = () => {
    const nextIndex =
      currentIndex + 1 >= MAX_VISIBLE_DOTS ||
      currentIndex + 1 >= testimonials?.length
        ? 0
        : currentIndex + 1;
    fadeToSlide(nextIndex);
  };

  // ✅ Helper: Reset interval after interaction
  const resetInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(nextSlide, 4000);
  };

  // ✅ Autoplay setup
  useEffect(() => {
    if (!allLoaded) return;

    resetInterval(); // start autoplay

    const slider = sliderRef.current;

    // Pause on hover
    const pause = () => clearInterval(intervalRef.current);
    const resume = () => resetInterval();

    // Swipe detection
    let startX = 0;
    const onTouchStart = (e) => (startX = e.touches[0].clientX);
    const onTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      if (endX < startX - 50 || endX > startX + 50) nextSlide();
    };

    slider.addEventListener('mouseenter', pause);
    slider.addEventListener('mouseleave', resume);
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

  const fadeToSlide = (index) => {
    if (index === currentIndex) return;
    const slider = sliderRef.current;
    const currentCard = activeCardRef.current;
    if (!slider || !currentCard) return;

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

    setCurrentIndex(index);

    requestAnimationFrame(() => {
      if (activeCardRef.current) {
        activeCardRef.current.style.opacity = 0;
        activeCardRef.current.style.transition = 'opacity 0.4s ease-in-out';
        activeCardRef.current.style.zIndex = 1;

        requestAnimationFrame(() => {
          activeCardRef.current.style.opacity = 1;
          outgoingCard.style.opacity = 0;
        });
      }
    });

    setTimeout(() => {
      if (slider.contains(outgoingCard)) {
        slider.removeChild(outgoingCard);
      }
    }, 1000);
  };

  const handleThumbClick = (slotIndex) => {
    const thumb = images[slotIndex];
    if (!thumb) return;

    const targetIdx = testimonials.findIndex((t) => t.image === thumb.image);
    if (targetIdx === -1 || targetIdx === currentIndex) return;

    resetInterval(); // ✅ Reset autoplay
    fadeToSlide(targetIdx);
  };

  const cardHTML = (t) => {
    if (!t) return null;

    return (
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

        {t.image && (
          <img
            src={t.image}
            alt={t.name || 'Testimonial'}
            className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
          />
        )}

        {t.comment && (
          <div className="text mt-4 text-center text-gray-700 italic">
            {t.comment}
          </div>
        )}

        {t.name && (
          <div className="name text-center mt-2 font-semibold text-gray-800">
            {t.name}
          </div>
        )}
      </>
    );
  };

  const imageHTML = (t) => {
    if (!t || !t.image) return null;

    return (
      <img
        src={t.image}
        alt={t.name || 'Testimonial'}
        className="w-10 h-10 object-cover rounded-full"
      />
    );
  };

  if (!allLoaded) return null;

  return (
    <section className="slider-wrapper">
      <div className="slider" ref={sliderRef}>
        {fixedSlots?.map((id, i) => (
          <div
            key={id}
            id={id}
            className="img-box"
            style={{
              opacity: 1,
              transition: 'opacity 0.3s ease-in-out',
              cursor: 'pointer',
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
          {testimonials[currentIndex]
            ? cardHTML(testimonials[currentIndex])
            : null}
        </div>
      </div>

      {/* Navigation Dots */}
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
              onClick={() => {
                resetInterval(); // ✅ Reset autoplay on dot click
                fadeToSlide(i);
              }}
            />
          ))}
      </div>
    </section>
  );
}
