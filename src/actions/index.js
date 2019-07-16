// Bounding Boxes
export const addBox = (id, position, hand) => {
  return {
    type: "ADD_BOX",
    id: id,
    position,
    hand: hand
  };
};

export const deleteBox = id => {
  return {
    type: "DELETE_BOX",
    id: id
  };
};

/**
 * Update position of an existing box.
 * @param {int} id
 * @param {Object} position
 */
export const updateBox = (id, position) => {
  return {
    type: "UPDATE_BOX",
    id: id,
    position
  };
};

// Keypoints
export const addKeypoint = (
  id,
  position,
  hand,
  handId,
  keypointIndex,
  occluded
) => {
  return {
    type: "ADD_KEYPOINT",
    id: id,
    position,
    hand: hand,
    handId: handId,
    keypointIndex: keypointIndex,
    occluded: occluded
  };
};

export const deleteKeypoint = id => {
  return {
    type: "DELETE_KEYPOINT",
    id: id
  };
};

export const updateKeypoint = (
  id,
  position,
  hand,
  handId,
  keypointIndex,
  occluded
) => {
  return {
    type: "UPDATE_KEYPOINT",
    id: id,
    position,
    hand: hand,
    handId: handId,
    keypointIndex: keypointIndex,
    occluded: occluded
  };
};

export const setImageProps = (height, width, offsetX, offsetY) => {
  return {
    type: "SET_IMAGE_PROPS",
    height,
    width,
    offsetX,
    offsetY
  };
};
