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
    this.submitTask = this.submitTask.bind(this);
    this.getSubmissionUrl = this.getSubmissionUrl.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getNormalizedBoxes = this.getNormalizedBoxes.bind(this);
    this.normalizePosition = this.normalizePosition.bind(this);
    this.displayTasks = this.displayTasks.bind(this);
    // this.parsed = queryString.parse(this.props.location.search);
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
      const normalizedBox = this.normalizePosition(box);
      normalizedBoxes.push(normalizedBox);
    }
    return normalizedBoxes;
  }

  normalizePosition(position) {
    const { top, left, width, height } = position;
    // console.log(top, left, width, height);
    const normalizedPosition = {
      top: top / this.props.imageHeight,
      left: left / this.props.imageWidth,
      width: width / this.props.imageWidth,
      height: height / this.props.imageHeight
    };
    // round to 2 decimal places
    for (var key in normalizedPosition) {
      normalizedPosition[key] = normalizedPosition[key].toFixed(5);
    }
    // console.log(normalizedPosition);
    return normalizedPosition;
  }

  handleSubmit(e) {
    // e.preventDefault();
    // const input = document.getElementById("submitButton");
    // input.setAttribute("value", JSON.stringify(this.getNormalizedBoxes()));
    // console.log(input);
    // const form = document.getElementById("submitForm");
    // HTMLFormElement.prototype.submit.call(form);
  }

  submitTask(e) {
    // // e.preventDefault();
    // console.log("POSTing data");
    // axios
    //   .post(`${this.getSubmissionUrl()}`, {})
    //   .then(function(response) {
    //     console.log(response);
    //   })
    //   .catch(function(error) {
    //     console.log(error);
    //   });
  }

  displayTasks() {
    return (
      <Card.Subtitle className="mb-2 text-muted">
        Currently annotating <b>{this.props.hand}</b> hands
      </Card.Subtitle>
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

  getSubmissionUrl() {
    // const url = config["submit"][env] + "/" + this.props.imageID;
    // // const url =
    // //   config["submit"][env] + "/?assignmentId=" + this.parsed.assignmentId;
    // console.log(url);
    // return url;
    // return url;
  }

  render() {
    return (
      <Card>
        <Card.Body>
          {this.displayTasks()}
          <Card.Title>
            <h2>Bounding Boxes</h2>
          </Card.Title>
          <Card.Text>
            Please draw a box around <b>each</b> hand, trying to make it as
            precise as possible and specifying whether it's a <b>left</b> or{" "}
            <b>right</b> hand.
            <br />
            Hit <b>enter</b> to move on to the next image.
          </Card.Text>
          {/* <form
            // id="submitForm"
            type="submit"
            method="POST"
            action={this.getSubmissionUrl()}
          > */}
          <Form id="submitForm" style={{ height: "0px" }}>
            <fieldset>
              <Form.Group>
                {/* <Form.Label as={Row}>
                  <h3>Handedness</h3>
                </Form.Label>

                <Row>
                  <Form.Control as="select">
                    <option>Left</option>
                    <option>Right</option>
                    <option>None</option>
                  </Form.Control>
                  <Form.Text className="text-muted">
                    Select left, right, or none.
                  </Form.Text>
                </Row> */}

                {/* <Col sm={1}>
                  <Form.Check
                    type="radio"
                    label="Left"
                    name="formHorizontalRadios"
                    id="formHorizontalRadios1"
                  />
                </Col>
                <Col sm={1}>
                  <Form.Check
                    type="radio"
                    label="Right"
                    name="formHorizontalRadios"
                    id="formHorizontalRadios2"
                  />
                </Col>
                <Col sm={3}>
                  <Form.Check
                    type="radio"
                    label="No hands"
                    name="formHorizontalRadios"
                    id="formHorizontalRadios2"
                  />
                </Col> */}
              </Form.Group>
              <SubmitButtonContainer
                action="submit"
                imageID={this.props.imageID}
                lastLabeled={this.props.lastLabeled}
                submit={this.props.submit}
                show={this.props.show}
              />
              {/* <ButtonGroup>
                <SubmitButtonContainer action="save" />
                
              </ButtonGroup> */}
            </fieldset>
            {/* <Form.Group as={Row}>
                      <Col sm={{ span: 10, offset: 2 }}>
                        <Button type="submit">Sign in</Button>
                      </Col>
                    </Form.Group> */}
          </Form>
          {/* </form> */}
          {/* <Card.Link href="#">Card Link</Card.Link>
                  <Card.Link href="#">Another Link</Card.Link> */}
        </Card.Body>
      </Card>
    );
    // const inputElement = this.createInputElement();

    // return (
    //   <div id="Submit">
    //     {/* <form
    //       id="submitForm"
    //       type="submit"
    //       method="POST"
    //       action={this.getSubmissionUrl()}
    //     > */}
    //     {inputElement}
    //     {/* </form> */}
    //   </div>
    // );
  }
}
