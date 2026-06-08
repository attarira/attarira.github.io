"use client";
import { NodeField } from './NodeField';
import { NodeHandle } from './NodeHandle';
import { NodeIcon } from './NodeIcon';
import { useStore } from '../store';

export const BaseNode = ({ id, data, config, handles, className = '', style, children }) => {
  const nodeData = data || {};
  const category = config.category || 'custom';
  const nodeHandles = handles ?? config.handles ?? [];
  const accentStyle = config.accentColor ? { '--category-color': config.accentColor } : {};
  const deleteNode = useStore((state) => state.deleteNode);

  const handleDelete = (event) => {
    event.stopPropagation();
    deleteNode(id);
  };

  return (
    <div
      className={`base-node node-category-${category} ${className}`.trim()}
      style={{ ...accentStyle, ...config.style, ...style }}
    >
      {nodeHandles.map((handle) => (
        <NodeHandle key={`${handle.type}-${handle.id}`} nodeId={id} handle={handle} />
      ))}

      <div className="base-node__header">
        <span className="base-node__accent" aria-hidden="true">
          <NodeIcon name={config.icon} className="base-node__icon" />
        </span>
        <div>
          <span className="base-node__title">{config.title}</span>
          <span className="base-node__type">{config.label || config.type}</span>
        </div>
        <button
          type="button"
          className="node-delete-button nodrag"
          onClick={handleDelete}
          aria-label={`Delete ${config.title} node`}
        >
          x
        </button>
      </div>

      <div className="base-node__body">
        {children ?? (
          <>
            {config.content ? <p className="base-node__content">{config.content}</p> : null}
            {config.fields?.map((field) => (
              <NodeField key={field.name} nodeId={id} data={nodeData} field={field} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};
