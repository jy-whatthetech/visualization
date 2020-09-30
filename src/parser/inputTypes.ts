export enum InputType {
  EdgePairs,
  WeightedEdgePairs,
  AdjacencyList,
  AdjacencyMatrix,
  GraphObject,
  BinaryTreeObject,
  BinaryHeap,
  LeetcodeTree
}

export function getLabel(type: number) {
  switch (type) {
    case InputType.EdgePairs:
      return "Edge List";
    case InputType.WeightedEdgePairs:
      return "Weighted Edge List";
    case InputType.AdjacencyList:
      return "Adjacency List";
    case InputType.AdjacencyMatrix:
      return "Adjacency Matrix";
    case InputType.GraphObject:
      return "JSON (Graph)";
    case InputType.BinaryTreeObject:
      return "JSON (Binary Tree)";
    case InputType.BinaryHeap:
      return "Array (Binary Heap)";
    case InputType.LeetcodeTree:
      return "Array (Leetcode Tree)";
    default:
      return "Error Label";
  }
}

export function getTypeConfig(type: InputType): any {
  const config = {
    inputType: type,
    weighted: false,
    directed: true,
    oneIndexed: false
  };
  switch (type) {
    case InputType.WeightedEdgePairs:
      config.weighted = true;
      break;
    default:
      break;
  }
  return config;
}
