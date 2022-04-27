import { motion, MotionCanvas, LayoutCamera } from "framer-motion-3d";
import {
  Shadow,
  softShadows,
  Stats,
  Points,
  useAspect,
  Html,
  meshBounds,
} from "@react-three/drei";
import { useThree, useFrame, Canvas } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { Mesh, PerspectiveCamera } from "three";
import gsap from "gsap";
import { a, SpringValue } from "@react-spring/three";
import { useSpring } from "@react-spring/core";
// softShadows();

const layoutCameraSettings: { x: number; y: number; z: number } = {
  x: 10,
  y: 5,
  z: 10,
};
export function Scene({
  isFullscreen,
  transitionDelay,
}: {
  isFullscreen: boolean;
  transitionDelay: number;
}) {
  const camRef = useRef<PerspectiveCamera>(null!);
  return (
    <MotionCanvas
      dpr={[1, 2]}
      shadows
      // camera={{ fov: 10, position: [50, 0.25, 0] }}
    >
      {/* @ts-ignore */}
      <LayoutCamera
        // makeDefault={true}
        initial={false}
        ref={camRef}
        animate={
          isFullscreen
            ? {
                ...layoutCameraSettings,
                // rotateY: degToRad(90),
                //@ts-ignore
                fov: 30,
              }
            : { x: 15, y: 0.25, z: 0, fov: 10 }
        }
      />
      <CanvasEl isFullscreen={isFullscreen} transitionDelay={transitionDelay} />
    </MotionCanvas>
  );
}
function CanvasEl({
  isFullscreen,
  transitionDelay,
}: {
  isFullscreen: boolean;
  transitionDelay: number;
}) {
  return (
    <>
      <Geometry transitionDelay={transitionDelay} isFullscreen={isFullscreen} />
      <Lights isFullscreen={isFullscreen} />
      <primitive object={new THREE.AxesHelper(10)} />
    </>
  );
}
function Lights({ isFullscreen }: { isFullscreen: boolean }) {
  const three = useThree();
  useFrame(() => {
    three.camera.lookAt(0, 0, 0);
  });
  return (
    <>
      {/* <Stats /> */}
      <ambientLight intensity={0.2} />
      <pointLight position={[-10, -10, 10]} intensity={2} color="#ff20f0" />
      <pointLight
        position={[0, 0.5, -1]}
        distance={1}
        intensity={2}
        color="#e4be00"
      />
      <motion.directionalLight
        castShadow
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={20}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        // initial={false}
        animate={isFullscreen ? { x: 0, y: 8, z: 5 } : { x: 4, y: 3, z: 3 }}
      />
    </>
  );
}
// Video by <a href="https://pixabay.com/users/engin_akyurt-3656355/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=67354">Engin Akyurt</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=67354">Pixabay</a>
// Video by <a href="https://pixabay.com/users/ronin_studio_munich-16211452/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=37088">Ronin Studio</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=37088">Pixabay</a>
function Video({ url, delay = 0 }: { url: string; delay?: number }) {
  const size = useAspect(1800, 1000);
  const [video] = useState(() =>
    Object.assign(document.createElement("video"), {
      src: url,
      crossOrigin: "Anonymous",
      // loop: true,
      muted: true,
    })
  );
  video.playsInline = true;
  // video.playsinline = true;
  useEffect(
    () =>
      void setTimeout(
        () =>
          video.play().then(() => {
            setTimeout(() => {
              video.pause();
            }, 23000 + 5000 - delay);
          }),
        delay
      ),
    [video]
  );
  return (
    // @ts-ignore
    <a.meshBasicMaterial toneMapped={false}>
      <videoTexture attach="map" args={[video]} encoding={THREE.sRGBEncoding} />
    </a.meshBasicMaterial>
  );
}
type Props = {
  url: string;
  delay?: number;
  position: any;
  move: boolean;
  [x: string]: any;
};
function Bubble(props: Props) {
  let { url, delay, move, position, ...rest } = props;

  // const increaseObjectSize = (object: THREE.Mesh) => {
  //   object.scale.multiplyScalar(2);
  // };
  // const decreaseObjectSize = (object: THREE.Mesh) => {
  //   object.scale.multiplyScalar(0.5);
  // };
  const { pos } = useSpring({
    pos: move ? [3 * position[0], -1, -3 * position[0]] : position,
    config: { mass: 5, tension: 100, friction: 50, precision: 0.0001 },
  });
  // The X axis is red. The Y axis is green. The Z axis is blue.

  const ref = useRef<any>(null!);
  return (
    <>
      {/* @ts-ignore */}
      <a.mesh
        receiveShadow
        castShadow
        ref={ref}
        position={pos}
        // onPointerEnter={() => increaseObjectSize(ref.current)}
        // onPointerLeave={() => decreaseObjectSize(ref.current)}
        {...rest}
      >
        <a.sphereBufferGeometry args={[0.6, 64, 64]} />
        <Video url={url} delay={delay} />
      </a.mesh>
    </>
  );
}
function Geometry({
  transitionDelay,
  isFullscreen,
}: {
  transitionDelay: number;
  isFullscreen: boolean;
}) {
  // x: red, y: green, z: blue
  const state = useThree();
  const [move, setMove] = useState(false);
  setTimeout(() => setMove(true), 14000);
  transitionDelay += 1000;
  return (
    <>
      <Bubble url={"/white.mp4"} move={move} position={[0, 0, 0]} />
      <Bubble
        url={"/orange.mp4"}
        move={move}
        position={[-1, 0.9, -3]}
        delay={transitionDelay}
      />

      {/* <Bubble url={"/orange.mp4"} delay={transitionDelay} position={x} /> */}
      <Bubble
        url={"/abstract.mp4"}
        position={[1, -0.9, 3]}
        delay={transitionDelay}
        move={move}
        // rotation-y={Math.PI / 4}
        rotation-x={Math.PI / 2}
      />
    </>
  );
}
