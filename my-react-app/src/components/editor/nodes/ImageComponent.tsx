import React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey } from 'lexical';

export function ImageComponent(props: {
  src: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  maxWidth?: string | number;
  nodeKey: string; // passed from the node
}) {
  const [editor] = useLexicalComposerContext();
  const [isFullSize, setIsFullSize] = React.useState(false);

  const handleRemove = () => {
    editor.update(() => {
      const node = $getNodeByKey(props.nodeKey);
      if (node) {
        node.remove();
      }
    });
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img
        src={props.src}
        alt={props.alt}
        onClick={() => setIsFullSize(!isFullSize)}
        style={{
          width: isFullSize ? '100%' : typeof props.width === 'number' ? `${props.width}px` : props.width,
          height: isFullSize ? 'auto' : typeof props.height === 'number' ? `${props.height}px` : props.height,
          maxWidth: isFullSize ? '100%' : typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth,
          cursor: 'pointer',
          display: 'block',
        }}
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleRemove();
        }}
        style={{
          position: 'absolute',
          top: 4,
          right: 4,
          background: 'black',
          color: 'white',
          borderRadius: '50%',
          border: 'none',
          width: 24,
          height: 24,
          cursor: 'pointer',
        }}
      >
        ×
      </button>
    </div>
  );
}
