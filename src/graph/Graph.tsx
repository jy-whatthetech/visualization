import React from "react";
import { Graph as D3Graph } from "react-d3-graph";
import { getTypeConfig } from "../parser/inputTypes";
import * as Utils from "../utils/utils";

type GraphProps = {
  inputType: number;
  data: any;
  id: string;
  directed: boolean;
  customNodes: Set<string>;
  startNode: string;
};

const Graph = ({
  inputType,
  data,
  id = "graph-id",
  directed,
  customNodes,
  startNode
}: GraphProps) => {
  // the graph configuration, you only need to pass down properties
  // that you want to override, otherwise default ones will be

  // add nodes from customNodes that don't already exist
  if (customNodes && customNodes.size > 0) {
    const seen = new Set();
    for (let n of data.nodes) {
      seen.add(n.id);
    }
    // add if not in seen
    for (let nodeId of Array.from(customNodes)) {
      if (!seen.has(nodeId)) {
        seen.add(nodeId);
        data.nodes.push({ id: nodeId });
      }
    }
  }

  // assign positions to all nodes
  for (let n of data.nodes) {
    n.x = Utils.randomInRange(10, 700);
    n.y = Utils.randomInRange(10, 350);
  }

  const myConfig = {
    nodeHighlightBehavior: true,
    staticGraphWithDragAndDrop: true,
    width: 1200,
    height: 800,
    directed: directed,
    node: {
      color: "lightgreen",
      size: 420,
      labelPosition: "center"
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

  return (
    <D3Graph
      id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
      data={data}
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
