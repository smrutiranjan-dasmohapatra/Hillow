import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const titleRef = useRef(null);
  const imageRef = useRef(null);
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    let split;

    const ctx = gsap.context(() => {
      split = new SplitType(titleRef.current, {
        types: "chars",
      });

      split.chars.forEach((char) => {
        const wrapper = document.createElement("span");

        wrapper.style.display = "inline-block";
        wrapper.style.overflow = "hidden";
        wrapper.style.verticalAlign = "top";

        char.parentNode.insertBefore(wrapper, char);
        wrapper.appendChild(char);
      });

      gsap.set(split.chars, {
        yPercent: 110,
        willChange: "transform",
      });

      gsap.set(imageRef.current, {
        scale: 1.08,
        yPercent: -8,
        willChange: "transform",
      });

      const tl = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      tl.to(
        imageRef.current,
        {
          scale: 1,
          duration: 2,
        },
        0
      );

      tl.to(
        split.chars,
        {
          yPercent: 0,
          duration: 1.4,
          stagger: {
            each: 0.05,
          },
        },
        0.3
      );

      gsap.to(imageRef.current, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-black font-sans">
      {/* Background Image */}
      <img
        ref={imageRef}
        src="/5.jpg"
        alt="House"
        className="absolute inset-0 h-[120%] w-full object-cover"
      />

      {/* Luxury Cinematic Multi-layered Overlay for Deep Bottom Fade */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Soft top-down vignette for header readability */}
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/70 to-transparent" />
        
        {/* Subtle overall center dim to keep the imagery premium and soft */}
        <div className="absolute inset-0 bg-black/5" />
        
        {/* Cinematic bottom-up fade: transitions into pure black over the bottom 30% */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/95 via-30% to-transparent" />
      </div>

      {/* Modern Top Minimal Header */}
      <header className="absolute top-0 left-0 w-full z-40 px-8 py-6 md:px-16 flex justify-between items-center text-white">
        <span className="text-xl font-light tracking-[0.3em] uppercase">Hillow</span>
        <button className="px-5 py-2 text-xs text-black uppercase tracking-widest border border-white/20 hover:border-white rounded-[2px] bg-white backdrop-blur-sm transition-all duration-300">
          Book Stay
        </button>
      </header>

      {/* Right Side: Circular Glassmorphic Social Media Sidebar */}
      <aside className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4">
        <div className="flex flex-col gap-4 p-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
          <a 
            href="#instagram" 
            aria-label="Instagram"
            className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a 
            href="#facebook" 
            aria-label="Facebook"
            className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"></path>
            </svg>
          </a>
          <a 
            href="#youtube" 
            aria-label="YouTube"
            className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
            </svg>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="absolute inset-0 z-30 flex flex-col justify-end items-start px-8 pb-12 md:px-16 md:pb-20">
        
        {/* Large Animated Title */}
        <div className="overflow-hidden">
          <h1
            ref={titleRef}
            className="
              text-white
              text-[18vw]
              font-light
              tracking-[-0.06em]
              leading-[0.85]
              select-none
              pointer-events-none
              uppercase
            "
          >
            Hillow
          </h1>
        </div>

        {/* Premium Informational Subtitle Layer Underneath */}
        <div className="mt-6 md:mt-8 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-16 max-w-2xl text-stone-300">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-400 font-semibold">
              The Sanctuary
            </span>
            <p className="text-[20px] md:text-[24px] leading-[1.25] tracking-[-0.03em] ">
              A minimalist mountain hideaway architected for deep family connection and raw, undisturbed alpine peace.
            </p>
          </div>
          
          
        </div>

      </div>
    </section>
  );
}