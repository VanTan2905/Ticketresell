import { useState, useEffect } from "react";

// Custom hook for determining how many items to show based on screen size
const useShowItem = () => {
  const [itemsToShow, setItemsToShow] = useState(4);

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth < 700) {
        setItemsToShow(1); // Small screens
      } else if (window.innerWidth < 1000) {
        setItemsToShow(2); // Medium screens
      } else if (window.innerWidth < 1350) {
        setItemsToShow(3); // Large screens
      } else {
        setItemsToShow(4); // Extra-large screens
      }
    };

    // Set the initial value and listen for resize events
    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);

    // Cleanup the event listener when the component unmounts
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  return itemsToShow;
};

export default useShowItem;
