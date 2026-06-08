"use client";
import { BaseNode } from './BaseNode';

export const createNode = (config) => {
  const ConfiguredNode = ({ id, data }) => (
    <BaseNode id={id} data={data} config={config} />
  );

  ConfiguredNode.displayName = `${config.title}Node`;

  return ConfiguredNode;
};
