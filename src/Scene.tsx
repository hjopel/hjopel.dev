import {
  useAspect,
  Text,
  OrbitControls,
  useTexture,
  Reflector,
} from "@react-three/drei";
import {
  useThree,
  useFrame,
  Canvas,
  GroupProps,
  context,
  MeshProps,
} from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils";
import React, { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import {
  BoxBufferGeometry,
  Material,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  VideoTexture,
} from "three";
import gsap from "gsap";
import { a, AnimatedComponent, SpringValue } from "@react-spring/three";
import { useSpring } from "@react-spring/core";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { BlurPass, Resizer, KernelSize } from "postprocessing";

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
      <Canvas ref={canRef} camera={{ fov: 10, position: [15, 0.25, 0] }}>
        {/* <CanvasEl
          isFullscreen={isFullscreen}
          transitionDelay={transitionDelay}
          canvasRef={canRef}
        /> */}
        {/* <Text
          fontSize={0.1}
          color="white"
          position={[0, 0.25, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          more than just
        </Text>
        <Text fontSize={0.4} color="white" rotation={[0, Math.PI / 2, 0]}>
          web development.
        </Text> */}
        <color attach="background" args={["black"]} />
        <fog attach="fog" args={["black", 1, 15]} />
        <group rotation={[0, Math.PI / 2, 0]}>
          <SeaWrapper isFullscreen={isFullscreen} />
          <Ground />
        </group>
        <OrbitControls />
        {/* <primitive object={new THREE.AxesHelper(10)} /> */}
        <EffectComposer>
          <Bloom
            intensity={1.0} // The bloom intensity.
            luminanceThreshold={0.9} // luminance threshold. Raise this value to mask out darker elements in the scene.
            luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1
          />
        </EffectComposer>
      </Canvas>
    </>
  );
}
function SeaWrapper({ isFullscreen }: { isFullscreen: boolean }) {
  return (
    <>
      <Lights isFullscreen={isFullscreen} />
      <Sea />
    </>
  );
}
type ExtProps = {
  dx: number;
  dy: number;
  hue: number;
  saturation: number;
};

function Sea() {
  const meshes: { mesh: any; props: ExtProps }[] = [],
    xgrid = 20,
    ygrid = 10;
  const [video] = useState(() =>
    Object.assign(document.createElement("video"), {
      src: "/sintel.mp4",
      crossOrigin: "Anonymous",
      loop: true,
      muted: true,
    })
  );
  video.addEventListener("play", function () {
    this.currentTime = 3;
  });
  const vt = new THREE.VideoTexture(video);
  let i, j, ox, oy, geometry, mesh;

  const ux = 1 / xgrid;
  const uy = 1 / ygrid;

  const xsize = 480 / xgrid;
  const ysize = 204 / ygrid;
  const parameters = { color: 0xffffff, map: vt };

  video.playsInline = true;
  video.play();
  let arr: number[] = [];
  let arr2: number[] = [];
  for (let i = 0; i < xgrid; i++) arr[i] = i;
  for (let i = 0; i < ygrid; i++) arr2[i] = i;

  let counter = 0;
  let h;

  useFrame(() => {
    const time = Date.now() * 0.00005;

    if (counter % 1000 > 200) {
      for (let i = 0; i < meshes.length; i++) {
        let material: any = myRef.current[i].material;
        h = ((360 * (meshes[i].props.hue + time)) % 360) / 360;
        material.color.setHSL(h, meshes[i].props.saturation, 0.5);
        let mesh = myRef.current[i];
        mesh.rotation.x += 10 * meshes[i].props.dx;
        mesh.rotation.y += 10 * meshes[i].props.dy;
        mesh.position.x -= 150 * 0.001 * meshes[i].props.dx;
        mesh.position.y += 150 * 0.001 * meshes[i].props.dy;
        mesh.position.z += 300 * 0.001 * meshes[i].props.dx;
      }
    }
    if (counter % 1000 === 0) {
      // if (counter === 1000) {
      for (let i = 0; i < meshes.length; i++) {
        meshes[i].props.dx *= -1;
        meshes[i].props.dy *= -1;
      }
    }
    counter++;
  });
  const material = new THREE.MeshLambertMaterial(parameters);
  const myRef = useRef<Mesh[]>([]);
  const addToRefs: (el: any) => void = (el) => {
    if (el && !myRef.current.includes(el)) {
      myRef.current.push(el);
    }
  };
  return (
    <>
      {arr
        .map((i) =>
          arr2.map((j) => {
            ox = i;
            oy = j;
            // const material = new THREE.MeshLambertMaterial(parameters);

            let geo1 = new THREE.BoxBufferGeometry(xsize, ysize, xsize);
            change_uvs(geo1, ux, uy, ox, oy);
            material.color.setHSL(i / xgrid, 1 - j / ygrid, 0.5);

            let mesh = (
              <mesh
                geometry={geo1}
                material={material}
                scale={0.005}
                position={[
                  (i - xgrid / 2) * xsize * 0.005,
                  (j - ygrid / 2) * ysize * 0.005,
                  0,
                ]}
                rotation={[0, 0, 0]}
                key={`${i}${j}`}
                ref={addToRefs}
              />
            );
            meshes.push({
              mesh,
              props: {
                dx: 0.001 * (0.5 - Math.random()),
                dy: 0.001 * (0.5 - Math.random()),
                hue: i / xgrid,
                saturation: 1 - j / ygrid,
              },
            });
            return mesh;
          })
        )
        .flatMap((obj) => obj)}
    </>
  );
}
function Ground() {
  const [floor, normal] = useTexture([
    "/SurfaceImperfections003_1K_var1.jpg",
    "/SurfaceImperfections003_1K_Normal.jpg",
  ]);
  return (
    <Reflector
      blur={[400, 100]}
      resolution={512}
      args={[20, 20]}
      mirror={0.5}
      mixBlur={6}
      mixStrength={1.5}
      rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      position={[0, -0.58, 0]}
    >
      {(Material: any, props: any) => (
        <Material
          color="#a0a0a0"
          metalness={0.4}
          roughnessMap={floor}
          normalMap={normal}
          normalScale={[2, 2]}
          {...props}
        />
      )}
    </Reflector>
  );
}
// function createMesh(i: number, j: number) {
//   const ref = useRef<any>(null!);

//   return <Text ref={ref}>hii</Text>;
// }
function change_uvs(
  geometry: THREE.BoxGeometry,
  unitx: number,
  unity: number,
  offsetx: number,
  offsety: number
) {
  const help = geometry.getAttribute("uv");

  for (let i = 0; i < help.array.length; i += 2) {
    // @ts-ignore
    help.array[i] = (help.array[i] + offsetx) * unitx;
    // @ts-ignore
    help.array[i + 1] = (help.array[i + 1] + offsety) * unity;
  }
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
      <pointLight position={[-10, -10, 10]} intensity={2} color="#ffffff" />
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
      loop: true,
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
  canvasRef?: any;
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
  canvasRef?: any;
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
