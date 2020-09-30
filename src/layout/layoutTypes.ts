import { InputType } from "../parser/inputTypes";
import { layoutTree } from "./treeLayout";
import { layoutArc } from "./arcLayout";
import { layoutTopoSort } from "./topologicalSort";
import { MyDataType } from "../App";

export enum LayoutType {
  Tree,
  TopologicalSort,
  Arc,
  ForceLayout,
  Random
}

export function getLayoutLabel(type: number) {
  switch (type) {
    case LayoutType.Tree:
      return "Tree";
    case LayoutType.ForceLayout:
      return "Force-Directed";
    case LayoutType.TopologicalSort:
      return "Topological Sort";
    case LayoutType.Arc:
      return "Arc";
    case LayoutType.Random:
      return "Random";
    default:
      return "Error Label";
  }
}

export function getDefaultLayout({ inputType, data, directed, customNodes, startNode }: any) {
  switch (inputType) {
    case InputType.EdgePairs:
    case InputType.WeightedEdgePairs:
    case InputType.AdjacencyList:
    case InputType.AdjacencyMatrix:
      return LayoutType.Arc;
    case InputType.GraphObject:
      return LayoutType.ForceLayout;
    case InputType.BinaryTreeObject:
    case InputType.BinaryHeap:
    case InputType.LeetcodeTree:
      return LayoutType.Tree;
    default:
      return LayoutType.TopologicalSort;
  }
}

export function performLayout(
  layoutType: number,
  data: MyDataType,
  inputType: number,
  spacing: { x: number; y: number }
) {
  switch (layoutType) {
    case LayoutType.Tree:
      return layoutTree(data, inputType, spacing);
    case LayoutType.TopologicalSort:
      return layoutTopoSort(data, spacing);
    case LayoutType.Arc:
      return layoutArc(data, spacing);
    case LayoutType.ForceLayout:
      // Handled within Graph.tsx
      return;
    case LayoutType.Random:
      // Handled within Graph.tsx
      return;
    default:
      console.error("unhandled layout type");
      return;
  }
}
