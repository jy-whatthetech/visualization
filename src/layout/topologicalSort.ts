import * as LayoutUtils from "./layoutUtils";
import { MyDataType, MyGraphNodeType, MyGraphLinkType } from "../App";
import * as Graph from "../graph/Graph";

export function layoutTopoSort(data: MyDataType) {
  let { startNode, nodes, links } = data;

  // remove backlinks; otherwise there will be a cycle
  let deduplicatedLinks = LayoutUtils.removeRepeatedEdges(links);

  const disconnectedComponents = LayoutUtils.getDisconnectedComponents(
    nodes,
    deduplicatedLinks,
    startNode
  );
  for (let comp of disconnectedComponents) {
    let roots = findNodesWithZeroIndegree(comp, links);
    if (roots.length === 0) {
      // return error message
      return "Invalid Graph: cycle detected in graph. Topological Sort can only be performed on graphs without cycles.";
    }
  }
}

export function findNodesWithZeroIndegree(
  nodes: Array<MyGraphNodeType>,
  links: Array<MyGraphLinkType>
): Array<MyGraphNodeType> {
  const hasIndegree = new Set<string>();
  const rtn: Array<MyGraphNodeType> = [];
  for (let link of links) {
    hasIndegree.add(link.target);
  }
  for (let node of nodes) {
    if (!hasIndegree.has(node.id)) {
      rtn.push(node);
    }
  }
  return rtn;
}
