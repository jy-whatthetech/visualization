import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 300;

export const useStyles = makeStyles(theme => ({
  // layout styles
  root: {
    display: "flex",
    overflow: "hidden"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  drawerHeaderText: {
    width: "100%"
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: "none"
  },
  mainContent: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  },
  layoutButton: {
    marginLeft: 10,
    marginRight: 0
  },
  searchBar: {
    display: "flex",
    flex: 1,
    justifyContent: "flex-end"
  },

  // form styles
  formControl: {
    margin: theme.spacing(1),
    width: `calc(100% - ${30}px)`
  },
  formControlLabel: {
    marginLeft: -4
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },

  sliders: {
    position: "absolute",
    zIndex: 999,
    top: 75,
    right: 30,
    height: 150
  },
  layoutError: {
    marginRight: 150
  }
}));
