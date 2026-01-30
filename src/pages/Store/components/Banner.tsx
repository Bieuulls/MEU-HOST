import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

interface Slide {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  overlayColor: string;
  overlayOpacity: number;
}

interface BannerSettings {
  slides?: Slide[];
  autoplay?: boolean;
  autoplaySpeed?: number;
  transitionDuration?: number;
}

export const Banner: React.FC = memo(() => {
  const { theme } = useTheme();
  const { banner: settings = {} as BannerSettings } = theme;
  const transitionDuration = settings.transitionDuration || 500;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);

  const slides = useMemo(() => settings.slides || [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
      title: 'Summer Collection 2024',
      subtitle: 'Discover the latest trends in fashion',
      buttonText: 'Shop Now',
      buttonLink: '/collections/summer',
      overlayColor: '#000000',
      overlayOpacity: 0.3
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b',
      title: 'New Arrivals',
      subtitle: 'Check out our newest products',
      buttonText: 'View Collection',
      buttonLink: '/collections/new',
      overlayColor: '#000000',
      overlayOpacity: 0.3
    }
  ], [settings.slides]);

  const handleNextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), transitionDuration);
  }, [isTransitioning, slides.length, transitionDuration]);

  const handlePrevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), transitionDuration);
  }, [isTransitioning, slides.length, transitionDuration]);

  useEffect(() => {
    if (!settings.autoplay || isAutoplayPaused) return;

    const interval = setInterval(() => {
      handleNextSlide();
    }, settings.autoplaySpeed || 5000);

    return () => clearInterval(interval);
  }, [settings.autoplay, settings.autoplaySpeed, handleNextSlide, isAutoplayPaused]);

  const handleImageError = useCallback((slideId: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(prev => ({ ...prev, [slideId]: true }));
    e.currentTarget.src = 'https://via.placeholder.co/800x1200/404040/FFFFFF.png?text=Banner+Image';
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsAutoplayPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsAutoplayPaused(false);
  }, []);

  if (!slides.length) {
    return null;
  }

  return (
    <div
      className="relative overflow-hidden bg-gray-900 group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides */}
      <div
        className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] min-h-[300px] sm:min-h-[400px] w-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={imageError[slide.id] ? 'https://via.placeholder.co/800x1200/404040/FFFFFF.png?text=Banner+Image' : slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
                onError={(e) => handleImageError(slide.id, e)}
              />
              <div
                className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"
                style={{
                  backgroundColor: slide.overlayColor,
                  opacity: slide.overlayOpacity
                }}
              />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center justify-center text-center text-white px-4 py-6 sm:py-8 md:py-12 max-w-7xl mx-auto">
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                  {slide.title}
                </h2>
                {slide.subtitle && (
                  <p className="text-sm sm:text-base md:text-lg font-medium max-w-xl mx-auto">
                    {slide.subtitle}
                  </p>
                )}
                {slide.buttonText && slide.buttonLink && (
                  <a
                    href={slide.buttonLink}
                    className="inline-block bg-white text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200"
                  >
                    {slide.buttonText}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/20 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/30"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <button
            onClick={handleNextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/20 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/30"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 bg-white' : 'bg-white/50'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
});

Banner.displayName = 'Banner';