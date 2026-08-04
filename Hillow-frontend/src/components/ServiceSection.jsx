import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Shield, Zap, Wifi, Compass, Key, Droplet } from 'lucide-react';

const servicesData = [
  {
    id: "01",
    title: "High-Tier Security",
    description: "Equipped with advanced biometric access controls, around-the-clock surveillance, and smart monitoring systems seamlessly integrated into the desert architecture.",
    tag: "SECURE",
    icon: <Shield className="w-5 h-5 stroke-[1.5]" />,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80", 
  },
  {
    id: "02",
    title: "Off-Grid Power",
    description: "Next-generation solar storage arrays coupled with intelligent energy grids guarantee uninterrupted premium power delivery throughout the extreme desert climate.",
    tag: "ENERGY",
    icon: <Zap className="w-5 h-5 stroke-[1.5]" />,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "03",
    title: "Water Autonomy",
    description: "Industrial atmospheric water generators paired with closed-loop subsurface purification systems provide localized micro-grid hydration completely independent of municipal lines.",
    tag: "RESOURCES",
    icon: <Droplet className="w-5 h-5 stroke-[1.5]" />,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "04",
    title: "Automated Concierge",
    description: "Deeply embedded smart environmental systems learn your patterns, adjusting indoor climate variants, kinetic shading elements, and lighting signatures preemptively.",
    tag: "INTELLIGENCE",
    icon: <Key className="w-5 h-5 stroke-[1.5]" />,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  }
];

export default function ServicesSection() {
  const containerRef = useRef(null);
  const imageRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // Smooth Parallax Effect for Images remains active
      imageRefs.current.forEach((imgContainer) => {
        if (!imgContainer) return;
        const innerImg = imgContainer.querySelector('img');
        
        gsap.fromTo(innerImg, 
          { yPercent: -15 }, 
          {
            yPercent: 15,    
            ease: "none",
            scrollTrigger: {
              trigger: imgContainer,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            }
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="w-full min-h-screen bg-black text-white  py-16 px-[6vw] font-sans overflow-hidden"
    >
      {/* Clean Solid Cut Header Block */}
<div className="w-full max-w-7xl mx-auto flex-shrink-0 mb-6 md:mb-10">
        <span className="text-3xl md:text-5xl font-semibold leading-[1.1] block tracking-tight text-black">
          THE RESORT / Systems & Space
        </span>
        <h2 className="text-sm md:text-base leading-relaxed text-neutral-500 mt-2 font-light">
          Engineered for Absolute Autonomy
        </h2>
      </div>

      {/* Services Grid Generation */}
      {servicesData.map((service, index) => {
        const isEven = index % 2 === 0;

        return (
          <div 
            key={service.id}
            className={`w-full flex flex-col ${
              isEven ? 'md:flex-row' : 'md:flex-row-reverse'
            } min-h-[85vh] `}
          >
            {/* Content Column */}
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-between bg-black relative min-h-[50vh] md:min-h-auto">
              <div className="text-xs tracking-wider text-zinc-600 flex items-center gap-2">
                <span>{service.tag}</span>
              </div>
              
              <div className="max-w-sm my-auto py-12">
                <div className="w-10 h-10 rounded-full border  flex items-center justify-center mb-6 text-zinc-400 bg-zinc-950">
                  {service.icon}
                </div>
                <h3 className="text-[7.5vw] md:text-[3.5vw] font-medium leading-[1.1] mb-3 tracking-[-0.03em]  text-white mb-6">
                  {service.title}
                </h3>
                <p className="text-white leading-relaxed font-light text-sm md:text-base">
                  {service.description}
                </p>
               
              </div>

              <div className="flex justify-between items-end text-xs font-mono text-zinc-600">
               
                <span className="text-xl font-light text-white">{service.id}</span>
              </div>
            </div>

            {/* Parallax Image Column */}
            <div 
              ref={(el) => (imageRefs.current[index] = el)}
              className="w-full md:w-1/2 h-[60vh] md:h-auto relative overflow-hidden bg-black"
            >
              <img 
                src={service.image} 
                alt={service.title}
                className="absolute inset-0 w-full h-[130%] object-cover will-change-transform brightness-[0.85] contrast-[1.02]"
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}