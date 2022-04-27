import logo from "./logo.svg";
import "./App.css";
import { useState, Suspense } from "react";
import { motion, MotionConfig } from "framer-motion";
import { transition } from "./settings";
import { Scene } from "./Scene";
import { a } from "@react-spring/web";
import { useSpring } from "@react-spring/core";
function App() {
  const [play, setPlay] = useState(true);
  return play ? <Main /> : <Loader setPlay={setPlay} />;
}
const Loader = ({ setPlay }: { setPlay: Function }) => {
  return (
    <div className="loader">
      <button onClick={() => setPlay(true)}>click to proceed</button>
    </div>
  );
};
const Main = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const transitionDelay = 5000;
  const styles = useSpring({
    loop: true,
    to: [
      { opacity: 1, color: "#ffaaee" },
      { opacity: 0, color: "rgb(14,26,19)" },
    ],
    // from: { opacity: 0, color: "red" },
  });
  setTimeout(() => setIsFullScreen(true), transitionDelay);
  return (
    <MotionConfig transition={transition}>
      <div
        data-is-fullscreen={isFullScreen}
        // onClick={() => setIsFullScreen(!isFullScreen)}
      >
        <motion.div layout className="header">
          <motion.div layout className="nav">
            <motion.div className="mainNav">
              <motion.span>Home</motion.span>
              <motion.span>About</motion.span>
              <motion.span>Projects</motion.span>
              <motion.span>Contact</motion.span>
            </motion.div>
          </motion.div>

          <motion.div className="titleWrapper">
            <motion.div className="stack">
              <a.h2 children="<hjopel />" />
              <a.h1 children="Software Developer" />
            </motion.div>
          </motion.div>
          <motion.div className="sub">
            <span>learn more</span>
          </motion.div>
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
};

export default App;
