"use client";
// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    nodeIds: {},
    getNodeId: (type) => {
        const nextNodeIds = {...get().nodeIds};
        if (nextNodeIds[type] === undefined) {
            nextNodeIds[type] = 0;
        }
        nextNodeIds[type] += 1;
        set({nodeIds: nextNodeIds});
        return `${type}-${nextNodeIds[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    deleteNode: (nodeId) => {
      set({
        nodes: get().nodes.filter((node) => node.id !== nodeId),
        edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      });
    },
    deleteEdge: (edgeId) => {
      set({
        edges: get().edges.filter((edge) => edge.id !== edgeId),
      });
    },
    onNodesChange: (changes) => {
      const deletedNodeIds = new Set(
        changes
          .filter((change) => change.type === 'remove')
          .map((change) => change.id)
      );

      set({
        nodes: applyNodeChanges(changes, get().nodes),
        edges: deletedNodeIds.size
          ? get().edges.filter((edge) => (
            !deletedNodeIds.has(edge.source) && !deletedNodeIds.has(edge.target)
          ))
          : get().edges,
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      // Reject self-loops at creation time; all other connection behavior stays unchanged.
      if (connection.source === connection.target) {
        return;
      }

      set({
        edges: addEdge({
          ...connection,
          type: 'deletable',
          animated: true,
          style: { stroke: 'var(--edge-color)', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            height: 18,
            width: 18,
            color: '#8079c6',
          },
        }, get().edges),
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: { ...node.data, [fieldName]: fieldValue },
            };
          }
  
          return node;
        }),
      });
    },
    clearCanvas: () => {
      set({
        nodes: [],
        edges: [],
        nodeIds: {},
      });
    },
  }));
