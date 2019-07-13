import React, { Component } from "react";
import KeyboardKey from "./KeyboardKey";
import { Card, ListGroup, Badge, ButtonGroup } from "react-bootstrap";
import SubmitButtonContainer from "../containers/SubmitButtonContainer";

export default class InfoPanel extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      // <div id="InfoPanel">
      <div>
        <Card style={{ width: "100%" }}>
          <div class="card-header">Quick Shortcuts</div>
          <ListGroup variant="flush">
            <ListGroup.Item style={{ padding: "0.64rem 1.25rem" }}>
              <span id="keybutton">
                <Badge variant="light">Z</Badge>
              </span>
              Undo
            </ListGroup.Item>
            <ListGroup.Item style={{ padding: "0.64rem 1.25rem" }}>
              <span id="keybutton">
                <Badge variant="light">X</Badge>
              </span>
              Redo
            </ListGroup.Item>
            <ListGroup.Item style={{ padding: "0.64rem 1.25rem" }}>
              <span id="keybutton">
                <Badge variant="light">C</Badge>
              </span>
              Toggle cross
            </ListGroup.Item>
            {/* <ListGroup.Item style={{ padding: "0.64rem 1.25rem" }}>
              <span id="keybutton">
                <Badge variant="light">K</Badge>
              </span>
              Toggle keypoint
            </ListGroup.Item> */}
            <ListGroup.Item style={{ padding: "0.64rem 1.25rem" }}>
              <span id="keybutton">
                <Badge variant="light">L / R</Badge>
              </span>
              Toggle hand
            </ListGroup.Item>
            <ListGroup.Item style={{ padding: "0.64rem 1.25rem" }}>
              <span id="keybutton">
                <Badge variant="primary">Enter</Badge>
              </span>
              Submit label
            </ListGroup.Item>
          </ListGroup>
        </Card>
        {/* <table>
          <tbody>
            <tr>
              <td>
                <KeyboardKey symbol={"Z"} />
              </td>
              <td>Undo</td>
            </tr>
            <tr>
              <td>
                <KeyboardKey symbol={"X"} />
              </td>
              <td>Redo</td>
            </tr>
            <tr>
              <td>
                <KeyboardKey symbol={"C"} />
              </td>
              <td>Toggle cross</td>
            </tr>
            <tr>
              <td>
                <KeyboardKey symbol={"K"} />
              </td>
              <td>Show reference keypoints</td>
            </tr>
          </tbody>
        </table> */}
      </div>
    );
  }
}
