"""
After saving images to ./src/images, run this script to prepare images
for annotation. Creates a data.json file to load frames and store
annotations.
"""

from os import listdir
from os.path import isfile, join

import json
import argparse

import random


def create_image_object(name, path, ix, keypoint=False):
    """
    Create image dict / json object
    - labels should be list of individual labels
    """
    return {'id': ix,
            'name': name,
            'path': path,
            'labels': {
                'bounding_boxes': [],
                'keypoints': []
            },
            'annotator_id': '',
            'image_dimensions': {  # May be redundant
                'bounding_boxes': [],
                'keypoints': [],
            },
            'no_hands': False}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Surgery Labels Data Prep')
    parser.add_argument('-p', '--path', default='src/images',
                        type=str, help='Path to images file')
    parser.add_argument('-kpr', '--keypoints_ratio', default=0.5, type=float,
                        help='Ratio of images to annotate bounding boxes and keypoint labels')
    parser.add_argument('-sp', '--save', default='src/data.json', type=str,
                        help='Save path for json data file')
    parser.add_argument('-s', '--seed', default=42,
                        type=int, help='Random seed')
    parser.add_argument('-i', '--index', default=0,
                        type=int, help='Number to start for data id labeling')
    args = parser.parse_args()

    images = [f for f in listdir(args.path) if isfile(join(args.path, f))]

    # Get indexes for frames to also require keypoint annotation
    num_keypoints = int(len(images) * args.keypoints_ratio)
    random.seed(args.seed)
    ix_keypoints = random.sample(range(len(images)), num_keypoints)

    image_path = args.path

    data = {'data': [{'id': "labeled_index",
                      'last_labeled_bounding_box': -1,
                      'last_labeled_keypoint': -1,
                      'bounding_box_done': False,
                      'keypoints_done': False,
                      'folder_name': "",
                      'your_name': ""}]}
    start_ix = args.index
    for ix, image in enumerate(images):
        name = image  # for now just keep original image name
        # This is relatively bad
        path = '../images/{}'.format(image)
        keypoint = True if ix in ix_keypoints else False
        data['data'].append(create_image_object(
            image, path, start_ix, keypoint))
        start_ix += 1

    with open(args.save, 'w') as f:
        json.dump(data, f, indent=2)
        print('{} files configured to {}!'.format(start_ix, args.save))
