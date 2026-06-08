"use client";
// PipelineUI.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap, BackgroundVariant, MarkerType } from 'reactflow';
import { useStore } from './store';
import { useShallow } from 'zustand/react/shallow';
import { nodeTypes, getNodeInitialData } from './nodes';
import { DeletableEdge } from './DeletableEdge';

import 'reactflow/dist/style.css';

const GRID_SIZE = 20;
const PRO_OPTIONS = { hideAttribution: true };
const DEFAULT_VIEWPORT = { x: 0, y: 0, zoom: 0.9 };
const EDGE_TYPES = { deletable: DeletableEdge };
const EDGE_MARKER = {
  type: MarkerType.ArrowClosed,
  width: 18,
  height: 18,
  color: '#8079c6',
};
const DEFAULT_EDGE_OPTIONS = {
  type: 'deletable',
  animated: true,
  style: {
    stroke: 'var(--edge-color)',
    strokeWidth: 2,
  },
  markerEnd: EDGE_MARKER,
};
const CONNECTION_LINE_STYLE = {
  stroke: 'var(--edge-active)',
  strokeWidth: 2,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeId: state.getNodeId,
  addNode: state.addNode,
  clearCanvas: state.clearCanvas,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeId,
      addNode,
      clearCanvas,
      onNodesChange,
      onEdgesChange,
      onConnect
    } = useStore(useShallow(selector));
    const isCanvasEmpty = nodes.length === 0 && edges.length === 0;

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeId = getNodeId(type);
            const newNode = {
              id: nodeId,
              type,
              position,
              data: getNodeInitialData(nodeId, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance, getNodeId, addNode]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const handleClearCanvas = useCallback(() => {
        if (isCanvasEmpty) {
            return;
        }

        const shouldClear = window.confirm('Clear the entire canvas? This will delete all nodes and edges.');

        if (shouldClear) {
            clearCanvas();
        }
    }, [clearCanvas, isCanvasEmpty]);

    return (
        <div ref={reactFlowWrapper} className="flow-shell">
            <button
                type="button"
                className="canvas-clear-button"
                onClick={handleClearCanvas}
                disabled={isCanvasEmpty}
                aria-label="Clear canvas"
            >
                x
            </button>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                edgeTypes={EDGE_TYPES}
                proOptions={PRO_OPTIONS}
                defaultViewport={DEFAULT_VIEWPORT}
                defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
                snapGrid={[GRID_SIZE, GRID_SIZE]}
                connectionLineType='smoothstep'
                connectionLineStyle={CONNECTION_LINE_STYLE}
                deleteKeyCode={null}
            >
                <Background
                    color="var(--canvas-dot)"
                    gap={GRID_SIZE}
                    size={1.4}
                    variant={BackgroundVariant.Dots}
                />
                <Controls />
                <MiniMap
                    nodeColor="var(--color-primary-soft)"
                    nodeStrokeColor="var(--color-primary)"
                    maskColor="rgba(246, 247, 251, 0.74)"
                    pannable
                    zoomable
                />
            </ReactFlow>
        </div>
    )
}
