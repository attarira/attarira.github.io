"use client";
import { NodeIcon } from './nodes/NodeIcon';

export const DraggableNode = ({ type, label, category = 'custom', icon, accentColor, description }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <div
        className={`draggable-node node-category-${category}`}
        style={accentColor ? { '--category-color': accentColor } : undefined}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        draggable
      >
          <span className="draggable-node__mark">
            <NodeIcon name={icon} className="draggable-node__icon" />
          </span>
          <span className="draggable-node__content">
            <span className="draggable-node__label">{label}</span>
            {description ? (
              <span className="draggable-node__description">{description}</span>
            ) : null}
          </span>
      </div>
    );
  };
