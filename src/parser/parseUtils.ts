import parseJson from "parse-json";
import { InputType, getTypeConfig } from "./inputTypes";

export function processInput(input: string, type: number, options?: any): any {
  const config = getTypeConfig(type);
  config.input = input;
  if (options) {
    if (options.oneIndexed) {
      config.oneIndexed = true;
    }
  }

  switch (type) {
    case InputType.EdgePairs:
    case InputType.WeightedEdgePairs:
      return parsePairs(config);
    case InputType.AdjacencyList:
      return parseAdjacencyList(config);
    case InputType.AdjacencyMatrix:
      return parseAdjacencyMatrix(config);
    case InputType.GraphObject:
      return parseGraphJSON(config);
    case InputType.BinaryTreeObject:
      return parseBinaryTreeJSON(config);
    default:
      break;
  }
}

// directed pairs
// [[2,1],[3,1],[1,4]]
export function parsePairs(config: { input: string; directed?: boolean; weighted?: boolean }): any {
  let { input, weighted = false } = config;

  // trim whitespace
  input = input.trim();
  if (input.length < 2) throw new Error("Please enter a non-empty input.");
  input = input.slice(1, input.length - 1);

  const links = [];
  const nodeSet = new Set<string>();

  let startInd = 0;
  let nextOpenBracket = input.indexOf("[", startInd);
  while (nextOpenBracket !== -1) {
    const nextCloseBracket = input.indexOf("]", nextOpenBracket);
    if (nextCloseBracket === -1) throw new Error("Missing a `]`");

    try {
      const pair = getDirectedPair(
        input.slice(nextOpenBracket + 1, nextCloseBracket),
        nodeSet,
        weighted
      );
      links.push(pair);
    } catch (ex) {
      throw ex;
    }

    startInd = nextCloseBracket;
    nextOpenBracket = input.indexOf("[", startInd);
  }

  if (links.length === 0) throw new Error("No pairs found.");

  return { nodeSet: nodeSet, links: links };
}
function getDirectedPair(s: string, nodeSet: Set<string>, weighted: boolean) {
  s = s.trim();
  if (s.length === 0 || s.indexOf(",") === -1)
    throw new Error("An edge pair had less than two arguments.");
  const sp = s.split(",");
  const src = sp[0].trim();
  const trg = sp[1].trim();

  if (src.length === 0 || trg.length === 0)
    throw new Error("An edge pair had less than two arguments.");

  nodeSet.add(src);
  nodeSet.add(trg);

  const rtn: any = { source: src, target: trg };
  if (weighted && sp.length === 3) {
    rtn.label = sp[2].trim();
  }
  return rtn;
}

// adjacency list
// array where arr[i] is an array of adjacent nodes
export function parseAdjacencyList(config: {
  input: string;
  directed?: boolean;
  oneIndexed?: boolean;
}): any {
  let { input, oneIndexed } = config;

  // trim whitespace
  input = input.trim();
  if (input.length < 2) throw new Error("Please enter a non-empty input.");
  input = input.slice(1, input.length - 1);

  const links = [];
  const nodeSet = new Set<string>();

  let startInd = 0;
  let nextOpenBracket = input.indexOf("[", startInd);
  let srcNode = oneIndexed ? 1 : 0; // index of source node
  while (nextOpenBracket !== -1) {
    const nextCloseBracket = input.indexOf("]", nextOpenBracket);
    if (nextCloseBracket === -1) throw new Error("Missing a `]`");

    const src = srcNode.toString();
    nodeSet.add(src);

    try {
      const arr = parseArray(input.slice(nextOpenBracket + 1, nextCloseBracket));
      for (let trg of arr) {
        nodeSet.add(trg); // add target to nodeSet too
        if (src !== trg) {
          //TODO: should we handle self-links?
          links.push({ source: src, target: trg });
        }
      }
    } catch (ex) {
      throw ex;
    }

    startInd = nextCloseBracket;
    nextOpenBracket = input.indexOf("[", startInd);
    srcNode++;
  }

  return { nodeSet: nodeSet, links: links };
}
function parseArray(s: string): any[] {
  s = s.trim();

  const rtn: any[] = [];

  const sp = s.split(",");
  for (let elem of sp) {
    const toAdd = elem.trim();
    if (toAdd.length > 0) {
      rtn.push(toAdd);
    }
  }

  return rtn;
}

