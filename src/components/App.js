import React, { Component } from "react";
import Header from "./Header";
import LabelViewContainer from "../containers/LabelViewContainer";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.toggleHand = this.toggleHand.bind(this);
    this.state = {
      hand: "left"
    };
  }
  componentDidMount() {
    document.addEventListener("keydown", this.toggleHand);
    console.log(this.props.keypoints);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.toggleHand);
  }

  toggleHand(event) {
    // Mark whether box is right or left hand
    switch (event.keyCode) {
      case 76:
        // console.log("You just pressed L!");
        if (this.state.hand == "right") {
          this.setState({ hand: "left" });
        } else if (this.state.hand == "left") {
          this.setState({ hand: "right" });
        }
        // this.setState({ hand: "left" });
        break;
      case 82:
        // console.log("You just pressed R!"r);
        if (this.state.hand == "left") {
          this.setState({ hand: "right" });
        } else if (this.state.hand == "right") {
          this.setState({ hand: "left" });
        }
        // this.setState({ hand: "right" });
        break;
    }
  }

  render() {
    return (
      <div id="App">
        {this.props.showHeader === true && <Header instruction="hello" />}
        <LabelViewContainer
          imageURL={this.props.imageURL}
          imageID={this.props.imageID}
          showSidePanel={this.props.showSidePanel}
          progress={this.props.progress}
          keypoints={this.props.keypoints}
          hand={this.state.hand}
          lastLabeled={this.props.lastLabeled}
        />
      </div>
    );
  }
}

export default App;
