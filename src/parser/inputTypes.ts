export enum InputType {
  EdgePairs,
  WeightedEdgePairs,
  AdjacencyList,
  AdjacencyMatrix,
  GraphObject,
  BinaryTreeObject
}

export function getLabel(type: number) {
  switch (type) {
    case InputType.EdgePairs:
      return "Edge Pairs";
    case InputType.WeightedEdgePairs:
      return "Weighted Edge Pairs";
    case InputType.AdjacencyList:
      return "Adjacency List";
    case InputType.AdjacencyMatrix:
      return "Adjacency Matrix";
    case InputType.GraphObject:
      return "Graph JSON";
    case InputType.BinaryTreeObject:
      return "Binary Tree JSON";
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
