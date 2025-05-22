import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import oneBg from './assets/one-bg.jpg';
import twoBg from './assets/two-bg.jpg'
import threeBg from './assets/three-bg.jpg'

const carouselItems = [
  {
    heading: 'Simplify Construction Planning',
    description: 'Explore our suite of tools to estimate costs, plan timelines, and source materials smartly.',
    cta: 'Get Started',
    link: '/cost-calculator',
    backgroundImage: oneBg,
  },
  {
    heading: 'Plan Out EMIs',
    description: 'Use our advanced EMI calculator to view EMI payments for purchases at a glance.',
    cta: 'Try EMI Calculator',
    link: '/emi-calculator',
    backgroundImage: twoBg,
  },
  {
    heading: 'Find Stores Near You',
    description: 'Locate nearby material suppliers and hardware stores across India.',
    cta: 'Find Stores',
    link: '/store-locator',
    backgroundImage: threeBg,
  }
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % carouselItems.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  useEffect(() => {
    const preloadImage = (src) => {
        const img = new Image();
        img.src = src;
    };

    // Preload next and previous images
    const nextIndex = (current + 1) % carouselItems.length;
    const prevIndex = (current - 1 + carouselItems.length) % carouselItems.length;

    preloadImage(carouselItems[nextIndex].backgroundImage);
    preloadImage(carouselItems[prevIndex].backgroundImage);
    }, [current]);

  return (
    <section
      className="relative mt-24 px-4 py-16 sm:px-6 text-center rounded-lg mx-8 bg-center bg-no-repeat max-h-800 inset-shadow-sm inset-shadow-gray-600/50"
      style={{
        backgroundColor: "#DFDBE5",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='42' height='44' viewBox='0 0 42 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Page-1' fill='none' fill-rule='evenodd'%3E%3Cg id='brick-wall' fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '20px 20px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 px-2 sm:px-4">
        
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="flex-shrink-0 bg-white/80 hover:bg-yellow-100 transition p-2 rounded-full shadow mr-5"
        >
          <ChevronLeft className="text-gray-700 w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Carousel Card */}
        <div className="w-full h-[340px] sm:h-[400px] md:h-[440px] flex items-center justify-center drop-shadow-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="relative w-full h-full bg-cover bg-center bg-no-repeat rounded-xl px-4 py-6 sm:px-8 sm:py-14 md:px-20 md:py-16 shadow-xl flex flex-col justify-center items-center text-center drop-shadow-xl"
              style={{
                backgroundImage: `url(${carouselItems[current].backgroundImage})`,
                backgroundBlendMode: 'overlay',
                backgroundColor: 'rgba(255,255,255,0.6)',
              }}
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-3 tracking-tight">
                {carouselItems[current].heading}
              </h1>
              <p className="text-xl sm:text-base text-gray-800 mb-6 max-w-md sm:max-w-xl mx-auto">
                {carouselItems[current].description}
              </p>
              <a
                href={carouselItems[current].link}
                className="bg-yellow-500 hover:bg-yellow-400 text-white px-5 py-2 rounded-lg text-sm sm:text-base font-semibold transition"
              >
                {carouselItems[current].cta}
              </a>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="flex-shrink-0 bg-white/80 hover:bg-yellow-100 transition p-2 rounded-full shadow ml-5"
        >
          <ChevronRight className="text-gray-700 w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </section>
  );
};

export default Carousel;
