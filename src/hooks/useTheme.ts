import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

/**
 * Hook to manage dark/light theme with view transition animation
 */
export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = async (event: React.MouseEvent) => {
    // @ts-ignore - View Transitions API
    if (!document.startViewTransition) {
      setIsDarkMode(!isDarkMode);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // @ts-ignore - View Transitions API
    const transition = document.startViewTransition(() => {
      flushSync(() => setIsDarkMode((prev) => !prev));
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  return { isDarkMode, toggleTheme };
}

