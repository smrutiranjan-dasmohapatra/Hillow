import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAuth } from "../context/AuthContext";
import ProfileMenu from "./ProfileMenu";

const NAV_LINKS = [
  { name: "Home", targetId: "home" },
  { name: "About", targetId: "about" },
  { name: "Explore", targetId: "services" },
  { name: "Gallery", targetId: "gallery" },
  { name: "Contact", targetId: "contact" },
];

export default function FloatingNavbar({ onBookClick, onLinkClick }) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(null);
  const { user } = useAuth();

  const linksWrapRef = useRef(null);
  const linksListRef = useRef(null);
  const linkItemRefs = useRef([]);
  const activeBgRef = useRef(null);
  const timelineRef = useRef(null);
  const isAnimatingRef = useRef(false);

  useLayoutEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      if (isMobile) {
        gsap.set(linksWrapRef.current, {
          height: 0,
          opacity: 0,
          width: "100%",
        });
        gsap.set(linkItemRefs.current, { opacity: 0, y: 8 });

        timelineRef.current = gsap
          .timeline({
            paused: true,
            defaults: { ease: "power3.inOut" },
            onStart: () => {
              isAnimatingRef.current = true;
            },
            onComplete: () => {
              isAnimatingRef.current = false;
            },
            onReverseComplete: () => {
              isAnimatingRef.current = false;
            },
          })
          .to(linksWrapRef.current, {
            height: "auto",
            opacity: 1,
            duration: 0.45,
          })
          .to(
            linkItemRefs.current,
            {
              opacity: 1,
              y: 0,
              stagger: 0.04,
              duration: 0.25,
            },
            "-=0.25",
          );
      } else {
        const naturalWidth = linksListRef.current
          ? linksListRef.current.getBoundingClientRect().width
          : 0;

        gsap.set(linksWrapRef.current, {
          width: 0,
          height: "auto",
          opacity: 1,
        });
        gsap.set(linkItemRefs.current, { opacity: 0, y: 8 });
        gsap.set(activeBgRef.current, { opacity: 0, scale: 0.95 });

        timelineRef.current = gsap
          .timeline({
            paused: true,
            defaults: { ease: "power3.inOut" },
            onStart: () => {
              isAnimatingRef.current = true;
            },
            onComplete: () => {
              isAnimatingRef.current = false;
              gsap.set(linksWrapRef.current, { width: "auto" });
            },
            onReverseComplete: () => {
              isAnimatingRef.current = false;
            },
          })
          .to(
            linksWrapRef.current,
            {
              width: naturalWidth,
              duration: 0.55,
            },
            0,
          )
          .to(
            linkItemRefs.current,
            {
              opacity: 1,
              y: 0,
              stagger: 0.06,
              duration: 0.35,
            },
            0.15,
          );
      }
    });

    if (open) {
      timelineRef.current.seek(timelineRef.current.duration());
    }

    return () => ctx.revert();
  }, []);

  const toggleMenu = () => {
    if (!timelineRef.current || isAnimatingRef.current) return;

    if (open) {
      if (window.innerWidth >= 768 && linksListRef.current) {
        const measuredWidth =
          linksListRef.current.getBoundingClientRect().width;
        gsap.set(linksWrapRef.current, { width: measuredWidth });
      }
      gsap.to(activeBgRef.current, { opacity: 0, scale: 0.95, duration: 0.2 });
      timelineRef.current.reverse();
      setActiveIdx(null);
    } else {
      timelineRef.current.play();
    }

    setOpen(!open);
  };

  const handleLinkClick = (index, link) => {
    if (isAnimatingRef.current) return;
    setActiveIdx(index);

    const clickedEl = linkItemRefs.current[index];
    if (!clickedEl) return;

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      isAnimatingRef.current = true;
      setOpen(false);
      timelineRef.current.reverse().then(() => {
        isAnimatingRef.current = false;
        if (onLinkClick) onLinkClick(link.targetId);
      });
      return;
    }

    const parentRect = linksListRef.current.getBoundingClientRect();
    const itemRect = clickedEl.getBoundingClientRect();

    const targetLeft = itemRect.left - parentRect.left;
    const targetWidth = itemRect.width;

    gsap.to(activeBgRef.current, {
      left: targetLeft,
      width: targetWidth,
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });

    if (onLinkClick) onLinkClick(link.targetId);
  };

  return (
    <header className="fixed left-1/2 top-4 md:top-8 z-50 -translate-x-1/2 w-[calc(100%-2rem)] max-w-max flex justify-center">
      <nav className="flex flex-col md:flex-row md:items-center gap-0 md:gap-1 bg-black/95 backdrop-blur-md p-1.5 shadow-2xl border border-white/10 relative w-full md:w-auto">
        <div className="flex items-center justify-between md:justify-start gap-1.5 md:order-2 z-20 w-full md:w-auto flex-shrink-0">
          <button
            onClick={toggleMenu}
            className={`flex items-center gap-2 px-5 py-3 text-xs md:text-sm font-medium transition-colors duration-200 ${
              open
                ? "bg-white text-black"
                : "bg-neutral-900 text-white hover:bg-neutral-800"
            }`}
          >
            {open ? <CloseIcon /> : <GridIcon />}
            <span>{open ? "Close" : "Menu"}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onBookClick}
              className="bg-white hover:bg-neutral-200 px-6 py-3 text-xs md:text-sm font-semibold text-black transition-all duration-200 whitespace-nowrap"
            >
              Book Stay
            </button>

            {user && (
              <div className="flex items-center justify-center px-5 py-3 text-xs md:text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition-colors duration-200 cursor-pointer">
                <ProfileMenu />
              </div>
            )}
          </div>
        </div>

        <div
          ref={linksWrapRef}
          className="overflow-hidden relative w-full md:w-auto md:order-1 z-10"
        >
          <ul
            ref={linksListRef}
            className="grid grid-cols-2 md:flex md:flex-row items-center justify-items-center gap-4 md:gap-1 whitespace-nowrap px-2 py-5 md:py-0 relative w-full md:w-max"
          >
            <span
              ref={activeBgRef}
              className="absolute top-0 bottom-0 my-auto h-full bg-white pointer-events-none z-0 hidden md:block"
              style={{ width: "0px" }}
            />

            {NAV_LINKS.map((link, index) => (
              <li
                key={link.name}
                ref={(el) => (linkItemRefs.current[index] = el)}
                onClick={() => handleLinkClick(index, link)}
                className={`cursor-pointer text-xs md:text-sm font-medium transition-colors duration-200 relative z-10 w-full text-center md:text-left md:w-auto px-5 py-3 flex items-center justify-center ${
                  activeIdx === index
                    ? "text-neutral-400 font-semibold"
                    : "text-white hover:text-neutral-300"
                }`}
              >
                {link.name}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}

function GridIcon() {
  const dots = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      dots.push({
        cx: 2 + col * 6,
        cy: 2 + row * 6,
      });
    }
  }
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      {dots.map((dot, i) => (
        <circle key={i} cx={dot.cx} cy={dot.cy} r="1.3" />
      ))}
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  );
}
