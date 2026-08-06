import React, { useState, useTransition } from "react";
import { 
  ArrowUpRight, 
  MessageSquare
} from "lucide-react";

// Inline SVG Icons
const LockShieldIcon = ({ className = "w-6 h-6 text-black" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <rect width="8" height="5" x="8" y="11" rx="1" />
    <path d="M10 11V9a2 2 0 1 1 4 0v2" />
  </svg>
);

const InstagramIcon = ({ size = 15, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 15, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = ({ size = 15, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

function Contact({ onNewFeedback }) {
  const currentYear = new Date().getFullYear();
  const [feedback, setFeedback] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [, startTransition] = useTransition();

  const handleRequireLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleFeedbackChange = (e) => {
    const val = e.target.value;
    startTransition(() => {
      setFeedback(val);
    });
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (feedback.trim()) {
      if (onNewFeedback) {
        onNewFeedback(feedback.trim());
      }
      setFeedback("");
    }
  };

  return (
    <>
      <footer id="contact" className="w-full bg-black text-white pt-16 pb-8 px-6 md:px-12 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          
          {/* TOP COMPOSITION GRID */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">
            
            {/* Brand Callout Statement */}
            <div className="md:col-span-6 flex flex-col items-start gap-5">
              <h2 className="text-3xl sm:text-4xl font-light leading-[1.1] text-white max-w-sm">
                Escape into<br />the quiet.
              </h2>
              
              <button 
                onClick={handleRequireLogin}
                className="flex items-center gap-3 px-6 py-3 bg-white text-black text-xs sm:text-sm font-medium hover:bg-neutral-200 transition-colors duration-150 cursor-pointer rounded-none border-0 outline-none active:scale-95"
              >
                <span>Reserve Your Capsule</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Navigation Links */}
            <div className="md:col-span-3 flex flex-col gap-3">
              <span className="text-[10px] uppercase font-mono tracking-[0.15em] text-neutral-500 font-semibold">
                EXPLORE
              </span>
              <ul className="flex flex-col gap-2 text-sm font-light text-neutral-400">
                <li className="hover:text-white cursor-pointer transition-colors duration-150">The Sanctuary</li>
                <li className="hover:text-white cursor-pointer transition-colors duration-150">Capsules</li>
                <li className="hover:text-white cursor-pointer transition-colors duration-150">Amenities</li>
                <li className="hover:text-white cursor-pointer transition-colors duration-150">Locations</li>
                <li className="hover:text-white cursor-pointer transition-colors duration-150">FAQ & Policies</li>
              </ul>
            </div>

            {/* Social Links Stack */}
            <div className="md:col-span-3 flex flex-col gap-3">
              <span className="text-[10px] uppercase font-mono tracking-[0.15em] text-neutral-500 font-semibold">
                CONNECT
              </span>
              <ul className="flex flex-col gap-2.5 text-sm font-light text-neutral-400">
                <li className="flex items-center gap-2.5 hover:text-white cursor-pointer transition-colors duration-150">
                  <InstagramIcon size={15} className="text-neutral-500" />
                  <span>Instagram</span>
                </li>
                <li className="flex items-center gap-2.5 hover:text-white cursor-pointer transition-colors duration-150">
                  <FacebookIcon size={15} className="text-neutral-500" />
                  <span>Facebook</span>
                </li>
                <li className="flex items-center gap-2.5 hover:text-white cursor-pointer transition-colors duration-150">
                  <YoutubeIcon size={15} className="text-neutral-500" />
                  <span>YouTube</span>
                </li>
              </ul>
            </div>

          </div>

          {/* FEEDBACK SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-6 border-t border-neutral-900">
            <div className="md:col-span-5 flex flex-col justify-center">
              <h3 className="text-lg sm:text-xl font-light text-white">
                Share your feedback
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Help us refine the Hillow experience.
              </p>
            </div>

            <div className="md:col-span-7 flex items-center w-full max-w-xl">
              <form onSubmit={handleFeedbackSubmit} className="flex items-center gap-0 w-full">
                <div className="relative flex-grow">
                  <MessageSquare size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input 
                    type="text" 
                    value={feedback}
                    onChange={handleFeedbackChange}
                    placeholder="Your feedback or suggestions..." 
                    required
                    autoComplete="off"
                    className="w-full bg-neutral-950 text-neutral-200 placeholder-neutral-600 border border-neutral-800 pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-neutral-500 rounded-none"
                  />
                </div>
                <button 
                  type="submit" 
                  className="bg-white text-black hover:bg-neutral-200 font-medium px-5 py-2.5 text-sm whitespace-nowrap border-0 rounded-none cursor-pointer active:scale-95"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>

          {/* BOTTOM BASELINE FOOTER */}
          <div className="border-t border-neutral-900 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono font-light text-neutral-500">
            <div>
              &copy; {currentYear} Hillow Sanctuary Inc. All rights reserved.
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-neutral-400">
              <span className="hover:text-white cursor-pointer transition-colors duration-150">Terms</span>
              <span className="hover:text-white cursor-pointer transition-colors duration-150">Privacy</span>
              <span 
                onClick={handleRequireLogin} 
                className="hover:text-white cursor-pointer transition-colors duration-150"
              >
                Cancellation
              </span>
            </div>
          </div>

        </div>
      </footer>

      {/* LIGHT THEME LOGIN ALERT MODAL */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white border border-neutral-200 p-6 flex flex-col items-center text-center shadow-xl rounded-none">
            
            <div className="w-10 h-10 bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-4">
              <LockShieldIcon className="w-5 h-5 text-black" />
            </div>

            <h3 className="text-lg font-medium text-black tracking-tight">
              Sign In Required
            </h3>

            <p className="text-xs text-neutral-600 mt-2 mb-6 leading-relaxed max-w-xs font-normal">
              To complete your reservation, please click the <strong className="text-black font-semibold">"Book Now"</strong> button in the navigation bar to log in.
            </p>

            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(false)}
                className="w-full py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium cursor-pointer rounded-none border border-neutral-200 outline-none"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(false)}
                className="w-full py-2.5 px-4 bg-black hover:bg-neutral-800 text-white text-xs font-medium cursor-pointer rounded-none border-0 outline-none"
              >
                Got It
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default React.memo(Contact);