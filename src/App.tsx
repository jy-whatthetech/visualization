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
  Typography
} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useStyles } from "./styles/useStyles";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon
} from "@material-ui/icons";

function App() {
  const classes = useStyles();

  // layout
  const [drawerOpen, setDrawerOpen] = React.useState(true);

  // input data
  const [inputValue, setInputValue] = React.useState("");
  const [comboValue, setComboValue] = React.useState(0);
  const [directed, setDirected] = React.useState(true);
  const [customNodes, setCustomNodes] = React.useState("");

  // graph payload (with minimalist structure)
  const [data, setData] = React.useState({
    nodes: [
      { id: "Harry", x: 50, y: 50 },
      { id: "Sally", x: 100, y: 200 },
      { id: "Alice", x: 200, y: 200 }
    ],
    links: [
      { source: "Harry", target: "Sally", label: "test123" },
      { source: "Harry", target: "Alice", label: "test456" }
    ]
  });

  React.useEffect(() => {
    if (!inputValue) return;

    let parsedValue: any;
    try {
      parsedValue = ParseUtils.processInput(inputValue, comboValue);
    } catch (ex) {
      console.error(ex);
      return;
    }

    const tempNodes: Array<any> = [];

    for (let nodeId of Array.from(parsedValue.nodeSet)) {
      let x = Utils.randomInRange(10, 800);
      let y = Utils.randomInRange(10, 500);
      tempNodes.push({ id: nodeId, x: x, y: y });
    }

    console.log(parsedValue);
    parsedValue.nodes = tempNodes;
    setData(parsedValue);
  }, [inputValue]);

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
            Persistent drawer
          </Typography>
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
          [[2,1],[3,1],[1,4]]
          <br />
          [[1],[],[0,5],[],[1,3,0],[0]]
          <br />
          <FormControl className={classes.formControl}>
            <InputLabel id="graph-input-type-label">Input Type</InputLabel>
            <Select
              labelId="graph-input-type-label"
              id="graph-input-type"
              value={""}
              className={classes.selectEmpty}
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
          <form>
            <label>
              Directed:{" "}
              <input
                type="checkbox"
                value={"directedValue"}
                checked={directed}
                onChange={e => setDirected(!directed)}
              />
            </label>
            <br />
            <label>
              Graph Input:
              <textarea
                id="graph-input"
                name="graph-input"
                value={inputValue}
                onChange={event => {
                  setInputValue(event.target.value);
                }}
              />
            </label>
            <label>
              Custom Nodes:
              <textarea
                id="custom-nodes"
                name="custom-nodes"
                value={customNodes}
                onChange={event => {
                  setCustomNodes(event.target.value);
                }}
              />
            </label>
          </form>
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
          customNodes={customNodes}
          data={data}
        />
      </main>
    </div>
  );
}

export default App;
