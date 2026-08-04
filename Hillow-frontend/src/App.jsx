import { useState, useRef } from "react";

import FloatingNavbar from "./components/Navbar";

import Hero from "./components/Hero";
import IntroSection from "./components/IntroSection";
import DesertJourney from "./components/Desertjourney";
import VillaFeatures from "./components/VillaFeatures";
import GallerySection from "./components/GallerySection";
import Contact from "./components/Contact";
import AboutSection from "./components/AboutSection";
import FeedbackSection from "../src/components/FeedbackSection";
import VillaTestimonials from "./components/VillaTestimonials"; // <-- Added import

import BookingDrawer from "./components/BookingDrawer";
import LoginDrawer from "./components/auth/LoginDrawer";
import TransitionOverlay from "../src/components/common/TransitionOverlay";

import WebsiteLoader from "./components/WebsiteLoader";
import FloatingModernSvg from "./components/FloatingModernSvg";

import { useAuth } from "./context/AuthContext";
import useLenis from "./hooks/useLenis";

const NAV_LINKS = [
  { name: "Home", targetId: "home" },
  { name: "About", targetId: "about" },
  { name: "Explore", targetId: "services" },
  { name: "Gallery", targetId: "gallery" },
  { name: "Contact", targetId: "contact" },
];

function App() {
  const lenis = useLenis();
  const transitionRef = useRef(null);

  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [latestUserFeedback, setLatestUserFeedback] = useState("");

  const handleBookClick = () => {
    if (user) {
      setIsBookingOpen(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleLinkClick = (targetId) => {
    const cleanId =
      typeof targetId === "string"
        ? targetId.toLowerCase().replace("#", "")
        : targetId?.targetId;

    if (!cleanId) return;

    const targetElement = document.getElementById(cleanId);
    if (!targetElement) return;

    const performScroll = () => {
      if (lenis) {
        lenis.scrollTo(targetElement, { immediate: true, force: true });
      } else {
        targetElement.scrollIntoView({ behavior: "auto" });
      }
    };

    if (transitionRef.current?.triggerTransition) {
      let fired = false;

      transitionRef.current.triggerTransition(() => {
        fired = true;
        performScroll();
      });

      setTimeout(() => {
        if (!fired) performScroll();
      }, 800);
    } else {
      performScroll();
    }
  };

  return (
    <main className="relative min-h-screen">
      <WebsiteLoader onLoadingComplete={() => setIsLoading(false)} />

      <div
        className={`transition-opacity duration-700 ${
          isLoading ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
        }`}
        aria-hidden={isLoading}
      >
        <TransitionOverlay ref={transitionRef} />

        <FloatingNavbar
          navLinks={NAV_LINKS}
          onBookClick={handleBookClick}
          onLinkClick={handleLinkClick}
        />

        <section id="home">
          <Hero />
        </section>

         <IntroSection />

        <section id="abb">
          <FeedbackSection userFeedback={latestUserFeedback} />
        </section>

        <section id="about">
          <AboutSection />
        </section>

        <section id="services">
          <DesertJourney />
          <VillaFeatures />
        </section>

        {/* Added VillaTestimonials Section */}
        <section id="testimonials">
          <VillaTestimonials />
        </section>

        <section id="gallery">
          <GallerySection />
        </section>

        <section id="contact">
          <Contact onNewFeedback={(text) => setLatestUserFeedback(text)} />
        </section>

        <LoginDrawer isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        <BookingDrawer isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />

      </div>
    </main>
  );
}

export default App;