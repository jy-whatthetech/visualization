import { MyDataType } from "../App";
import * as LayoutUtils from "./layoutUtils";

export function layoutTree(data: MyDataType) {
  let { startNode, nodes, links, directed } = data;

  const edgeMap = LayoutUtils.convertToEdgeMap(links, !!directed);

  if (!startNode || startNode.length === 0) {
    startNode = LayoutUtils.deriveStartNode(nodes, edgeMap);
  }

  // construct tree
  const [root, idToTreeNode] = constructTreeObject(edgeMap, startNode);

  //   class DrawTree(object):
  //     def __init__(self, tree, parent=None, depth=0, number=1):
  //         self.x = -1.
  //         self.y = depth
  //         self.tree = tree
  //         self.children = [DrawTree(c, self, depth+1, i+1)
  //                          for i, c
  //                          in enumerate(tree.children)]
  //         self.parent = parent
  //         self.thread = None
  //         self.offset = 0
  //         self.ancestor = self
  //         self.change = self.shift = 0
  //         self._lmost_sibling = None
  //         #this is the number of the node in its group of siblings 1..n
  //         self.number = number

  //     def left_brother(self):
  //         n = None
  //         if self.parent:
  //             for node in self.parent.children:
  //                 if node == self: return n
  //                 else:            n = node
  //         return n

  //     def get_lmost_sibling(self):
  //         if not self._lmost_sibling and self.parent and self != \
  //         self.parent.children[0]:
  //             self._lmost_sibling = self.parent.children[0]
  //         return self._lmost_sibling
  //     leftmost_sibling = property(get_lmost_sibling)

  // def buchheim(tree):
  //     dt = firstwalk(tree)
  //     second_walk(dt)
  //     return dt

  // def firstwalk(v, distance=1.):
  //     if len(v.children) == 0:
  //         if v.leftmost_sibling:
  //             v.x = v.left_brother().x + distance
  //         else:
  //             v.x = 0.
  //     else:
  //         default_ancestor = v.children[0]
  //         for w in v.children:
  //             firstwalk(w)
  //             default_ancestor = apportion(w, default_ancestor,
  //                                          distance)
  //         execute_shifts(v)

  //         midpoint = (v.children[0].x + v.children[-1].x) / 2

  //         ell = v.children[0]
  //         arr = v.children[-1]
  //         w = v.left_brother()
  //         if w:
  //             v.x = w.x + distance
  //             v.mod = v.x - midpoint
  //         else:
  //             v.x = midpoint
  //     return v

  // def apportion(v, default_ancestor, distance):
  //     w = v.left_brother()
  //     if w is not None:
  //         #in buchheim notation:
  //         #i == inner; o == outer; r == right; l == left;
  //         vir = vor = v
  //         vil = w
  //         vol = v.leftmost_sibling
  //         sir = sor = v.mod
  //         sil = vil.mod
  //         sol = vol.mod
  //         while vil.right() and vir.left():
  //             vil = vil.right()
  //             vir = vir.left()
  //             vol = vol.left()
  //             vor = vor.right()
  //             vor.ancestor = v
  //             shift = (vil.x + sil) - (vir.x + sir) + distance
  //             if shift > 0:
  //                 a = ancestor(vil, v, default_ancestor)
  //                 move_subtree(a, v, shift)
  //                 sir = sir + shift
  //                 sor = sor + shift
  //             sil += vil.mod
  //             sir += vir.mod
  //             sol += vol.mod
  //             sor += vor.mod
  //         if vil.right() and not vor.right():
  //             vor.thread = vil.right()
  //             vor.mod += sil - sor
  //         else:
  //             if vir.left() and not vol.left():
  //                 vol.thread = vir.left()
  //                 vol.mod += sir - sol
  //             default_ancestor = v
  //     return default_ancestor

  // def move_subtree(wl, wr, shift):
  //     subtrees = wr.number - wl.number
  //     wr.change -= shift / subtrees
  //     wr.shift += shift
  //     wl.change += shift / subtrees
  //     wr.x += shift
  //     wr.mod += shift

  // def execute_shifts(v):
  //     shift = change = 0
  //     for w in v.children[::-1]:
  //         w.x += shift
  //         w.mod += shift
  //         change += w.change
  //         shift += w.shift + change

  // def ancestor(vil, v, default_ancestor):
  //     if vil.ancestor in v.parent.children:
  //         return vil.ancestor
  //     else:
  //         return default_ancestor

  // def second_walk(v, m=0, depth=0):
  //     v.x += m
  //     v.y = depth

  //     for w in v.children:
  //         second_walk(w, m + v.mod, depth+1, min)
}

function firstwalk(root: TreeNode, distance = 1) {
  if (root.children.length === 0) {
    // this is a leaf node
  }
}

// recursively constrcut tree object
function constructTreeObject(
  edgeMap: LayoutUtils.EdgeMap,
  startNode: string
): Array<TreeNode | { [key: string]: TreeNode }> {
  // bfs starting from start node
  let queue: Array<TreeNode> = [];
  let root = new TreeNode(startNode);
  queue.push(root);
  let seen = new Set<string>();
  seen.add(startNode);
  let idToTreeNode: { [key: string]: TreeNode } = {};
  idToTreeNode[startNode] = root;

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

      // populate left most sibling
      if (front.children.length > 1) {
        tempNode.leftmost_sibling = front.children[0];
      }

      idToTreeNode[child] = tempNode;
    }
  }
  return [root, idToTreeNode];
}

interface TreeNode {
  value: string;
  children: Array<TreeNode>;
  parent: TreeNode | null;

  // Buchheim Tree properties
  leftmost_sibling: null | TreeNode;
}
class TreeNode {
  constructor(value: string) {
    this.value = value;
    this.children = [];
    this.parent = null;
    this.leftmost_sibling = null;
  }
}
