import { InputType } from "../parser/inputTypes";
import { layoutTree } from "./treeLayout";
import { MyDataType } from "../App";

export enum LayoutType {
  Tree,
  TopologicalSort,
  ForceLayout
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

export function performLayout(layoutType: number, data: MyDataType, inputType: number) {
  switch (layoutType) {
    case LayoutType.Tree:
      return layoutTree(data, inputType);
    default:
      console.error("unhandled layout type");
      return;
  }
}
