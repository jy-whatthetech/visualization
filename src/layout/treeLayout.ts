import { MyDataType } from "../App";
import * as LayoutUtils from "./layoutUtils";
import * as Graph from "../graph/Graph";
import { InputType } from "../parser/inputTypes";

const DEFAULT_PADDING = 0.4;
const DEFAULT_SPACE_BETWEEN_COMPONENTS = 0.8;

const spacingArray = [50, 75, 90, 125, 160];

type IdToNode = {
  [key: string]: TreeNode;
};

function isBinaryTree(inputType: number): boolean {
  return (
    inputType === InputType.BinaryTreeObject ||
    inputType === InputType.BinaryHeap ||
    inputType === InputType.LeetcodeTree
  );
}

export function layoutTree(data: MyDataType, inputType: number, spacing: { x: number; y: number }) {
  let { startNode, nodes, links, directed, tree, idToTreeNode } = data;
  let isBinary = isBinaryTree(inputType);
  if (!isBinary) {
    directed = false;
  }

  const edgeMap = LayoutUtils.convertToEdgeMap(links, !!directed);
  let idToNode: IdToNode = {};
  // run Buchheim algorithm on all disconnected components, then lay them out next to each other
  let rightMostX = 0;
  const disconnectedComponents = LayoutUtils.getDisconnectedComponents(nodes, links, startNode);

  for (let comp of disconnectedComponents) {
    // derive the start node based on if user specified it
    let actualStartNode: string | null = null;
    if (startNode && startNode.length > 0) {
      if (LayoutUtils.isStartNodeInComponent(startNode, comp)) {
        actualStartNode = startNode;
      }
    }
    if (!actualStartNode) {
      actualStartNode = LayoutUtils.deriveStartNode(comp, edgeMap);
    }

    // construct the treeObject
    let root = tree;
    if (tree) {
      idToNode = idToTreeNode as IdToNode;
    }
    if (!root) {
      root = constructTreeObject(edgeMap, actualStartNode, idToNode);
    }

    let shiftAmount = rightMostX > 0 ? rightMostX + DEFAULT_SPACE_BETWEEN_COMPONENTS : 0;
    rightMostX = runBuchheim(root, DEFAULT_PADDING, isBinary, 0);
    moveSubtree(root, shiftAmount);
  }

  // assign positions to actual nodes
  for (let node of nodes) {
    // normalize node positions based on graph size and padding
    const nodeId = node.id;
    const tNode = idToNode[nodeId];
    if (tNode) {
      let realx = Graph.DEFAULT_LEFT_PADDING / 2 + spacingArray[spacing.x] * tNode.x;
      let realy = Graph.DEFAULT_TOP_PADDING + spacingArray[spacing.y] * tNode.y;
      node.x = realx;
      node.y = realy;
    }
  }
}

function runBuchheim(root: TreeNode, padding: number, isBinary: boolean, depth: number) {
  // if no children, return self at position 0
  root.y = depth;
  if (root.children.length === 0) {
    root.x = 0;
    return root.x;
  }
  // if only one child, put it directly above its one child
  // (unless binary tree, then we must respect left/right child placements)
  if (root.children.length === 1) {
    runBuchheim(root.children[0], padding, isBinary, depth + 1);
    root.x = root.children[0].x;
    if (isBinary) {
      if (root.children[0].isRightChild) {
        if (root.children[0].x < 0.5) {
          const distanceToMove = 0.5 - root.children[0].x;
          moveSubtree(root.children[0], distanceToMove);
        }
        root.x = root.children[0].x - 0.5;
      } else {
        // child is a left child
        root.x = root.children[0].x + 0.5;
      }
    }

    let rightContour = getContours(root)[1];
    let rightMostX = root.x;
    for (let r of rightContour) {
      rightMostX = Math.max(rightMostX, r);
    }
    return rightMostX;
  }

  let prevRightContour: Array<number> = [];
  for (let child of root.children) {
    runBuchheim(child, padding, isBinary, depth + 1);
    let [leftContour, rightContour] = getContours(child);
    if (child !== root.children[0]) {
      const minShift = getMinimumShift(prevRightContour, leftContour, padding);
      // perform the move
      moveSubtree(child, minShift);
      [leftContour, rightContour] = getContours(child);
    }
    for (let i = 0; i < prevRightContour.length; i++) {
      const val = prevRightContour[i];
      if (i >= rightContour.length) {
        rightContour.push(val);
      } else {
        rightContour[i] = Math.max(rightContour[i], val);
      }
    }
    prevRightContour = rightContour;
  }

  // parent should be in middle of all children
  const midpoint = (root.children[0].x + root.children[root.children.length - 1].x) / 2;
  root.x = midpoint;

  // return rightmost point of tree
  let rightMostX = root.x;
  for (let r of prevRightContour) {
    rightMostX = Math.max(rightMostX, r);
  }
  return rightMostX;
}

