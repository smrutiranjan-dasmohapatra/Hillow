"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Responsive canvas frame-sequence scroller.
 *
 * You only have ONE set of (desktop-size) frames in /public/frames, named
 * ezgif-frame-001.jpg ... so all breakpoints below point at the same
 * folder/pattern. We still get responsiveness — canvas draw math already
 * does a "cover" fit so the same image always fills any screen size — we're
 * just tuning scroll distance/pinning per device so it *feels* right, not
 * swapping image sets.
 *
 * IMPORTANT — quality note:
 * Because these frames came from ezgif (a GIF converter), they're
 * double-compressed and will look soft no matter what this component does.
 * When you get the chance, re-export frames directly from the source video
 * with ffmpeg for a real quality bump, e.g.:
 *   ffmpeg -i input.mp4 -vf "scale=1920:-1" -q:v 2 frames/frame-%03d.jpg
 * That's optional — the code below works fine with what you have now.
 */

const FRAME_BASE_PATH = "/frames/ezgif-frame-";
const FRAME_COUNT = 151; // update if your actual frame count differs
const FRAME_PAD = 3; // ezgif-frame-001.jpg -> 3-digit padding

const BREAKPOINTS = {
  mobile: {
    query: "(max-width: 767px)",
    basePath: FRAME_BASE_PATH,
    frameCount: FRAME_COUNT,
    scrollMultiplier: 20, // shorter scroll distance, feels snappier on touch
    pin: false, // pinning full-screen on mobile often feels janky; disable if needed
  },
  tablet: {
    query: "(min-width: 768px) and (max-width: 1024px)",
    basePath: FRAME_BASE_PATH,
    frameCount: FRAME_COUNT,
    scrollMultiplier: 30,
    pin: true,
  },
  desktop: {
    query: "(min-width: 1025px)",
    basePath: FRAME_BASE_PATH,
    frameCount: FRAME_COUNT,
    scrollMultiplier: 40,
    pin: true,
  },
};

export default function CanvasSequence() {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    // desynchronized + alpha:false = fewer compositing steps per frame
    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });

    const mm = gsap.matchMedia();
    let cleanupFns = [];

    Object.values(BREAKPOINTS).forEach((config) => {
      mm.add(config.query, () => {
        const { basePath, frameCount, scrollMultiplier, pin } = config;
        const images = new Array(frameCount);
        const sequence = { frame: 0 };
        let lastDrawnFrame = -1;
        let rafId = null;

        // ---- Canvas sizing ----
        function resizeCanvas() {
          const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap for perf
          canvas.width = window.innerWidth * dpr;
          canvas.height = window.innerHeight * dpr;
          canvas.style.width = `${window.innerWidth}px`;
          canvas.style.height = `${window.innerHeight}px`;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          renderNow();
        }

        // ---- Draw whatever frame is currently loaded closest to target ----
        function drawFrame(image) {
          const cw = window.innerWidth;
          const ch = window.innerHeight;
          ctx.clearRect(0, 0, cw, ch);
          const scale = Math.max(cw / image.width, ch / image.height);
          const width = image.width * scale;
          const height = image.height * scale;
          const x = (cw - width) / 2;
          const y = (ch - height) / 2;
          ctx.drawImage(image, x, y, width, height);
        }

        function renderNow() {
          const target = Math.round(sequence.frame);
          if (target === lastDrawnFrame) return; // skip redundant redraws
          // fall back to nearest already-loaded frame so it never "hangs" blank
          let idx = target;
          while (idx >= 0 && !(images[idx] && images[idx].complete)) idx--;
          if (idx < 0) return;
          drawFrame(images[idx]);
          lastDrawnFrame = target;
        }

        function render() {
          if (rafId) return;
          rafId = requestAnimationFrame(() => {
            renderNow();
            rafId = null;
          });
        }

        // ---- Prioritized progressive loading ----
        // Loads frame 0 first (so something shows instantly), then streams the
        // rest in with a small concurrency cap instead of firing 151 requests
        // at once.
        function loadImage(i) {
          return new Promise((resolve) => {
            const img = new Image();
            img.decoding = "async";
            img.src = `${basePath}${String(i + 1).padStart(FRAME_PAD, "0")}.jpg`;
            img.onload = () => resolve();
            img.onerror = () => resolve(); // don't block the whole sequence
            images[i] = img;
          });
        }

        async function loadAll() {
          await loadImage(0);
          renderNow();
          startAnimation(); // scroll works immediately, remaining frames stream in

          const CONCURRENCY = 6;
          let next = 1;
          async function worker() {
            while (next < frameCount) {
              const i = next++;
              await loadImage(i);
            }
          }
          await Promise.all(
            Array.from({ length: CONCURRENCY }, worker)
          );
        }

        let scrollTriggerInstance = null;

        function startAnimation() {
          scrollTriggerInstance = gsap.to(sequence, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            onUpdate: render,
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: `+=${frameCount * scrollMultiplier}`,
              scrub: true,
              pin,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        }

        let resizeTimeout;
        function onResize() {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(resizeCanvas, 100); // debounced
        }

        resizeCanvas();
        window.addEventListener("resize", onResize);
        loadAll();

        // matchMedia context cleanup — runs automatically when the
        // breakpoint no longer matches, or on unmount
        return () => {
          window.removeEventListener("resize", onResize);
          clearTimeout(resizeTimeout);
          if (rafId) cancelAnimationFrame(rafId);
          if (scrollTriggerInstance && scrollTriggerInstance.scrollTrigger) {
            scrollTriggerInstance.scrollTrigger.kill();
          }
        };
      });
    });

    return () => mm.revert(); // cleans up all breakpoint contexts + listeners
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        height: "100vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </section>
  );
}

