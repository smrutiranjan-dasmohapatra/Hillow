import { useState, useEffect } from "react";

export default function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    
    // Trigger smooth mount entrance
    const timer = setTimeout(() => setIsLoaded(true), 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  const bgImage = isMobile ? "/images/image.jpg" : "/images/c2.jpg";

  return (
    <section
      id="hero"
      className="relative w-full h-screen overflow-hidden  text-white antialiased select-none flex flex-col justify-between"
    >
      {/* Immersive Background with Subtle Parallax Zoom Effect */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div
          className={`w-full h-full bg-cover bg-center transition-transform duration-[2000ms] ease-out ${
            isLoaded ? "scale-100" : "scale-105"
          }`}
          style={{
            backgroundImage: `url('${bgImage}'), url('/images/c2.jpg')`,
          }}
        />
        <img
          src="/5.jpg"
          alt="Base Underlay"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
        />
      </div>

      {/* Sophisticated Multi-Layer Gradient Vignette */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black via-black/40 to-black/60 opacity-90" />
      <div className="absolute inset-0 z-10 pointer-events-none bg-radial from-transparent via-black/40 to-black/80" />

     

      {/* Main Content Area */}
      <div className="relative z-20 w-full px-8 pb-12 md:px-16 md:pb-16 flex flex-col justify-end mt-auto">
        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 lg:gap-16">
          
          {/* Left Column: Title & Editorial Tagline */}
          <div className="flex flex-col items-start max-w-3xl w-full">
            <div className="overflow-hidden py-2">
             <h1
  className={`py-4 text-6xl sm:text-9xl font-light uppercase tracking-tight transition-all duration-1000 ease-out transform ${
    isLoaded
      ? "translate-y-0 opacity-100"
      : "translate-y-16 opacity-0"
  }`}
>
  Hillow
</h1>
            </div>

            <div 
              className={`mt-6 md:mt-8 flex flex-col items-start gap-3 max-w-lg transition-all duration-1000 delay-200 ease-out transform ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <p className="text-zinc-200 text-lg md:text-xl font-light tracking-wide leading-relaxed">
                Hidden beyond the pristine dunes, Hillow is a sanctuary where architecture dissolves seamlessly into raw nature.
              </p>
            </div>
          </div>

          {/* Right Column: Clean, Borderless Video Trigger Widget */}
          <div 
            onClick={() => setIsVideoOpen(true)}
            className={`group cursor-pointer pointer-events-auto z-30 flex flex-col items-start gap-3 transition-all duration-1000 delay-300 ease-out transform ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="relative w-52 sm:w-60 md:w-72 aspect-[16/10] overflow-hidden bg-zinc-900">
              <img
                src="/images/c2.jpg"
                alt="Play preview loop"
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out select-none pointer-events-none"
              />

              {/* Minimal Glass Play Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors duration-500">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-500 ease-out group-hover:bg-white group-hover:text-black group-hover:scale-110">
                  <svg
                    className="w-4 h-4 fill-current ml-0.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Sub-label details */}
            <div className="flex items-center justify-between w-full text-[11px] font-sans tracking-[0.2em] uppercase text-zinc-400 group-hover:text-white transition-colors duration-300 pt-1 font-light">
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 bg-white/60 rounded-full" />
                Play film sequence
              </span>
              <span className="text-zinc-400 font-light">02:56</span>
            </div>
          </div>

        </div>
      </div>

      {/* Fullscreen Cinematic Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-3xl animate-fadeIn">
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={() => setIsVideoOpen(false)}
          />

          {/* Close Action Button */}
          <button
            onClick={() => setIsVideoOpen(false)}
            className="absolute top-8 right-8 md:top-12 md:right-16 text-white/70 hover:text-white flex items-center gap-3 text-xs uppercase tracking-[0.3em] font-sans font-light bg-white/5 hover:bg-white/10 px-5 py-2.5 transition-all duration-300 z-50 rounded-full"
          >
            <span>Dismiss</span>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Video Player Frame */}
          <div className="relative w-full max-w-6xl aspect-video mx-6 z-40 shadow-2xl overflow-hidden rounded-lg">
            <video
              autoPlay
              controls
              playsInline
              preload="auto"
              poster="/images/c2.jpg"
              className="w-full h-full bg-black object-contain"
            >
              <source src="/vi.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </section>
  );
}