import undoable, { distinctState } from "redux-undo";

const keypoints = (state = {}, action) => {
  switch (action.type) {
    // add new keypoint to the Redux store (belongs to a hand)
    case "ADD_KEYPOINT":
      let newId = action.id;
      return {
        ...state,
        [newId]: {
          id: newId,
          position: action.position, // coordinates
          hand: action.hand, // left or right
          handId: action.handId, // hand that it belongs to
          keypointIndex: action.keypointIndex, // 0 - 20
          occluded: action.occluded
        }
      };

    // delete an existing keypoint from the Redux store
    case "DELETE_KEYPOINT":
      let deleteId = action.id.toString();
      return Object.keys(state).reduce((result, key) => {
        if (key !== deleteId) {
          result[key] = state[key];
        }
        return result;
      }, {});

    // update the position of an existing keypoint in the Redux store
    case "UPDATE_KEYPOINT":
      let updateId = action.id;
      return Object.keys(state).reduce((result, key) => {
        if (key === updateId) {
          let keypoint = state[key];
          result[key] = {
            ...keypoint,
            position: action.position,
            hand: action.hand, // left or right
            handId: action.handId, // hand that it belongs to
            keypointIndex: action.keypointIndex, // 0 - 20
            occluded: action.occluded
          };
        } else {
          result[key] = state[key];
        }
        return result;
      }, {});

    default:
      return state;
  }
};

const undoableKeypoints = undoable(keypoints, {
  filter: distinctState()
});

export default undoableKeypoints;