function getContours(root: TreeNode): Array<Array<number>> {
  // bfs to get the min and max x position of each level
  const left: Array<number> = [];
  const right: Array<number> = [];

  let curr = [root];
  while (curr.length > 0) {
    let next: Array<TreeNode> = [];
    let lo = 999999999;
    let hi = -999999999;
    for (let node of curr) {
      for (let child of node.children) {
        next.push(child);
      }
      lo = Math.min(lo, node.x);
      hi = Math.max(hi, node.x);
    }
    left.push(lo);
    right.push(hi);
    curr = next;
  }
  return [left, right];
}

function getMinimumShift(rightContour: Array<number>, leftContour: Array<number>, padding: number) {
  if (rightContour.length === 0 || leftContour.length === 0) return 0;
  const smallerSize = Math.min(rightContour.length, leftContour.length);
  let res = 0;
  if (leftContour[0] - rightContour[0] < 1) {
    res = 1 - (leftContour[0] - rightContour[0]);
  }
  for (let i = 1; i < smallerSize; i++) {
    const l = rightContour[i];
    const r = leftContour[i];
    if (r - l < padding) {
      res = Math.max(res, padding - (r - l));
    }
  }
  return res;
}

function moveSubtree(root: TreeNode, shift: number) {
  root.x += shift;
  for (let child of root.children) {
    moveSubtree(child, shift);
  }
}

// recursively constrcut tree object
function constructTreeObject(
  edgeMap: LayoutUtils.EdgeMap,
  startNode: string,
  idToNode: IdToNode
): TreeNode {
  // bfs starting from start node
  let queue: Array<TreeNode> = [];
  let root = new TreeNode(startNode);
  queue.push(root);
  let seen = new Set<string>();
  seen.add(startNode);
  idToNode[startNode] = root;

  while (queue.length > 0) {
    let front: TreeNode = queue.shift() as TreeNode;
    let frontVal = front.value;

    // create child nodes, add to children, and then add to back of queue
    if (!edgeMap.hasOwnProperty(frontVal) || edgeMap[frontVal].length === 0) {
      // this is a leaf node
      continue;
    }
    let children = edgeMap[frontVal];
    for (let child of children) {
      if (seen.has(child)) continue;
      seen.add(child);
      let tempNode = new TreeNode(child);
      front.children.push(tempNode);
      tempNode.parent = front;
      queue.push(tempNode);

      idToNode[child] = tempNode;
    }
  }
  return root;
}

export interface TreeNode {
  value: string;
  children: Array<TreeNode>;
  parent: TreeNode | null;
  x: number;
  y: number;
  isRightChild: boolean;
}
export class TreeNode {
  constructor(value: string, isRightChild = false) {
    this.value = value;
    this.children = [];
    this.parent = null;
    this.x = 0;
    this.y = 0;
    this.isRightChild = isRightChild;
  }
}
