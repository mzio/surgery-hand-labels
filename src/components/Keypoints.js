import React, { Component } from "react";
import Keypoint from "./Keypoint.js";

export default class Keypoints extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    const keypointsToRender = this.props.keypoints.map((keypoint, index) => {
      return (
        <Keypoint
          key={keypoint.id}
          isDrawing={this.props.isDrawing}
          keypoint={keypoint}
          occluded={this.props.occluded}
        />
      );
    });

    return (
      <div id="Keypoints">
        {keypointsToRender.length > 0 && keypointsToRender}
      </div>
    );
  }
}
