import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import SectionHeader from "../components/common/SectionHeader";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

const FEATURE_DATA = [
  {
    id: 'lounge',
    title: 'Sunken Villa Lounge',
    leftImg: '/images/Hillow.jpg',
    rightImg: '/images/c1.jpg',
    subtitle: 'Engineered for Elevated Living',
    details: 'A subterranean structural sanctuary engineered into raw terrain, featuring an integrated linear hearth and custom low-profile seating contours. Formed from micro-cement architectures to resist thermal extremes while delivering absolute acoustic isolation.',
  },
  {
    id: 'capsule',
    title: 'Panoramic Glass Pavilion',
    leftImg: '/images/c2.jpg',
    rightImg: '/images/c3.jpg',
    subtitle: 'Structural Transparency',
    details: 'Suspended over deep topographical geometry, this structural capsule utilizes monolithic double-glazed structural glass panes. Features integrated environmental climate arrays and a structural steel skeletal outrigger frame.',
  },
  {
    id: 'pool',
    title: 'Infinity Horizon Pool',
    leftImg: '/images/pool-1.jpg',
    rightImg: '/images/pool-2.jpg',
    subtitle: 'Fluid Horizon Matrix',
    details: 'A fully cantilevered monolithic basin that merges seamlessly with changing horizon levels. Engineered with a hidden continuous overflow perimeter system and sand-tinted concrete matrices matching surrounding geological features.',
  },
  {
    id: 'wellness',
    title: 'Private Wellness & Spa',
    leftImg: '/images/spaa.jpg',
    rightImg: '/images/spaa-2.jpg',
    subtitle: 'Acoustic & Light Isolation',
    details: 'Equipped with an automated structural aperture layout and specialized zero-light-pollution lens configurations. The floor plan utilizes a floating deck platform to mitigate deep geological resonance vectors.',
  },
  {
    id: 'restaurant',
    title: 'Culinary & Private Dining',
    leftImg: '/images/r2.jpg',
    rightImg: '/images/r1.jpg',
    subtitle: 'Subterranean Gastronomy',
    details: 'An open-concept subterranean culinary vault with a cantilevered chef table, temperature-controlled vintage cellar, and custom basalt stone countertops. Designed for private gastronomic experiences surrounded by raw stone textures.',
  },
];

