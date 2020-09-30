import parseJson from "parse-json";
import { InputType, getTypeConfig } from "./inputTypes";
import { TreeNode } from "../layout/treeLayout";

export function processInput(input: string, type: number, options?: any): any {
  const config = getTypeConfig(type);
  config.input = input;
  if (options) {
    if (options.oneIndexed) {
      config.oneIndexed = true;
    }
    if (options.reverseEdges) {
      config.reverseEdges = true;
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
    case InputType.BinaryHeap:
      return parseBinaryHeap(config);
    case InputType.LeetcodeTree:
      return parseLeetcodeTree(config);
    default:
      break;
  }
}

// trim whitespace and remove quotes
function cleanseInput(s: string) {
  s = s.trim();
  if (s.length && s.charAt(0) === `"` && s.charAt(s.length - 1) === `"`) {
    s = s.slice(1, s.length - 1);
  } else if (s.length && s.charAt(0) === `'` && s.charAt(s.length - 1) === `'`) {
    s = s.slice(1, s.length - 1);
  }
  return s;
}

// directed pairs
// [[2,1],[3,1],[1,4]]
export function parsePairs(config: {
  input: string;
  directed?: boolean;
  weighted?: boolean;
  reverseEdges?: boolean;
}): any {
  let { input, weighted = false, reverseEdges = false } = config;
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
        weighted,
        reverseEdges
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
function getDirectedPair(
  s: string,
  nodeSet: Set<string>,
  weighted: boolean,
  reverseEdges: boolean
) {
  s = s.trim();
  if (s.length === 0 || s.indexOf(",") === -1)
    throw new Error("An edge pair had less than two arguments.");
  const sp = s.split(",");
  const src = cleanseInput(sp[0]);
  const trg = cleanseInput(sp[1]);

  if (src.length === 0 || trg.length === 0)
    throw new Error("An edge pair had less than two arguments.");

  nodeSet.add(src);
  nodeSet.add(trg);

  let rtn: any = { source: src, target: trg };
  if (reverseEdges) {
    rtn = { source: trg, target: src };
  }
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
    const toAdd = cleanseInput(elem);
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

export function parseGraphJSON(config: { input: string }) {
  let { input } = config;
  input = input.trim();
  let jsonObj: any;
  try {
    jsonObj = parseJson(input); // parseJson library will automatically handle and throw error in syntax
  } catch (error) {
    throw new Error(error.message);
  }
  if (!jsonObj.nodes) {
    throw new Error("JSON object is missing the `nodes` property");
  }
  let nodes = jsonObj.nodes;

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

  return { startNode: jsonObj.startNode, nodeSet: nodeSet, links: links };
}

export function parseBinaryTreeJSON(config: { input: string }) {
  let { input } = config;
  input = input.trim();
  let jsonObj: any;
  try {
    jsonObj = parseJson(input); // parseJson library will automatically handle and throw error in syntax
  } catch (error) {
    throw new Error(error.message);
  }

  if (!jsonObj.nodes) {
    throw new Error("JSON object is missing the `nodes` property");
  }
  let nodes = jsonObj.nodes;

  const nodeSet = new Set<string>();
  const links = [];

  const idToNode: any = {};

  for (let node of nodes) {
    nodeSet.add(node.id);
    const tNode = new TreeNode(node.id);
    idToNode[node.id] = tNode;

    if (node.left) {
      links.push({ source: node.id, target: node.left });
    }
    if (node.right) {
      links.push({ source: node.id, target: node.right });
    }
  }

  // second traverse: construct links and mark isRightChild
  for (let node of nodes) {
    const tNode = idToNode[node.id];

    if (node.left) {
      tNode.children.push(idToNode[node.left]);
    }
    if (node.right) {
      tNode.children.push(idToNode[node.right]);
      idToNode[node.right].isRightChild = true;
    }
  }

  return {
    startNode: jsonObj.root,
    tree: idToNode[jsonObj.root],
    idToTreeNode: idToNode,
    nodeSet: nodeSet,
    links: links
  };
}

// Binary tree/heap in array form (child is at 2n+1 and 2n+2)
// differentiate between id and label
export function parseBinaryHeap(config: { input: string }) {
  let { input } = config;
  input = input.trim();
  if (input.length < 2) {
    throw new Error("Input too short");
  }
  input = input.slice(1, input.length - 1);
  input = input.trim();
  if (input.length === 0) {
    throw new Error("Input too short");
  }
  const nodeSet = new Set<string>();
  const nodeToLabel: any = {};
  const links: Array<any> = [];
  if (input.indexOf(",") === -1) {
    nodeSet.add(input);
    return { startNode: input, nodeSet: nodeSet, links: links };
  }

  let sp = input.split(",");
  sp = sp.map((elem, ind) => {
    let trimmed = cleanseInput(elem);
    let key = ind + " index";
    nodeToLabel[key] = trimmed;
    nodeSet.add(key);
    return key;
  });
  const idToNode: any = {};
  let root: string | undefined;
  for (let i = 0; i < sp.length; i++) {
    const src = sp[i];
    nodeSet.add(src);
    if (!idToNode.hasOwnProperty(src)) {
      const tNode = new TreeNode(src);
      idToNode[src] = tNode;
    }
    if (i === 0) {
      root = src;
    }

    let leftChildInd = i * 2 + 1;
    let rightChildInd = i * 2 + 2;
    if (leftChildInd < sp.length) {
      const targetId = leftChildInd + " index";
      // link child node
      const tNode = new TreeNode(targetId);
      idToNode[targetId] = tNode;
      idToNode[src].children.push(tNode);

      links.push({ source: src, target: targetId });
    }
    if (rightChildInd < sp.length) {
      const targetId = rightChildInd + " index";
      // link child node
      const tNode = new TreeNode(targetId);
      idToNode[targetId] = tNode;
      idToNode[src].children.push(tNode);
      tNode.isRightChild = true;

      links.push({ source: src, target: targetId });
    }
  }
  return {
    startNode: root,
    tree: idToNode[root as string],
    idToTreeNode: idToNode,
    nodeSet: nodeSet,
    nodeToLabel: nodeToLabel,
    links: links
  };
}

// Leetcode's binary tree serialization
// (modified bfs; see https://support.leetcode.com/hc/en-us/articles/360011883654-What-does-1-null-2-3-mean-in-binary-tree-representation-)
// differentiate between id and label
export function parseLeetcodeTree(config: { input: string }) {
  let { input } = config;
  input = input.trim();
  if (input.length < 2) {
    throw new Error("Input too short");
  }
  input = input.slice(1, input.length - 1);
  input = input.trim();
  if (input.length === 0) {
    throw new Error("Input too short");
  }

  const nodeSet = new Set<string>();
  const nodeToLabel: any = {};
  const links: Array<any> = [];

  if (input.indexOf(",") === -1) {
    nodeSet.add(input);
    return { startNode: input, nodeSet: nodeSet, links: links };
  }

  const idToNode: any = {};

  let sp = input.split(",");
  sp = sp.map((elem, ind) => {
    let trimmed = cleanseInput(elem);
    let key = ind + " index";
    if (trimmed !== "null") {
      nodeSet.add(key);
      const tNode = new TreeNode(key);
      idToNode[key] = tNode;
      nodeToLabel[key] = trimmed;
    }
    return elem.trim();
  });

  let queue = []; // queue.shift() to dequeue
  queue.push("0 index");
  let ind = 1;
  while (queue.length > 0) {
    let src = queue.shift();
    if (ind >= sp.length) break;
    let trg = sp[ind];
    if (trg !== "null") {
      // left child
      // connect and add to queue
      trg = ind + " index";

      idToNode[src as string].children.push(idToNode[trg]);
      links.push({ source: src, target: trg });
      queue.push(trg);
    }
    ind++;
    if (ind >= sp.length) break;
    trg = sp[ind];
    if (trg !== "null") {
      // right child
      trg = ind + " index";

      idToNode[src as string].children.push(idToNode[trg]);
      idToNode[trg].isRightChild = true;
      links.push({ source: src, target: trg });
      queue.push(trg);
    }
    ind++;
  }

  return {
    startNode: "0 index",
    tree: idToNode["0 index"],
    idToTreeNode: idToNode,
    nodeSet: nodeSet,
    nodeToLabel: nodeToLabel,
    links: links
  };
}

export function parseNodes(input: string) {
  const nodeSet = new Set<string>();
  input = input.trim();
  if (input.length < 2) {
    throw new Error("Input too short");
  }
  input = input.slice(1, input.length - 1);
  input = input.trim();
  if (input.length === 0) {
    return nodeSet;
  }
  if (input.indexOf(",") === -1) {
    nodeSet.add(cleanseInput(input));
    return nodeSet;
  }

  const sp = input.split(",");
  for (let s of sp) {
    s = cleanseInput(s);
    if (s.length) nodeSet.add(s);
  }
  return nodeSet;
}
