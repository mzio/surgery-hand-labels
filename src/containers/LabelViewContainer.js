import { connect } from "react-redux";
import { ActionCreators as UndoActionCreators } from "redux-undo";
import LabelView from "../components/LabelView";
import {
  addBox,
  addKeypoint,
  updateKeypoint,
  deleteKeypoint
} from "../actions";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

// convert JSON key-value pairs of boxes to Array
const preprocess = boxes => {
  return Object.keys(boxes).reduce((result, key) => {
    result.push(boxes[key]);
    return result;
  }, []);
};

const mapStateToProps = (state, ownProps) => {
  const committedBoxesArray = preprocess(state.turktool.committedBoxes.present);
  const committedKeypointsArray = preprocess(
    state.turktool.committedKeypoints.present
  );
  return {
    committedBoxes: committedBoxesArray,
    committedKeypoints: committedKeypointsArray,
    imageURL: ownProps.imageURL,
    imageProps: state.turktool.imageProps,
    canUndo: state.turktool.committedBoxes.past.length > 0,
    canRedo: state.turktool.committedBoxes.future.length > 0,
    canUndoKeypoint: state.turktool.committedKeypoints.past.length > 0,
    canRedoKeypoint: state.turktool.committedKeypoints.future.length > 0,
    taskId: ownProps.taskId,
    hand: ownProps.hand,
    boundingBoxes: ownProps.boundingBoxes
  };
};

const mapDispatchToProps = dispatch => {
  return {
    commitDrawingAsBox: (id, position, hand) => {
      dispatch(addBox(id, position, hand));
    },
    commitDrawingAsKeypoint: (
      id,
      position,
      hand,
      handId,
      keypointIndex,
      occluded
    ) => {
      dispatch(
        addKeypoint(id, position, hand, handId, keypointIndex, occluded)
      );
    },
    updateDrawingAsKeypoint: (
      id,
      position,
      hand,
      handId,
      keypointIndex,
      occluded
    ) => {
      dispatch(
        updateKeypoint(id, position, hand, handId, keypointIndex, occluded)
      );
    },
    deleteDrawingAsKeypoint: id => {
      dispatch(deleteKeypoint(id));
    },
    onUndo: () => dispatch(UndoActionCreators.undo()),
    onRedo: () => dispatch(UndoActionCreators.redo()),
    onUndoKeypoint: () => dispatch(UndoActionCreators.undo()),
    onRedoKeypoint: () => dispatch(UndoActionCreators.redo())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LabelView);
