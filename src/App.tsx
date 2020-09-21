import React from "react";
import clsx from "clsx";
import "./App.css";
import Graph from "./graph/Graph";
import * as ParseUtils from "./parser/parseUtils";
import * as Utils from "./utils/utils";
import { InputType, getLabel } from "./parser/inputTypes";
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
  Checkbox,
  Button
} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useStyles } from "./styles/useStyles";
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from "@material-ui/icons";

const DEFAULT_GRAPH_INPUT = "[[2,1],[3,1],[1,4]]";
const DEFAULT_CUSTOM_NODES_INPUT = "[5]";

function App() {
  const classes = useStyles();

  // layout
  const [drawerOpen, setDrawerOpen] = React.useState(true);

  // input data
  const [inputValue, setInputValue] = React.useState(DEFAULT_GRAPH_INPUT);
  const [comboValue, setComboValue] = React.useState(0);
  const [directed, setDirected] = React.useState(true);
  const [oneIndexed, setOneIndexed] = React.useState(false);
  const [customNodes, setCustomNodes] = React.useState(DEFAULT_CUSTOM_NODES_INPUT);

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

    const tempNodes: Array<any> = [];

    for (let nodeId of Array.from(parsedValue.nodeSet)) {
      let x = Utils.randomInRange(10, 800);
      let y = Utils.randomInRange(10, 500);
      tempNodes.push({ id: nodeId, x: x, y: y });
    }

    parsedValue.nodes = tempNodes;
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
          <Button className={classes.layoutButton} variant="contained">
            Topological Sort
          </Button>
          <Button className={classes.layoutButton} variant="contained" color="primary">
            Force Layout
          </Button>
          <Button className={classes.layoutButton} variant="contained" color="secondary">
            Secondary
          </Button>
          <Button className={classes.layoutButton} variant="contained">
            Tree
          </Button>
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
              label="Graph Input"
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
            <TextField
              label="Custom Nodes Set"
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
          data={data}
        />
      </main>
    </div>
  );
}

export default App;
