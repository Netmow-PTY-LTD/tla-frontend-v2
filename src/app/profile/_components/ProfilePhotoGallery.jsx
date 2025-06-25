import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfilePhotoGallery({ userInfo }) {
  const photos = userInfo?.data?.photosVideos?.photos || [];

  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => setIsOpen(false);

  const goPrev = () =>
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % photos.length);

  return (
    <section className="py-5 relative">
      <div className="flex flex-wrap gap-5">
        <div className="w-full">
          <h2 className="text-[24px] font-semibold mb-4 profile-heading relative flex items-baseline gap-3">
            <span>Galleries</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="62"
              height="4"
              viewBox="0 0 62 4"
              fill="none"
            >
              <rect
                x="0.138672"
                y="0.201172"
                width="11.3115"
                height="3.40625"
                rx="1.70312"
                fill="#D9D9D9"
              />
              <rect
                x="17.4512"
                y="0.201172"
                width="44.5493"
                height="3.40625"
                rx="1.70312"
                fill="#00C3C0"
              />
            </svg>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {photos.length > 0 ? (
              photos.map((photo, index) => (
                <button
                  key={`photo-${index}`}
                  onClick={() => openLightbox(index)}
                  className="focus:outline-none cursor-pointer"
                >
                  <img
                    src={photo || '/assets/img/gallery-placeholder.png'}
                    alt={`Gallery Image ${index + 1}`}
                    className="w-full h-[200px] rounded-lg object-cover"
                  />
                </button>
              ))
            ) : (
              <div className="col-span-full text-gray-500 italic">
                No photos available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Background Shape */}
      {/* <div className="absolute top-0 right-0 hidden md:block">
        <Image
          src="/assets/img/experience-bg-shape.png"
          width={691}
          height={720}
          alt="shape"
        />
      </div> */}

      {/* Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white text-3xl font-bold z-50"
          >
            &times;
          </button>
          <button
            onClick={goPrev}
            className="absolute left-4 text-white text-4xl z-50"
          >
            &#10094;
          </button>
          <img
            src={photos[currentIndex]}
            alt={`Preview ${currentIndex + 1}`}
            className="max-w-full max-h-[80vh] rounded-lg z-40"
          />
          <button
            onClick={goNext}
            className="absolute right-4 text-white text-4xl z-50"
          >
            &#10095;
          </button>
        </div>
      )}
    </section>
  );
}
