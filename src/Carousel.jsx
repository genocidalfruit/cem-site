import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import oneBg from './assets/Simplify Construction Planning.png';
import twoBg from './assets/Plan Out EMIs.png';
import threeBg from './assets/Find Stores Near You.png';
 
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
      className="relative mt-20 md:mt-24 px-2 sm:px-4 py-8 inset-shadow-sm inset-shadow-gray-600/50 sm:py-16 text-center rounded-lg mx-2 sm:mx-4 md:mx-8 bg-center bg-no-repeat"
      style={{
        backgroundColor: "#DFDBE5",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='42' height='44' viewBox='0 0 42 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Page-1' fill='none' fill-rule='evenodd'%3E%3Cg id='brick-wall' fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '20px 20px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 sm:gap-2 px-1 sm:px-2 md:px-4">
        {/* Left Arrow - Hidden on mobile, visible on tablet and up */}
        <button
          onClick={handlePrev}
          className="hidden sm:flex flex-shrink-0 bg-white/80 hover:bg-yellow-100 transition p-1 sm:p-2 rounded-full shadow mr-2 sm:mr-5"
        >
          <ChevronLeft className="text-gray-700 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </button>
 
        {/* Carousel Card */}
        <div className="w-full h-[280px] sm:h-[340px] md:h-[400px] lg:h-[440px] flex items-center justify-center drop-shadow-lg sm:drop-shadow-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="relative w-full h-full bg-cover bg-center bg-no-repeat rounded-lg sm:rounded-xl px-4 py-6 sm:px-6 sm:py-10 md:px-8 md:py-14 lg:px-20 lg:py-16 shadow-lg sm:shadow-xl flex flex-col justify-center items-center text-center"
              style={{
                backgroundImage: `url(${carouselItems[current].backgroundImage})`,
                backgroundBlendMode: 'overlay',
                backgroundColor: 'rgba(255,255,255,0.6)',
              }}
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold sm:font-extrabold text-gray-800 mb-2 sm:mb-3 tracking-tight">
                {carouselItems[current].heading}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-800 mb-4 sm:mb-6 max-w-xs sm:max-w-md md:max-w-xl mx-auto">
                {carouselItems[current].description}
              </p>
              <a
                href={carouselItems[current].link}
                className="bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 sm:px-5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base font-semibold transition"
              >
                {carouselItems[current].cta}
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
 
        {/* Right Arrow - Hidden on mobile, visible on tablet and up */}
        <button
          onClick={handleNext}
          className="hidden sm:flex flex-shrink-0 bg-white/80 hover:bg-yellow-100 transition p-1 sm:p-2 rounded-full shadow ml-2 sm:ml-5"
        >
          <ChevronRight className="text-gray-700 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </button>
      </div>
 
      {/* Mobile Navigation Dots */}
      <div className="sm:hidden flex justify-center mt-4 space-x-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full ${current === index ? 'bg-gray-800' : 'bg-gray-400'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
 
export default Carousel;