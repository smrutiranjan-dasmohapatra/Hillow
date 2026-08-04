import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import SectionHeader from "../components/common/SectionHeader"; // adjust the path

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

const AboutSection = () => {
  const sectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const imagesContainerRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Scrub-based reveal for text lines
      const textLines = textContainerRef.current?.querySelectorAll('.reveal-line');
      
      if (textLines && textLines.length > 0) {
        textLines.forEach((line) => {
          gsap.fromTo(
            line,
            { 
              yPercent: 120, 
              opacity: 0,
              clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
            },
            {
              yPercent: 0,
              opacity: 1,
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                end: 'top 20%',
                scrub: 1.5,
              }
            }
          );
        });
      }

      // Smooth bottom-up polygon clipping reveal for the left-side images
      const imageItems = imagesContainerRef.current?.querySelectorAll('.reveal-image-item');
      if (imageItems && imageItems.length > 0) {
        imageItems.forEach((imgItem, index) => {
          gsap.fromTo(
            imgItem,
            {
              clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
              scale: 1.15
            },
            {
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: `top ${75 - index * 10}%`,
                end: `top ${15 - index * 10}%`,
                scrub: 1.5,
              }
            }
          );
        });
      }

    }, section);

    return () => ctx.revert();
  }, []);

  const founders = [
    { name: 'Alexandre Vance', role: 'Principal Architect', image: '/images/f1.jpg' },
    { name: 'Elena Rostova', role: 'Creative Director', image: '/images/f2.jpg' },
    { name: 'Julian Thorne', role: 'Landscape Curator', image: '/images/f3.jpg' },
    { name: 'Siddharth Mehta', role: 'Design Principal', image: '/images/f4.jpg' },
    { name: 'Clara Dupond', role: 'Hospitality Lead', image: '/images/f5.jpg' },
  ];

  return (
    <section 
      ref={sectionRef} 
      id='about'
      className="relative w-full min-h-screen bg-white text-black px-6 sm:px-10 lg:px-20 py-20 flex flex-col justify-center overflow-hidden transition-all duration-500"
    >

           <SectionHeader
        title="THE Hillow / Founders & Members"
        subtitle="Engineered for Absolute Freedom"
        blockColor="#111111"
        textColor="#111111"
      />
      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        
        {/* Left Column: 1 Image on Mobile/Small screens, 2 Stacked Equal-Length Images on LG+ screens */}
        <div ref={imagesContainerRef} className="lg:col-span-4 w-full flex flex-col space-y-4">
          {/* Image 1 (Always Visible) */}
          <div className="w-full h-[380px] sm:h-[420px] lg:h-[470px] overflow-hidden relative bg-black/20">
            <div 
              className="reveal-image-item w-full h-full absolute inset-0 overflow-hidden transform-gpu will-change-[clip-path,transform]"
              style={{ clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' }}
            >
              <img 
                src="/images/i1.jpg" 
                alt="Hillow Desert Architecture" 
                className="w-full h-full grayscale object-cover"
              />
            </div>
          </div>

          {/* Image 2 (Hidden on mobile/sm, visible only on lg+) */}
          <div className="hidden lg:block w-full lg:h-[470px] overflow-hidden relative bg-black/20">
            <div 
              className="reveal-image-item w-full h-full absolute inset-0 overflow-hidden transform-gpu will-change-[clip-path,transform]"
              style={{ clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' }}
            >
              <img 
                src="/images/i.jpg" 
                alt="Hillow Desert Landscape" 
                className="w-full h-full grayscale object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Hillow Desert Resort Story */}
        <div 
          ref={textContainerRef}
          className="lg:col-span-8 flex flex-col justify-between space-y-6 lg:space-y-8"
        >
          {/* Paragraph 1 */}
          <div className="overflow-hidden py-1">
            <p className="reveal-line text-lg sm:text-xl lg:text-2xl font-normal leading-relaxed tracking-wide transform-gpu will-change-[transform,opacity,clip-path]"
               style={{ clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' }}
            >
              We are the team that shaped Hillow out of a deep reverence for the raw, quiet luxury of the desert landscape.
            </p>
          </div>

          {/* Paragraph 2 */}
          <div className="overflow-hidden py-1">
            <p className="reveal-line text-lg sm:text-xl lg:text-2xl font-normal leading-relaxed tracking-wide text-neutral-800 transform-gpu will-change-[transform,opacity,clip-path]"
               style={{ clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' }}
            >
              Every horizon, architectural contour, and quiet sanctuary we've built here is personal; our team cares intimately about how your stay feels, breathes, and connects you to the vastness around you.
            </p>
          </div>

          {/* Paragraph 3 */}
          <div className="overflow-hidden py-1">
            <p className="reveal-line text-lg sm:text-xl lg:text-2xl font-normal leading-relaxed tracking-wide text-neutral-800 transform-gpu will-change-[transform,opacity,clip-path]"
               style={{ clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' }}
            >
              Welcoming you to Hillow means sharing our personal sanctuary—turning untouched desert sands into an unforgettable retreat.
            </p>
          </div>

          {/* Always Visible Details Section featuring 5 Founders Grid */}
          <div className="mt-6 pt-6 border-t border-neutral-200 flex flex-col space-y-8">
            <div className="flex flex-col space-y-2">
              <h4 className="text-xl font-medium tracking-wide">The Visionaries Behind Hillow</h4>
              <p className="text-neutral-700 text-base sm:text-lg leading-relaxed">
                Founded by a dedicated collective of architects and hospitality curators, Hillow was born from a shared vision to merge minimalist luxury with the untamed, raw beauty of the desert.
              </p>
            </div>

            {/* 5 Founders Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {founders.map((founder, index) => (
                <div key={index} className="flex flex-col space-y-3">
                  <div className="w-full h-[220px] overflow-hidden relative bg-neutral-100">
                    <img 
                      src={founder.image} 
                      alt={founder.name} 
                      className="w-full h-full grayscale object-cover"
                    />
                  </div>
                  <div className="flex flex-col space-y-0.5">
                    <h5 className="text-sm font-medium text-black">{founder.name}</h5>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider">{founder.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutSection;