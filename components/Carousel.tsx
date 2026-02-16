import React, { useRef, useState } from 'react';
import { Topic } from '../types';
import { Link } from 'react-router-dom';

interface CarouselProps {
  title: string;
  items: Topic[];
}

const Carousel: React.FC<CarouselProps> = ({ title, items }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = current.clientWidth * 0.8;
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  return (
    <div className="py-8 group">
      <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 md:px-12 text-gray-900 dark:text-white flex items-center gap-2">
        {title}
        <span className="text-primary text-sm font-medium hover:underline cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity ml-auto md:ml-4 flex items-center gap-1">
          See all
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </span>
      </h2>
      
      <div className="relative group/carousel">
        {/* Left Chevron */}
        <button 
          onClick={() => scroll('left')}
          className={`absolute left-0 top-0 bottom-0 z-20 w-16 bg-gradient-to-r from-gray-50/90 to-transparent dark:from-gray-900/90 hidden md:flex items-center justify-center text-gray-800 dark:text-white transition-all duration-300 ${showLeft ? 'opacity-0 group-hover/carousel:opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-label="Scroll left"
        >
          <svg className="w-10 h-10 drop-shadow-lg transform transition-transform hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        {/* Scroll Container with Perspective */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto gap-6 px-4 md:px-12 pb-8 snap-x snap-mandatory no-scrollbar perspective-1000"
        >
          {items.map((item) => (
            <Link 
              key={item.id} 
              to={`/topic/${item.slug}`}
              className="flex-none w-[280px] md:w-[320px] snap-start focus:outline-none group/card"
            >
              <div className="transform-style-3d transition-all duration-500 ease-out group-hover/card:rotate-y-2 group-hover/card:scale-105 group-hover/card:-translate-y-2">
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 relative mb-3 shadow-md transition-all duration-500 group-hover/card:shadow-2xl group-hover/card:shadow-primary/20">
                   <img 
                     src={item.type === 'youtube' && item.youtubeId 
                       ? `https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`
                       : `https://picsum.photos/seed/${item.id}/640/360`}
                     alt={item.title}
                     className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                     loading="lazy"
                   />
                   
                   {/* Type Badge */}
                   <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide border border-white/10">
                     {item.type}
                   </div>
                   
                   {/* Duration */}
                   {item.estimatedTime && (
                     <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md font-mono border border-white/10">
                       {item.estimatedTime} min
                     </div>
                   )}
                   
                   {/* Quick Actions Overlay (Desktop) */}
                   <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                      <div className="bg-white/90 text-primary rounded-full p-3 shadow-lg transform scale-50 group-hover/card:scale-100 transition-transform duration-300 delay-75">
                        <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                   </div>
                </div>

                <div className="px-1">
                  <h3 className="font-bold text-lg leading-tight text-gray-900 dark:text-gray-100 group-hover/card:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {item.summary}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {item.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-gray-400 border border-gray-200 dark:border-gray-700 px-1.5 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Chevron */}
        <button 
          onClick={() => scroll('right')}
          className={`absolute right-0 top-0 bottom-0 z-20 w-16 bg-gradient-to-l from-gray-50/90 to-transparent dark:from-gray-900/90 hidden md:flex items-center justify-center text-gray-800 dark:text-white transition-all duration-300 ${showRight ? 'opacity-0 group-hover/carousel:opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-label="Scroll right"
        >
           <svg className="w-10 h-10 drop-shadow-lg transform transition-transform hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
};

export default Carousel;