import FloatingNavbar from "./components/Navbar"; // 1. Import your brand new navbar
import Hero from "./components/Hero";

import DesertJourney from "./components/Desertjourney.jsx";
import useLenis from "./hooks/useLenis";

function App() {
  useLenis();

  return (
    <>
      {/* 2. Render the Navbar at the very top */}
   
      
      <Hero />
      
      
      <DesertJourney />
   
      
      

    </>
  );
}

export default App;