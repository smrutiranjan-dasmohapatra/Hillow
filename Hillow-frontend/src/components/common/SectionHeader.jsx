import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrollTrigger);
}

export default function SectionHeader({ 
  title, 
  subtitle, 
  blockColor = "#3D4A3E", // Default block color (Safari Green)
  textColor = "#2c352d"   // Default final text color
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use GSAP context for isolated, clean scoping per section instance
    const ctx = gsap.context(() => {
      const targets = container.querySelectorAll(".redact-target");
      
      targets.forEach((el) => {
        // Split text by words
        const split = new SplitText(el, { type: "words" });

        // Apply initial hidden states with custom section background blocks
        split.words.forEach((word) => {
          word.style.backgroundImage = `linear-gradient(${blockColor}, ${blockColor})`;
          word.style.backgroundSize = "100% 100__"; // Note: standard fallback string
          word.style.backgroundSize = "100% 100%";
          word.style.backgroundRepeat = "no-repeat";
          word.style.color = "transparent";
          word.style.padding = "2px 4px";
          word.style.borderRadius = "2px";
          word.style.display = "inline-block"; 
        });

        // Unique scroll timeline for this specific header instance
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        // Trigger the peeling reveal animation sequence
        split.words.forEach((word, index) => {
          const delay = index * 0.07;
          
          tl.to(word, { 
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
    }, container);

    return () => ctx.revert(); // Clean up layout calculations if section unmounts
  }, [blockColor, textColor]); // Re-run setup safely if colors change dynamically

  return (
    <div ref={containerRef} className="w-full max-w-[600px] flex flex-col items-start mb-10 md:mb-1">
      <span className="redact-target text-4xl md:text-5xl  font-semibold leading-[1.1] block tracking-tight uppercase">
        {title}
      </span>
      {subtitle && (
        <h2 className="redact-target text-sm md:text-base leading-relaxed mt-3  font-light tracking-wide uppercase opacity-80">
          {subtitle}
        </h2>
      )}
    </div>
  );
}