export default function VillaFeatures({
  blockColor = "#3D4A3E", 
  textColor = "#000000"   
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const sectionRef = useRef(null);
  const headerContainerRef = useRef(null);
  const rightContainerRef = useRef(null);
  const textRefs = useRef([]);
  const arrowRefs = useRef([]);
  const modalRef = useRef(null);
  const modalContentRef = useRef(null);
  const innerContentRef = useRef(null);

  // Preload Images
  useEffect(() => {
    FEATURE_DATA.forEach((item) => {
      const l = new Image();
      l.src = item.leftImg;
      const r = new Image();
      r.src = item.rightImg;
    });
  }, []);

  // GSAP Scroll Animations & Pinning Controller
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      
      // 1. HEADER ANIMATION
      const headerTargets = headerContainerRef.current?.querySelectorAll(".redact-target");
      if (headerTargets) {
        headerTargets.forEach((el) => {
          const split = new SplitText(el, { type: "words" });

          split.words.forEach((word) => {
            word.style.backgroundImage = `linear-gradient(${blockColor}, ${blockColor})`;
            word.style.backgroundSize = "100% 100%";
            word.style.backgroundRepeat = "no-repeat";
            word.style.color = "transparent";
            word.style.padding = "2px 4px";
            word.style.borderRadius = "2px";
            word.style.display = "inline-block";
          });

          const headerTl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none reverse",
            }
          });

          split.words.forEach((word, index) => {
            const delay = index * 0.07;
            headerTl.to(word, {
              backgroundSize: "0% 100%",
              duration: 0.22,
              ease: "power2.inOut"
            }, delay)
            .to(word, {
              color: textColor,
              duration: 0.15
            }, delay + 0.06);
          });
        });
      }

      // 2. MAIN PINNING & RIGHT IMAGE CONTAINER SWAP CONTROLLER
      const revealLayers = gsap.utils.toArray('.reveal-layer');
      const revealImages = gsap.utils.toArray('.reveal-img');

      gsap.set(revealLayers, { xPercent: -100, autoAlpha: 1 });
      gsap.set(revealImages, { xPercent: 100, scale: 1.15 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 4%',
          end: `+=${FEATURE_DATA.length * 90}%`,
          pin: true,
          scrub: 1.2,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        }
      });

      FEATURE_DATA.forEach((_, index) => {
        if (index === 0) return;

        tl.to({}, {
          duration: 0.5,
          onStart: () => setActiveIndex(index),
          onReverseComplete: () => setActiveIndex(index - 1)
        }, '+=0.2');

        const activeReveals = rightContainerRef.current?.querySelectorAll(`.reveal-layer-${index}`);
        const activeImgs = rightContainerRef.current?.querySelectorAll(`.reveal-img-${index}`);

        tl.to(activeReveals, {
          xPercent: 0,
          duration: 1.2,
          ease: 'power2.inOut'
        }, '<');

        tl.to(activeImgs, {
          xPercent: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power2.inOut'
        }, '<');
      });

      tl.to({}, { duration: 0.5 });

    }, section);

    return () => ctx.revert();
  }, [blockColor, textColor]);

  // Arrow Hover Handlers with GSAP Smooth Transition
  const handleMouseEnter = (index) => {
    if (arrowRefs.current[index]) {
      gsap.to(arrowRefs.current[index], {
        x: 8,
        scale: 1.2,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = (index) => {
    if (arrowRefs.current[index]) {
      gsap.to(arrowRefs.current[index], {
        x: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  // Modal Animation Configuration
  useEffect(() => {
    if (selectedFeature && modalRef.current && modalContentRef.current) {
      const ctx = gsap.context(() => {
        const openTl = gsap.timeline();

        gsap.set(modalRef.current, { autoAlpha: 0 });
        gsap.set(modalContentRef.current, {
          y: -80,
          scaleX: 0.4,
          scaleY: 0.1,
          clipPath: 'inset(0% 0% 100% 0%)',
          opacity: 0
        });
        gsap.set(innerContentRef.current, { opacity: 0, y: 15 });

        openTl.to(modalRef.current, {
          autoAlpha: 1,
          duration: 0.35,
          ease: 'power2.out'
        })
        .to(modalContentRef.current, {
          y: 0,
          scaleX: 1,
          scaleY: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          duration: 0.7,
          ease: 'power4.inOut'
        }, '-=0.15')
        .to(innerContentRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out'
        }, '-=0.25');
      });

      return () => ctx.revert();
    }
  }, [selectedFeature]);

  const closeModal = () => {
    if (!modalRef.current || !modalContentRef.current) return;

    const closeTl = gsap.timeline({
      onComplete: () => setSelectedFeature(null)
    });

    closeTl.to(innerContentRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.2,
      ease: 'power2.in'
    })
    .to(modalContentRef.current, {
      y: -60,
      scaleX: 0.4,
      scaleY: 0.1,
      clipPath: 'inset(0% 0% 100% 0%)',
      opacity: 0,
      duration: 0.45,
      ease: 'power3.inOut'
    }, '-=0.1')
    .to(modalRef.current, {
      autoAlpha: 0,
      duration: 0.25,
      ease: 'power2.out'
    }, '-=0.2');
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full min-h-screen lg:h-screen lg:max-h-screen bg-white text-black flex flex-col justify-start px-4 sm:px-8 lg:px-12 py-4 sm:py-5 select-none overflow-y-auto lg:overflow-hidden box-border"
      >
        {/* Section Header */}
        <div ref={headerContainerRef} className="flex-shrink-0">
          <SectionHeader
            title="THE HILLOW / Features & Form"
            subtitle="Engineered for Elevated Living"
            blockColor="#111111"
            textColor="#111111"
          />
        </div>

        {/* Main Content Layout */}
        <div className="w-full max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-around flex-grow gap-6 md:gap-12 lg:gap-16 relative my-auto py-2">

          {/* Left Column (Text Stack) */}
          <div className="flex flex-col justify-center w-full md:w-1/2 z-20 space-y-4 md:space-y-6">
            
            {/* Title Selection Track */}
            <div className="space-y-1.5 sm:space-y-2 lg:space-y-3 w-full">
              {FEATURE_DATA.map((item, i) => {
                const isActive = activeIndex === i;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between group cursor-pointer py-1.5 sm:py-2.5 relative"
                    onClick={() => setSelectedFeature(item)}
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={() => handleMouseLeave(i)}
                  >
                    <div className="flex items-center gap-4 sm:gap-6">
                      {/* Modern Fluid Line / Numeric Indicator */}
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] sm:text-xs font-mono tracking-widest transition-colors duration-500 ${isActive ? 'text-black font-semibold' : 'text-neutral-400'}`}>
                          0{i + 1}
                        </span>
                        <div className="relative w-8 sm:w-12 h-[2px] bg-neutral-200 overflow-hidden rounded-full">
                          <div 
                            className={`absolute inset-0 bg-black transition-transform duration-500 ease-out origin-left ${isActive ? 'scale-x-100' : 'scale-x-0'}`} 
                          />
                        </div>
                      </div>

                      <h2
                        ref={(el) => (textRefs.current[i] = el)}
                        className={`text-[4.8vw] sm:text-[3.2vw] md:text-[1.9vw] lg:text-[2vw] font-light tracking-tight leading-none transition-all duration-500 ease-out transform-gpu block whitespace-nowrap text-left ${
                          isActive
                            ? 'text-black font-normal translate-x-2 opacity-100'
                            : 'text-black opacity-40 hover:opacity-70'
                        }`}
                      >
                        {item.title}
                      </h2>
                    </div>

                    {/* Smooth Animated Arrow Icon & Tap Cue */}
                    <div className="flex items-center gap-3">
                      <span className={`inline-block text-[9px] sm:text-[10px] tracking-widest uppercase font-mono transition-all duration-300 ${isActive ? 'opacity-70 translate-x-0' : 'opacity-0 translate-x-2'}`}>
                        <span className="inline sm:hidden">View</span>
                        <span className="hidden sm:inline">Tap for Detail</span>
                      </span>
                      <div
                        ref={(el) => (arrowRefs.current[i] = el)}
                        className={`text-black flex items-center justify-center transition-opacity duration-500 ${
                          isActive ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 stroke-[1.5]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeLinejoin="round"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column (Image Preview Card) */}
          <div
            ref={rightContainerRef}
            className="w-full sm:w-[85%] md:w-1/2 aspect-[16/10] sm:aspect-[16/11] md:aspect-[4/3] max-h-[35vh] sm:max-h-[42vh] md:max-h-[58vh] relative overflow-hidden bg-neutral-100 flex-shrink-0 mx-auto"
          >
            {/* Base Image Layer */}
            <img
              src={FEATURE_DATA[0].leftImg}
              alt="Base Feature View"
              className="w-full h-full object-cover absolute inset-0 z-0"
            />

            {/* Scroll Reveal Layers */}
            {FEATURE_DATA.slice(1).map((item, idx) => {
              const actualIndex = idx + 1;
              return (
                <div 
                  key={`right-layer-${item.id}`} 
                  className={`reveal-layer reveal-layer-${actualIndex} absolute inset-0 w-full h-full overflow-hidden z-10 opacity-0`}
                >
                  <img
                    src={item.leftImg}
                    alt="Reveal Feature View"
                    className={`reveal-img reveal-img-${actualIndex} w-full h-full object-cover absolute inset-0`}
                  />
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Full Screen Glass Mask Modal Portal */}
      {selectedFeature && createPortal(
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 sm:p-6 md:p-10 pointer-events-auto opacity-0"
          onClick={closeModal}
        >
          <div
            ref={modalContentRef}
            className="modal-content w-full max-w-5xl bg-white overflow-hidden shadow-2xl max-h-[90vh] md:max-h-[80vh] transform-gpu origin-top"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              ref={innerContentRef}
              className="w-full h-full flex flex-col md:flex-row will-change-transform"
            >
              <div className="w-full md:w-1/2 h-[30vh] sm:h-[35vh] md:h-auto p-4 sm:p-6 md:p-10 relative overflow-hidden">
                <img
                  src={selectedFeature.leftImg}
                  alt={selectedFeature.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-between bg-white overflow-y-auto">
                <div>
                  <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400 block mb-2">
                    Architectural System
                  </span>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-black tracking-tight leading-tight mb-4 md:mb-6">
                    {selectedFeature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
                    {selectedFeature.details}
                  </p>
                </div>

                <div className="mt-6 md:mt-0 pt-6 border-t border-neutral-100 flex justify-between items-center">
                  <span className="text-xs text-neutral-400 font-mono tracking-tight">
                    SYS-ID: {selectedFeature.id.toUpperCase()}_04
                  </span>
                  <button
                    onClick={closeModal}
                    className="text-sm uppercase tracking-wider font-semibold px-5 py-2.5 bg-black text-white hover:bg-neutral-900 transition-colors duration-200 cursor-pointer"
                  >
                    Close Interface
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}