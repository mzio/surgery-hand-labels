import React, { Component } from "react";
import axios from "axios";
import { Row, Col, Form, Card, Button, ButtonGroup } from "react-bootstrap";
import SubmitButtonContainer from "../containers/SubmitButtonContainer";

var env = process.env.NODE_ENV;
var config = require("../config.json");
const queryString = require("query-string");
var qs = require("qs");

export default class SubmitForm extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.displayTasks = this.displayTasks.bind(this);
    this.renderTaskCard = this.renderTaskCard.bind(this);
  }

  displayTasks() {
    return (
      <Card.Subtitle className="mb-2 text-muted">Instructions</Card.Subtitle>
    ); // Don't have keypoints implemented yet
    if (this.props.keypoints) {
      return (
        <Card.Subtitle className="mb-2 text-muted">
          Task 1 of 2 | Currently annotating <b>{this.props.hand}</b> hands
        </Card.Subtitle>
      );
    } else {
      return (
        <Card.Subtitle className="mb-2 text-muted">
          Task 1 of 1 | Currently annotating <b>{this.props.hand}</b> hands
        </Card.Subtitle>
      );
    }
  }

  createInputElement() {
    if (this.hasAcceptedTask()) {
      if (this.props.hasDrawnBox)
        return (
          <Button
            name="boundingBoxes"
            type="submit"
            id="submitButton"
            value={JSON.stringify(this.getNormalizedBoxes())}
            ref={value => {
              this.value = value;
            }}
            onClick={this.getSubmissionUrl()}
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

  renderTaskCard() {
    if (this.props.keypoints) {
      if (this.props.keypointState == "New Hand") {
        return (
          <Card>
            <Card.Body>
              {this.displayTasks()}
              <Card.Title>
                <h2>Select a hand type 🙌</h2>
              </Card.Title>
              <Card.Text>
                Press <b>R</b> to toggle between right or left hand labeling.
                When the correct hand type is specified, hit <b>Enter</b>. Hit{" "}
                <b>N</b> if there are no hands in the image.
              </Card.Text>
              <Form id="submitForm" style={{ height: "0px" }}>
                <fieldset>
                  <SubmitButtonContainer
                    action="submit"
                    imageID={this.props.imageID}
                    lastLabeled={this.props.lastLabeled}
                    submit={this.props.submit}
                    noHands={this.props.noHands}
                    show={this.props.show}
                    mode="keypoints"
                  />
                </fieldset>
              </Form>
            </Card.Body>
          </Card>
        );
      } else if (this.props.keypointState == "Labeling") {
        return (
          <Card>
            <Card.Body>
              {this.displayTasks()}
              <Card.Title>
                <h2>Keypoint Labeling ✍🔥</h2>
              </Card.Title>
              <Card.Text>
                <p>
                  Click on the image above to place a keypoint label, using the
                  diagram for reference. For occluded keypoints, press <b>O</b>{" "}
                  to toggle and try to label where the point would have been in
                  the image. Undo with <b>Z</b>, and redo with <b>X</b>.
                </p>
                <p>
                  For each new hand, you'll only be able to label a specific
                  keypoint once. Use the arrow keys or <b>A</b> / <b>D</b> to
                  switch between keypoints. Press <b>C</b> to toggle crosshairs.
                  After all points are labeled, hit <b>Enter</b>.
                </p>
              </Card.Text>
              <Form id="submitForm" style={{ height: "0px" }}>
                <fieldset>
                  <SubmitButtonContainer
                    action="submit"
                    imageID={this.props.imageID}
                    lastLabeled={this.props.lastLabeled}
                    submit={this.props.submit}
                    noHands={this.props.noHands}
                    show={this.props.show}
                    mode="keypoints"
                  />
                </fieldset>
              </Form>
            </Card.Body>
          </Card>
        );
      } else {
        // Review
        return (
          <Card>
            <Card.Body>
              {this.displayTasks()}
              <Card.Title>
                <h2>Review 👌💯</h2>
              </Card.Title>
              <Card.Text>
                If you're happy with all the keypoints labeled for the current
                hand, press <b>H</b> to begin another hand, or <b>Enter</b> to
                submit labels and move on to the next image. If you'd like to go
                back and modify previous annotations, hit <b>Backspace</b>.
              </Card.Text>
              <Form id="submitForm" style={{ height: "0px" }}>
                <fieldset>
                  <SubmitButtonContainer
                    action="submit"
                    imageID={this.props.imageID}
                    lastLabeled={this.props.lastLabeled}
                    submit={this.props.submit}
                    noHands={this.props.noHands}
                    show={this.props.show}
                    mode="keypoints"
                  />
                </fieldset>
              </Form>
            </Card.Body>
          </Card>
        );
      }
    } else {
      return (
        <Card>
          <Card.Body>
            {this.displayTasks()}
            <Card.Title>
              <h2>Bounding Boxes</h2>
            </Card.Title>
            <Card.Text>
              <p>
                For the image loaded, please provide labels for <a>all</a>{" "}
                hands. To do so, for each hand, first indicate whether you're
                labeling a right or left hand (toggle with <b>R</b>). Then click
                and drag to draw a box. After this is done, <b>repeat</b> for
                each hand remaining in the image, specifying whether you're
                currently labeling a right or left hand and drawing a box.
              </p>
              <p>
                Try to keep boxes as tight as possible, and hit <b>Enter</b> to
                submit labels and move on to the next image. If there are no
                hands at all in the image, press <b>N</b>.
              </p>
            </Card.Text>
            <Form id="submitForm" style={{ height: "0px" }}>
              <fieldset>
                <SubmitButtonContainer
                  action="submit"
                  imageID={this.props.imageID}
                  lastLabeled={this.props.lastLabeled}
                  submit={this.props.submit}
                  noHands={this.props.noHands}
                  show={this.props.show}
                  mode="boundingBoxes"
                />
              </fieldset>
            </Form>
          </Card.Body>
        </Card>
      );
    }
  }

  render() {
    return this.renderTaskCard();
  }
}
