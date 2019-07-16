import React, { Component } from "react";
import BoundingBoxes from "./BoundingBoxes";
import Keypoints from "./Keypoints";
import ImageContainer from "../containers/ImageContainer";
import Crosshair from "../components/Crosshair";
import InfoPanel from "../components/InfoPanel";
import KeypointPanel from "../components/KeypointPanel";
import SubmitForm from "../components/SubmitForm";
import Header from "../components/Header";
import { calculateRectPosition, isRectangleTooSmall } from "../utils/drawing";
import { calculateKeypointPosition } from "../utils/drawing";

// import SubmitButtonContainer from "../containers/SubmitButtonContainer";
import { Container, Row, Col, ProgressBar } from "react-bootstrap";

/**
 * `LabelView` is a container for `LabelImage` and
 * `BoundingBoxes` components.
 */
class LabelView extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.createRectangle = this.createRectangle.bind(this);
    this.createKeypoint = this.createKeypoint.bind(this);
    this.updateCursorPosition = this.updateCursorPosition.bind(this);
    this.getCurrentBox = this.getCurrentBox.bind(this);
    this.getCurrentKeypoint = this.getCurrentKeypoint.bind(this);
    this.refreshDrawing = this.refreshDrawing.bind(this);
    this.refreshDrawingKeypoints = this.refreshDrawingKeypoints.bind(this);
    this.isCrosshairReady = this.isCrosshairReady.bind(this);
    this.loadBoxes = this.loadBoxes.bind(this);
    this.getKeypointImage = this.getKeypointImage.bind(this);
    this.changeLabelingMode = this.changeLabelingMode.bind(this);
    this.renderLabels = this.renderLabels.bind(this);
    this.renderKeypointHeader = this.renderKeypointHeader.bind(this);

    this.state = {
      isDrawing: false,
      currentBoxId: 0,
      startX: null,
      startY: null,
      currX: null,
      currY: null,
      imgLoaded: false,
      imageUrl: null,
      showCrosshair: true,
      submit: false,
      currentKeypointId: 0,
      keypointImageIndex: 0,
      keypointIndex: 0,
      keypoints: this.props.modeKeypoints, // labeling keypoints (true) or boxes (false)
      handId: 0, // For connecting keypoints to hands
      task: this.props.modeKeypoints ? "Keypoints" : "Bounding Boxes",
      keypointState: "New Hand", // "New Hand" (select a hand), "Labeling" (place keypoints), "Review" (after, hit enter to move to next or n for new hand)
      occluded: false
    };
  }

  /**
   * Add event listener
   */
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }

  /**
   * Remove event listener
   */
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  getCurrentBox() {
    return {
      startX: this.state.startX,
      startY: this.state.startY,
      currX: this.state.currX,
      currY: this.state.currY
    };
  }

  getCurrentKeypoint() {
    return {
      startX: this.state.startX,
      startY: this.state.startY,
      currX: this.state.currX, // currX?
      currY: this.state.currY // currY?
    };
  }

  getKeypointImage(increase) {
    function mod(n, m) {
      return ((n % m) + m) % m;
    }
    var ix = this.state.keypointImageIndex;
    if (increase) {
      ix = mod(ix + 1, 22);
    } else {
      ix = mod(ix - 1, 22);
    }
    this.setState({ keypointImageIndex: ix });
    this.setState({ keypointIndex: ix }); // redundant
  }

  loadBoxes() {
    // this.props.savedBoxes.forEach((e) => {
    //   this.props.commitDrawingAsBox(
    //     e.id,
    //     e.
    //     this.state.currentBoxId,
    //     boxPosition,
    //     this.props.hand
    //   );
    // });
  }

  changeLabelingMode() {
    if (this.state.keypoints) {
      this.setState({ keypoints: false });
      this.setState({ task: "Bounding Boxes" });
    } else {
      this.setState({ keypoints: true });
      this.setState({ task: "Keypoints" });
    }
  }

  handleKeyPress(event) {
    switch (event.keyCode) {
      case 67:
        console.log("You just pressed C!");
        this.setState(prevState => {
          return {
            showCrosshair: !prevState.showCrosshair
          };
        });
        break;
      case 90:
        console.log("You just pressed Z!");
        if (this.props.canUndo) this.props.onUndo();
        if (this.props.canUndoKeypoint) this.props.onUndoKeypoint();
        break;
      case 88:
        console.log("You just pressed X!");
        if (this.props.canRedo) this.props.onRedo();
        if (this.props.canRedoKeypoint) this.props.onRedoKeypoint();
        break;
      case 75:
        console.log("You just pressed K!");
        break;
      case 76:
        console.log("You just pressed L!");
        break;
      case 82:
        console.log("You just pressed R!");
        break;
      case 13:
        console.log("You just pressed Enter!");
        if (this.state.keypoints) {
          if (this.state.keypointState === "Review") {
            this.setState({ submit: true });
          } else if (this.state.keypointState === "New Hand") {
            this.setState({ keypointState: "Labeling" });
          } else if (this.state.keypointState === "Labeling") {
            this.setState({ keypointState: "Review", keypointImageIndex: 21 });
          }
        } else {
          this.setState({ submit: true });
        }
        break;
      case 79:
        console.log("o (occluded)");
        this.setState({ occluded: !this.state.occluded });
        break;
      case 37:
        console.log("left arrow");
        if (this.state.keypointIndex !== 0) {
          this.getKeypointImage(false);
        }
        break;
      case 39:
        console.log("right arrow");
        if (this.state.keypointIndex < 20) {
          this.getKeypointImage(true);
        }
        break;
      case 65:
        console.log("a (left)");
        if (this.state.keypointIndex !== 0) {
          this.getKeypointImage(false);
        }
        break;
      case 68:
        console.log("d (right)");
        if (this.state.keypointIndex < 20) {
          this.getKeypointImage(true);
        }
        break;
      case 77:
        console.log("m (mode change)");
        console.log(this.state.keypoints);
        this.changeLabelingMode();
        break;
      case 78:
        console.log("n (new hand)");
        this.setState({
          handId: (this.state.handId += 1),
          keypointState: "New Hand",
          keypointImageIndex: 0,
          keypointIndex: 0
        });
        console.log(this.state.handId);
      case 8:
        console.log("backspace (go back)");
        if (this.state.keypointState === "Review") {
          this.setState({
            keypointState: "Labeling",
            keypointImageIndex: 20,
            keypointIndex: 20
          });
        }
      default:
        break;
    }
  }

  createRectangle(event) {
    this.setState({
      isDrawing: true,
      startX: event.pageX,
      startY: event.pageY,
      currX: event.pageX,
      currY: event.pageY
    });
  }

  createKeypoint(event) {
    this.setState({
      isDrawing: true,
      startX: event.pageX,
      startY: event.pageY,
      currX: event.pageX,
      currY: event.pageY
    });
  }

  updateCursorPosition(event) {
    this.setState({
      currX: event.pageX,
      currY: event.pageY
    });
  }

  // This might change for bounding box vs keypoint labeling
  mouseDownHandler(event) {
    // only start drawing if the mouse was pressed
    // down inside the image that we want labelled
    console.log(event.target.className);
    if (
      event.target.className !== "line" &&
      event.target.id !== "LabelViewImg" &&
      event.target.className !== "BoundingBox" &&
      event.target.id !== "Crosshair"
    )
      return;
    event.persist();
    if (this.state.keypoints) {
      this.createKeypoint(event);
    } else {
      this.createRectangle(event);
    }
  }

  mouseMoveHandler(event) {
    // only update the state if is drawing
    if (this.state.keypoints) {
      event.persist();
    } else {
      event.persist();
    }
    this.updateCursorPosition(event);
  }

  mouseUpHandler(event) {
    if (this.state.keypoints) {
      const keypointPosition = calculateKeypointPosition(
        this.props.imageProps,
        this.getCurrentKeypoint()
      );
      if (this.state.isDrawing) {
        if (this.state.keypointState === "Labeling") {
          try {
            var committedKeypoints = this.props.committedKeypoints;
            var keypointIndex = this.state.keypointIndex;
            var handId = this.state.handId;
            if (
              committedKeypoints.filter(function(e) {
                return e.keypointIndex === keypointIndex && e.handId === handId;
              }).length === 0
            ) {
              this.props.commitDrawingAsKeypoint(
                this.state.currentKeypointId,
                keypointPosition,
                this.props.hand,
                this.state.handId,
                this.state.keypointIndex,
                this.state.occluded
              );
            }
          } catch (e) {
            // console.log(e);
            this.props.commitDrawingAsKeypoint(
              this.state.currentKeypointId,
              keypointPosition,
              this.props.hand,
              this.state.handId,
              this.state.keypointIndex,
              this.state.occluded
            );
          }
        }
      }
      this.refreshDrawingKeypoints();
    } else {
      const boxPosition = calculateRectPosition(
        this.props.imageProps,
        this.getCurrentBox()
      );
      if (this.state.isDrawing && !isRectangleTooSmall(boxPosition)) {
        // drawing has ended, and coord is not null,
        // so this rectangle can be committed permanently
        this.props.commitDrawingAsBox(
          this.state.currentBoxId,
          boxPosition,
          this.props.hand
        );
      }
      this.refreshDrawing();
    }
  }

  refreshDrawing() {
    this.setState(prevState => {
      return {
        ...prevState,
        isDrawing: false,
        currentBoxId: prevState.isDrawing
          ? prevState.currentBoxId + 1
          : prevState.currentBoxId,
        startX: null,
        startY: null
      };
    });
  }

  refreshDrawingKeypoints() {
    this.setState(prevState => {
      return {
        ...prevState,
        isDrawing: false,
        currentKeypointId: prevState.isDrawing
          ? prevState.currentKeypointId + 1
          : prevState.currentKeypointId,
        startX: null,
        startY: null
      };
    });
  }

  isCrosshairReady() {
    return (
      this.state.currX &&
      this.state.currY &&
      this.props.imageProps.height &&
      this.props.imageProps.width
    );
  }

  renderLabels(thingsToRender) {
    if (this.state.keypoints) {
      return (
        <div id="LabelView">
          {this.state.showCrosshair && this.isCrosshairReady() && (
            <Crosshair
              x={this.state.currX}
              y={this.state.currY}
              imageProps={this.props.imageProps}
            />
          )}
          {thingsToRender.length > 0 && (
            <Keypoints
              className="Keypoints unselectable"
              keypoints={thingsToRender}
              isDrawing={this.state.isDrawing}
              occluded={this.state.occluded}
            />
          )}
          <ImageContainer imageURL={this.props.imageURL} />
        </div>
      );
    } else {
      return (
        <div id="LabelView">
          {this.state.showCrosshair && this.isCrosshairReady() && (
            <Crosshair
              x={this.state.currX}
              y={this.state.currY}
              imageProps={this.props.imageProps}
            />
          )}
          {thingsToRender.length > 0 && (
            <BoundingBoxes
              className="BoundingBoxes unselectable"
              boxes={thingsToRender}
              isDrawing={this.state.isDrawing}
            />
          )}
          <ImageContainer imageURL={this.props.imageURL} />
        </div>
      );
    }
  }

  renderKeypointHeader() {
    if (this.state.keypoints) {
      var occludedText = "";
      if (this.state.occluded) {
        occludedText = " (occluded)";
      }
      return (
        <h3 style={{ textAlign: "center" }}>
          Currently annotating hand {this.state.handId} (
          <span style={{ color: "#007bff" }}>{this.props.hand}</span>) and
          keypoint {this.state.keypointIndex}
          <span style={{ color: "#A0A0A0" }}>{occludedText}</span>
        </h3>
      );
    } else {
      return (
        <h2 style={{ textAlign: "center" }}>
          Currently annotating{" "}
          <span style={{ color: "#007bff" }}>{this.props.hand}</span> hands
        </h2>
      );
    }
  }

  renderKeypointPanel() {
    if (this.state.keypoints) {
      return (
        <KeypointPanel
          image={this.props.keypointImages[this.state.keypointImageIndex]}
          ix={this.state.keypointImageIndex}
          hand={this.props.hand}
        />
      );
    } else {
      return <InfoPanel />;
    }
  }

  render() {
    // TODO: get committed rectangles from Redux store
    if (this.state.keypoints) {
      // Keypoints
      var thingsToRender = this.props.committedKeypoints.slice(0);
      // console.log(thingsToRender);
      if (this.state.startX != null) {
        thingsToRender.push({
          id: this.state.currentKeypointId,
          position: calculateKeypointPosition(
            this.props.imageProps,
            this.getCurrentKeypoint()
          ),
          handId: this.state.handId
        });
      }
    } else {
      // Boxes
      var thingsToRender = this.props.committedBoxes.slice(0);

      if (this.state.startX != null) {
        thingsToRender.push({
          id: this.state.currentBoxId,
          position: calculateRectPosition(
            this.props.imageProps,
            this.getCurrentBox()
          )
        });
      }
    }

    return (
      <div
        // id="LabelViewContainer"
        onMouseDown={this.mouseDownHandler}
        onMouseUp={this.mouseUpHandler}
        onMouseMove={this.mouseMoveHandler}
      >
        <Container>
          <Row>
            <Col>
              <h1 id="Header" style={{ marginBottom: "1rem" }}>
                Surgery Hand {this.state.task}
              </h1>
              {this.renderKeypointHeader()}
            </Col>
          </Row>
          <Row>
            <Col sm={8}>
              {this.renderLabels(thingsToRender)}
              {/* <RenderLabels thingsToRender={thingsToRender} /> */}
              {/* <div id="LabelView">
                {this.state.showCrosshair && this.isCrosshairReady() && (
                  <Crosshair
                    x={this.state.currX}
                    y={this.state.currY}
                    imageProps={this.props.imageProps}
                  />
                )}
                {boxesToRender.length > 0 && (
                  <BoundingBoxes
                    className="BoundingBoxes unselectable"
                    boxes={boxesToRender}
                    isDrawing={this.state.isDrawing}
                  />
                )}
                <ImageContainer imageURL={this.props.imageURL} />
              </div> */}
            </Col>
            <Col sm={4}>
              {/* <div id="Middle"> */}
              {this.props.showSidePanel && (
                <div id="SidePanel">{this.renderKeypointPanel()}</div>
              )}
              <div style={{ clear: "both" }} />
              {/* </div> */}
            </Col>
          </Row>
          <Row id="Progress">
            <Col sm={0} />
            <Col sm={8}>
              {/* Progress: */}
              <ProgressBar
                animated
                now={this.props.progress}
                label={`${this.props.progress}% labeled`}
              />
            </Col>
            <Col sm={0} />
          </Row>
          <Row>
            <Col>
              <SubmitForm
                imageID={this.props.imageID}
                hand={this.props.hand}
                lastLabeled={this.props.lastLabeled}
                submit={this.state.submit}
                show={false}
                keypoints={this.state.keypoints}
                keypointState={this.state.keypointState}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default LabelView;
