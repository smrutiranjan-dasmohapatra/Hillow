import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';

export default function FloatingModernSvg() {
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    // Get the total length of the SVG path for smooth drawing animation
    const length = path.getTotalLength();

    // Set up initial dasharray and dashoffset for drawing effect
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    // Animate the stroke drawing continuously
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 3,
      ease: "power3.inOut",
      repeat: -1,
      yoyo: true,
      repeatDelay: 0.5,
    });

    // Floating animation loop (sine-wave style bobbing + gentle rotation)
    gsap.to(containerRef.current, {
      y: -15,
      rotation: 3,
      duration: 4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, []);

  // Render via React Portal so it floats independently over any layout/page component
  return createPortal(
    <div 
      ref={containerRef}
      className="fixed bottom-8 right-8 z-50 w-24 h-24 sm:w-32 sm:h-32 p-3 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center pointer-events-auto group cursor-pointer hover:border-indigo-500/50 transition-colors duration-300"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      title="Scroll to Top / Floating Element"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 102 102"
        className="w-full h-full drop-shadow-[0_0_12px_rgba(99,102,241,0.4)] group-hover:scale-110 transition-transform duration-500"
        fill="none"
      >
        <path
          ref={pathRef}
          d="M50.5,50.5 C67.16667,50.5 83.83333,50.5 100.5,50.5 100.5,67.16667 100.5,83.83333 100.5,100.5 100.5,100.5 81.3,101.8 63.3,83.8 45.3,65.8 56,35.4 35.5,15.5 18.5,-1 0.5,0.5 0.5,0.5 0.5,17.16667 0.5,33.83333 0.5,50.5 17.16667,50.5 33.83333,50.5 50.5,50.5 50.5,50.5 76.1,49.9 88.5,32.5 100.9,15.1 100.5,0.5 100.5,0.5 83.83333,0.5 67.16667,0.5 50.5,0.5 50.5,33.83333 50.5,67.16667 50.5,100.5 33.83333,100.5 17.16667,100.5 0.5,100.5 0.5,100.5 0.2,80.7 11.8,68.2 23.4,55.7 40,49.7 50.5,50.5"
          stroke="url(#floatingGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        <defs>
          <linearGradient id="floatingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#fb7185" />
          </linearGradient>
        </defs>
      </svg>

      {/* Subtle Corner Markers */}
      <span className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/30" />
      <span className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/30" />
      <span className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-white/30" />
      <span className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/30" />
    </div>,
    document.body
  );
}