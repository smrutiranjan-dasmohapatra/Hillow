import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import SectionHeader from "../components/common/SectionHeader";

const REVIEWS_DATA = [
  {
    id: 1,
    client: "Lord & Lady Sterling",
    role: "Private Estates Collectors",
    location: "London & Geneva",
    rating: 5,
    quote: "The Hillow redefines spatial solitude. The transition from raw desert topography into absolute subterranean luxury is nothing short of a masterclass in modern architecture.",
    date: "Winter Acquisition"
  },
  {
    id: 2,
    client: "Dr. Alistair Vance",
    role: "Architectural Historian & Patron",
    location: "Zurich, Switzerland",
    rating: 5,
    quote: "Every material choice—from the micro-cement arrays to the basalt kitchen countertops—resonates with the surrounding geological scale. Pure structural brilliance.",
    date: "Autumn Residency"
  },
  {
    id: 3,
    client: "Elena Rostova",
    role: "Design Principal & Founder",
    location: "Milan, Italy",
    rating: 5,
    quote: "Absolute acoustic isolation and seamless horizon framing. Staying at The Hillow feels like inhabiting a living sculpture suspended in timeless calm.",
    date: "Spring Sojourn"
  }
];

export default function VillaTestimonials({ blockColor = "#3D4A3E", textColor = "#000000" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const contentRef = useRef(null);

  const activeReview = REVIEWS_DATA[currentIndex];

  const handleIndexChange = (newIndex) => {
    if (newIndex === currentIndex) return;

    gsap.to(contentRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setCurrentIndex(newIndex);
      }
    });
  };

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [currentIndex]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-white text-black flex flex-col justify-between px-4 sm:px-8 lg:px-12 py-12 select-none overflow-hidden box-border"
    >
      {/* Header */}
      <div className="flex-shrink-0 w-full max-w-7xl mx-auto">
        <SectionHeader
          title="THE HILLOW / Partner Feedback"
          subtitle="Verified Client & Resident Testimonials"
          blockColor="#111111"
          textColor="#111111"
        />
      </div>

      {/* Main Feedback Carousel Layout */}
      <div className="w-full max-w-5xl mx-auto flex flex-col justify-center items-center flex-grow my-auto py-8">
        
        {/* Testimonial Card Frame with Fixed Responsive Height */}
        <div 
          ref={cardRef}
          className="w-full bg-black border border-neutral-800 p-6 sm:p-10 md:p-14 relative shadow-sm flex flex-col justify-between h-[420px] sm:h-[380px] md:h-[360px]"
        >
          {/* Top Row: Rating & Index Indicator */}
          <div className="flex justify-between items-center w-full flex-shrink-0">
            <div className="flex items-center gap-1.5">
              {[...Array(activeReview.rating)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.399 8.168-7.333-3.854-7.333 3.854 1.399-8.168-5.934-5.787 8.2-1.192z" />
                </svg>
              ))}
            </div>
            
            <span className="text-xs font-mono tracking-widest text-neutral-400">
              0{currentIndex + 1} / 0{REVIEWS_DATA.length}
            </span>
          </div>

          {/* Dynamic Content Track (Locked inside middle space) */}
          <div ref={contentRef} className="flex flex-col justify-between flex-grow my-4">
            <p className="text-lg sm:text-xl md:text-2xl font-light leading-snug tracking-tight text-white line-clamp-4">
              "{activeReview.quote}"
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 border-t border-neutral-800">
              <div>
                <h4 className="text-sm sm:text-base font-semibold tracking-wide text-white">
                  {activeReview.client}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-400 font-light">
                  {activeReview.role} — <span className="text-neutral-200">{activeReview.location}</span>
                </p>
              </div>

              <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                {activeReview.date}
              </span>
            </div>
          </div>

          {/* Navigation Controls inside card bottom right */}
          <div className="absolute bottom-6 right-6 sm:right-10 flex items-center gap-2">
            {REVIEWS_DATA.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleIndexChange(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === idx ? 'w-8 bg-white' : 'w-2 bg-neutral-700'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Quick Navigation Controls Bottom Row */}
        <div className="w-full flex justify-between items-center mt-6 px-2">
          <button
            onClick={() => handleIndexChange((currentIndex - 1 + REVIEWS_DATA.length) % REVIEWS_DATA.length)}
            className="text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-black transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>← Previous Review</span>
          </button>

          <span className="text-xs text-neutral-400 font-mono tracking-wider hidden sm:inline">
            THE HILLOW ARCHITECTURAL ARCHIVES
          </span>

          <button
            onClick={() => handleIndexChange((currentIndex + 1) % REVIEWS_DATA.length)}
            className="text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-black transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>Next Review →</span>
          </button>
        </div>

      </div>
    </section>
  );
}