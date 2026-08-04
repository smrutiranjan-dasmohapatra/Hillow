import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export default function IntroSection() {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    let split;

    const ctx = gsap.context(() => {
      // 1. Split the text into lines first
      split = new SplitType(textRef.current, {
        types: "lines",
        tagName: "span", // Explicitly wrapping in spans prevents layout shifting
      });

      const textLines = split.lines;
      const inlineImages = textRef.current.querySelectorAll(".inline-img-wrapper");

      // Apply hardware acceleration classes to prevent stuttering on scroll entry
      gsap.set(textLines, {
        opacity: 0.15,
        y: 20,
        willChange: "transform, opacity",
      });

      gsap.set(inlineImages, {
        opacity: 0,
        scale: 0.6,
        y: 30,
        transformOrigin: "bottom center",
        willChange: "transform, opacity",
      });

      // 2. Force ScrollTrigger to recalculate page geometry after DOM splitting
      ScrollTrigger.refresh();

      // 3. ScrollTrigger Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%",
          end: "bottom 35%",
          scrub: 0.5,
        },
      });

      // Reveal text lines smoothly
      tl.to(
        textLines,
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power2.out",
        },
        0
      );

      // Reveal images in sync
      tl.to(
        inlineImages,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          stagger: 0.15,
          duration: 1.2,
          ease: "power3.out",
        },
        0.1
      );
    }, containerRef);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section
      id="intro"
      ref={containerRef}
      className="relative min-h-screen bg-black text-white py-15 md:py-15 px-6 md:px-16 overflow-hidden flex items-start justify-center"
    >
      <div className="max-w-7xl mx-auto w-full">
        <h2
          ref={textRef}
          className="text-[6.5vw] md:text-[4vw] font-light tracking-tight  leading-[1.55] md:leading-[1.45] text-center"
        >
          {/* IMAGE AT START OF LINE */}
          <span className="inline-img-wrapper inline-block align-[-0.1em] mr-2 md:mr-3.5 w-[55px] h-[32px] sm:w-[65px] sm:h-[38px] md:w-[110px] md:h-[65px] overflow-hidden rounded-sm md:rounded">
            <img src="/images/Hillow.jpg" alt="Hillow Resort" className="w-full h-full object-cover" />
          </span>
          Welcome to the serene desert sanctuary of Hillow Desert Resort®, where you experience ultimate tranquility.
          
          {/* IMAGE AT END OF LINE */}
          Unwind in modular luxury capsules
          <span className="inline-img-wrapper inline-block align-[-0.1em] ml-2 md:ml-3.5 w-[55px] h-[32px] sm:w-[65px] sm:h-[38px] md:w-[110px] md:h-[65px] overflow-hidden rounded-sm md:rounded">
            <img src="/images/c1.jpg" alt="Capsules" className="w-full h-full object-cover" />
          </span>
          , indulge in world-class spa retreats
          
          {/* IMAGE AT START OF LINE */}
          <span className="inline-img-wrapper inline-block align-[-0.1em] mr-2 md:mr-3.5 w-[55px] h-[32px] sm:w-[65px] sm:h-[38px] md:w-[110px] md:h-[65px] overflow-hidden rounded-sm md:rounded">
            <img src="/images/spaa.jpg" alt="Spa Retreat" className="w-full h-full object-cover" />
          </span>
          , and relax in luminous infinity pools
          
          {/* IMAGE AT END OF LINE */}
          nestled in a breathtaking landscape
          <span className="inline-img-wrapper inline-block align-[-0.1em] ml-2 md:ml-3.5 w-[55px] h-[32px] sm:w-[65px] sm:h-[38px] md:w-[110px] md:h-[65px] overflow-hidden rounded-sm md:rounded">
            <img src="/images/pool-1.jpg" alt="Infinity Pool" className="w-full h-full object-cover" />
          </span>.
        </h2>
      </div>
    </section>
  );
}