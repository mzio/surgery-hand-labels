import React, { Component } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
var env = process.env.NODE_ENV;
var config = require("../config.json");
const queryString = require("query-string");
var qs = require("qs");

export default class SubmitButton extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.submitTask = this.submitTask.bind(this);
    this.getSubmissionUrl = this.getSubmissionUrl.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getNormalizedBoxes = this.getNormalizedBoxes.bind(this);
    this.getNormalizedKeypoints = this.getNormalizedKeypoints.bind(this);
    this.normalizePosition = this.normalizePosition.bind(this);
    this.parsed = queryString.parse(this.props.location.search);
  }

  hasAcceptedTask() {
    return true;
    if (this.parsed.assignmentId === undefined) return false;
    return this.parsed.assignmentId !== "ASSIGNMENT_ID_NOT_AVAILABLE";
  }

  /*
   * Return an Array of normalized box positions. (no id)
   */
  getNormalizedBoxes() {
    const normalizedBoxes = [];
    for (var key in this.props.boundingBoxes) {
      const box = this.props.boundingBoxes[key].position;
      const normalizedBox = this.normalizePosition(box, true);
      normalizedBoxes.push(normalizedBox);
    }
    return normalizedBoxes;
  }

  getNormalizedKeypoints() {
    const normalizedKeypoints = [];
    for (var key in this.props.keypoints) {
      const keypoint = this.props.keypoints[key].position;
      var normalizedKeypoint = this.props.keypoints[key];
      normalizedKeypoint.position = this.normalizePosition(keypoint, false);
      normalizedKeypoints.push(normalizedKeypoint);
    }
    return normalizedKeypoints;
  }

  // Organize array of keypoints into hand objects
  getKeypointHandData(keypoints) {
    var hands = [];
    var handIds = [];
    for (var i = 0; i < keypoints.length; i++) {
      const keypoint = keypoints[i];
      if (handIds.includes(keypoint.handId)) {
        var hand = hands[keypoint.handId];
        const keypointPosition = keypoint.position;
        hand.keypoints[keypoint.keypointIndex] = {
          keypointPosition,
          occluded: keypoint.occluded
        };
      } else {
        handIds.push(keypoint.handId);
        var hand = {
          handId: keypoint.handId,
          keypoints: new Array(21).fill(null),
          hand: keypoint.hand
        };
        const keypointPosition = keypoint.position;
        hand.keypoints[keypoint.keypointIndex] = {
          keypointPosition,
          occluded: keypoint.occluded
        };
        hands.push(hand);
      }
    }
  }

  getImageDimensions() {
    return [this.props.imageWidth, this.props.imageHeight];
  }

  normalizePosition(position, box) {
    if (box) {
      const { top, left, width, height } = position;
      // console.log(top, left, width, height);
      const normalizedPosition = {
        top: top / this.props.imageHeight,
        left: left / this.props.imageWidth,
        width: width / this.props.imageWidth,
        height: height / this.props.imageHeight
      };
      // round to 5 decimal places
      for (var key in normalizedPosition) {
        normalizedPosition[key] = normalizedPosition[key].toFixed(5);
      }
      // console.log(normalizedPosition);
      return normalizedPosition;
    } else {
      const { top, left } = position;
      const normalizedPosition = {
        top: top / this.props.imageHeight,
        left: left / this.props.imageWidth
      };
      // round to 5 decimal places
      for (var key in normalizedPosition) {
        normalizedPosition[key] = normalizedPosition[key].toFixed(5);
      }
      // console.log(normalizedPosition);
      return normalizedPosition;
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const input = document.getElementById("submitButton");
    input.setAttribute("value", JSON.stringify(this.getNormalizedBoxes()));
    console.log(input);
    // const form = document.getElementById("submitForm");
    // HTMLFormElement.prototype.submit.call(form);
  }

  submitTask() {
    // e.preventDefault();
    const labelIndex = config["submit"][env] + "/labeled_index";
    const imagePath = config["submit"][env] + "/" + this.props.imageID;
    axios
      .put(imagePath, {
        labels: this.getNormalizedBoxes(),
        labeled: true
      })
      .then(res => {
        console.log(res);
        axios.put(labelIndex, { last_labeled: this.props.lastLabeled + 1 });
      });

    // axios.get(label_index).then(function(res) {
    //   console.log(res.data);
    // });
    // console.log("POSTing data");
    // axios
    //   .put(`${this.getSubmissionUrl()}`, {})
    //   .then(function(response) {
    //     console.log(response);
    //   })
    //   .catch(function(error) {
    //     console.log(error);
    //   });
  }

  createInputElement() {
    if (this.hasAcceptedTask()) {
      if (this.props.hasDrawnBox)
        return (
          <Button
            name="boundingBoxes"
            // type="submit"
            id="submitButton"
            value={JSON.stringify(this.getNormalizedBoxes())}
            ref={value => {
              this.value = value;
            }}
            onClick={this.submitTask}
          >
            {this.props.action}
          </Button>
        );
      else
        return (
          <Button name="boundingBoxes" type="submit" id="submitButton" disabled>
            {/* Draw a box first! */}
            {this.props.action}
          </Button>
        );
    } else {
      return (
        <Button name="boundingBoxes" type="submit" id="submitButton" disabled>
          Cannot Submit! Accept HIT.
        </Button>
      );
    }
  }

  getSubmissionUrl() {
    const url = config["submit"][env] + "/" + this.props.imageID;
    // const url =
    //   config["submit"][env] + "/?assignmentId=" + this.parsed.assignmentId;
    console.log(url);
    return url;
  }

  render() {
    const inputElement = this.createInputElement();
    if (this.props.submit) {
      this.submitTask();
    }

    if (this.props.show) {
      return <div id="Submit">{inputElement}</div>;
    } else {
      return null;
    }
  }
}
