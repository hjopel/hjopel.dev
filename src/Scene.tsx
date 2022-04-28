import { useAspect, Text, OrbitControls } from "@react-three/drei";
import {
  useThree,
  useFrame,
  Canvas,
  GroupProps,
  context,
} from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils";
import React, { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { Mesh, PerspectiveCamera } from "three";
import gsap from "gsap";
import { a, AnimatedComponent, SpringValue } from "@react-spring/three";
import { useSpring } from "@react-spring/core";
// softShadows();

export function Scene({
  isFullscreen,
  transitionDelay,
}: {
  isFullscreen: boolean;
  transitionDelay: number;
}) {
  const camRef = useRef<PerspectiveCamera>(null!);
  const canRef = useRef<HTMLCanvasElement>(null!);
  // canRef.
  return (
    <>
      {/* <Canvas ref={canRef} camera={{ fov: 10, position: [15, 0.25, 0] }}> */}
      <Canvas ref={canRef} camera={{ fov: 10, position: [15, 0.25, 0] }}>
        <CanvasEl
          isFullscreen={isFullscreen}
          transitionDelay={transitionDelay}
          canvasRef={canRef}
        />
        <Text
          fontSize={0.1}
          color="white"
          position={[0, 0.25, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          more than just
        </Text>
        <Text fontSize={0.4} color="white" rotation={[0, Math.PI / 2, 0]}>
          web development.
        </Text>
        <OrbitControls />
      </Canvas>
    </>
  );
}
function CanvasEl({
  isFullscreen,
  transitionDelay,
  canvasRef,
}: {
  isFullscreen: boolean;
  transitionDelay: number;
  canvasRef: any;
}) {
  return (
    <>
      <Geometry
        transitionDelay={transitionDelay}
        isFullscreen={isFullscreen}
        canvasRef={canvasRef}
      />
      <Lights isFullscreen={isFullscreen} />
      {/* <primitive object={new THREE.AxesHelper(10)} /> */}
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
      {/* @ts-ignore */}
      <a.directionalLight
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
        // @ts-ignore
        animate={isFullscreen ? { x: 0, y: 8, z: 5 } : { x: 4, y: 3, z: 3 }}
      />
    </>
  );
}
// Video by <a href="https://pixabay.com/users/engin_akyurt-3656355/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=67354">Engin Akyurt</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=67354">Pixabay</a>
// Video by <a href="https://pixabay.com/users/ronin_studio_munich-16211452/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=37088">Ronin Studio</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=37088">Pixabay</a>
function Video({
  url,
  delay = 0,
  canvasRef,
}: {
  url: string;
  delay?: number;
  canvasRef: any;
}) {
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
            setTimeout(() => {}, 23000 + 5000 - delay);
          }),
        delay
      ),
    [video]
  );
  const ref = useRef<any>(null!);
  useFrame(() => {
    // console.log(ref?.current);
  });
  return (
    // @ts-ignore
    <a.meshBasicMaterial toneMapped={false}>
      <videoTexture
        attach="map"
        args={[video]}
        encoding={THREE.sRGBEncoding}
        ref={ref}
      />
    </a.meshBasicMaterial>
  );
}
type Props = {
  url: string;
  delay?: number;
  position: any;
  move: boolean;
  sizeUp: boolean;
  canvasRef: any;
  [x: string]: any;
};
function Bubble(props: Props) {
  let { url, delay, move, position, sizeUp, canvasRef, ...rest } = props;
  const [hovers, setHovers] = useState(false);

  const getHoverMultiplier = () => {
    return hovers ? 4 : 1;
  };
  const { pos, scale, rotY } = useSpring({
    // pos: move ? [3 * position[0], -1, -3 * position[0]] : position,
    pos: move ? [0, -0.5, -1.5 * position[0]] : position,
    scale: sizeUp ? 0.4 * getHoverMultiplier() : 0.1,
    rotY: hovers ? Math.PI / 3 : 0,
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
        onPointerEnter={() => setHovers(true)}
        onPointerLeave={() => setHovers(false)}
        {...rest}
        scale={scale}
        rotation-y={rotY}
      >
        <a.sphereBufferGeometry args={[0.6, 64, 64]} />
        <Video url={url} delay={delay} canvasRef={canvasRef} />
      </a.mesh>
    </>
  );
}
function Geometry({
  transitionDelay,
  isFullscreen,
  canvasRef,
}: {
  transitionDelay: number;
  isFullscreen: boolean;
  canvasRef: any;
}) {
  // x: red, y: green, z: blue
  const state = useThree();
  const [move, setMove] = useState(false);
  const [sizeUp, setSizeUp] = useState(false);
  setTimeout(() => setSizeUp(true), transitionDelay);
  setTimeout(() => setMove(true), 14000);
  transitionDelay += 1000;
  const bubbleConfig: { url: string; position: number[]; delay?: number }[] = [
    {
      url: "/white.mp4",
      position: [0, 0, 0],
    },
    {
      url: "/orange.mp4",
      position: [-1, 0.9, -1],
      delay: transitionDelay,
    },
    {
      url: "/abstract.mp4",
      position: [1, -0.9, 1],
      delay: transitionDelay,
    },
  ];
  return (
    <>
      {/* <Text color="white" anchorX="center" anchorY="middle">
        hii
      </Text> */}
      <a.group>
        {bubbleConfig.map((config) => (
          <Bubble
            url={config.url}
            position={config.position}
            delay={config.delay ?? 0}
            move={move}
            sizeUp={sizeUp}
            key={config.url}
            canvasRef={canvasRef}
          />
        ))}
      </a.group>
    </>
  );
}
