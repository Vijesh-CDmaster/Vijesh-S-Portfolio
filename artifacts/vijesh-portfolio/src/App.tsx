import { useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';

import BlackHoleIntro from '@/components/BlackHoleIntro';
import PortfolioPage from '@/components/PortfolioPage';

function App() {
  const [isEntered, setIsEntered] = useState(false);

  // MotionConfig reducedMotion="user" makes every Framer Motion animation in
  // the tree respect prefers-reduced-motion automatically.
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {isEntered ? (
          <div key="portfolio" className="min-h-[100dvh]">
            <PortfolioPage />
          </div>
        ) : (
          <BlackHoleIntro key="intro" onEnter={() => setIsEntered(true)} />
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

export default App;
