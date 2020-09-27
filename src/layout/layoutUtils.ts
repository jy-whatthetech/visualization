import { MyGraphLinkType } from "../App";

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

    if (!directed) {
      for (let src of edgeMap) {
        edgeMap[src] = Array.from(edgeMap[src]);
      }
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

  for (let src of Object.keys(edgeMap)) {
    nodesWithOut.add(src);
    const children = edgeMap[src];
    for (let trg of children) {
      nodesWithIn.add(trg);
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

  // find 3.
  const arr = Array.from(nodesWithOut);
  arr.sort();
  return arr[0];
}
