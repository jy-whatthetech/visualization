import { MyGraphNodeType, MyGraphLinkType } from "../App";

export type EdgeMap = {
  [key: string]: Array<string>;
};

// convert layout into edge map
// returns map of nodeIds to list of its outgoing nodes
export function convertToEdgeMap(links: Array<MyGraphLinkType>, directed: boolean): EdgeMap {
  const edgeMap: any = {};
  for (const link of links) {
    const src = link.source;
    const trg = link.target;
    if (directed) {
      if (!edgeMap.hasOwnProperty(src)) {
        edgeMap[src] = [];
      }
      edgeMap[src].push(trg);
    } else {
      if (!edgeMap.hasOwnProperty(src)) {
        edgeMap[src] = new Set();
      }
      edgeMap[src].add(trg);

      if (!edgeMap.hasOwnProperty(trg)) {
        edgeMap[trg] = new Set();
      }
      edgeMap[trg].add(src);
    }
  }
  if (!directed) {
    for (let src of Object.keys(edgeMap)) {
      edgeMap[src] = Array.from(edgeMap[src]);
    }
  }
  return edgeMap;
}

// derive start node from nodes and edges (assuming startNode is not defined)
// 1. find the node that has indegree 0 and outdegree > 0
// 2. if multiple satisfy #1, return the smallest id
// 3. else return smallest id out of all nodes with at least 1 outdegree
export function deriveStartNode(nodes: any, edgeMap: EdgeMap): string {
  const nodesWithIn = new Set<string>(); // nodes with indegree
  const nodesWithOut = new Set<string>(); // nodes with outdegree
  const currenNodes = new Set<string>();
  const currenNodeList = [];
  for (let node of nodes) {
    currenNodes.add(node.id);
    currenNodeList.push(node.id);
  }

  for (let src of Object.keys(edgeMap)) {
    if (currenNodes.has(src)) {
      nodesWithOut.add(src);
      const children = edgeMap[src];
      for (let trg of children) {
        nodesWithIn.add(trg);
      }
    }
  }

  // find 1.
  let candidates = new Set<string>();
  for (let node of nodes) {
    if (!nodesWithIn.has(node.id) && nodesWithOut.has(node.id)) {
      candidates.add(node.id);
    }
  }

  if (candidates.size > 0) {
    const arr = Array.from(candidates);
    arr.sort();
    return arr[0];
  }

  // if 3 doesn't exist, just return smallest nodeId
  if (nodesWithOut.size === 0) {
    currenNodeList.sort();
    return currenNodeList[0];
  }

  // find 3.
  const arr = Array.from(nodesWithOut);
  arr.sort();
  return arr[0];
}

export function getExtraNodes(
  nodes: Array<MyGraphNodeType>,
  links: Array<MyGraphLinkType>
): Array<MyGraphNodeType> {
  const connectedNodeIds = new Set<string>();
  const rtn: Array<MyGraphNodeType> = [];
  for (let link of links) {
    connectedNodeIds.add(link.source);
    connectedNodeIds.add(link.target);
  }
  for (let node of nodes) {
    if (!connectedNodeIds.has(node.id)) {
      rtn.push(node);
    }
  }
  return rtn;
}

// get all disconeccted components
// return list of list of nodes
// Note: the connected component with the start node should always be first in the returned list
export function getDisconnectedComponents(
  nodes: Array<MyGraphNodeType>,
  links: Array<MyGraphLinkType>,
  startNode: string | undefined
) {
  const idToNodes: { [key: string]: MyGraphNodeType } = {};
  for (let node of nodes) {
    idToNodes[node.id] = node;
  }
  const rtn: Array<Array<MyGraphNodeType>> = [];

  const connectedNodeIds = new Set<string>();
  for (let link of links) {
    connectedNodeIds.add(link.source);
    connectedNodeIds.add(link.target);
  }

  const edgeMap: EdgeMap = convertToEdgeMap(links, false);
  const seen = new Set<string>();
  for (let nodeId of Array.from(connectedNodeIds)) {
    if (!seen.has(nodeId)) {
      const collected = new Set<string>();
      dfs(nodeId, edgeMap, seen, collected);
      // collect all the nodes objects in a list
      const toAdd: Array<MyGraphNodeType> = [];
      for (let c of Array.from(collected)) {
        toAdd.push(idToNodes[c]);
      }

      if (startNode && collected.has(startNode)) {
        rtn.unshift(toAdd);
      } else {
        rtn.push(toAdd);
      }
    }
  }

  return rtn;
}
function dfs(nodeId: string, edgeMap: EdgeMap, seen: Set<string>, collected: Set<string>) {
  if (seen.has(nodeId)) return;
  seen.add(nodeId);
  collected.add(nodeId);
  const children = edgeMap[nodeId];
  if (!children) return;
  for (let child of children) {
    dfs(child, edgeMap, seen, collected);
  }
}

export function isStartNodeInComponent(startNode: string, nodes: Array<MyGraphNodeType>) {
  for (let node of nodes) {
    if (node.id === startNode) return true;
  }
  return false;
}

// used for undirected graphs: remove links that are backlinks of another edge
export function removeRepeatedEdges(links: Array<MyGraphLinkType>) {
  let seen = new Set<string>();
  let rtn = [];
  for (let link of links) {
    let key = link.source + "-linkTo-" + link.target;
    let backKey = link.target + "-linkTo-" + link.source;
    if (seen.has(backKey)) {
      continue;
    }
    seen.add(key);
    rtn.push(link);
  }
  return rtn;
}
