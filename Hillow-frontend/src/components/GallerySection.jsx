import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from "../components/common/SectionHeader";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function GallerySection() {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Handle Mobile Screen Detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;

    // Viewport dimensions for SVG coordinates
    const width = isMobile ? 200 : 400;
    const height = isMobile ? 300 : 200;

    // Force an immediate set to 0 height on mount / resize so it never flashes full size
    gsap.set(['#poly01', '#poly02', '#poly03'], {
      attr: { points: `0,0 ${width},0 ${width},0 0,0` },
    });
    gsap.set(svg, { autoAlpha: 1 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=300%', // Optimized length to ensure smooth step-by-step completion without sticking
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Reveal layers down to full viewport height sequentially
      tl.to('#poly01', { attr: { points: `0,0 ${width},0 ${width},${height} 0,${height}` }, duration: 1 }, 0)
        .to('#poly02', { attr: { points: `0,0 ${width},0 ${width},${height} 0,${height}` }, duration: 1 }, 1)
        .to('#poly03', { attr: { points: `0,0 ${width},0 ${width},${height} 0,${height}` }, duration: 1 }, 2);
    }, container);

    return () => {
      ctx.revert();
    };
  }, [isMobile]);

  // Image source mappings based on viewport size
  const images = {
    hillow: isMobile ? "/images/Hillow-m.jpg" : "/images/Hillow.jpg",
    c1: isMobile ? "/images/c2-m.jpg" : "/images/c1.jpg",
    n: isMobile ? "/images/n-m.jpg" : "/images/n.jpg",
    r1: isMobile ? "/images/r1-m.jpg" : "/images/r1.jpg",
  };

  const viewBoxWidth = isMobile ? 200 : 400;
  const viewBoxHeight = isMobile ? 300 : 200;

  return (
    <section
      id="gallery"
      ref={containerRef}
      className="relative w-full h-screen max-h-screen bg-black text-white flex flex-col justify-start px-6 sm:px-12 py-5 select-none overflow-hidden"
    >
      {/* Section Header */}
      <SectionHeader
        title="THE Hillow / Gallary & Vision"
        subtitle="Captured for Unfiltered Reflection"
        blockColor="#FFFFFFCC"
        textColor="#FFFFFF"
      />

      {/* Main content area */}
      <div className="w-full max-w-3xl mx-auto flex flex-col flex-grow relative overflow-hidden">
        {/* Shutter Reveal Stage */}
        <div className="w-full flex-grow min-h-0 relative flex items-center justify-center overflow-hidden bg-black">
          <svg
            id="svg"
            ref={svgRef}
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
            preserveAspectRatio="none"
            className="w-full h-full opacity-0 fill-current select-none max-h-[80vh] block"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Base Image: Hillow Villa */}
              <pattern id="img1" patternUnits="userSpaceOnUse" width={viewBoxWidth} height={viewBoxHeight}>
                <image
                  href={images.hillow}
                  onError={(e) => e.currentTarget.setAttribute('href', '/images/Hillow.jpg')}
                  width={viewBoxWidth}
                  height={viewBoxHeight}
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>

              {/* Layer 1 Image: Capsule House (c1) */}
              <pattern id="img2" patternUnits="userSpaceOnUse" width={viewBoxWidth} height={viewBoxHeight}>
                <image
                  href={images.c1}
                  onError={(e) => e.currentTarget.setAttribute('href', '/images/c1.jpg')}
                  width={viewBoxWidth}
                  height={viewBoxHeight}
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>

              {/* Layer 2 Image: Nature (n) */}
              <pattern id="img3" patternUnits="userSpaceOnUse" width={viewBoxWidth} height={viewBoxHeight}>
                <image
                  href={images.n}
                  onError={(e) => e.currentTarget.setAttribute('href', '/images/n.jpg')}
                  width={viewBoxWidth}
                  height={viewBoxHeight}
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>

              {/* Layer 3 Image: Restaurant (r1) */}
              <pattern id="img4" patternUnits="userSpaceOnUse" width={viewBoxWidth} height={viewBoxHeight}>
                <image
                  href={images.r1}
                  onError={(e) => e.currentTarget.setAttribute('href', '/images/r1.jpg')}
                  width={viewBoxWidth}
                  height={viewBoxHeight}
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>

              {/* Clip paths set explicitly to collapsed flat top initially */}
              <clipPath id="clip01">
                <polygon id="poly01" points={`0,0 ${viewBoxWidth},0 ${viewBoxWidth},0 0,0`} />
              </clipPath>

              <clipPath id="clip02">
                <polygon id="poly02" points={`0,0 ${viewBoxWidth},0 ${viewBoxWidth},0 0,0`} />
              </clipPath>

              <clipPath id="clip03">
                <polygon id="poly03" points={`0,0 ${viewBoxWidth},0 ${viewBoxWidth},0 0,0`} />
              </clipPath>
            </defs>

            {/* Base Layer */}
            <g>
              <rect x="0" y="0" width={viewBoxWidth} height={viewBoxHeight} fill="url(#img1)" />
            </g>

            {/* Layer 1 Reveal */}
            <g clipPath="url(#clip01)">
              <rect x="0" y="0" width={viewBoxWidth} height={viewBoxHeight} fill="url(#img2)" />
            </g>

            {/* Layer 2 Reveal */}
            <g clipPath="url(#clip02)">
              <rect x="0" y="0" width={viewBoxWidth} height={viewBoxHeight} fill="url(#img3)" />
            </g>

            {/* Layer 3 Reveal */}
            <g clipPath="url(#clip03)">
              <rect x="0" y="0" width={viewBoxWidth} height={viewBoxHeight} fill="url(#img4)" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}