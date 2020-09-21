import { InputType } from "../parser/inputTypes";

export enum LayoutType {
  Tree,
  ForceLayout,
  TopologicalSort
}

export function getLayoutLabel(type: number) {
  switch (type) {
    case LayoutType.Tree:
      return "Tree";
    case LayoutType.ForceLayout:
      return "Force-Directed";
    case LayoutType.TopologicalSort:
      return "Topological Sort";
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
