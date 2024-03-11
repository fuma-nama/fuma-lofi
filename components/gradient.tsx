"use client";
import { ShaderGradient, ShaderGradientCanvas } from "shadergradient";
import { motion } from "framer-motion";
import React from "react";

export function Gradient() {
  return (
    <ShaderGradientCanvas>
      <ShaderGradient
        control="query"
        dampingFactor={1}
        urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&brightness=1&cAzimuthAngle=180&cDistance=2.8&cPolarAngle=80&cameraZoom=9.1&color1=%23606080&color2=%238d7dca&color3=%23212121&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=disabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=50&rotationY=0&rotationZ=-60&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.5&uFrequency=0&uSpeed=0.3&uStrength=1.7&uTime=8&wireframe=false&zoomOut=false"
      />
    </ShaderGradientCanvas>
  );
}
