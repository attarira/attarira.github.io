"use client";
import { Handle, Position } from 'reactflow';

const positionMap = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
};

export const NodeHandle = ({ nodeId, handle }) => {
  const position = positionMap[handle.position] || handle.position;
  const handleId = `${nodeId}-${handle.id}`;
  const isSource = handle.type === 'source';

  return (
    <Handle
      className={`node-handle node-handle-${handle.type}`}
      type={handle.type}
      position={position}
      id={handleId}
      style={handle.style}
    >
      {handle.label ? (
        <span className={`handle-tooltip handle-tooltip--${isSource ? 'right' : 'left'}`}>
          {handle.label}
        </span>
      ) : null}
    </Handle>
  );
};
