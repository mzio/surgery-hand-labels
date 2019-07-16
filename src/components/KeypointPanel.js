import React, { Component } from "react";
import { Card, ListGroup, Badge, ButtonGroup } from "react-bootstrap";
import SubmitButtonContainer from "../containers/SubmitButtonContainer";
import { isFlowBaseAnnotation } from "@babel/types";

export default class KeypointPanel extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.getStyle = this.getStyle.bind(this);
  }

  getStyle() {
    // console.log(this.props.hand);
    if (this.props.hand == "left") {
      return {
        transform: "scaleX(-1)"
      };
    } else {
      return {
        transform: "scaleX(1)"
      };
    }
  }

  changeHand() {
    this.state.leftHand = !this.state.leftHand;
  }

  render() {
    // console.log(this.props.hand);
    return (
      // <div id="InfoPanel">
      <div>
        <Card style={{ width: "75%" }}>
          <Card.Img
            variant="top"
            src={this.props.image}
            style={this.getStyle()}
          />
          <Card.Body style={{ padding: "10px 0 0 0" }}>
            <Card.Title style={{ textAlign: "center" }}>
              <h3>Keypoint {this.props.ix}</h3>
            </Card.Title>
          </Card.Body>

          {/* <div class="card-header">Quick Shortcuts</div> */}
          {/* <ListGroup variant="flush">
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
          </ListGroup> */}
        </Card>
      </div>
    );
  }
}
