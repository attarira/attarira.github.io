"use client";
import { useStore } from '../store';

const getDefaultValue = (field, nodeId, data) => {
  if (typeof field.defaultValue === 'function') {
    return field.defaultValue(nodeId, data);
  }

  return field.defaultValue || '';
};

const useFieldValue = (nodeId, data, field) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const value = data?.[field.name] ?? getDefaultValue(field, nodeId, data);

  const onChange = (event) => {
    updateNodeField(nodeId, field.name, event.target.value);
  };

  return { value, onChange };
};

export const NodeTextField = ({ nodeId, data, field }) => {
  const { value, onChange } = useFieldValue(nodeId, data, field);

  return (
    <label className="node-field">
      <span className="node-field__label">{field.label}</span>
      <input
        className="node-field__control nodrag"
        type="text"
        value={value}
        onChange={onChange}
      />
    </label>
  );
};

export const NodeSelectField = ({ nodeId, data, field }) => {
  const { value, onChange } = useFieldValue(nodeId, data, field);

  return (
    <label className="node-field">
      <span className="node-field__label">{field.label}</span>
      <select className="node-field__control nodrag" value={value} onChange={onChange}>
        {field.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};

export const NodeTextareaField = ({ nodeId, data, field }) => {
  const { value, onChange } = useFieldValue(nodeId, data, field);

  return (
    <label className="node-field node-field--textarea">
      <span className="node-field__label">{field.label}</span>
      <textarea
        className="node-field__control nodrag"
        value={value}
        onChange={onChange}
      />
    </label>
  );
};

export const NodeField = ({ nodeId, data, field }) => {
  if (field.type === 'select') {
    return <NodeSelectField nodeId={nodeId} data={data} field={field} />;
  }

  if (field.type === 'textarea') {
    return <NodeTextareaField nodeId={nodeId} data={data} field={field} />;
  }

  return <NodeTextField nodeId={nodeId} data={data} field={field} />;
};
