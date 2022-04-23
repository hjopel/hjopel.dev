import { motion, MotionCanvas, LayoutCamera } from "framer-motion-3d";
import {
  Shadow,
  softShadows,
  Stats,
  Points,
  useAspect,
  Html,
} from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { Mesh } from "three";

softShadows();

export function Scene({
  isFullscreen,
  transitionDelay,
}: {
  isFullscreen: boolean;
  transitionDelay: number;
}) {
  return (
    <MotionCanvas dpr={[1, 2]} shadows>
      {/* @ts-ignore */}
      <LayoutCamera
        initial={false}
        animate={
          isFullscreen
            ? {
                x: 10,
                y: 5,
                z: 10,
                // rotateY: degToRad(90),
                //@ts-ignore
                fov: 30,
              }
            : { x: 15, y: 0.25, z: 0, fov: 10 }
        }
      />
      <Geometry transitionDelay={transitionDelay} isFullscreen={isFullscreen} />
      <Lights isFullscreen={isFullscreen} />
    </MotionCanvas>
  );
}

function Lights({ isFullscreen }: { isFullscreen: boolean }) {
  const three = useThree();
  useFrame(() => {
    three.camera.lookAt(0, 0, 0);
  });
  return (
    <>
      <Stats />
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
      loop: true,
      muted: true,
    })
  );
  useEffect(() => void setTimeout(() => video.play(), delay), [video]);
  return (
    <meshBasicMaterial toneMapped={false}>
      <videoTexture attach="map" args={[video]} encoding={THREE.sRGBEncoding} />
    </meshBasicMaterial>
  );
}

function Geometry({
  transitionDelay,
  isFullscreen,
}: {
  transitionDelay: number;
  isFullscreen: boolean;
}) {
  const orangeRef = useRef<Mesh>(null!);
  const swirlRef = useRef<Mesh>(null!);
  useFrame(({ clock }) => {
    // orangeRef.current.position.x = 5 * Math.cos(clock.getElapsedTime()) * -1;
    // orangeRef.current.position.z = 5 * Math.sin(clock.getElapsedTime()) * -3;
    // swirlRef.current.position.x = 5 * Math.cos(clock.getElapsedTime()) * 1;
    // swirlRef.current.position.z = 5 * Math.sin(clock.getElapsedTime()) * 3;
  });
  return (
    <>
      {/* {isFullscreen ? (
        // <group rotation={[0, 0, 0]}>
        <Html className="test">
          <h2>Software Development</h2>
        </Html>
      ) : (
        // </group>
        ""
      )} */}

      <mesh receiveShadow castShadow>
        <sphereBufferGeometry args={[0.75, 64, 64]} />
        <Video url={"/white.mp4"} />
        <Shadow
          position-y={-0.79}
          rotation-x={0}
          opacity={0.6}
          scale={[0.8, 0.8, 1]}
        />
      </mesh>

      {/* @ts-ignore */}
      <mesh receiveShadow castShadow position={[-1, 0.9, -3]} ref={orangeRef}>
        <sphereBufferGeometry args={[0.75, 64, 64]} />
        <Video url={"/orange.mp4"} delay={transitionDelay} />
        <Shadow
          position-y={-0.79}
          rotation-x={-Math.PI / 4}
          opacity={0.6}
          scale={[0.8, 0.8, 1]}
        />
      </mesh>
      {/* @ts-ignore */}
      <mesh receiveShadow castShadow position={[1, -0.9, 3]} ref={swirlRef}>
        <sphereBufferGeometry args={[0.75, 64, 64]} />
        <Video url={"/abstract.mp4"} delay={transitionDelay} />
        <Shadow
          position-y={-0.79}
          rotation-x={-Math.PI / 3}
          opacity={0.6}
          scale={[0.8, 0.8, 1]}
        />
      </mesh>
    </>
  );
}
