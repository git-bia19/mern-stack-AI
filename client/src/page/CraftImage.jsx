import React from 'react';
import { useNode } from '@craftjs/core';
import { Image as KonvaImage } from 'react-konva';

const CraftImage = ({ image, x = 50, y = 50 }) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <KonvaImage
      image={image}
      x={x}
      y={y}
      draggable
      ref={ref => connect(drag(ref))}
    />
  );
};

export default CraftImage;
