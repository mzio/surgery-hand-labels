import React, { Component } from "react";

export default class Keypoint extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.timer = null;
    this.state = {
      mouseOver: false,
      colors: [
        "204,102,0", // 0 - 4
        "217,102,0",
        "230,102,0",
        "242,102,0",
        "255,102,0",
        "255,102,0", // 5 - 8
        "255,140,0",
        "255,179,0",
        "255,217,0",
        "102,204,0", // 9 - 12
        "115,217,26",
        "128,230,51",
        "140,242,77",
        "51,51,255", // 13 - 16
        "68,68,255",
        "85,85,255",
        "102,102,255",
        "102,102,204", // 17 - 20
        "102,115,204",
        "102,128,204",
        "102,140,204"
      ]
    };
    this.getColor = this.getColor.bind(this);
  }

  getColor(outer, ix) {
    if (ix > 22) {
      return "rgba(255, 255, 255, 0.8)";
    }
    const vals = this.state.colors[ix];
    var transparency = 1;
    if (outer) {
      transparency = 0.25;
    }
    return `rgba(${vals},${transparency})`;
  }

  getStyle(outer, rgba, size) {
    if (outer) {
      return {
        top: `-${size / 2}px`,
        left: `-${size / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
        position: "absolute",
        borderRadius: "50%",
        backgroundColor: rgba
      };
    } else {
      return {
        top: "20%",
        left: "20%",
        width: "60%",
        height: "60%",
        position: "absolute",
        borderRadius: "50%",
        backgroundColor: rgba,
        border: "1px solid rgba(0, 0, 0, 1)"
      };
    }
  }

  render() {
    try {
      var keypointIndex = this.props.keypoint.keypointIndex.toString();
      if (this.props.keypoint.occluded) {
        var keypointIndex = `(${keypointIndex})`;
      }
    } catch (e) {
      //   console.log(this.props.keypoint);
    }
    return (
      <div
        className="Keypoint"
        style={this.props.keypoint.position}
        onMouseOver={this.mouseOverHandler}
        onMouseLeave={this.mouseLeaveHandler}
      >
        <div
          className="outer"
          style={this.getStyle(
            true,
            this.getColor(true, this.props.keypoint.keypointIndex),
            15
          )}
        >
          <div
            className="inner"
            style={this.getStyle(
              false,
              this.getColor(false, this.props.keypoint.keypointIndex),
              15
            )}
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: "-15px",
            left: "-5px",
            zIndex: "1",
            fontSize: "10px",
            // color: this.getColor(false, this.props.keypoint.keypointIndex)
            color: this.getColor(false, 23)
          }}
        >
          {keypointIndex}
        </div>
      </div>
    );
  }
}
