// 🌱 Healing Garden - Seed Icon SVG Component

import React from 'react';
import Svg, { Ellipse } from 'react-native-svg';

interface SeedIconProps {
  size?: number;
}

export const SeedIcon: React.FC<SeedIconProps> = ({ size = 40 }) => {
  return (
    <Svg width={size} height={size * 0.89} viewBox="0 0 286 255" fill="none">
      <Ellipse
        cx="108.803"
        cy="84.960"
        rx="40.617"
        ry="19.457"
        fill="#B98A5A"
        transform="rotate(90.114 108.803 84.960)"
      />
      <Ellipse
        cx="199.560"
        cy="114.896"
        rx="38.105"
        ry="17.587"
        fill="#B98A5A"
        transform="rotate(-154.493 199.560 114.896)"
      />
      <Ellipse
        cx="111.482"
        cy="191.708"
        rx="42.148"
        ry="24.582"
        fill="#B98A5A"
        transform="rotate(119.055 111.482 191.708)"
      />
    </Svg>
  );
};
