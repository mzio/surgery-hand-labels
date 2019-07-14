import { combineReducers } from "redux";
import committedBoxes from "./committedBoxes";
import committedKeypoints from "./committedKeypoints";
import imageProps from "./imageProps";

const main = combineReducers({
  committedBoxes: committedBoxes,
  committedKeypoints: committedKeypoints,
  imageProps: imageProps
});

export default main;
