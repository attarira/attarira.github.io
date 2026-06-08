"use client";
// PipelineToolbar.js

import { DraggableNode } from './DraggableNode';
import { toolbarNodeConfigs } from './nodes';

export const PipelineToolbar = () => {

    return (
        <aside className="node-sidebar" aria-label="Node library">
            <div className="sidebar-header">
                <span className="sidebar-eyebrow">Library</span>
                <h2>Nodes</h2>
                <p>Drag a block onto the canvas to build your AI workflow.</p>
            </div>

            <div className="node-palette">
                {toolbarNodeConfigs.map((node) => (
                    <DraggableNode
                        key={node.type}
                        type={node.type}
                        label={node.label}
                        category={node.category}
                        icon={node.icon}
                        accentColor={node.accentColor}
                        description={node.description}
                    />
                ))}
            </div>
        </aside>
    );
};
