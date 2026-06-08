"use client";
import { APINode } from './APINode';
import { ConditionNode } from './ConditionNode';
import { FilterNode } from './FilterNode';
import { InputNode } from './InputNode';
import { LLMNode } from './LLMNode';
import { MathNode } from './MathNode';
import { OutputNode } from './OutputNode';
import { TextNode } from './TextNode';
import { TransformNode } from './TransformNode';
import { toolbarNodeConfigs, getNodeInitialData } from './nodeConfigs';

export const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  math: MathNode,
  filter: FilterNode,
  transform: TransformNode,
  api: APINode,
  condition: ConditionNode,
};

export { toolbarNodeConfigs, getNodeInitialData };
