import { useState, useCallback } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from './hooks/useLenis';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Marquee from './components/Marquee';
import Work from './components/Work';
import About from './components/About';
import Clients from './components/Clients';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import './styles/global.css';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Lenis smooth scroll
  useLenis();

  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
    // ScrollTrigger calculated positions while preloader covered content — recalculate
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }, []);

  return (
    <>
      <CustomCursor />
      <Preloader onComplete={handlePreloaderComplete} />
      <Navbar isLoading={isLoading} />
      <main>
        <Hero isLoading={isLoading} />
        <Services />
        <Marquee />
        <Work />
        <About />
        <Clients />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
