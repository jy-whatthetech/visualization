import React from "react";
import clsx from "clsx";
import "./App.css";
import Graph from "./graph/Graph";
import * as ParseUtils from "./parser/parseUtils";
import { InputType, getLabel } from "./parser/inputTypes";
import { LayoutType, getLayoutLabel } from "./layout/layoutTypes";
import {
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  AppBar,
  Drawer,
  Toolbar,
  Divider,
  IconButton,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useStyles } from "./styles/useStyles";
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from "@material-ui/icons";
import { LabelWithTooltip, ColorButton, SelectedButton } from "./utils/helperComponents";

const DEFAULT_GRAPH_INPUT = "[[2,1],[3,1],[1,4]]";
const DEFAULT_CUSTOM_NODES_INPUT = "[]";

function App() {
  const classes = useStyles();

  // layout
  const [drawerOpen, setDrawerOpen] = React.useState(true);

  // input data
  const [inputValue, setInputValue] = React.useState(DEFAULT_GRAPH_INPUT);
  const [comboValue, setComboValue] = React.useState(InputType.EdgePairs);
  const [directed, setDirected] = React.useState(true);
  const [oneIndexed, setOneIndexed] = React.useState(false);
  const [customNodes, setCustomNodes] = React.useState(DEFAULT_CUSTOM_NODES_INPUT);

  const [allNodes, setAllNodes] = React.useState<Array<string>>([]);
  const [startNode, setStartNode] = React.useState("");

  // error handling
  const [graphInputError, setGraphInputError] = React.useState("");
  const [customNodesInputError, setCustomNodesInputError] = React.useState("");

  // graph payload (with minimalist structure)
  const [customNodeSet, setCustomNodeSet] = React.useState(new Set<string>());
  const [data, setData] = React.useState({
    nodes: [
      { id: "PlaceHolderNode1", x: 50, y: 50 },
      { id: "PlaceHolderNode2", x: 100, y: 100 }
    ],
    links: [{ source: "PlaceHolderNode1", target: "PlaceHolderNode2", label: "TestLinkLabel" }]
  });

  // layout
  const [selectedLayout, setSelectedLayout] = React.useState(LayoutType.ForceLayout);

  const graphInputRef = React.useRef<any>();
  const customNodesInputRef = React.useRef<any>();

  // handle changes to graph input, input type, associated options (i.e. 1-indexed)
  React.useEffect(() => {
    if (!inputValue) return;

    let parsedValue: any;
    try {
      parsedValue = ParseUtils.processInput(inputValue, comboValue, {
        oneIndexed
      });
    } catch (ex) {
      setGraphInputError(ex.message);
      return;
    }

    const nodeToLabel = parsedValue.nodeToLabel ? parsedValue.nodeToLabel : {};

    parsedValue.nodes = Array.from(parsedValue.nodeSet).map(nodeId => {
      return {
        id: nodeId as string,
        label: nodeToLabel.hasOwnProperty(nodeId) ? nodeToLabel[nodeId as string] : nodeId
      };
    });
    if (parsedValue.startValue) {
      setStartNode(parsedValue.startValue);
    }
    setGraphInputError("");
    setData(parsedValue);
  }, [inputValue, comboValue, oneIndexed]);

  // handle changes to custom nodes input ()
  React.useEffect(() => {
    if (!customNodes) return;

    let parsedValue: Set<string>;
    try {
      parsedValue = ParseUtils.parseNodes(customNodes);
    } catch (ex) {
      setCustomNodesInputError(ex.message);
      return;
    }
    setCustomNodesInputError("");
    setCustomNodeSet(parsedValue);
  }, [customNodes]);

  React.useEffect(() => {
    let allNodesSet = new Set();
    for (let n of data.nodes) {
      allNodesSet.add(n.id);
    }
    for (let nodeId of Array.from(customNodeSet)) {
      allNodesSet.add(nodeId);
    }
    let tempAllNodes = Array.from(allNodesSet) as Array<string>;
    tempAllNodes.sort();
    if (!allNodesSet.has(startNode)) {
      setStartNode("");
    }
    setAllNodes(tempAllNodes);
  }, [customNodeSet, data]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerOpen
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => {
              setDrawerOpen(true);
            }}
            edge="start"
            className={clsx(classes.menuButton, drawerOpen && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Choose Layout:
          </Typography>
          {Object.keys(LayoutType)
            .filter(k => typeof LayoutType[k as any] !== "number")
            .map(key => {
              let currLayoutType = parseInt(key);
              return currLayoutType === selectedLayout ? (
                <SelectedButton
                  className={classes.layoutButton}
                  variant="contained"
                  onClick={() => {
                    setSelectedLayout(currLayoutType);
                  }}
                >
                  {getLayoutLabel(parseInt(key))}
                </SelectedButton>
              ) : (
                <ColorButton
                  className={classes.layoutButton}
                  variant="contained"
                  onClick={() => {
                    setSelectedLayout(currLayoutType);
                  }}
                >
                  {getLayoutLabel(parseInt(key))}
                </ColorButton>
              );
            })}
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <Typography className={classes.drawerHeaderText} variant="h6" noWrap>
            Graph Input
          </Typography>
          <IconButton
            onClick={() => {
              setDrawerOpen(false);
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <div>
          <Divider />
          <FormControl className={classes.formControl}>
            <TextField
              InputLabelProps={{ style: { pointerEvents: "auto" } }}
              label={
                <LabelWithTooltip
                  label={"Graph Input"}
                  tooltipText={"Enter the text representation of the graph."}
                  inputRef={graphInputRef}
                />
              }
              inputRef={graphInputRef}
              placeholder="Please enter graph input."
              multiline
              rows={3}
              rowsMax={10}
              variant="outlined"
              value={inputValue}
              onChange={event => {
                setInputValue(event.target.value);
              }}
              error={graphInputError.length > 0}
              helperText={graphInputError}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="graph-input-type-label">Input Type</InputLabel>
            <Select
              labelId="graph-input-type-label"
              id="graph-input-type"
              value={comboValue}
              className={classes.selectEmpty}
              variant="outlined"
              onChange={e => {
                setComboValue(parseInt(e.target.value as string));
              }}
            >
              {Object.keys(InputType)
                .filter(k => typeof InputType[k as any] !== "number")
                .sort((a, b) => getLabel(parseInt(a)).localeCompare(getLabel(parseInt(b))))
                .map(key => (
                  <MenuItem key={key} value={key}>
                    {getLabel(parseInt(key))}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          {comboValue === InputType.AdjacencyList && (
            <FormControlLabel
              className={classes.formControlLabel}
              control={
                <Checkbox
                  checked={oneIndexed}
                  onChange={e => setOneIndexed(!oneIndexed)}
                  name="oneIndexedValue"
                  color="primary"
                />
              }
              label="1-indexed"
            />
          )}
          <FormControlLabel
            className={classes.formControlLabel}
            control={
              <Checkbox
                checked={directed}
                onChange={e => setDirected(!directed)}
                name="directedValue"
                color="primary"
              />
            }
            label="Directed"
          />
          <FormControl className={classes.formControl}>
            <Autocomplete
              options={allNodes}
              value={startNode && startNode.length > 0 ? startNode : null}
              onChange={(event: React.ChangeEvent<{}>, newValue: string | null) => {
                if (newValue) setStartNode(newValue);
              }}
              renderInput={(params: any) => (
                <TextField {...params} label="Start Node" margin="normal" variant="outlined" />
              )}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              InputLabelProps={{ style: { pointerEvents: "auto" } }}
              label={
                <LabelWithTooltip
                  label={"Custom Node Set"}
                  tooltipText={
                    "(Optional) Specify if the set of nodes is described in a separate list from the edges."
                  }
                  inputRef={customNodesInputRef}
                />
              }
              inputRef={customNodesInputRef}
              placeholder="Enter custom node set here."
              multiline
              rows={3}
              rowsMax={10}
              variant="outlined"
              value={customNodes}
              onChange={event => {
                setCustomNodes(event.target.value);
              }}
              error={customNodesInputError.length > 0}
              helperText={customNodesInputError}
            />
          </FormControl>
        </div>
      </Drawer>
      <main
        className={clsx(classes.mainContent, {
          [classes.contentShift]: drawerOpen
        })}
      >
        <div className={classes.drawerHeader} />
        <Graph
          id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
          inputType={comboValue}
          directed={directed}
          customNodes={customNodeSet}
          startNode={startNode}
          data={data}
          selectedLayout={selectedLayout}
        />
      </main>
    </div>
  );
}

export default App;
