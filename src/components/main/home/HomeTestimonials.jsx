'use client';

import { useEffect, useRef, useState } from 'react';

const testimonials = [
  {
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    name: 'Alicia Green',
    rating: 5,
    text: 'Amazing legal service. Fast and professional.',
  },
  {
    image: 'https://randomuser.me/api/portraits/men/44.jpg',
    name: 'Mark Benson',
    rating: 4,
    text: 'Best legal experience I’ve had. Highly recommend.',
  },
  {
    image: 'https://randomuser.me/api/portraits/women/21.jpg',
    name: 'Sara Lee',
    rating: 5,
    text: 'Very supportive and timely updates.',
  },
  {
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'John Smith',
    rating: 4,
    text: 'Confident, clear, and trustworthy advice.',
  },
  {
    image: 'https://randomuser.me/api/portraits/women/45.jpg',
    name: 'Emily Reed',
    rating: 5,
    text: 'Truly helpful legal team. Great results.',
  },
  {
    image: 'https://randomuser.me/api/portraits/men/58.jpg',
    name: 'Paul Stone',
    rating: 3,
    text: 'Listened, understood, and delivered perfectly.',
  },
  {
    image: 'https://randomuser.me/api/portraits/women/11.jpg',
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
  const intervalRef = useRef(null);
  const sliderRef = useRef(null);

  const cardHTML = (t) => (
    <>
      <img src={t.image} alt={t.name} />
      <div className="name">{t.name}</div>
      <div className="stars">
        {'★'.repeat(t.rating)}
        {'☆'.repeat(5 - t.rating)}
      </div>
      <div className="text">{t.text}</div>
    </>
  );

  const imageHTML = (t) => <img src={t.image} alt={t.name} />;

  const goToSlide = (index) => {
    if (index === currentIndex) return;
    setStep((prev) => (prev % 6) + 1);
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= MAX_VISIBLE_DOTS || nextIndex >= testimonials.length) {
      nextIndex = 0;
    }
    setStep((prev) => (prev % 6) + 1);
    setCurrentIndex(nextIndex);
  };

  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 4000);
    const slider = sliderRef.current;

    const pause = () => clearInterval(intervalRef.current);
    const resume = () => (intervalRef.current = setInterval(nextSlide, 4000));

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
  }, [currentIndex]);

  return (
    <section className="flex flex-col items-center justify-center px-5 bg-[#f0f4f8] section">
      <div className="relative w-full max-w-[1000px] h-[500px]" ref={sliderRef}>
        {fixedSlots.map((slotId, i) => (
          <div
            key={slotId}
            className="img-box absolute w-[70px] h-[70px] rounded-full overflow-hidden bg-white shadow"
            style={{
              ...[
                { top: '5%', left: '5%' },
                { top: '30%', left: '10%' },
                { bottom: '5%', left: '5%' },
                { top: '5%', right: '5%' },
                { top: '30%', right: '10%' },
                { bottom: '5%', right: '5%' },
              ][i],
            }}
          >
            {testimonials[(currentIndex + i + 1) % testimonials.length] &&
              imageHTML(
                testimonials[(currentIndex + i + 1) % testimonials.length]
              )}
          </div>
        ))}

        <div className="active-card absolute w-[90%] max-w-[340px] h-[320px] bg-white rounded-[20px] shadow-xl p-5 text-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          {cardHTML(testimonials[currentIndex])}
        </div>
      </div>

      <div className="dots mt-6 flex gap-2 justify-center flex-wrap">
        {Array(MAX_VISIBLE_DOTS)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className={`dot w-[12px] h-[12px] rounded-full cursor-pointer transition-colors duration-300 ${
                i === currentIndex ? 'bg-[#00c3c0]' : 'bg-[#ccc]'
              }`}
              onClick={() => goToSlide(i)}
            />
          ))}
      </div>
      <style>
        {`
            .slider {
            position: relative;
            width: 100%;
            max-width: 1000px;
            height: 500px;
        }

        .img-box,
        .active-card {
            transition: opacity 0.5s ease;
        }

        .img-box {
            position: absolute;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            overflow: hidden;
            background: #fff;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            z-index: 1;
        }

        .img-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .active-card {
            position: absolute;
            width: 90%;
            max-width: 340px;
            height: 320px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            padding: 20px;
            text-align: center;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .active-card img {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 10px;
        }

        .active-card .name {
            font-weight: bold;
            color: #00c3c0;
            margin-bottom: 5px;
        }

        .active-card .stars {
            color: #facc15;
            font-size: 16px;
            margin-bottom: 8px;
        }

        .active-card .text {
            font-size: 14px;
            color: #333;
            position: relative;
            padding-left: 20px;
        }

        .active-card .text::before {
            content: "❝";
            position: absolute;
            left: 0;
            top: -5px;
            font-size: 22px;
            color: #00c3c0;
        }

        /* Fixed Positions */
        #img1 {
            top: 5%;
            left: 5%;
        }

        #img2 {
            top: 30%;
            left: 10%;
        }

        #img3 {
            bottom: 5%;
            left: 5%;
        }

        #img4 {
            top: 5%;
            right: 5%;
        }

        #img5 {
            top: 30%;
            right: 10%;
        }

        #img6 {
            bottom: 5%;
            right: 5%;
        }

        /* Dots */
        .dots {
            margin-top: 25px;
            display: flex;
            gap: 8px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .dot {
            width: 12px;
            height: 12px;
            background-color: #ccc;
            border-radius: 50%;
            cursor: pointer;
            transition: background 0.3s ease;
        }

        .dot.active {
            background-color: #00c3c0;
        }

        @media (max-width: 768px) {
            .slider {
                height: 440px;
            }

            .img-box {
                width: 60px;
                height: 60px;
            }

            .active-card {
                max-width: 280px;
                padding: 15px;
            }
        }

        @media (max-width: 480px) {
            .slider {
                height: 380px;
            }

            .img-box {
                width: 50px;
                height: 50px;
            }

            .active-card {
                max-width: 240px;
                padding: 10px;
            }
        }
        `}
      </style>
    </section>
  );
}
