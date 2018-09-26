import red from "@material-ui/core/colors/red";
import pink from "@material-ui/core/colors/pink";
import purple from "@material-ui/core/colors/purple";
import deepPurple from "@material-ui/core/colors/deepPurple";
import indigo from "@material-ui/core/colors/indigo";
import blue from "@material-ui/core/colors/blue";
import lightBlue from "@material-ui/core/colors/lightBlue";
import cyan from "@material-ui/core/colors/cyan";
import teal from "@material-ui/core/colors/teal";
import green from "@material-ui/core/colors/green";
import lightGreen from "@material-ui/core/colors/lightGreen";
import lime from "@material-ui/core/colors/lime";
import yellow from "@material-ui/core/colors/yellow";
import amber from "@material-ui/core/colors/amber";
import orange from "@material-ui/core/colors/orange";
import deepOrange from "@material-ui/core/colors/deepOrange";
import brown from "@material-ui/core/colors/brown";
import grey from "@material-ui/core/colors/grey";
import blueGrey from "@material-ui/core/colors/blueGrey";

const colors = [
  "red",
  "pink",
  "purple",
  "deepPurple",
  "indigo",
  "blue",
  "lightBlue",
  "cyan",
  "teal",
  "green",
  "lightGreen",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deepOrange",
  "brown",
  "grey",
  "blueGrey"
];

const colorsReduced = [
  "red",
  "pink",
  "purple",
  "blue",
  "green",
  "lime",
  "amber",
  "deepOrange",
  "brown",
  "grey"
];

const colorList = [
  { name: "red", component: red },
  { name: "pink", component: pink },
  { name: "purple", component: purple },
  { name: "deepPurple", component: deepPurple },
  { name: "indigo", component: indigo },
  { name: "blue", component: blue },
  { name: "lightBlue", component: lightBlue },
  { name: "cyan", component: cyan },
  { name: "teal", component: teal },
  { name: "green", component: green },
  { name: "lightGreen", component: lightGreen },
  { name: "lime", component: lime },
  { name: "yellow", component: yellow },
  { name: "amber", component: amber },
  { name: "orange", component: orange },
  { name: "deepOrange", component: deepOrange },
  { name: "brown", component: brown },
  { name: "grey", component: grey },
  { name: "blueGrey", component: blueGrey }
];

const colorClasses = (suffix, base, attribute) => {
  let result = {};
  for (var color in colorList) {
    result[colorList[color].name + suffix] = {
      [attribute]: colorList[color].component[base]
    };
  }
  return result;
};

const backgroundColorHoverClasses = (suffix, base, hover) => {
  let result = {};
  for (var color in colorList) {
    result[colorList[color].name + suffix] = {
      background: colorList[color].component[base],
      "&:hover": {
        background: colorList[color].component[hover]
      }
    };
  }
  return result;
};

export { colors, colorsReduced, backgroundColorHoverClasses, colorClasses };
