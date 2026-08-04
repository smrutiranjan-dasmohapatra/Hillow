import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function WebsiteLoader({ onLoadingComplete }) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [counter, setCounter] = useState(0);

  const containerRef = useRef(null);
  const textContainerRef = useRef(null);
  const barRef = useRef(null);
  const svgRef = useRef(null);
  const pathRefs = useRef([]);

  const onLoadingCompleteRef = useRef(onLoadingComplete);
  useEffect(() => {
    onLoadingCompleteRef.current = onLoadingComplete;
  }, [onLoadingComplete]);

  // Background SVG Path Drawing Animation for Edge-to-Edge Desert Map, Mountains, Lake & Trees
  useEffect(() => {
    const paths = pathRefs.current;
    if (!paths.length) return;

    const svgTl = gsap.timeline({ repeat: -1, yoyo: true });

    paths.forEach((path, index) => {
      if (!path) return;
      const length = path.getTotalLength();

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });

      svgTl.to(path, {
        strokeDashoffset: 0,
        duration: 3.5,
        ease: "power2.inOut",
      }, index * 0.06);
    });

    return () => {
      svgTl.kill();
    };
  }, []);

  useEffect(() => {
    // Immediate hard set before any paint to avoid any flash/glitch frame
    gsap.set(containerRef.current, { scaleY: 1, transformOrigin: "bottom", opacity: 1 });
    const letters = textContainerRef.current.querySelectorAll('.letter');

    // Number counter animation extended to 3.8 seconds
    const counterObj = { val: 0 };
    gsap.to(counterObj, {
      val: 100,
      duration: 3.8,
      ease: "power2.inOut",
      onUpdate: () => {
        setCounter(Math.round(counterObj.val));
      }
    });

    // Master timeline
    const tl = gsap.timeline({
      onComplete: () => {
        const exitTl = gsap.timeline({
          onComplete: () => {
            setIsCompleted(true);
            onLoadingCompleteRef.current?.();
          }
        });

        // Clean exit matching TransitionOverlay: fade out text and wipe up smoothly
        exitTl.to(textContainerRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.2
        })
        .to(barRef.current, {
          opacity: 0,
          duration: 0.1
        }, "-=0.2")
        .to(containerRef.current, {
          scaleY: 0,
          duration: 0.45,
          ease: "power4.inOut",
          transformOrigin: "top"
        }, "-=0.1");
      }
    });

    // Initial states set instantly inside effect
    gsap.set(barRef.current, { scaleX: 0, transformOrigin: "left" });
    gsap.set(letters, { 
      opacity: 0, 
      y: 60, 
      rotateX: 90, 
      transformOrigin: "bottom center",
      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" 
    });

    // Animation Choreography
    tl.to(letters, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
      stagger: 0.08,
      duration: 0.9,
      ease: "power3.out"
    }, 0.05)
    .to(barRef.current, {
      scaleX: 1,
      duration: 3.8,
      ease: "power2.inOut"
    }, 0);

    return () => {
      tl.kill();
    };
  }, []);

  if (isCompleted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-amber-50 text-black select-none overflow-hidden opacity-0 m-0 p-0 w-screen h-screen"
      style={{ transformOrigin: "bottom", width: "100vw", height: "100vh" }}
    >
      {/* Absolute True Edge-to-Edge Full Screen SVG Desert Map Landscape (No Padding / No Margins) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none opacity-20 m-0 p-0">
        <svg
          ref={svgRef}
          viewBox="0 0 1920 1080"
          preserveAspectRatio="none"
          className="w-full h-full block m-0 p-0"
          fill="none"
        >
          {/* Horizon Mountain Ridges spanning entire width - Sharp Edges */}
          <path
            ref={(el) => (pathRefs.current[0] = el)}
            d="M0,250 L200,100 L400,220 L600,130 L800,240 L1000,110 L1200,220 L1400,150 L1600,230 L1800,120 L1920,180 L1920,1080 L0,1080 Z"
            stroke="#000000"
            strokeWidth="2"
            strokeLinejoin="miter"
          />
          <path
            ref={(el) => (pathRefs.current[1] = el)}
            d="M0,350 L300,250 L550,340 L850,230 L1150,330 L1450,240 L1750,320 L1920,330"
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinejoin="miter"
          />

          {/* Rolling Desert Dunes Midground Layers */}
          <path
            ref={(el) => (pathRefs.current[2] = el)}
            d="M0,520 Q480,440 960,540 T1920,500 L1920,1080 L0,1080 Z"
            stroke="#000000"
            strokeWidth="2"
          />
          <path
            ref={(el) => (pathRefs.current[3] = el)}
            d="M0,720 Q500,640 1000,740 T1920,700 L1920,1080 L0,1080 Z"
            stroke="#000000"
            strokeWidth="1.5"
          />

          {/* Central Desert Lake / Oasis Water Body */}
          <path
            ref={(el) => (pathRefs.current[4] = el)}
            d="M750,580 Q960,520 1180,600 T1050,720 Q900,780 780,700 Z"
            stroke="#000000"
            strokeWidth="2.5"
          />

          {/* Winding Roads and Pathways across the screen */}
          <path
            ref={(el) => (pathRefs.current[5] = el)}
            d="M0,900 Q400,820 700,680 T1300,620 Q1600,580 1920,450"
            stroke="#000000"
            strokeWidth="1.5"
            strokeDasharray="8 8"
          />

          {/* Scattered Luxury Villas / Modern Capsule Units across full screen */}
          <rect
            ref={(el) => (pathRefs.current[6] = el)}
            x="350"
            y="420"
            width="120"
            height="70"
            rx="25"
            stroke="#000000"
            strokeWidth="2"
          />
          <rect
            ref={(el) => (pathRefs.current[7] = el)}
            x="200"
            y="650"
            width="140"
            height="80"
            rx="30"
            stroke="#000000"
            strokeWidth="2"
          />
          <rect
            ref={(el) => (pathRefs.current[8] = el)}
            x="1350"
            y="550"
            width="150"
            height="85"
            rx="32"
            stroke="#000000"
            strokeWidth="2"
          />
          <rect
            ref={(el) => (pathRefs.current[9] = el)}
            x="1550"
            y="750"
            width="130"
            height="75"
            rx="28"
            stroke="#000000"
            strokeWidth="2"
          />

          {/* Palm Trees / Forest Clusters */}
          <circle ref={(el) => (pathRefs.current[10] = el)} cx="680" cy="620" r="20" stroke="#000000" strokeWidth="1.5" />
          <circle ref={(el) => (pathRefs.current[11] = el)} cx="720" cy="590" r="24" stroke="#000000" strokeWidth="1.5" />
          <circle ref={(el) => (pathRefs.current[12] = el)} cx="1220" cy="660" r="22" stroke="#000000" strokeWidth="1.5" />
          <circle ref={(el) => (pathRefs.current[13] = el)} cx="1260" cy="690" r="18" stroke="#000000" strokeWidth="1.5" />
          <circle ref={(el) => (pathRefs.current[14] = el)} cx="1500" cy="780" r="20" stroke="#000000" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Center Large Text Container */}
      <div className="flex flex-col items-center justify-center px-6 text-center z-10 m-0 p-0">
        <div
          ref={textContainerRef}
          className="flex items-center overflow-hidden py-4 text-6xl sm:text-9xl font-bold tracking-tight"
          style={{ perspective: "1000px" }}
        >
          <span className="letter inline-block will-change-transform text-black">H</span>
          <span className="letter inline-block will-change-transform text-black">I</span>
          <span className="letter inline-block will-change-transform text-black">L</span>
          <span className="letter inline-block will-change-transform text-black">L</span>
          <span className="letter inline-block will-change-transform text-black">O</span>
          <span className="letter inline-block will-change-transform text-black">W</span>
        </div>
      </div>

      {/* Larger Counter Percentage Displayed on the Bottom Right */}
      <div className="absolute bottom-6 right-8 z-30 text-4xl sm:text-6xl font-bold tracking-tighter text-black/90">
        {counter}%
      </div>

      {/* Thin progress bar attached completely to the bottom edge of the screen */}
      <div className="absolute bottom-0 left-0 w-full h-[4px] overflow-hidden z-20 m-0 p-0">
        <div
          ref={barRef}
          className="absolute inset-0 bg-black/70"
        />
      </div>
    </div>
  );
}