import { ShaderGradient, ShaderGradientCanvas } from "shadergradient";
import React, { useMemo } from "react";

const colorSets = [
  ["#606080", "#8d7dca", "#212121"],
  ["#80ffc3", "#a6574e", "#00298a"],
  ["#f57ff3", "#58426e", "#210c1c"],
];

export function Gradient({ currentId }: { currentId: number }) {
  const set = useMemo(() => {
    return colorSets[currentId % colorSets.length];
  }, [currentId]);

  return (
    <ShaderGradientCanvas>
      <ShaderGradient
        animate="on"
        brightness={1}
        cAzimuthAngle={180}
        cDistance={2.8}
        cPolarAngle={80}
        cameraZoom={9.1}
        color1={set[0]}
        color2={set[1]}
        color3={set[2]}
        envPreset="city"
        frameRate={10}
        grain="on"
        lightType="3d"
        positionX={0}
        positionY={0}
        positionZ={0}
        range="disabled"
        rangeEnd={40}
        rangeStart={0}
        reflection={0.1}
        rotationX={50}
        rotationY={0}
        rotationZ={-60}
        shader="defaults"
        type="waterPlane"
        uAmplitude={0}
        uDensity={1.5}
        uFrequency={0}
        uSpeed={0.3}
        uStrength={1.7}
        uTime={8}
        wireframe={false}
        zoomOut={false}
      />
    </ShaderGradientCanvas>
  );
}