// adjacency matrix
// n x n binary matrix where arr[i][j] means there is a connection between i and j
export function parseAdjacencyMatrix(config: { input: string }): any {
  let { input } = config;
  input = input.trim();
  if (input.length < 2) throw new Error("Input too short");
  input = input.slice(1, input.length - 1);

  // parse each row of the matrix and add a connection between row i and column j when 1 is encountered
  const matrix = [];
  const links = [];
  const nodeSet = new Set<string>();

  let startInd = 0;
  let nextOpenBracket = input.indexOf("[", startInd);
  let srcNode = 0; // index of source node
  while (nextOpenBracket !== -1) {
    const nextCloseBracket = input.indexOf("]", nextOpenBracket);
    if (nextCloseBracket === -1) throw new Error("No matching close bracket");

    const src = srcNode.toString();
    nodeSet.add(src);

    try {
      const arr = parseArray(input.slice(nextOpenBracket + 1, nextCloseBracket));
      matrix.push(arr);
    } catch (ex) {
      throw ex;
    }

    startInd = nextCloseBracket;
    nextOpenBracket = input.indexOf("[", startInd);
    srcNode++;
  }

  const n = matrix.length;
  for (let i = 0; i < matrix.length; i++) {
    const arr = matrix[i];
    if (arr.length !== n) throw new Error("Adjacency matrix has incorrect column size(s)");
    for (let j = 0; j < n; j++) {
      const colVal = arr[j];
      const colValNum = parseInt(colVal);
      if (colValNum === 1) {
        links.push({ source: i.toString(), target: j.toString() });
      }
    }
  }

  return { nodeSet: nodeSet, links: links };
}

// TODO: Read start node (needed for layout)?
export function parseGraphJSON(config: { input: string }) {
  let { input } = config;
  input = input.trim();
  let jsonObj: any;
  try {
    jsonObj = parseJson(input); // parseJson library will automatically handle and throw error in syntax
  } catch (error) {
    throw new Error(error.message);
  }
  if (!jsonObj.graph || !jsonObj.graph.nodes) {
    throw new Error("JSON object is missing the `graph.nodes` property");
  }
  let nodes = jsonObj.graph.nodes;

  const nodeSet = new Set<string>();
  const links = [];

  for (let node of nodes) {
    nodeSet.add(node.id);
    if (node.children) {
      let children = node.children;
      for (let child of children) {
        links.push({ source: node.id, target: child });
      }
    }
  }

  return { startNode: jsonObj.graph.startNode, nodeSet: nodeSet, links: links };
}

// TODO: Read root node (needed for layout)?
export function parseBinaryTreeJSON(config: { input: string }) {
  let { input } = config;
  input = input.trim();
  let jsonObj: any;
  try {
    jsonObj = parseJson(input); // parseJson library will automatically handle and throw error in syntax
  } catch (error) {
    throw new Error(error.message);
  }

  if (!jsonObj.tree || !jsonObj.tree.nodes) {
    throw new Error("JSON object is missing the `tree.nodes` property");
  }
  let nodes = jsonObj.tree.nodes;

  const nodeSet = new Set<string>();
  const links = [];

  for (let node of nodes) {
    nodeSet.add(node.id);
    if (node.left) {
      links.push({ source: node.id, target: node.left });
    }
    if (node.right) {
      links.push({ source: node.id, target: node.right });
    }
  }

  return { startNode: jsonObj.tree.root, nodeSet: nodeSet, links: links };
}

export function parseNodes(input: string) {
  const nodeSet = new Set<string>();
  input = input.trim();
  if (input.length < 2) {
    throw new Error("Input too short");
  }
  input = input.slice(1, input.length - 1);
  if (input.length === 0) {
    return nodeSet;
  }
  if (input.indexOf(",") === -1) {
    nodeSet.add(input);
    return nodeSet;
  }

  const sp = input.split(",");
  for (let s of sp) {
    s = s.trim();
    if (s.length) nodeSet.add(s);
  }
  return nodeSet;
}

// Binary tree/heap in array form (child is at 2n+1 and 2n+2)
export function parseBinaryHeap(input: string) {
  if (input.length < 2) {
    throw new Error("Input too short");
  }
  //TODO:
}
