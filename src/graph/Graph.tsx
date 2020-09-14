import React from "react";
import { Graph as D3Graph } from "react-d3-graph";
import { InputType, getTypeConfig } from "../parser/inputTypes";

type GraphProps = {
  inputType: number;
  data: any;
  id: string;
};

const Graph = ({ inputType, data, id = "graph-id" }: GraphProps) => {
  // the graph configuration, you only need to pass down properties
  // that you want to override, otherwise default ones will be used
  const myConfig = {
    nodeHighlightBehavior: true,
    staticGraphWithDragAndDrop: true,
    width: 1200,
    height: 800,
    directed: true,
    node: {
      color: "lightgreen",
      size: 420,
      labelPosition: "center"
    },
    link: {
      color: "blue",
      renderLabel: true
    },
    renderLabel: getTypeConfig(inputType).weighted
  };

  // graph event callbacks
  const onClickGraph = function() {
    window.alert(`Clicked the graph background`);
  };

  const onClickNode = function(nodeId: string) {
    window.alert(`Clicked node ${nodeId}`);
  };

  const onDoubleClickNode = function(nodeId: string) {
    window.alert(`Double clicked node ${nodeId}`);
  };

  const onRightClickNode = function(event: any, nodeId: string) {
    window.alert(`Right clicked node ${nodeId}`);
  };

  const onMouseOverNode = function(nodeId: string) {
    window.alert(`Mouse over node ${nodeId}`);
  };

  const onMouseOutNode = function(nodeId: string) {
    window.alert(`Mouse out node ${nodeId}`);
  };

  const onClickLink = function(source: string, target: string) {
    window.alert(`Clicked link between ${source} and ${target}`);
  };

  const onRightClickLink = function(
    event: any,
    source: string,
    target: string
  ) {
    window.alert(`Right clicked link between ${source} and ${target}`);
  };

  const onMouseOverLink = function(source: string, target: string) {
    window.alert(`Mouse over in link between ${source} and ${target}`);
  };

  const onMouseOutLink = function(source: string, target: string) {
    window.alert(`Mouse out link between ${source} and ${target}`);
  };

  const onNodePositionChange = function(nodeId: string, x: number, y: number) {
    window.alert(
      `Node ${nodeId} is moved to new position. New position is x= ${x} y= ${y}`
    );
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
