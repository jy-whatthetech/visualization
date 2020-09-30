import * as LayoutUtils from "./layoutUtils";
import { MyDataType, MyGraphNodeType, MyGraphLinkType } from "../App";
import * as Graph from "../graph/Graph";

const DEFAULT_SPACE_BETWEEN_COMPONENTS = 80;

const xSpacingArray = [50, 75, 100, 125, 150];
const ySpacingArray = [40, 55, 75, 110, 140];

type IdToNode = {
  [key: string]: MyGraphNodeType;
};

export function layoutTopoSort(data: MyDataType, spacing: { x: number; y: number }) {
  let { startNode, nodes, links } = data;

  let idToNode: IdToNode = {};
  for (let node of nodes) {
    idToNode[node.id] = node;
  }

  // remove backlinks; otherwise there will be a cycle
  let deduplicatedLinks = LayoutUtils.removeRepeatedEdges(links);
  const edgeMap = LayoutUtils.convertToEdgeMap(deduplicatedLinks, true);

  const disconnectedComponents = LayoutUtils.getDisconnectedComponents(
    nodes,
    deduplicatedLinks,
    startNode
  );
  let prevMaxY = 0;
  for (let comp of disconnectedComponents) {
    let roots = findNodesWithZeroIndegree(comp, links, startNode);
    if (roots.length === 0) {
      // return error message
      return "Invalid Graph: cycle detected in graph. Topological Sort can only be performed on graphs without cycles. Could not find an appropriate source node.";
    }

    let curr = roots;
    let baselineY = prevMaxY
      ? prevMaxY + DEFAULT_SPACE_BETWEEN_COMPONENTS
      : Graph.DEFAULT_TOP_PADDING * 1.2;
    let currMaxY = prevMaxY;
    let y_value = baselineY;
    let x_value = Graph.DEFAULT_LEFT_PADDING;

    let seen = new Set<string>();
    let nodeToLevel: any = {};
    let level = 0;
    for (let node of curr) {
      seen.add(node.id);
      nodeToLevel[node.id] = level;
      level += 1;
    }

    while (curr.length > 0) {
      let next: Array<MyGraphNodeType> = [];
      let nextSeen = new Set<string>();
      level = 0;
      for (let node of curr) {
        // add it to the canvas
        node.x = x_value;

        if (edgeMap[node.id]) {
          for (let childId of edgeMap[node.id]) {
            if (seen.has(childId)) {
              // make sure child and its backlink node not on same X level
              let childLevel = nodeToLevel[childId];
              if (level === childLevel) {
                level += 1;
                y_value += ySpacingArray[spacing.y];
              }
              continue;
            } else if (nextSeen.has(childId)) {
              continue;
            }
            nextSeen.add(childId);
            next.push(idToNode[childId]);
          }
        }

        nodeToLevel[node.id] = level;
        node.y = y_value;
        y_value += ySpacingArray[spacing.y];
        level += 1;
      }
      for (let nid of Array.from(nextSeen)) {
        seen.add(nid);
      }

      curr = next;
      currMaxY = Math.max(currMaxY, y_value);
      y_value = baselineY;
      x_value += xSpacingArray[spacing.x];
    }

    // if there are nodes in this component not in seen, there was a cycle; return error
    for (let node of comp) {
      if (!seen.has(node.id)) {
        return "Invalid Graph: cycle detected in graph. Topological Sort generally can only be performed on graphs without cycles. There was trouble deriving one or more source nodes.";
      }
    }

    prevMaxY = currMaxY;
  }
}

function findNodesWithZeroIndegree(
  nodes: Array<MyGraphNodeType>,
  links: Array<MyGraphLinkType>,
  startNode: string | undefined
): Array<MyGraphNodeType> {
  const hasIndegree = new Set<string>();
  const rtn: Array<MyGraphNodeType> = [];
  for (let link of links) {
    hasIndegree.add(link.target);
  }
  for (let node of nodes) {
    if (!hasIndegree.has(node.id)) {
      if (node.id === startNode) {
        rtn.unshift(node);
      } else {
        rtn.push(node);
      }
    }
  }
  return rtn;
}

// returns a map of node ids to their indegree
export function getNodeToIndegree(
  nodes: Array<MyGraphNodeType>,
  links: Array<MyGraphLinkType>
): { [key: string]: number } {
  let res: { [key: string]: number } = {};
  for (let link of links) {
    if (!res[link.target]) {
      res[link.target] = 0;
    }
    res[link.target] += 1;
  }
  return res;
}
