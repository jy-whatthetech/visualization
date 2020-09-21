import React from "react";
import { Button, Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Help as HelpIcon } from "@material-ui/icons";

export const LabelWithTooltip = ({
  tooltipText,
  label,
  inputRef
}: {
  tooltipText: string;
  label: string;
  inputRef: React.RefObject<HTMLInputElement>;
}) => {
  return (
    <div
      onClick={() => {
        if (inputRef && inputRef.current) {
          inputRef.current.focus();
        }
      }}
    >
      {label}
      <Tooltip
        style={{ height: "20px", margin: "0px 0px -4px 4px" }}
        title={tooltipText}
        placement="right"
      >
        <HelpIcon />
      </Tooltip>
    </div>
  );
};

const lightGreen = "#81c784";
const green = "#4caf50";
const lightGrey = "#eeeeee";

export const ColorButton = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText(lightGrey),
    backgroundColor: lightGrey,
    "&:hover": {
      backgroundColor: lightGreen
    }
  }
}))(Button);

export const SelectedButton = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText(green),
    backgroundColor: green,
    "&:hover": {
      backgroundColor: green
    }
  }
}))(Button);
