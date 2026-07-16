import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

const NAV_LINKS = ["Services", "About", "Gallery", "Contact"];

export default function FloatingNavbar() {
  const [open, setOpen] = useState(false);

  const linksWrapRef = useRef(null);
  const linksListRef = useRef(null);
  const linkItemRefs = useRef([]);
  const timelineRef = useRef(null);

  useLayoutEffect(() => {
    const naturalWidth = linksListRef.current?.scrollWidth ?? 0;

    const ctx = gsap.context(() => {
      gsap.set(linksWrapRef.current, {
        width: 0,
      });

      gsap.set(linkItemRefs.current, {
        opacity: 0,
        y: 8,
      });

      timelineRef.current = gsap
        .timeline({
          paused: true,
          defaults: {
            ease: "power3.inOut",
          },
        })
        .to(
          linksWrapRef.current,
          {
            width: naturalWidth,
            duration: 0.55,
          },
          0
        )
        .to(
          linkItemRefs.current,
          {
            opacity: 1,
            y: 0,
            stagger: 0.06,
            duration: 0.35,
          },
          0.15
        );
    });

    return () => ctx.revert();
  }, []);

  const toggleMenu = () => {
    if (!timelineRef.current) return;

    if (open) {
      timelineRef.current.reverse();
    } else {
      timelineRef.current.play();
    }

    setOpen(!open);
  };

  return (
    <header className="fixed left-1/2 top-8 z-50 -translate-x-1/2 ">
      <nav
        className="
          flex
          items-center
          gap-8
          rounded-[2px]
          border

          bg-black
         
         
        "
      >
        {/* Logo */}
        <div className="flex items-center gap-4 whitespace-nowrap">
         

          <span className="text-xl   font-semibold
           
            leading-none
            whitespace-nowrap
            select-none
            pointer-events-none text-white">
            Hillow
          </span>
        </div>

        {/* Animated Links */}
        <div
          ref={linksWrapRef}
          className="overflow-hidden"
        >
          <ul
            ref={linksListRef}
            className="flex items-center gap-10 whitespace-nowrap pl-3 pr-2"
          >
            {NAV_LINKS.map((item, index) => (
              <li
                key={item}
                ref={(el) => (linkItemRefs.current[index] = el)}
                className="
                  cursor-pointer
                  text-base
                  font-light
                  text-white
                  transition
                  hover:text-mauve-900
                "
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Menu Button */}
        <button
          onClick={toggleMenu}
          className="
            flex
            items-center
            gap-3
            rounded-full
            bg-black
            px-6
            py-3
            text-base
            font-semibold
            text-white
            
          "
        >
          {open ? <CloseIcon /> : <GridIcon />}
          {open ? "Close" : "Menu"}
        </button>
      </nav>
    </header>
  );
}

function LogoMark() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      className="text-black"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="16"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="12"
        cy="16"
        r="6"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
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
    <svg
      width="18"
      height="18"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      {dots.map((dot, i) => (
        <circle
          key={i}
          cx={dot.cx}
          cy={dot.cy}
          r="1.3"
        />
      ))}
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
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