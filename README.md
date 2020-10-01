<h1 align="center">
  <img width="24" src="./public/favicon.png" alt="Icon" />
  Gee Vis - A Graph Visualization Tool
</h1>

<h4 align="center">
  Convert graphs and trees from their text-based representation into intuitive visual layouts.
</h4>
<img height="430" src="./screenshots/NaryTree.PNG" alt="Icon" />

## :exclamation: About

Gee Vis is a graph visualization tool that receives user input in various commonly used graph and tree formats, and generates well-proportioned and visually intuitive layouts based on different graph layout algorithms. The UI is simple but flexible, providing basic validation on improper input syntax, as well as a handful of configuration options to aid in the user experience.

## :mag_right: Features

### User Input
The tool supports the parsing of most of the commonly-used graph and tree formats. The text in Graph Input text field will be parsed according the the selected input format. There will be some basic input validation such as making sure edges in an Edge List have length 2, JSON syntax is valid, brackets are matched, etc. Validation errors will be shown in red under the text field. Spacing and newlines outside node names does not matter, and quotes around a node name will automatically be stripped during parsing. 

#### Supported input formats:
- [Adjacency List](https://en.wikipedia.org/wiki/Adjacency_list) - Example: `[[2, 3], [3], [1], []]`
  - The Adjacency List input type also provides the option to toggle 1-indexed node values. So in the above example, instead of node `0` being connected to `2` and `3`, node `1` would be connected to `2` and `3`
- [Adjacency Matrix](https://en.wikipedia.org/wiki/Adjacency_matrix) - Example: `[[0,0,1], [1,0,1], [1,0,0]]`
- [Edge List](https://en.wikipedia.org/wiki/Edge_list) - Example: `[["A","B"],["B","C"],["B","D"]]`
  - The Edge List input type also provides the option reverse the direction of specified edges. So in the above example, instead of `A` being connected to `B`, `B` would be connected to `A`
- Weighted Edge List - similar to Edge List, but with an additional element in each edge definition to specify the weight of the edge. The resulting graph will be drawn with labels on the edges. Example: `[[0,1,3],[1,2,1],[1,3,4],[2,3,1]]`
- [Binary Heap Array](https://en.wikipedia.org/wiki/Binary_heap#Heap_implementation) - Example: `[1,3,6,5,9,8]`
- [Array serialization of a tree](https://support.leetcode.com/hc/en-us/articles/360011883654-What-does-1-null-2-3-mean-in-binary-tree-representation-) - Example: `[5,1,4,null,null,3,6]`
- JSON Graph Object - `nodes` attribute is an array where each node has an `id` and a list of `children`. In addition the JSON object can have an optional `startNode` attribute, to specify the starting node of the graph. Example:
```
  {
    "nodes": [
      {"children": ["B", "C", "D"], "id": "A", "value": "A"},
      {"children": ["E", "F"], "id": "B", "value": "B"},
      {"children": [], "id": "C", "value": "C"},
      {"children": ["G", "H"], "id": "D", "value": "D"},
      {"children": [], "id": "E", "value": "E"},
      {"children": ["I", "J"], "id": "F", "value": "F"},
      {"children": ["K"], "id": "G", "value": "G"},
      {"children": [], "id": "H", "value": "H"},
      {"children": [], "id": "I", "value": "I"},
      {"children": [], "id": "J", "value": "J"},
      {"children": [], "id": "K", "value": "K"}
    ],
    "startNode": "A"
  }
```
- JSON Tree Object - similar JSON Graph, but nodes have `left` and `right` properties instead of `children`. Also, `startNode` is renamed to `root`. Example:
```
{
  "nodes": [
    {"id": "1", "left": "2", "right": null, "value": 1},
    {"id": "2", "left": null, "right": null, "value": 2}
  ],
  "root": "1"
}
 ```
 
#### Start Node
In addition, the user can optionally select a start node out of the list of nodes in the graph, and the layout algorithm will prioritize putting that node at the front of the layout.

#### Custom Node List
The Custom Node List is an optional field which is only used when there is a separate list of nodes to describe the graph along with what was passed into the Graph Input. For example, this could be the case for a graph that describes airport connections - where there is an Edge List to describe airline routes, and a separate list to describe all  available airports. 
 - Example format: `[
    "BGI",
    "CDG",
    "DEL",
    "DOH",
    "DSM",
    "EWR",
    "EYW",
    "HND",
    "ICN",
    "JFK",
    "LGA",
    "LHR",
    "ORD",
    "SAN",
    "SFO",
    "SIN",
    "TLV",
    "BUD"
  ]`


## :computer: Technologies

This project was developed with the following technologies:

- [Typescript](https://www.typescriptlang.org/)
- [ReactJS](https://reactjs.org/)
- [Material-UI](https://material-ui.com/)
- [react-d3-graph](https://github.com/danielcaldas/react-d3-graph)
- [D3](https://d3js.org/)

## :information_source: Installation

To clone and run this application in your machine, you'll need [Git](https://git-scm.com), and [Node.js v12](https://nodejs.org/en/) or higher

```bash
# Clone this repository.
git clone https://github.com/jy-whatthetech/visualization.git
cd visualization

# Install dependencies
npm i

# Run the app, and navigate to http://localhost:3000
npm run start
```
