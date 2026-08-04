import { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";

const TransitionOverlay = forwardRef((props, ref) => {
  const overlayRef = useRef(null);

  useImperativeHandle(ref, () => ({
    triggerTransition(targetName, onMiddleCallback) {
      const tl = gsap.timeline();

      // 1. Wipe down background
      tl.to(overlayRef.current, {
        scaleY: 1,
        duration: 0.4,
        ease: "power4.inOut",
        transformOrigin: "bottom",
      })
      // 2. Execute scroll callback at peak cover
      .add(() => {
        if (onMiddleCallback) onMiddleCallback();
      })
      // 3. Hold briefly
      .to({}, { duration: 0.25 })
      // 4. Wipe curtain away
      .to(overlayRef.current, {
        scaleY: 0,
        duration: 0.45,
        ease: "power4.inOut",
        transformOrigin: "top",
      });
    },
  }));

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-amber-50 z-[999] pointer-events-none scale-y-0 w-full h-full flex flex-col items-center justify-center overflow-hidden m-0 p-0"
    >
      {/* Subtle ambient vignette */}
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.05), rgba(0,0,0,0) 60%)",
        }}
      />
    </div>
  );
});

export default TransitionOverlay;