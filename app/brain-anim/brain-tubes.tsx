'use client'

import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

// Base color (for example, a shade of blue)
const baseColor = new THREE.Color(0.1, 0.3, 0.6); // Change this to your desired base color

const getRandomColorValue = () => Math.random() * 0.5; // Random value between 0 and 0.5

export const BrainMaterial = shaderMaterial(
  {
    time: 0,
    color: baseColor.clone().multiplyScalar(getRandomColorValue()), // Initial color adjusted for brightness
    mouse: new THREE.Vector3(0, 0, 0),
  },
  // vertex shader
  /*glsl*/ `
    varying vec2 vUv;
    uniform float time;
    uniform vec3 mouse;
    varying float vProgress;
    void main() {
      vUv = uv;
      vProgress = smoothstep(-1., 1., sin(vUv.x * 8. + time * 3.));
      
      vec3 p = position;
      float maxDist = 0.05;
      float dist = length(mouse - p);
      if (dist < maxDist) {
        vec3 dir = normalize(mouse - p);
        dir *= 1. - dist / maxDist; 
        p -= dir * 0.03;
      }
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    }
  `,
  // fragment shader
  /*glsl*/ `
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    varying float vProgress;
    void main() {
      float hideCorners1 = smoothstep(1., 0.9, vUv.x);
      float hideCorners2 = smoothstep(0., 0.1, vUv.x);
      vec3 finalColor = color; // Use the consistent color
      gl_FragColor.rgba = vec4(finalColor, hideCorners1 * hideCorners2);
    }
  `,
);

extend({ BrainMaterial });

function Tube(props: { curve: THREE.CatmullRomCurve3; brightness: number }) {
  const { curve, brightness } = props;
  const brainMat = React.useRef<THREE.ShaderMaterial>(null!);
  const { viewport } = useThree();

  // Set initial color for the tube
  useEffect(() => {
    brainMat.current.uniforms.color.value = baseColor.clone().multiplyScalar(brightness);
  }, [brightness]); // Update color when brightness changes

  useFrame(({ clock, mouse }) => {
    brainMat.current.uniforms.time.value = clock.getElapsedTime();

    brainMat.current.uniforms.mouse.value = new THREE.Vector3(
      (mouse.x * viewport.width) / 2,
      (mouse.y * viewport.height) / 2,
      0,
    );
  });

  return (
    <>
      <mesh>
        <tubeGeometry args={[curve, 64, 0.001, 2, false]} />
        <brainMaterial
          ref={brainMat}
          side={THREE.DoubleSide}
          transparent={true}
          depthTest={false}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}

export function Tubes(props: { curves: THREE.CatmullRomCurve3[] }) {
  const { curves } = props;
  const [brightness, setBrightness] = useState(getRandomColorValue()); // Manage brightness state

  // Update brightness every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBrightness(getRandomColorValue());
    }, 100);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <>
      {curves.map((curve, index) => {
        <Tube key={index} curve={curve} brightness={brightness} />; // Pass brightness to each tube
      })}
    </>
  );
}



