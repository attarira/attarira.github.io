"use client";
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from 'reactflow';
import { useStore } from './store';

export const DeletableEdge = ({
  id,
  data,
  source,
  sourceHandle,
  sourceX,
  sourceY,
  target,
  targetHandle,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
}) => {
  const deleteEdge = useStore((state) => state.deleteEdge);
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleDelete = (event) => {
    event.stopPropagation();
    deleteEdge(id);
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <button
          type="button"
          className="edge-delete-button nodrag nopan"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
          onClick={handleDelete}
          aria-label="Delete edge"
        >
          x
        </button>
      </EdgeLabelRenderer>
    </>
  );
};

