import React, { createContext, useState, useRef } from 'react';

export const TabBarVisibilityContext = createContext({
  isTabBarVisible: true,
  setTabBarVisible: () => {},
});

export const TabBarVisibilityProvider = ({ children }) => {
  const [isTabBarVisible, setTabBarVisible] = useState(true);
  return (
    <TabBarVisibilityContext.Provider value={{ isTabBarVisible, setTabBarVisible }}>
      {children}
    </TabBarVisibilityContext.Provider>
  );
};

// Custom hook for scroll-based tab bar visibility
export const useTabBarVisibilityOnScroll = () => {
  const { setTabBarVisible } = React.useContext(TabBarVisibilityContext);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef('up');
  const cumulativeDelta = useRef(0);
  const threshold = 20; // px

  const handleTabBarScroll = (event) => {
    const currentY = event.nativeEvent.contentOffset.y;
    if (currentY <= 0) {
      // Always show at top
      setTabBarVisible(true);
      scrollDirection.current = 'up';
      cumulativeDelta.current = 0;
    } else if (currentY > lastScrollY.current) {
      // Scrolling down
      if (scrollDirection.current !== 'down') {
        scrollDirection.current = 'down';
        cumulativeDelta.current = 0;
      }
      cumulativeDelta.current += currentY - lastScrollY.current;
      if (cumulativeDelta.current > threshold) {
        setTabBarVisible(false);
        cumulativeDelta.current = 0;
      }
    } else if (currentY < lastScrollY.current) {
      // Scrolling up
      if (scrollDirection.current !== 'up') {
        scrollDirection.current = 'up';
        cumulativeDelta.current = 0;
      }
      cumulativeDelta.current += lastScrollY.current - currentY;
      if (cumulativeDelta.current > threshold) {
        setTabBarVisible(true);
        cumulativeDelta.current = 0;
      }
    }
    lastScrollY.current = currentY;
  };

  return handleTabBarScroll;
}; 