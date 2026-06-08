"use client";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useUpdateNodeInternals } from 'reactflow';
import { BaseNode } from './BaseNode';
import { nodeConfigs } from './nodeConfigs';
import { useStore } from '../store';

const VALID_VARIABLE_NAME = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const PREFERRED_WIDTH = 360;
const MAX_WIDTH = 520;
const GROW_AFTER_CHARACTERS = 42;
const WIDTH_PER_EXTRA_CHARACTER = 6;
const MIN_TEXTAREA_HEIGHT = 88;
const MAX_TEXTAREA_HEIGHT = 240;
const NODE_VERTICAL_CHROME = 124;
const HANDLE_GAP = 24;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getContentWidth = (text) => {
  const longestLineLength = text
    .split('\n')
    .reduce((longest, line) => Math.max(longest, line.length), 0);
  const extraWidth = Math.max(0, longestLineLength - GROW_AFTER_CHARACTERS) * WIDTH_PER_EXTRA_CHARACTER;

  return clamp(PREFERRED_WIDTH + extraWidth, PREFERRED_WIDTH, MAX_WIDTH);
};

const extractVariables = (text) => {
  const variables = [];
  const seen = new Set();
  let searchFrom = 0;

  while (searchFrom < text.length) {
    const openIndex = text.indexOf('{{', searchFrom);

    if (openIndex === -1) {
      break;
    }

    const closeIndex = text.indexOf('}}', openIndex + 2);

    if (closeIndex === -1) {
      break;
    }

    const rawVariableName = text.slice(openIndex + 2, closeIndex);
    const variableName = rawVariableName.trim();

    // Braces inside a candidate indicate nested braces, not a valid variable token.
    if (
      !rawVariableName.includes('{') &&
      !rawVariableName.includes('}') &&
      VALID_VARIABLE_NAME.test(variableName) &&
      !seen.has(variableName)
    ) {
      seen.add(variableName);
      variables.push(variableName);
    }

    searchFrom = closeIndex + 2;
  }

  return variables;
};

const getHandleTop = (index, total) => {
  if (total === 1) {
    return '50%';
  }

  return `${((index + 1) / (total + 1)) * 100}%`;
};

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const updateNodeInternals = useUpdateNodeInternals();
  const textareaRef = useRef(null);
  const frameRef = useRef(null);
  const nodeData = data || {};
  const text = nodeData.text ?? nodeConfigs.text.getInitialData().text;
  const variables = useMemo(() => extractVariables(text), [text]);
  const [size, setSize] = useState({
    width: PREFERRED_WIDTH,
    minHeight: NODE_VERTICAL_CHROME + MIN_TEXTAREA_HEIGHT,
    textareaHeight: MIN_TEXTAREA_HEIGHT,
    isTextareaScrollable: false,
  });

  const handles = useMemo(() => {
    // Template variables like {{customerName}} become target handles so other
    // nodes can feed values directly into the text prompt.
    const variableHandles = variables.map((variableName, index) => ({
      type: 'target',
      position: 'left',
      id: `var-${variableName}`,
      label: variableName,
      style: { top: getHandleTop(index, variables.length) },
    }));

    return [...variableHandles, ...nodeConfigs.text.handles];
  }, [variables]);

  const measureNode = useCallback(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    const nextWidth = getContentWidth(text);

    // Measure after wrapping at the current width, then cap height so long
    // prompts scroll internally instead of growing across the canvas.
    textarea.style.height = 'auto';
    textarea.style.overflowY = 'hidden';

    const measuredTextareaHeight = Math.max(MIN_TEXTAREA_HEIGHT, textarea.scrollHeight + 2);
    const nextTextareaHeight = clamp(
      measuredTextareaHeight,
      MIN_TEXTAREA_HEIGHT,
      MAX_TEXTAREA_HEIGHT,
    );
    const isTextareaScrollable = measuredTextareaHeight > MAX_TEXTAREA_HEIGHT;

    textarea.style.height = `${nextTextareaHeight}px`;
    textarea.style.overflowY = isTextareaScrollable ? 'auto' : 'hidden';

    const handleHeight = variables.length > 1 ? (variables.length + 1) * HANDLE_GAP : 0;
    const nextMinHeight = Math.max(
      NODE_VERTICAL_CHROME + nextTextareaHeight,
      NODE_VERTICAL_CHROME + handleHeight,
    );

    setSize((currentSize) => {
      if (
        currentSize.width === nextWidth &&
        currentSize.minHeight === nextMinHeight &&
        currentSize.textareaHeight === nextTextareaHeight &&
        currentSize.isTextareaScrollable === isTextareaScrollable
      ) {
        return currentSize;
      }

      return {
        width: nextWidth,
        minHeight: nextMinHeight,
        textareaHeight: nextTextareaHeight,
        isTextareaScrollable,
      };
    });
  }, [text, variables.length]);

  useLayoutEffect(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      measureNode();
    });

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [measureNode, size.width, text]);

  useLayoutEffect(() => {
    updateNodeInternals(id);
  }, [handles, id, size, updateNodeInternals]);

  const onChange = (event) => {
    updateNodeField(id, 'text', event.target.value);
  };

  return (
    <BaseNode
      id={id}
      data={nodeData}
      config={nodeConfigs.text}
      handles={handles}
      className="text-node"
      style={{ width: size.width, minHeight: size.minHeight }}
    >
      <label className="node-field node-field--textarea text-node__field">
        <span className="node-field__label">Text</span>
        <textarea
          ref={textareaRef}
          className="node-field__control text-node__textarea nodrag"
          style={{
            height: size.textareaHeight,
            overflowY: size.isTextareaScrollable ? 'auto' : 'hidden',
          }}
          value={text}
          onChange={onChange}
        />
      </label>
    </BaseNode>
  );
};
