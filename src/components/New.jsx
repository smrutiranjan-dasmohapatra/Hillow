import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Mock data matching the design cards
const CARDS_DATA = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    price: '$1,932,000',
    address: 'Liberty Hill LN, Independence Village, VA',
    specs: '4 bds | 4 ba | 2337 sqft | House for sale',
    rotation: -2,
    xOffset: 0,
    yOffset: 0,
    zIndex: 30,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    price: '$2,450,000',
    address: 'Sunset Blvd, Beverly Hills, CA',
    specs: '5 bds | 6 ba | 4120 sqft | House for sale',
    rotation: 6,
    xOffset: 120,
    yOffset: -100,
    zIndex: 20,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    price: '$1,850,000',
    address: 'Oakridge Ct, Austin, TX',
    specs: '3 bds | 3.5 ba | 2800 sqft | House for sale',
    rotation: -4,
    xOffset: 80,
    yOffset: 160,
    zIndex: 15,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    price: '$3,100,000',
    address: 'Magnolia Dr, Miami, FL',
    specs: '6 bds | 5 ba | 5200 sqft | House for sale',
    rotation: 8,
    xOffset: 240,
    yOffset: -220,
    zIndex: 10,
  },
];

export default function New() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Text elements fade-in up
      gsap.from('.reveal-text', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
      });

      // 2. Cards entrance & smooth staggered spreading animation
      // Cards start stacked tightly together, then smoothly fan out into place
      gsap.fromTo(
        cardsRef.current,
        {
          opacity: 0,
          scale: 0.8,
          x: 0,
          y: 50,
          rotation: 0,
        },
        {
          opacity: 1,
          scale: 1,
          x: (i) => CARDS_DATA[i].xOffset,
          y: (i) => CARDS_DATA[i].yOffset,
          rotation: (i) => CARDS_DATA[i].rotation,
          duration: 1.4,
          stagger: 0.1,
          ease: 'power4.out',
          delay: 0.2,
        }
      );

      // 3. Subtle floating parallax on mouse move / hover state for that premium "smooth" feel
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const moveX = (clientX - window.innerWidth / 2) * 0.015;
        const moveY = (clientY - window.innerHeight / 2) * 0.015;

        cardsRef.current.forEach((card, index) => {
          const factor = (index + 1) * 0.4; // subtle depth layering
          gsap.to(card, {
            x: CARDS_DATA[index].xOffset + moveX * factor,
            y: CARDS_DATA[index].yOffset + moveY * factor,
            duration: 0.8,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-[#FAF8F5] overflow-hidden flex items-center px-8 md:px-16 lg:px-24 py-20 font-sans selection:bg-[#1A2B49] selection:text-white"
    >
      {/* Background soft grid lines mimicking the image layout */}
      <div className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-[0.03]">
        <div className="border-r border-black h-full"></div>
        <div className="border-r border-black h-full"></div>
        <div className="border-r border-black h-full"></div>
        <div></div>
      </div>

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Left Column - Typography content */}
        <div className="flex flex-col space-y-6 lg:col-span-5 max-w-xl">
          {/* Top Pill Badges */}
          <div className="flex items-center space-x-3 reveal-text">
            <span className="px-4 py-1.5 rounded-full border border-gray-300 text-xs font-medium tracking-wide text-gray-600 bg-white/50 backdrop-blur-sm cursor-pointer hover:bg-white transition-all">
              Agents
            </span>
            <span className="px-4 py-1.5 rounded-full border border-gray-300 text-xs font-medium tracking-wide text-gray-600 bg-white/50 backdrop-blur-sm cursor-pointer hover:bg-white transition-all">
              Buy & Rent
            </span>
          </div>

          {/* Subheading */}
          <span className="reveal-text text-xs font-bold tracking-[0.25em] text-gray-400 uppercase pt-2">
            Get Recommendations
          </span>

          {/* Core Headline */}
          <h1 className="reveal-text text-6xl md:text-7xl font-normal text-[#131B2D] leading-[1.08] tracking-tight font-serif">
            Homes.<br />
            Loans.<br />
            Agents.<br />
            Tours.
          </h1>

          {/* Supporting Paragraph */}
          <p className="reveal-text text-gray-500 text-base md:text-lg leading-relaxed font-light max-w-sm pt-2">
            A real estate agent can provide you with a clear full breakdown of costs so that you can avoid surprise expenses.
          </p>

          {/* Elegant Search Input */}
          <div className="reveal-text flex items-center space-x-3 pt-4 w-full max-w-md">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search location..."
                className="w-full bg-transparent border border-gray-300 rounded-full py-4 pl-6 pr-4 text-sm text-[#131B2D] focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-400 transition-all bg-white/20 backdrop-blur-[2px]"
              />
            </div>
            <button className="bg-[#131B2D] hover:bg-opacity-90 text-white rounded-full p-4 flex items-center justify-center shadow-lg shadow-gray-200 transition-transform active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Column - Fanning Scattered Cards Area */}
        <div className="lg:col-span-7 relative h-[500px] lg:h-[650px] flex items-center justify-center mt-12 lg:mt-0">
          <div className="relative w-[320px] h-[360px] md:w-[360px] md:h-[400px]">
            {CARDS_DATA.map((card, index) => (
              <div
                key={card.id}
                ref={(el) => (cardsRef.current[index] = el)}
                style={{ zIndex: card.zIndex }}
                className="absolute top-0 left-0 w-full bg-white rounded-3xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-gray-100/50 transform origin-center select-none group cursor-pointer"
              >
                {/* Image Container with Inner Overlay */}
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] w-full bg-gray-100">
                  <img
                    src={card.image}
                    alt={card.address}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none"
                  />
                </div>

                {/* Card Meta Content */}
                <div className="pt-4 pb-2 px-1 relative">
                  <h3 className="text-xl font-bold text-[#131B2D] tracking-tight">
                    {card.price}
                  </h3>
                  <p className="text-xs font-medium text-gray-500 mt-1 truncate">
                    {card.address}
                  </p>
                  
                  <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
                    <span className="text-[10px] font-medium tracking-wide text-gray-400 uppercase">
                      {card.specs}
                    </span>
                    
                    {/* Floating Heart Icon Button */}
                    <button className="w-7 h-7 rounded-full bg-[#EBF1FF] flex items-center justify-center text-[#407BFF] hover:bg-[#407BFF] hover:text-white transition-colors duration-300 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}