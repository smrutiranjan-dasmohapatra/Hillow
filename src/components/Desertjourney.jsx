import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STOPS = [
  {
    coord: "24.6837°N   46.5892°E",
    eyebrow: "Arrival Gateway",
    title: "Welcome to the Desert Retreat",
    copy: "Your journey begins at the private arrival pavilion, where every guest is welcomed before entering the peaceful, uninterrupted landscape of the resort.",
    image: "/.jpg",
    reverse: false,
  },
  {
    coord: "24.6212°N   46.6104°E",
    eyebrow: "Wellness Oasis",
    title: "Spa & Infinity Pool",
    copy: "Relax with restorative spa treatments, an architectural infinity pool, and open-air lounges surrounded by the deep, restorative silence of the desert.",
    image: "/spaa.jpg",
    reverse: true,
  },
  {
    coord: "24.5904°N   46.6533°E",
    eyebrow: "Private Stay",
    title: "Your Capsule Villa",
    copy: "A secluded modern capsule designed for absolute comfort, privacy, and uninterrupted views of the surrounding desert landscape.",
    image: "/v.jpg",
    reverse: false,
  },
];

export default function DesertJourney() {
  const wrapRef = useRef(null);
  const pathRef = useRef(null);
  const vehicleRef = useRef(null);
  const stopRefs = useRef([]);
  const imageRefs = useRef([]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();

    // Initial SVG line configuration
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    // Extracted vehicle-position logic so it can be called immediately on mount
    // AND on every scroll update — this is the fix for the "car stuck in corner" bug.
    const updateVehicle = (progress) => {
      path.style.strokeDashoffset = String(length * (1 - progress));

      try {
        // Fetch current point positions along the vector coordinates
        const pt = path.getPointAtLength(progress * length);

        // Fetch a tiny offset point down the trail to accurately compute directional angle
        const lookAheadLength = Math.min(length, progress * length + 1);
        const ptAhead = path.getPointAtLength(lookAheadLength);

        // Calculate the exact rotation angle in degrees
        const angle =
          Math.atan2(ptAhead.y - pt.y, ptAhead.x - pt.x) * (180 / Math.PI);

        // Update position transform matrix along with directional alignment rotation
        gsap.set(vehicleRef.current, {
          x: pt.x,
          y: pt.y,
          rotation: angle,
          transformOrigin: "50% 50%",
        });
      } catch (e) {
        // Guard against unmounted path layout updates
      }
    };

    // 🔑 FIX: place the vehicle at the path's true starting point immediately,
    // instead of leaving it un-transformed at (0,0) until the first scroll event fires.
    updateVehicle(0);

    // 1. Draw Path + Dynamic Vehicle Orientation Progress Tracking
    const drawTrigger = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: "top 70%",
      end: "bottom 30%",
      scrub: 1,
      onUpdate: (self) => updateVehicle(self.progress),
      onRefresh: (self) => updateVehicle(self.progress), // re-sync on resize/layout refresh
    });

    // Floating mountain mist/firefly particles
    const particleTweens = [];
    const particles = gsap.utils.toArray(".journey-particle");
    particles.forEach((p) => {
      const tween = gsap.to(p, {
        x: "random(-5, 5)",
        y: "random(-7, 7)",
        duration: "random(4, 8)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      particleTweens.push(tween);
    });

    // 2. Elegant Fade + Rise for text cards as they enter view
    const cardTriggers = [];
    stopRefs.current.forEach((el) => {
      if (!el) return;
      const cardsTween = gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
      cardTriggers.push(cardsTween);
    });

    // 3. Cinematic Vertical Parallax Drift
    const parallaxTweens = [];
    imageRefs.current.forEach((img, i) => {
      if (!img) return;
      const parallax = gsap.fromTo(
        img,
        { yPercent: i % 2 === 0 ? -12 : 12 },
        {
          yPercent: i % 2 === 0 ? 12 : -12,
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      parallaxTweens.push(parallax);
    });

    return () => {
      drawTrigger.kill();
      particleTweens.forEach((t) => t.kill());
      cardTriggers.forEach((t) => t.scrollTrigger && t.scrollTrigger.kill());
      parallaxTweens.forEach((t) => t.scrollTrigger && t.scrollTrigger.kill());
    };
  }, []);

  return (
    <section className="relative bg-amber-200/30 overflow-hidden w-full text-[#f3ede1] py-28 px-[6vw] font-sans">
      {/* Intro Header aligned with Hero Aesthetic */}
      <div className="max-w-[640px] mb-20 md:mb-32">
        <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-black font-semibold">
          THE RESORT / The Journey
        </span>
        <h2 className="font-sans font-normal text-black text-5xl md:text-7xl leading-[1.05] mt-4 mb-6 tracking-[-0.06em] uppercase">
          Every Path <br />
          <span className="font-normal text-black">Leads to Peace.</span>
        </h2>
      </div>

      {/* SVG Path Tracker & Stop Cards Grid */}
      <div ref={wrapRef} className="relative overflow-visible max-w-7xl mx-auto">
        {/* Dynamic Route Tracker SVG Overlay */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 100 300"
          preserveAspectRatio="none"
        >
          {/* Jagged Mountain Trail Path adjusted to start near top-left corner (5% x, 5% y) */}
          <path
            ref={pathRef}
            d="M 5 15 
               L 65 24 
               L 73 42 
               L 42 61 
               L 50 78 
               L 22 98 
               L 38 116 
               L 28 134 
               L 62 153 
               L 51 172 
               L 82 192 
               L 60 216 
               L 42 234 
               L 28 250 
               L 52 271 
               L 78 292"
            fill="none"
            stroke="#4a4436"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="opacity-40"
          />

          {/* Floating Firefly/Mist Particles */}
          {[
            [35, 30], [55, 45], [75, 60], [28, 80], [45, 110],
            [68, 125], [18, 145], [80, 165], [38, 185], [58, 205],
            [72, 225], [22, 245], [48, 260], [62, 275], [82, 115],
          ].map(([cx, cy], idx) => (
            <circle
              key={idx}
              className="journey-particle"
              cx={cx}
              cy={cy}
              r={0.4 + (idx % 3) * 0.2}
              fill="#7BAE7F"
              opacity={0.12 + (idx % 4) * 0.05}
            />
          ))}

          {/* Static Hub Junctions (adjusted the first hub to match the new start path coordinate) */}
          {[
            [5, 15],
            [22, 98],
            [82, 192],
            [78, 292],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="2.5" fill="#4a4436" />
          ))}

          {/* Dynamic Interactive Moving Vehicle Element */}
          <g ref={vehicleRef} className="will-change-transform">
            {/* Base sizing bounding boundary context box wrapper */}
            <g transform="translate(-4, -2)">
              {/* Sleek Minimalist Luxury Vehicle Top-down Vector Path Outline */}
              <path
                d="M 1 1.5 C 1 0.7, 2 0.5, 4 0.5 C 6 0.5, 7 0.7, 7 1.5 L 7.5 2 L 7.5 3.5 L 7 4 C 7 4.8, 6 5, 4 5 C 2 5, 1 4.8, 1 4 L 0.5 3.5 L 0.5 2 Z"
                fill="#7BAE7F"
              />
              {/* Windshield & Cabin Details */}
              <path
                d="M 2.5 1.2 L 5.5 1.2 L 6 2 L 6 3.5 L 5.5 4.3 L 2.5 4.3 L 2 3.5 L 2 2 Z"
                fill="#1e241f"
                opacity="0.65"
              />
              {/* Small Glowing Headlights */}
              <circle cx="7.2" cy="1" r="0.3" fill="#FFF8E7" />
              <circle cx="7.2" cy="4.5" r="0.3" fill="#FFF8E7" />
            </g>
          </g>
        </svg>

        {STOPS.map((stop, i) => (
          <div
            key={stop.coord}
            ref={(el) => (stopRefs.current[i] = el)}
            className="stop-item relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center py-20 md:py-36 z-10"
          >
            {/* Parallax Image Block Wrapper */}
            <div
              className={`relative aspect-[3/3] overflow-hidden z-10 ${
                stop.reverse ? "md:order-2" : "md:order-1"
              }`}
            >
              <img
                ref={(el) => (imageRefs.current[i] = el)}
                src={stop.image}
                alt={stop.title}
                className="absolute inset-0 w-full h-[130%] -top-[15%] object-cover select-none pointer-events-none scale-105"
              />
            </div>

            {/* Separated Content Container */}
            <div
              className={`px-2 flex flex-col justify-center items-start text-left ${
                stop.reverse ? "md:order-1" : "md:order-2"
              }`}
            >
              {/* Text Layout Block */}
              <div className="flex flex-col items-start w-full">
                <span className="block font-sans text-[10px] uppercase tracking-[0.25em] text-black mb-4 font-semibold">
                  {stop.eyebrow}
                </span>
                <h3 className="font-sans font-normal text-black text-4xl md:text-7xl leading-[1.1] mb-5 tracking-[-0.04em] uppercase">
                  {stop.title}
                </h3>
                <p className="text-black/70 text-[20px] md:text-[24px] leading-[1.25] tracking-[-0.03em] max-w-[420px]">
                  {stop.copy}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}