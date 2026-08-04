import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeader from "../components/common/SectionHeader"; // adjust the path

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STOPS = [
  {
    coord: "24.6837°N   46.5892°E",
    eyebrow: "Arrival Gateway",
    title: "Welcome to the Desert Retreat",
    copy: "Your journey begins at the private arrival pavilion, where every guest is welcomed before entering the peaceful, uninterrupted landscape of the resort.",
    image: "/images/Hillow.jpg",
  },
  {
    coord: "24.6212°N   46.6104°E",
    eyebrow: "Wellness Oasis",
    title: "Spa & Infinity Pool",
    copy: "Relax with restorative spa treatments, an architectural infinity pool, and open-air lounges surrounded by the deep, restorative silence of the desert.",
    image: "/images/spaa.jpg",
  },
  {
    coord: "24.5904°N   46.6533°E",
    eyebrow: "Private Stay",
    title: "Your Capsule Villa",
    copy: "A secluded modern capsule designed for absolute comfort, privacy, and uninterrupted views of the surrounding desert landscape.",
    image: "/images/c1.jpg",
  },
];

export default function DesertJourney() {
  const wrapRef = useRef(null);
  const pathRef = useRef(null);
  const vehicleRef = useRef(null);
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

    const updateVehicle = (progress) => {
      path.style.strokeDashoffset = String(length * (1 - progress));

      try {
        const pt = path.getPointAtLength(progress * length);
        const lookAheadLength = Math.min(length, progress * length + 1);
        const ptAhead = path.getPointAtLength(lookAheadLength);

        const angle =
          Math.atan2(ptAhead.y - pt.y, ptAhead.x - pt.x) * (180 / Math.PI);

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

    updateVehicle(0);

    const drawTrigger = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: "top 70%",
      end: "bottom 30%",
      scrub: 1,
      onUpdate: (self) => updateVehicle(self.progress),
      onRefresh: (self) => updateVehicle(self.progress),
    });

    const particleTweens = [];
    const particles = gsap.utils.toArray(".journey-particle");
    particles.forEach((p) => {
      const tween = gsap.to(p, {
        x: "random(-15, 15)",
        y: "random(-15, 15)",
        duration: "random(5, 9)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      particleTweens.push(tween);
    });

    const parallaxTweens = [];
    imageRefs.current.forEach((img, i) => {
      if (!img) return;

      const parallax = gsap.fromTo(
        img,
        { yPercent: i % 2 === 0 ? -20 : 20 },
        {
          yPercent: i % 2 === 0 ? 20 : -20,
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
      parallaxTweens.forEach((t) => t.scrollTrigger && t.scrollTrigger.kill());
    };
  }, []);

  return (
    <section
      id="services"
      className="relative bg-white overflow-hidden w-full px-6 sm:px-12 py-10 font-sans antialiased"
    >
      {/* Section Header */}
     <SectionHeader
  title="THE Hillow / Waypoint & Route"
  subtitle="Engineered for Absolute Freedom"
  blockColor="#111111"
  textColor="#111111"
/>

      <div
        ref={wrapRef}
        className="relative overflow-visible w-full max-w-7xl mx-auto flex flex-col gap-24 md:gap-36 mt-8"
      >
        {/* MAP ROUTE OVERLAY BACKGROUND */}
        <svg
          className="absolute inset-x-0 inset-y-0 w-full h-full pointer-events-none z-0 block"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
        >
          <path
            ref={pathRef}
            d="M 150 45 L 320 80 L 520 40 L 720 120 L 850 250 L 650 360 L 480 430 L 250 510 L 120 620 L 340 760 L 580 840 L 820 790 L 900 950"
            fill="none"
            stroke="#4a4436"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="opacity-35"
          />

          {[
            [180, 60],
            [350, 90],
            [510, 50],
            [690, 140],
            [820, 230],
            [700, 320],
            [520, 410],
            [290, 480],
            [150, 600],
            [310, 720],
            [540, 810],
            [790, 820],
            [870, 920],
            [400, 250],
            [600, 650],
          ].map(([cx, cy], idx) => (
            <circle
              key={idx}
              className="journey-particle"
              cx={cx}
              cy={cy}
              r={1.5 + (idx % 3) * 0.8}
              fill="#72b8c6"
              opacity={0.12 + (idx % 4) * 0.04}
            />
          ))}

          {[
            [150, 45],
            [250, 510],
            [900, 950],
          ].map(([cx, cy], i) => (
            <g key={i} transform={`translate(${cx}, ${cy - 12}) scale(3.5)`}>
              {/* Tent Icon replacing the flag icon */}
              <path
                d="M 0 6 L 3 -1 L 4.5 1 L 6 -1 L 9 6 Z"
                fill="#3D4A3E"
                stroke="#2A352B"
                strokeWidth="0.3"
                strokeLinejoin="round"
              />
              <path
                d="M 4.5 1 L 4.5 6"
                stroke="#1e241f"
                strokeWidth="0.4"
              />
              <polygon
                points="4.5,1 2.5,4 4.5,4"
                fill="#526354"
                opacity="0.6"
              />
            </g>
          ))}

          <g ref={vehicleRef} className="will-change-transform">
            <g transform="translate(-18, -11) scale(4.5)">
              <path
                d="M 1 1.5 C 1 0.7, 2 0.5, 4 0.5 C 6 0.5, 7 0.7, 7 1.5 L 7.5 2 L 7.5 3.5 L 7 4 C 7 4.8, 6 5, 4 5 C 2 5, 1 4.8, 1 4 L 0.5 3.5 L 0.5 2 Z"
                fill="#7BAE7F"
              />
              <path
                d="M 2.5 1.2 L 5.5 1.2 L 6 2 L 6 3.5 L 5.5 4.3 L 2.5 4.3 L 2 3.5 L 2 2 Z"
                fill="#1e241f"
                opacity="0.65"
              />
              <circle cx="7.2" cy="1" r="0.3" fill="#FFF8E7" />
              <circle cx="7.2" cy="4.5" r="0.3" fill="#FFF8E7" />
            </g>
          </g>
        </svg>

        {STOPS.map((stop, i) => {
          const isEven = i % 2 === 0;

          return (
            <div
              key={stop.coord}
              className="stop-item relative grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center z-10 w-full"
            >
              {/* LEFT SIDE BLOCK */}
              <div
                className={`w-full flex flex-col justify-center ${
                  isEven ? "order-1" : "order-2 md:order-1"
                }`}
              >
                {isEven ? (
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    <img
                      ref={(el) => (imageRefs.current[i] = el)}
                      src={stop.image}
                      alt={stop.title}
                      className="absolute inset-0 w-full h-[140%] -top-[20%] object-cover select-none pointer-events-none opacity-95"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col text-left max-w-lg">
                    <div className="flex flex-col gap-1 mb-3">
                      <span className="text-xl font-medium tracking-wide">
                        {stop.eyebrow}
                      </span>
                      <span className="block font-mono text-[10px] tracking-widest text-stone-400">
                        {stop.coord}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-neutral-900 leading-[1.15] mb-3">
                      {stop.title}
                    </h3>

                    <p className="text-neutral-700 text-base sm:text-lg leading-relaxed">
                      {stop.copy}
                    </p>
                  </div>
                )}
              </div>

              {/* RIGHT SIDE BLOCK */}
              <div
                className={`w-full flex flex-col justify-center ${
                  isEven ? "order-2" : "order-1 md:order-2"
                }`}
              >
                {!isEven ? (
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    <img
                      ref={(el) => (imageRefs.current[i] = el)}
                      src={stop.image}
                      alt={stop.title}
                      className="absolute inset-0 w-full h-[140%] -top-[20%] object-cover select-none pointer-events-none opacity-95"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col text-left max-w-lg">
                    <div className="flex flex-col gap-1 mb-3">
                      <span className="text-xl font-medium tracking-wide">
                        {stop.eyebrow}
                      </span>
                      <span className="block font-mono text-[10px] tracking-widest text-stone-400">
                        {stop.coord}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-neutral-900 leading-[1.15] mb-3">
                      {stop.title}
                    </h3>

                    <p className="text-neutral-700 text-base sm:text-lg leading-relaxed">
                      {stop.copy}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}