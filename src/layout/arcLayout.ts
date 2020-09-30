import * as LayoutUtils from "./layoutUtils";
import { MyDataType, MyGraphNodeType } from "../App";
import * as Graph from "../graph/Graph";

const DEFAULT_X_SPACING = 70;
const DEFAULT_Y_PADDING = 120;

export function layoutArc(data: MyDataType) {
  let { startNode, nodes, links } = data;

  const disconnectedComponents = LayoutUtils.getDisconnectedComponents(nodes, links, startNode);

  let y_value = Graph.DEFAULT_TOP_PADDING + DEFAULT_Y_PADDING / 2;

  for (let comp of disconnectedComponents) {
    let sortedNodes = arrangeNodesInLine(comp, startNode);

    // assign positions to the sorted notes
    let x_offset = Graph.DEFAULT_LEFT_PADDING;
    for (let node of sortedNodes) {
      node.x = x_offset;
      node.y = y_value;
      x_offset += DEFAULT_X_SPACING;
    }
    y_value += DEFAULT_Y_PADDING * 2;
  }
}

// return node list sorted by node ids lexicographical order
// with startNode (if specified) in front
function arrangeNodesInLine(nodes: Array<MyGraphNodeType>, startNode: string | undefined) {
  const collected: Array<string> = [];
  const res: Array<string> = [];
  const idToNode: any = {};
  for (let node of nodes) {
    idToNode[node.id] = node;
    if (startNode && startNode === node.id) {
      res.push(startNode);
    } else {
      collected.push(node.id);
    }
  }
  collected.sort();
  for (let nodeId of collected) {
    res.push(nodeId);
  }
  const nodeRtn = [];
  for (let nodeId of res) {
    nodeRtn.push(idToNode[nodeId]);
  }
  return nodeRtn;
}
