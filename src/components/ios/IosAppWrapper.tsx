import React from 'react';
import useWindowStore from '#store/window';

const IosAppWrapper = () => {
  const windows = useWindowStore((state: any) => state.windows);
  const closeWindow = useWindowStore((state: any) => state.closeWindow);

  // Find the top-most open window
  const openWindows = Object.entries(windows)
    .filter(([_, win]: [string, any]) => win.isOpen)
    .sort((a: any, b: any) => b[1].zIndex - a[1].zIndex);

  if (openWindows.length === 0) return null;

  const activeAppId = openWindows[0][0];

  return (
    <div className="fixed bottom-0 left-0 w-full h-8 z-[9999] flex justify-center items-end pb-2 pointer-events-none">
      {/* iOS Home Indicator - click or swipe up to go home */}
      <button 
        onClick={() => closeWindow(activeAppId)}
        className="w-1/3 h-1.5 bg-black/50 dark:bg-white/50 backdrop-blur-md rounded-full pointer-events-auto hover:bg-black/80 transition-colors"
        aria-label="Go home"
      />
    </div>
  );
};

export default IosAppWrapper;
