import React from 'react';
import { useEditor } from '@craftjs/core';
import CraftImage from './CraftImage';

const Layers = ({ images, onRemove }) => {
  const { connectors } = useEditor();

  return (
    <div>
      {images.map((img, index) => (
        <div key={index} ref={ref => connectors.connect(ref)}>
          <CraftImage src={img.src} x={img.x} y={img.y} />
          <button onClick={() => onRemove(index)}>Remove Layer</button>
        </div>
      ))}
    </div>
  );
};

export default Layers;
