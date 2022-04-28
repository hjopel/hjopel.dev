import logo from "./logo.svg";
import "./App.css";
import { useState, Suspense } from "react";
import { transition } from "./settings";
import { Scene } from "./Scene";
import { a } from "@react-spring/web";
import { useSpring } from "@react-spring/core";
// "@react-spring/core": "^9.4.4",
//     "@react-spring/three": "^9.4.4",
//     "@react-spring/web": "^9.4.4",
//     "@react-three/drei": "^9.5.3",
//     "@react-three/fiber": "^7.0.23",
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
    <div
      data-is-fullscreen={isFullScreen}
      // onClick={() => setIsFullScreen(!isFullScreen)}
    >
      {/* <motion.div layout className="header">
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
        </motion.div> */}
      <div className="header">
        <div className="nav">
          <div className="mainNav">
            <span>Home</span>
            <span>About</span>
            <span>Projects</span>
          </div>
        </div>
        {/* <div className="titleWrapper */}
      </div>

      <div className="container">
        <Suspense fallback={null}>
          <Scene
            isFullscreen={isFullScreen}
            transitionDelay={transitionDelay}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default App;
