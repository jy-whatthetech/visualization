export enum InputType {
  EdgePairs,
  WeightedEdgePairs,
  AdjacencyList,
  AdjacencyList1Ind,
  AdjacencyMatrix,
  BinaryTree,
  GraphObject,
  AncestorGraph
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
      return "Binary Tree";
    case InputType.GraphObject:
      return "Graph Object";
    case InputType.AncestorGraph:
      return "Ancestor Graph";
    default:
      return "Error Label";
  }
}

// TODO: Add ability to specify own nodes
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
