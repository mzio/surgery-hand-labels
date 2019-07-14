import { combineReducers } from "redux";
import committedBoxes from "./committedBoxes";
import committedKeypoints from "./committedKeypoints";
import imageProps from "./imageProps";
import main from "./main";

const turktoolApp = combineReducers({
  turktool: main
});

export default turktoolApp;
