import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

export const Hero: React.FC = () => {
  const { theme } = useTheme();
  const { hero } = theme;

  return (
    <section
      className={`relative ${hero.height === 'large' ? 'min-h-[600px] lg:min-h-[700px]' : 'min-h-[400px] lg:min-h-[500px]'}`}
    >
      <div className="absolute inset-0">
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet={hero.mobileImage || 'https://placehold.co/800x1200/404040/FFFFFF.png?text=Welcome'}
            onError={(e) => {
              const target = e.target as HTMLSourceElement;
              target.srcset = 'https://placehold.co/800x1200/404040/FFFFFF.png?text=Welcome';
            }}
          />
          <img
            src={hero.image || 'https://placehold.co/1920x1080/404040/FFFFFF.png?text=Welcome'}
            alt="Hero banner"
            className="w-full h-full object-cover"
            loading="eager"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/1920x1080/404040/FFFFFF.png?text=Welcome';
            }}
          />
        </picture>
        {hero.showGradient && (
          <div
            className={`absolute inset-0 bg-gradient-to-${hero.gradientDirection || 'b'} from-black/60 to-transparent`}
            style={{ opacity: hero.overlayOpacity }}
          />
        )}
      </div>

      <div className="relative h-full container mx-auto px-4">
        <div
          className={`flex flex-col h-full justify-center items-${hero.contentAlignment || 'center'} text-${hero.contentAlignment || 'center'} py-20 lg:py-32`}
        >
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-3xl animate-fade-in`}
            style={{ color: hero.title.color || '#FFFFFF' }}
          >
            {hero.title.text}
          </h1>
          <p
            className={`text-lg md:text-xl lg:text-2xl font-medium mb-8 max-w-2xl animate-fade-in-up`}
            style={{ color: hero.subtitle.color || '#FFFFFF' }}
          >
            {hero.subtitle.text}
          </p>
          {hero.button.show && (
            <a
              href={hero.button.url}
              className={`
                inline-flex px-8 py-4 rounded-full text-base md:text-lg font-semibold
                transition-all duration-300 transform hover:scale-105
                ${hero.button.style === 'primary' ? 'bg-white text-black hover:bg-opacity-90' : 'bg-black text-white hover:bg-opacity-90'}
                ${hero.button.size === 'large' ? 'min-w-[200px] justify-center' : 'min-w-[160px] justify-center'}
                animate-fade-in-up
              `}
            >
              {hero.button.text}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};