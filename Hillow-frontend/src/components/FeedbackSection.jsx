import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const COMMENT_POOL = [
  { id: 1, name: "Marcus V.", emoji: "🏜️", text: "That dune horizon view is insane..." },
  { id: 2, name: "Elena R.", emoji: "🏛️", text: "Minimalist layout turned out super clean!" },
  { id: 3, name: "Tariq A.", emoji: "🌿", text: "Infinity pool at dusk is a vibe 🔥" },
  { id: 4, name: "Sarah K.", emoji: "✨", text: "Effortless aesthetic. Love this setup." },
  { id: 5, name: "Liam T.", emoji: "🌌", text: "Zero light pollution... stargazing is crazy here" },
  { id: 6, name: "Amira M.", emoji: "🍸", text: "Sunset hours hit completely different" },
  { id: 7, name: "Julian B.", emoji: "📐", text: "The architectural details are top tier" },
];

export default function FeedbackSection({ userFeedback }) {
  const [comments, setComments] = useState([]);
  const [isVisible, setIsVisible] = useState(false); // Starts hidden by default
  
  const poolIndex = useRef(0);
  const commentRefs = useRef({});
  const listContainerRef = useRef(null);
  const activeUserCommentId = useRef(null);

  // Toggle Feed Visibility with smooth GSAP transition
  const toggleVisibility = () => {
    if (isVisible) {
      gsap.to(listContainerRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => setIsVisible(false)
      });
    } else {
      setIsVisible(true);
      gsap.fromTo(
        listContainerRef.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.35, ease: "power2.out" }
      );
    }
  };

  // 1. LISTEN FOR USER FEEDBACK (Shows 3 comments max, hides user item after 9s)
  useEffect(() => {
    if (!userFeedback) return;

    // Auto-open feed when user posts
    if (!isVisible) {
      setIsVisible(true);
      if (listContainerRef.current) {
        gsap.fromTo(
          listContainerRef.current,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.35, ease: "power2.out" }
        );
      }
    }

    const userInstanceId = Date.now() + Math.random();
    activeUserCommentId.current = userInstanceId;

    const userEntry = {
      id: Date.now(),
      instanceId: userInstanceId,
      name: "You",
      emoji: "🍸",
      text: userFeedback,
      isUser: true,
    };

    setComments((prev) => [userEntry, ...prev].slice(0, 3));

    const hideTimer = setTimeout(() => {
      const userEl = commentRefs.current[userInstanceId];

      const removeUserComment = () => {
        activeUserCommentId.current = null;
        setComments((prev) => prev.filter((item) => item.instanceId !== userInstanceId));
      };

      if (userEl) {
        gsap.to(userEl, {
          opacity: 0,
          y: -12,
          duration: 0.5,
          ease: "power2.in",
          onComplete: removeUserComment,
        });
      } else {
        removeUserComment();
      }
    }, 9000);

    return () => clearTimeout(hideTimer);
  }, [userFeedback]);

  // 2. ADD REGULAR COMMENTS PERIODICALLY
  const pushNextComment = () => {
    const nextItem = {
      ...COMMENT_POOL[poolIndex.current],
      instanceId: Date.now() + Math.random(),
      isUser: false,
    };

    poolIndex.current = (poolIndex.current + 1) % COMMENT_POOL.length;

    setComments((prev) => {
      const maxAllowed = activeUserCommentId.current ? 3 : 2;

      if (prev.length >= maxAllowed) {
        const oldestItem = prev.find((item) => !item.isUser) || prev[prev.length - 1];

        if (oldestItem && !oldestItem.isUser) {
          const oldestEl = commentRefs.current[oldestItem.instanceId];
          if (oldestEl) {
            gsap.to(oldestEl, {
              opacity: 0,
              y: -15,
              duration: 0.35,
              ease: "power2.in",
            });
          }
        }
      }

      const updated = [...prev, nextItem];
      return updated.slice(-maxAllowed);
    });
  };

  useEffect(() => {
    const t1 = setTimeout(pushNextComment, 800);
    const t2 = setTimeout(pushNextComment, 2200);

    const interval = setInterval(pushNextComment, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(interval);
    };
  }, []);

  // 3. GSAP ENTRANCE ANIMATION FOR COMMENTS
  useEffect(() => {
    if (!isVisible) return;

    comments.forEach((c) => {
      const el = commentRefs.current[c.instanceId];
      if (el && !el.dataset.animated) {
        el.dataset.animated = "true";

        gsap.fromTo(
          el,
          { opacity: 0, y: 15, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.45,
            ease: "power2.out",
          }
        );
      }
    });
  }, [comments, isVisible]);

  return (
    <div className="fixed bottom-6 left-6 z-50 w-[280px] sm:w-[340px] pointer-events-none select-none flex flex-col items-start gap-1">
      
      {/* PERFECTLY ALIGNED HEADER */}
      <div className="w-full flex items-baseline justify-between px-0.5 pointer-events-auto">
        
        {/* Live Indicator + Label */}
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium drop-shadow">
            LIVE FEEDBACK
          </span>
        </div>

        {/* Clean Text Toggle Button */}
        <button
          onClick={toggleVisibility}
          className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 hover:text-stone-100 transition-colors duration-200 cursor-pointer focus:outline-none shrink-0"
        >
          [{isVisible ? 'HIDE' : 'SHOW'}]
        </button>
      </div>

      {/* Comment List Wrapper */}
      <div ref={listContainerRef} className="w-full overflow-hidden" style={{ height: 0, opacity: 0 }}>
        {isVisible && (
          <div className="flex flex-col gap-1 items-start justify-end pt-0.5">
            {comments.map((item) => (
              <div
                key={item.instanceId}
                ref={(el) => (commentRefs.current[item.instanceId] = el)}
                className="flex items-baseline gap-2 w-full will-change-transform"
              >
                {/* Emoji */}
                <span className="text-sm shrink-0 leading-none">{item.emoji}</span>

                {/* Comment Text Line */}
                <div className="flex items-baseline gap-1.5 text-xs min-w-0 flex-1">
                  <span className={`font-semibold shrink-0 text-[12px] tracking-tight ${
                    item.isUser ? "text-emerald-400 font-bold" : "text-stone-100"
                  }`}>
                    {item.name}:
                  </span>
                  <span className={`font-normal truncate text-[12px] tracking-wide ${
                    item.isUser 
                      ? "text-emerald-400 font-semibold drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]" 
                      : "text-stone-300"
                  }`}>
                    {item.text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}