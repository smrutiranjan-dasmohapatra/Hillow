import gsap from "gsap";

/**
 * heroAnimations.js
 * ------------------------------------------------------------------
 * Only one animation in this file: the giant background wordmark
 * letters rising up from below, one after another. Everything else
 * in the hero (nav, house image, copy) is static — no entrance
 * animation, no scale, no fade. It's just there on load.
 * ------------------------------------------------------------------
 */

/**
 * Splits a wordmark into individual <span> letters so GSAP can animate
 * each one independently. Call this once, before playLetterReveal.
 *
 * @param {HTMLElement} el - the container element holding the plain text
 * @returns {HTMLElement[]} array of letter span elements (in DOM order)
 */
export function splitIntoLetters(el) {
  if (!el) return [];
  const text = el.textContent;
  el.textContent = "";
  el.setAttribute("aria-label", text);

  const letters = text.split("").map((char) => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    span.style.display = "inline-block";
    span.style.willChange = "transform, opacity";
    span.setAttribute("aria-hidden", "true");
    el.appendChild(span);
    return span;
  });

  return letters;
}

/**
 * Animates the wordmark letters up from below the fold, one by one,
 * fading in as they arrive. This is the ONLY animation in the hero.
 *
 * @param {HTMLElement[]} letters - output of splitIntoLetters()
 * @returns {gsap.core.Timeline}
 */
export function playLetterReveal(letters = []) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

  if (prefersReducedMotion) {
    gsap.set(letters, { opacity: 1, yPercent: 0 });
    return tl;
  }

  // Start: each letter pushed below its own box and invisible
  gsap.set(letters, { yPercent: 120, opacity: 0 });

  // Climb up, one after another
  tl.to(letters, {
    yPercent: 0,
    opacity: 1,
    duration: 1.1,
    stagger: {
      each: 0.045,
      from: "start",
    },
  });

  return tl;
}