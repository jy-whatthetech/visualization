import * as LayoutUtils from "./layoutUtils";
import { MyDataType, MyGraphNodeType } from "../App";
import * as Graph from "../graph/Graph";
import { generatePermutations } from "../utils/utils";

const DEFAULT_Y_PADDING = 120;

const spacingArray = [50, 60, 75, 95, 125];

const DEFAULT_MAX_LEN_TO_BRUTE_FORCE = 5;

export function layoutArc(data: MyDataType, spacing: { x: number; y: number }) {
  let { startNode, nodes, links } = data;

  const disconnectedComponents = LayoutUtils.getDisconnectedComponents(nodes, links, startNode);
  const directedEdgeMap = LayoutUtils.convertToEdgeMap(links, true);
  const undirectedEdgeMap = LayoutUtils.convertToEdgeMap(links, false);

  let y_value = Graph.DEFAULT_TOP_PADDING + DEFAULT_Y_PADDING / 2;

  for (let comp of disconnectedComponents) {
    let actualStartNode: string | undefined;
    if (startNode && startNode.length > 0) {
      if (LayoutUtils.isStartNodeInComponent(startNode, comp)) {
        actualStartNode = startNode;
      }
    }
    if (!actualStartNode) {
      actualStartNode = arrangeNodesInLine(comp, actualStartNode)[0].id;
    }

    let sortedNodeIds = arrangeSubGraph(
      undirectedEdgeMap,
      "DUMMYNODE_DO_NOT_COPY",
      actualStartNode,
      directedEdgeMap
    );
    let idToNode: any = {};
    for (let node of nodes) {
      idToNode[node.id] = node;
    }
    let sortedNodes = [];
    for (let nid of sortedNodeIds) {
      sortedNodes.push(idToNode[nid]);
    }

    // assign positions to the sorted notes
    let x_offset = Graph.DEFAULT_LEFT_PADDING / 2;
    for (let node of sortedNodes) {
      node.x = x_offset;
      node.y = y_value;
      x_offset += spacingArray[spacing.x];
    }
    y_value += DEFAULT_Y_PADDING * 2;
  }
}

// return node list sorted by node ids lexicographical order
// with startNode (if specified) in front
function arrangeNodesInLine(
  nodes: Array<MyGraphNodeType>,
  startNode: string | undefined
): Array<MyGraphNodeType> {
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

// if not cycle back, layout this node and recurse deeper
// return an array of nodes in the order we want to place them
function arrangeSubGraph(
  edgeMap: LayoutUtils.EdgeMap,
  backNodeId: string,
  currNodeId: string,
  directedEdgeMap: LayoutUtils.EdgeMap
) {
  if (!edgeMap[currNodeId] || edgeMap[currNodeId].length === 0) {
    return [currNodeId];
  }

  let res = [currNodeId];
  // loop through children
  let children = edgeMap[currNodeId];
  let seen = new Set<string>(); // global seen
  for (let child of children) {
    // skip back node
    if (child === backNodeId || seen.has(child)) {
      continue;
    }

    // dfs on this subgraph; it not cycleBack, recurse on this child append result to result list
    // if cycleBack, brute force min line crossing if less than 5 nodes, else call arrangeNodesInLine()
    let collected = new Set<string>(); // result of dfs
    let cycleBack = [false];
    dfs(edgeMap, seen, collected, cycleBack, currNodeId, currNodeId, child);

    if (!cycleBack[0]) {
      let recurseArr = arrangeSubGraph(edgeMap, currNodeId, child, directedEdgeMap);
      for (let nodeId of recurseArr) {
        res.push(nodeId);
      }
    } else {
      let helperArr = bruteForceMinLineCrossings(
        directedEdgeMap,
        Array.from(collected),
        currNodeId
      );

      for (let nodeId of helperArr) {
        if (nodeId !== currNodeId) res.push(nodeId);
      }
    }
  }
  return res;
}

// determine if this dfs cycles back the prev node;
// return set of nodes in this dfs
function dfs(
  edgeMap: LayoutUtils.EdgeMap,
  seen: Set<string>,
  collected: Set<string>,
  cycleBack: Array<boolean>,
  origin: string,
  backNode: string,
  currNode: string
) {
  //add to seen and collected
  seen.add(currNode);
  collected.add(currNode);
  if (!edgeMap[currNode] || edgeMap[currNode].length === 0) {
    return;
  }

  // loop over children, traverse unseen nodes
  // update cycle back if seen is origin, unless the origin is the backNode
  let children = edgeMap[currNode];
  for (let child of children) {
    if (child === backNode) continue;
    if (child === origin) {
      cycleBack[0] = true;
      continue;
    }
    if (seen.has(child)) continue;
    dfs(edgeMap, seen, collected, cycleBack, origin, currNode, child);
  }
}

function bruteForceMinLineCrossings(
  directedEdgeMap: LayoutUtils.EdgeMap,
  collected: Array<string>,
  origin: string
) {
  if (collected.length > 1 + DEFAULT_MAX_LEN_TO_BRUTE_FORCE) {
    collected.sort();
    return collected;
  }

  // generate permutations
  let perms = generatePermutations(collected);
  let res = perms[0];
  let minCrossings = 999999;
  for (let perm of perms) {
    let numCrossings = calculateNumCrossings(directedEdgeMap, perm, origin);
    if (numCrossings < minCrossings) {
      minCrossings = numCrossings;
      res = perm;
    }
    if (minCrossings === 0) break;
  }
  return res;
}
function calculateNumCrossings(
  directedEdgeMap: LayoutUtils.EdgeMap,
  perm: Array<string>,
  origin: string
): number {
  let idToIndex: any = {};
  idToIndex[origin] = -1;
  let forward_cnt = []; // number of endpoints at each index
  let back_cnt = [];
  for (let i = 0; i < perm.length; i++) {
    forward_cnt.push(0);
    back_cnt.push(0);
    idToIndex[perm[i]] = i;
  }

  let res = 0;
  // start with origin
  let children = directedEdgeMap[origin] ? directedEdgeMap[origin] : [];
  for (let child of children) {
    forward_cnt[idToIndex[child]] += 1;
  }
  // iterate through perm
  for (let i = 0; i < perm.length; i++) {
    children = directedEdgeMap[perm[i]];
    if (!children) continue;
    for (let child of children) {
      const childInd = idToIndex[child];

      if (childInd > i) {
        // if there are any that end between i and childInd, increment crossings
        for (let x = i + 1; x < childInd; x++) {
          if (forward_cnt[x]) res += forward_cnt[x];
        }
      } else {
        // child is behind;
        for (let x = i - 1; x > childInd; x--) {
          if (back_cnt[x]) res += back_cnt[x];
        }
      }
    }

    // update forward and back count
    for (let child of children) {
      const childInd = idToIndex[child];
      if (childInd > i) {
        forward_cnt[childInd] += 1;
      } else {
        // child is behind
        back_cnt[i] += 1;
      }
    }
  }
  return res;
}
