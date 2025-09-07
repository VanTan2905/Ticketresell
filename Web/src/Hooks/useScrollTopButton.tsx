import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react'; 
import '@/Css/ScrollTopBtn.css'; 

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Show the button when scrolled down
  const handleScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top-button" // Use the CSS class
          aria-label="Scroll to top"
        >
          <ArrowUp className="icon" /> {/* Use the CSS class for icon */}
        </button>
      )}
    </>
  );
};
export default ScrollToTopButton;