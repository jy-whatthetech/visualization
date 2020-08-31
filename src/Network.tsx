import React from "react";
import { Graph } from "@vx/network";

export type NetworkProps = {
  width: number;
  height: number;
  numNodes?: number;
};

export const background = "#272b4d";

export default function Example({ width, height, numNodes = 0 }: NetworkProps) {
  // const nodes = [
  //   { x: 50, y: 20 },
  //   { x: 200, y: 300 },
  //   { x: 300, y: 40 }
  // ];
  const nodes: any[] = [];
  for (let i = 0; i < numNodes; i++) {
    const row = Math.floor(i / 4) + 1;
    const column = i % 4 + 1;
    const y = 100 * row;
    const x = 100 * column;
    nodes.push({ x: x, y: y });
  }

  const links = [
    { source: nodes[0], target: nodes[1] },
    { source: nodes[1], target: nodes[2] },
    { source: nodes[2], target: nodes[0] }
  ];

  const graph = {
    nodes,
    links
  };

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect width={width} height={height} rx={14} fill={background} />
      <Graph graph={graph} />
    </svg>
  );
}
