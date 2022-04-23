import logo from "./logo.svg";
import "./App.css";
import { useState, Suspense } from "react";
import { motion, MotionConfig } from "framer-motion";
import { transition } from "./settings";
import { Scene } from "./Scene";
function App() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [play, setPlay] = useState(true);
  const transitionDelay = 5000;
  setTimeout(() => setIsFullScreen(true), transitionDelay);
  return (
    <MotionConfig transition={transition}>
      <div
        data-is-fullscreen={isFullScreen}
        // onClick={() => setIsFullScreen(!isFullScreen)}
      >
        <motion.div layout className="header">
          <motion.div className="stack">
            <motion.h2 children="<hjopel />" />
            <motion.h1 children="Software Developer" />
          </motion.div>
          {/* <motion.h1 children="<hjopel />" />
          <motion.h2 children="Software Developer" /> */}
        </motion.div>
        <motion.div className="container" layout>
          <Suspense fallback={null}>
            <Scene
              isFullscreen={isFullScreen}
              transitionDelay={transitionDelay}
            />
          </Suspense>
        </motion.div>
      </div>
    </MotionConfig>
  );
}

export default App;
