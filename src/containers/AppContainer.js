import React, { Component } from "react";
import axios from "axios";
import App from "../components/App";
import config from "../config";
import queryString from "qs";
import data from "../data";
import { tsImportEqualsDeclaration } from "@babel/types";

function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);

const keypoints = importAll(
  require.context("../keypoints", false, /\.(png|jpe?g|svg)$/)
);

export default class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.loadImageURL = this.loadImageURL.bind(this);
    this.state = { imageURL: null };
  }

  componentDidMount() {
    this.loadImageURL();
  }

  loadImageURL() {
    // var start_ix = data.data[0].last_labeled + 1;
    // console.log(data.data[start_ix]);
    // this.setState({ imageURL: images[start_ix] });
    // // for (var i = 0; i < data.length; i++) {
    // //   if (data[i].labeled == false) {
    // //     console.log(data[i]);
    // //     this.setState({ imageURL: images[i] });
    // //     break;
    // //   }
    // // }
    // // console.log(images[0]["path"]);
    axios
      .get("http://localhost:3001/data")
      .then(res => {
        var lastLabeled;
        if (config.keypoints) {
          lastLabeled = res.data[0].last_labeled_keypoint;
        } else {
          lastLabeled = res.data[0].last_labeled_bounding_box;
        }
        var start_ix = lastLabeled + 1;
        var res_ix = start_ix + 1;
        this.setState({
          imageURL: images[start_ix],
          keypoints: res.data[res_ix].labels.keypoints,
          boundingBoxes: res.data[res_ix].labels.bounding_boxes,
          imageID: res.data[res_ix].id,
          lastLabeled: lastLabeled,
          imageName: res.data[res_ix].name
        });
      })
      .catch(err => {
        console.log("Axios API error!");
        console.log(err);
      });
  }

  render() {
    if (config.keypoints) {
      var start_ix = data.data[0].last_labeled_keypoint + 1;
    } else {
      var start_ix = data.data[0].last_labeled_bounding_box + 1;
    }
    var progress = Math.round((start_ix / (data.data.length - 1)) * 100);

    var finished = progress >= 100 ? true : false;
    console.log(start_ix);

    return (
      <App
        imageURL={this.state.imageURL}
        showSidePanel={true}
        progress={progress}
        keypoints={this.state.keypoints}
        boundingBoxes={this.state.boundingBoxes}
        imageID={this.state.imageID}
        imageName={this.state.imageName}
        lastLabeled={this.state.lastLabeled}
        keypointImages={keypoints}
        modeKeypoints={config.keypoints}
        finished={finished}
        startIx={start_ix}
        // showHeader={true}
      />
    );
  }
}
