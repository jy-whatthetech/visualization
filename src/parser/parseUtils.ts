import { InputType, getTypeConfig } from "./inputTypes";

export function processInput(input: string, type: number): any {
  const config = getTypeConfig(type);
  config.input = input;

  switch (type) {
    case InputType.EdgePairs:
    case InputType.WeightedEdgePairs:
      return parsePairs(config);
    case InputType.AdjacencyList:
    case InputType.AdjacencyList1Ind:
      return parseAdjacencyList(config);
    case InputType.AdjacencyMatrix:
      return "Adjacency Matrix";
    case InputType.BinaryTree:
      return "Binary Tree";
    case InputType.GraphObject:
      return "Graph Object";
    case InputType.AncestorGraph:
      return "Ancestor Graph";
    default:
      break;
  }
}

// directed pairs
// [[2,1],[3,1],[1,4]]
export function parsePairs(config: {
  input: string;
  directed?: boolean;
  weighted?: boolean;
}): any {
  let { input, directed, weighted } = config;

  // trim whitespace
  input = input.trim();
  if (input.length < 2) throw new Error("Input too short");
  input = input.slice(1, input.length - 1);

  const links = [];
  const nodeSet = new Set<string>();

  let startInd = 0;
  let nextOpenBracket = input.indexOf("[", startInd);
  while (nextOpenBracket !== -1) {
    const nextCloseBracket = input.indexOf("]", nextOpenBracket);
    if (nextCloseBracket === -1) throw new Error("No matching close bracket");

    try {
      const pair = getDirectedPair(
        input.slice(nextOpenBracket + 1, nextCloseBracket),
        nodeSet
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
function getDirectedPair(s: string, nodeSet: Set<string>) {
  s = s.trim();
  if (s.length === 0 || s.indexOf(",") === -1)
    throw new Error("pair needs two arguments");
  const sp = s.split(",");
  const src = sp[0].trim();
  const trg = sp[1].trim();

  if (src.length === 0 || trg.length === 0)
    throw new Error("src and trg need to be non-empty");

  nodeSet.add(src);
  nodeSet.add(trg);

  return { source: src, target: trg };
}

// adjacency list
// array where arr[i] is an array of adjacent nodes
export function parseAdjacencyList(config: {
  input: string;
  directed?: boolean;
  oneIndexed?: boolean;
}): any {
  let { input, directed, oneIndexed } = config;

  // trim whitespace
  input = input.trim();
  if (input.length < 2) throw new Error("Input too short");
  input = input.slice(1, input.length - 1);

  const links = [];
  const nodeSet = new Set<string>();

  let startInd = 0;
  let nextOpenBracket = input.indexOf("[", startInd);
  let srcNode = oneIndexed ? 1 : 0; // index of source node
  while (nextOpenBracket !== -1) {
    const nextCloseBracket = input.indexOf("]", nextOpenBracket);
    if (nextCloseBracket === -1) throw new Error("No matching close bracket");

    const src = srcNode.toString();
    nodeSet.add(src);

    try {
      const arr = parseArray(
        input.slice(nextOpenBracket + 1, nextCloseBracket),
        nodeSet
      );
      for (let trg of arr) {
        links.push({ source: src, target: trg });
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
function parseArray(s: string, nodeSet: Set<string>): any[] {
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
