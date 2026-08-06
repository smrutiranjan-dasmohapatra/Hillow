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
  const [imagesReady, setImagesReady] = useState(false);

  // Handle Mobile Screen Detection & Resize Refresh (debounced)
  useEffect(() => {
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setIsMobile(window.innerWidth < 640);
        ScrollTrigger.refresh();
      }, 150);
    };

    setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const images = {
    hillow: isMobile ? "/images/Hillow-m.jpg" : "/images/Hillow.jpg",
    c1: isMobile ? "/images/c2-m.jpg" : "/images/c1.jpg",
    n: isMobile ? "/images/n-m.jpg" : "/images/n.jpg",
    r1: isMobile ? "/images/r1-m.jpg" : "/images/r1.jpg",
  };

  // Preload + decode every image before we let the reveal animation run.
  // This is what kills the "flash of blank / half-loaded" stutter on first scroll.
  useEffect(() => {
    let cancelled = false;
    setImagesReady(false);

    const sources = Object.values(images);
    Promise.all(
      sources.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => (img.decode ? img.decode().then(resolve).catch(resolve) : resolve());
            img.onerror = resolve; // don't block on a missing file
          })
      )
    ).then(() => {
      if (!cancelled) setImagesReady(true);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg || !imagesReady) return;

    const width = isMobile ? 200 : 400;
    const height = isMobile ? 300 : 200;

    const rects = gsap.utils.toArray('.reveal-rect');

    // GPU-accelerated: we animate `scaleX` via CSS transform instead of the
    // `points` attribute. Attribute animation forces the browser to
    // recompute clip geometry every frame — this is the #1 cause of scroll
    // jank in shutter/wipe reveals. A transform is composited for free.
    gsap.set(rects, {
      transformOrigin: '0% 50%',
      scaleX: 0,
      force3D: true,
    });
    gsap.set(svg, { autoAlpha: 1 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=350%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to('#reveal01', { scaleX: 1, duration: 1 }, 0)
        .to('#reveal02', { scaleX: 1, duration: 1 }, 1)
        .to('#reveal03', { scaleX: 1, duration: 1 }, 2);
    }, container);

    return () => {
      ctx.revert();
    };
  }, [isMobile, imagesReady]);

  const viewBoxWidth = isMobile ? 200 : 400;
  const viewBoxHeight = isMobile ? 300 : 200;

  return (
    <section
      id="gallery"
      ref={containerRef}
      className="relative w-full h-screen max-h-screen text-white flex flex-col justify-start px-4 sm:px-12 py-5 select-none overflow-hidden will-change-transform"
    >
      {/* Section Header */}
      <SectionHeader
        title="THE Hillow / Gallary & Vision"
        subtitle="Captured for Unfiltered Reflection"
        blockColor="#111111"
        textColor="#111111"
      />

      {/* Main content area */}
      <div className="w-full max-w-3xl mx-auto flex flex-col flex-grow relative overflow-hidden items-center justify-center my-auto">
        {/* Shutter Reveal Stage */}
        
          <svg
            id="svg"
            ref={svgRef}
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
            preserveAspectRatio="none"
            className="w-full h-full opacity-0 fill-current select-none max-h-[72vh] sm:max-h-[80vh] block transform-gpu object-contain"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="img1" patternUnits="userSpaceOnUse" width={viewBoxWidth} height={viewBoxHeight}>
                <image
                  href={images.hillow}
                  onError={(e) => e.currentTarget.setAttribute('href', '/images/Hillow.jpg')}
                  width={viewBoxWidth}
                  height={viewBoxHeight}
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>

              <pattern id="img2" patternUnits="userSpaceOnUse" width={viewBoxWidth} height={viewBoxHeight}>
                <image
                  href={images.c1}
                  onError={(e) => e.currentTarget.setAttribute('href', '/images/c1.jpg')}
                  width={viewBoxWidth}
                  height={viewBoxHeight}
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>

              <pattern id="img3" patternUnits="userSpaceOnUse" width={viewBoxWidth} height={viewBoxHeight}>
                <image
                  href={images.n}
                  onError={(e) => e.currentTarget.setAttribute('href', '/images/n.jpg')}
                  width={viewBoxWidth}
                  height={viewBoxHeight}
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>

              <pattern id="img4" patternUnits="userSpaceOnUse" width={viewBoxWidth} height={viewBoxHeight}>
                <image
                  href={images.r1}
                  onError={(e) => e.currentTarget.setAttribute('href', '/images/r1.jpg')}
                  width={viewBoxWidth}
                  height={viewBoxHeight}
                  preserveAspectRatio="xMidYMid slice"
                />
              </pattern>

              {/* Reveal clips: each is a single rect whose SCALE we animate,
                  never its geometry. transformBox: fill-box makes scaleX
                  anchor to this rect's own bounding box regardless of
                  viewBox size. */}
              <clipPath id="clip01">
                <rect
                  id="reveal01"
                  className="reveal-rect"
                  x="0"
                  y="0"
                  width={viewBoxWidth}
                  height={viewBoxHeight}
                  style={{ transformBox: 'fill-box' }}
                />
              </clipPath>

              <clipPath id="clip02">
                <rect
                  id="reveal02"
                  className="reveal-rect"
                  x="0"
                  y="0"
                  width={viewBoxWidth}
                  height={viewBoxHeight}
                  style={{ transformBox: 'fill-box' }}
                />
              </clipPath>

              <clipPath id="clip03">
                <rect
                  id="reveal03"
                  className="reveal-rect"
                  x="0"
                  y="0"
                  width={viewBoxWidth}
                  height={viewBoxHeight}
                  style={{ transformBox: 'fill-box' }}
                />
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
      
    </section>
  );
}