export enum InputType {
  EdgePairs,
  WeightedEdgePairs,
  AdjacencyList,
  AdjacencyList1Ind,
  AdjacencyMatrix,
  BinaryTree,
  GraphObject,
  TreeObject
}

export function getLabel(type: number) {
  switch (type) {
    case InputType.EdgePairs:
      return "Edge Pairs";
    case InputType.WeightedEdgePairs:
      return "Weighted Edge Pairs";
    case InputType.AdjacencyList:
      return "Adjacency List";
    case InputType.AdjacencyList1Ind:
      return "One-indexed Adjacency List";
    case InputType.AdjacencyMatrix:
      return "Adjacency Matrix";
    case InputType.BinaryTree:
      return "Binary Tree or Heap";
    case InputType.GraphObject:
      return "Graph JSON";
    case InputType.TreeObject:
      return "Tree JSON";
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
    case InputType.AdjacencyList1Ind:
      config.oneIndexed = true;
      break;
    default:
      break;
  }
  return config;
}
