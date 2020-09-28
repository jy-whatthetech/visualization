import React from "react";
import { Graph as D3Graph } from "react-d3-graph";
import { getTypeConfig } from "../parser/inputTypes";
import * as Utils from "../utils/utils";
import { performLayout } from "../layout/layoutTypes";

export const DEFAULT_GRAPH_WIDTH = 700;
export const DEFAULT_GRAPH_HEIGHT = 350;
export const DEFAULT_LEFT_PADDING = 100;
export const DEFAULT_RIGHT_PADDING = 100;
export const DEFAULT_TOP_PADDING = 50;

export type GraphProps = {
  inputType: number;
  data: any;
  id: string;
  directed: boolean;
  customNodes: Set<string>;
  startNode: string | null;
  selectedLayout: number;
  drawerOpen: boolean;
};

function debounce(fn: any, ms: number) {
  let timer: any;
  return (_: any) => {
    clearTimeout(timer);
    timer = setTimeout(_ => {
      timer = null;
      fn();
    }, ms);
  };
}

const Graph = ({
  inputType,
  data,
  id = "graph-id",
  directed,
  customNodes,
  startNode,
  selectedLayout,
  drawerOpen
}: GraphProps) => {
  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth
  });

  React.useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      });
    }, 100);
    window.addEventListener("resize", debouncedHandleResize);
  });

  const graphPaneHeight = dimensions.height - 120;
  const graphPaneWidth = drawerOpen ? dimensions.width - 350 : dimensions.width - 50;

  // add nodes from customNodes that don't already exist
  let extraNodes = [];
  if (customNodes && customNodes.size > 0) {
    const seen = new Set();
    for (let n of data.nodes) {
      seen.add(n.id);
    }
    // add if not in seen
    let x = graphPaneWidth - DEFAULT_RIGHT_PADDING;
    let y = DEFAULT_TOP_PADDING;
    for (let nodeId of Array.from(customNodes)) {
      if (!seen.has(nodeId)) {
        seen.add(nodeId);
        extraNodes.push({ id: nodeId, label: nodeId, x: x, y: y });
        y += 50;
      }
    }
  }

  // assign positions to all nodes
  data.startNode = startNode;
  data.directed = directed;
  for (let n of data.nodes) {
    n.x = Utils.randomInRange(DEFAULT_LEFT_PADDING, DEFAULT_GRAPH_WIDTH);
    n.y = Utils.randomInRange(DEFAULT_TOP_PADDING, DEFAULT_GRAPH_HEIGHT);
  }
  performLayout(selectedLayout, data, inputType);

  const myConfig = {
    nodeHighlightBehavior: true,
    staticGraphWithDragAndDrop: true,
    width: graphPaneWidth,
    height: graphPaneHeight,
    directed: directed,
    node: {
      color: "lightgreen",
      size: 420,
      labelPosition: "center",
      labelProperty: "label" as any
    },
    link: {
      color: "blue",
      renderLabel: getTypeConfig(inputType).weighted
    }
  };

  // graph event callbacks
  // const onClickGraph = function() {
  //   window.alert(`Clicked the graph background`);
  // };

  // const onClickNode = function(nodeId: string) {
  //   window.alert(`Clicked node ${nodeId}`);
  // };

  // const onDoubleClickNode = function(nodeId: string) {
  //   window.alert(`Double clicked node ${nodeId}`);
  // };

  // const onRightClickNode = function(event: any, nodeId: string) {
  //   window.alert(`Right clicked node ${nodeId}`);
  // };

  // const onMouseOverNode = function(nodeId: string) {
  //   window.alert(`Mouse over node ${nodeId}`);
  // };

  // const onMouseOutNode = function(nodeId: string) {
  //   window.alert(`Mouse out node ${nodeId}`);
  // };

  // const onClickLink = function(source: string, target: string) {
  //   window.alert(`Clicked link between ${source} and ${target}`);
  // };

  // const onRightClickLink = function(
  //   event: any,
  //   source: string,
  //   target: string
  // ) {
  //   window.alert(`Right clicked link between ${source} and ${target}`);
  // };

  // const onMouseOverLink = function(source: string, target: string) {
  //   window.alert(`Mouse over in link between ${source} and ${target}`);
  // };

  // const onMouseOutLink = function(source: string, target: string) {
  //   window.alert(`Mouse out link between ${source} and ${target}`);
  // };

  const onNodePositionChange = function(nodeId: string, x: number, y: number) {
    window.alert(`Node ${nodeId} is moved to new position. New position is x= ${x} y= ${y}`);
  };

  const oldNodeToNewNodeId: any = {};
  const argNodes = [];
  const argLinks = [];
  for (let node of [...data.nodes, ...extraNodes]) {
    let rand = Math.floor((Math.random() * 100000000)).toString();
    let nodeId = node.id;
    let newId = nodeId + rand;
    oldNodeToNewNodeId[nodeId] = newId;

    argNodes.push({ ...node, id: newId });
  }

  for (let link of data.links) {
    argLinks.push({
      ...link,
      source: oldNodeToNewNodeId[link.source],
      target: oldNodeToNewNodeId[link.target]
    });
  }

  return (
    <D3Graph
      id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
      data={{ nodes: argNodes, links: argLinks }}
      config={myConfig}
      // onClickNode={onClickNode}
      // onDoubleClickNode={onDoubleClickNode}
      // onRightClickNode={onRightClickNode}
      // onClickGraph={onClickGraph}
      // onClickLink={onClickLink}
      // onRightClickLink={onRightClickLink}
      // onMouseOverNode={onMouseOverNode}
      // onMouseOutNode={onMouseOutNode}
      // onMouseOverLink={onMouseOverLink}
      // onMouseOutLink={onMouseOutLink}
      onNodePositionChange={onNodePositionChange}
    />
  );
};

export default Graph;
