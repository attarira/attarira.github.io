"use client";
 const textFileOptions = [
  { value: 'Text', label: 'Text' },
  { value: 'File', label: 'File' },
];

export const nodeConfigs = {
  customInput: {
    type: 'customInput',
    label: 'Input',
    title: 'Input',
    category: 'input',
    icon: 'input',
    accentColor: '#2563eb',
    description: 'Start with user data',
    getInitialData: (id) => ({
      inputName: id.replace('customInput-', 'input_'),
      inputType: 'Text',
    }),
    fields: [
      {
        type: 'text',
        label: 'Name',
        name: 'inputName',
        defaultValue: (id) => id.replace('customInput-', 'input_'),
      },
      {
        type: 'select',
        label: 'Type',
        name: 'inputType',
        defaultValue: 'Text',
        options: textFileOptions,
      },
    ],
    handles: [
      { type: 'source', position: 'right', id: 'value', label: 'Value' },
    ],
  },
  llm: {
    type: 'llm',
    label: 'LLM',
    title: 'LLM',
    category: 'ai',
    icon: 'sparkles',
    accentColor: '#7c3aed',
    description: 'Generate model output',
    content: 'This is a LLM.',
    handles: [
      { type: 'target', position: 'left', id: 'system', label: 'System', style: { top: `${100 / 3}%` } },
      { type: 'target', position: 'left', id: 'prompt', label: 'Prompt', style: { top: `${200 / 3}%` } },
      { type: 'source', position: 'right', id: 'response', label: 'Response' },
    ],
  },
  customOutput: {
    type: 'customOutput',
    label: 'Output',
    title: 'Output',
    category: 'output',
    icon: 'output',
    accentColor: '#059669',
    description: 'Return workflow results',
    getInitialData: (id) => ({
      outputName: id.replace('customOutput-', 'output_'),
      outputType: 'Text',
    }),
    fields: [
      {
        type: 'text',
        label: 'Name',
        name: 'outputName',
        defaultValue: (id) => id.replace('customOutput-', 'output_'),
      },
      {
        type: 'select',
        label: 'Type',
        name: 'outputType',
        defaultValue: 'Text',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'File', label: 'Image' },
        ],
      },
    ],
    handles: [
      { type: 'target', position: 'left', id: 'value', label: 'Value' },
    ],
  },
  text: {
    type: 'text',
    label: 'Text',
    title: 'Text',
    category: 'text',
    icon: 'text',
    accentColor: '#d97706',
    description: 'Compose prompt text',
    getInitialData: () => ({
      text: '{{input}}',
    }),
    fields: [
      {
        type: 'text',
        label: 'Text',
        name: 'text',
        defaultValue: '{{input}}',
      },
    ],
    handles: [
      { type: 'source', position: 'right', id: 'output', label: 'Output' },
    ],
  },
  math: {
    type: 'math',
    label: 'Math',
    title: 'Math',
    category: 'custom',
    icon: 'calculator',
    accentColor: '#64748b',
    description: 'Combine numeric inputs',
    getInitialData: () => ({
      operation: 'Add',
    }),
    fields: [
      {
        type: 'select',
        label: 'Operation',
        name: 'operation',
        defaultValue: 'Add',
        options: [
          { value: 'Add', label: 'Add' },
          { value: 'Subtract', label: 'Subtract' },
          { value: 'Multiply', label: 'Multiply' },
          { value: 'Divide', label: 'Divide' },
        ],
      },
    ],
    handles: [
      { type: 'target', position: 'left', id: 'a', label: 'A', style: { top: '35%' } },
      { type: 'target', position: 'left', id: 'b', label: 'B', style: { top: '65%' } },
      { type: 'source', position: 'right', id: 'result', label: 'Result' },
    ],
  },
  filter: {
    type: 'filter',
    label: 'Filter',
    title: 'Filter',
    category: 'logic',
    icon: 'filter',
    accentColor: '#e11d48',
    description: 'Keep matching values',
    getInitialData: () => ({
      condition: '',
    }),
    fields: [
      {
        type: 'text',
        label: 'Condition',
        name: 'condition',
        defaultValue: '',
      },
    ],
    handles: [
      { type: 'target', position: 'left', id: 'input', label: 'Input' },
      { type: 'source', position: 'right', id: 'output', label: 'Output' },
    ],
  },
  transform: {
    type: 'transform',
    label: 'Transform',
    title: 'Transform',
    category: 'data',
    icon: 'transform',
    accentColor: '#0891b2',
    description: 'Convert text or data',
    getInitialData: () => ({
      transform: 'Uppercase',
    }),
    fields: [
      {
        type: 'select',
        label: 'Transform',
        name: 'transform',
        defaultValue: 'Uppercase',
        options: [
          { value: 'Uppercase', label: 'Uppercase' },
          { value: 'Lowercase', label: 'Lowercase' },
          { value: 'Trim', label: 'Trim' },
          { value: 'JSON Stringify', label: 'JSON Stringify' },
        ],
      },
    ],
    handles: [
      { type: 'target', position: 'left', id: 'input', label: 'Input' },
      { type: 'source', position: 'right', id: 'output', label: 'Output' },
    ],
  },
  api: {
    type: 'api',
    label: 'API',
    title: 'API',
    category: 'integration',
    icon: 'api',
    accentColor: '#4f46e5',
    description: 'Call an external service',
    getInitialData: () => ({
      url: '',
      method: 'GET',
    }),
    fields: [
      {
        type: 'text',
        label: 'URL',
        name: 'url',
        defaultValue: '',
      },
      {
        type: 'select',
        label: 'Method',
        name: 'method',
        defaultValue: 'GET',
        options: [
          { value: 'GET', label: 'GET' },
          { value: 'POST', label: 'POST' },
        ],
      },
    ],
    handles: [
      { type: 'target', position: 'left', id: 'payload', label: 'Payload' },
      { type: 'source', position: 'right', id: 'response', label: 'Response' },
    ],
  },
  condition: {
    type: 'condition',
    label: 'Condition',
    title: 'Condition',
    category: 'logic',
    icon: 'branch',
    accentColor: '#c026d3',
    description: 'Branch by expression',
    getInitialData: () => ({
      expression: '',
    }),
    fields: [
      {
        type: 'text',
        label: 'Expression',
        name: 'expression',
        defaultValue: '',
      },
    ],
    handles: [
      { type: 'target', position: 'left', id: 'input', label: 'Input' },
      { type: 'source', position: 'right', id: 'true', label: 'True', style: { top: '35%' } },
      { type: 'source', position: 'right', id: 'false', label: 'False', style: { top: '65%' } },
    ],
  },
};

export const toolbarNodeConfigs = Object.values(nodeConfigs).map(({ type, label, category, icon, accentColor, description }) => ({
  type,
  label,
  category,
  icon,
  accentColor,
  description,
}));

export const getNodeInitialData = (nodeId, type) => {
  const config = nodeConfigs[type];

  return {
    id: nodeId,
    nodeType: type,
    ...(config?.getInitialData ? config.getInitialData(nodeId) : {}),
  };
};
