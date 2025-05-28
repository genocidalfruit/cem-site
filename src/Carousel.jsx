import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

// Mock images - replace with your actual imports
const carouselItems = [
  {
    heading: 'Simplify Construction Planning',
    description: 'Explore our suite of tools to estimate costs, plan timelines, and source materials smartly.',
    cta: 'Get Started',
    link: '/cost-calculator',
    backgroundImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
    gradient: 'from-yellow-600/60 to-amber-600/60'
  },
  {
    heading: 'Plan Out EMIs',
    description: 'Use our advanced EMI calculator to view EMI payments for purchases at a glance.',
    cta: 'Try EMI Calculator',
    link: '/emi-calculator',
    backgroundImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
    gradient: 'from-green-600/60 to-teal-600/60'
  },
  {
    heading: 'Find the Right Materials for Your Build',
    description: 'Use our intelligent filtering system to discover the perfect materials tailored to your construction needs.',
    cta: 'Start Predicting',
    link: '/product-predictor',
    backgroundImage: 'https://images.unsplash.com/photo-1429497419816-9ca5cfb4571a?w=800&h=600&fit=crop',
    gradient: 'from-blue-600/60 to-cyan-600/60'
  }
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0, time: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const intervalRef = useRef(null);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % carouselItems.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const handleTouchStart = (e) => {
    const touch = e.targetTouches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    });
    setTouchEnd({ x: 0, y: 0 });
    setIsDragging(false);
  };

  const handleTouchMove = (e) => {
    if (!touchStart.x) return;
    
    const touch = e.targetTouches[0];
    const currentX = touch.clientX;
    const currentY = touch.clientY;
    
    const deltaX = Math.abs(currentX - touchStart.x);
    const deltaY = Math.abs(currentY - touchStart.y);
    
    // Only start considering it a swipe if horizontal movement is greater than vertical
    // and we've moved more than a threshold
    if (deltaX > 10 && deltaX > deltaY) {
      setIsDragging(true);
      // Prevent default scrolling only when we're sure it's a horizontal swipe
      e.preventDefault();
    }
    
    setTouchEnd({ x: currentX, y: currentY });
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.x || !touchEnd.x || !isDragging) {
      setIsDragging(false);
      return;
    }
    
    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = Math.abs(touchStart.y - touchEnd.y);
    const deltaTime = Date.now() - touchStart.time;
    
    // More restrictive swipe detection:
    // - Minimum horizontal distance
    // - Maximum time (to detect swipes, not slow drags)
    // - Horizontal movement should be significantly more than vertical
    const minSwipeDistance = 80;
    const maxSwipeTime = 500;
    const isHorizontalSwipe = Math.abs(deltaX) > minSwipeDistance && 
                             Math.abs(deltaX) > deltaY * 2 &&
                             deltaTime < maxSwipeTime;

    if (isHorizontalSwipe) {
      if (deltaX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    
    setIsDragging(false);
    setTouchStart({ x: 0, y: 0, time: 0 });
    setTouchEnd({ x: 0, y: 0 });
  };

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay) {
      intervalRef.current = setInterval(() => {
        handleNext();
      }, 5000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isAutoPlay, current]);

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 py-8">
      {/* Main Carousel Container */}
      <div 
        className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: isDragging ? 'none' : 'auto' }}
      >
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out transform scale-105 group-hover:scale-100"
          style={{ backgroundImage: `url(${carouselItems[current].backgroundImage})` }}
        />
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${carouselItems[current].gradient} transition-all duration-700`} />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 sm:p-8 lg:p-12">
          <div 
            key={current}
            className="animate-fade-in-up max-w-4xl"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 lg:mb-6 leading-tight">
              {carouselItems[current].heading}
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-6 lg:mb-8 max-w-2xl mx-auto leading-relaxed">
              {carouselItems[current].description}
            </p>
            <a
              href={carouselItems[current].link}
              className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={(e) => {
                // Prevent link activation if we just finished a swipe
                if (isDragging) {
                  e.preventDefault();
                }
              }}
            >
              {carouselItems[current].cta}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Navigation Arrows - Desktop */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Auto-play Control */}
        <button
          onClick={toggleAutoPlay}
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
        >
          {isAutoPlay ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Indicators */}
      <div className="flex justify-center mt-6 space-x-3">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-300 rounded-full ${
              current === index 
                ? 'w-12 h-3 bg-gray-800' 
                : 'w-3 h-3 bg-gray-400 hover:bg-gray-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${((current + 1) / carouselItems.length) * 100}%` }}
        />
      </div>

      {/* Mobile Swipe Hint */}
      <div className="sm:hidden text-center mt-4">
        <p className="text-sm text-gray-500">← Swipe horizontally to navigate →</p>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Carousel;