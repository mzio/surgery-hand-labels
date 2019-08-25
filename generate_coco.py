# Generate COCO format from the labeler
import json
import numpy as np
import os.path as osp
import argparse 
import datetime

# generate the relative coordinates of keypoints frames
def _relative_COCO_keypoints(raw):
    src = raw
    dest = np.zeros([21,3])
    for r in range(dest.shape[0]):
        if src[r] is not None:
            v = 1 if src[r]['occluded'] else 2
            x = float(src[r]['position']['left'])
            y = float(src[r]['position']['top'])
        else:
            x = 0; y = 0; v = 0;
        dest[r,:] = [x,y,v]
        
    return dest

# return the num of keypoints that are annotated
def _count_num_keypoints(raw):
    return sum( [not i is None for i in raw] )

def COCO_keypoints(raw,width,height):
    relative_kp = _relative_COCO_keypoints(raw)
    relative_kp[:,0] = relative_kp[:,0]*width
    relative_kp[:,1] = relative_kp[:,1]*height
    relative_kp = relative_kp.reshape(-1,1)
    relative_kp = np.squeeze(relative_kp)
    relative_kp = np.array(relative_kp,dtype=int)
    return list(relative_kp)
# encoder for json
class MyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(MyEncoder, self).default(obj)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--json-file', help='Json file that needs to be transfered to COCO format')
    args = parser.parse_args()
    # load in the json info
    f_json = args.json_file

    with open(f_json,'r') as f:
        kp = json.load(f)
        kp = kp['data']
    
    # basic information
    # Note: the keypoint annotation is one-indexed.
    INFO = {
        "description": "Surgical Keypoints Dataset",
        "url": "",
        "version": "0.1.0",
        "year": 2019,
        "contributor": "Cheng Xiaotian",
        "date_created": datetime.datetime.utcnow().isoformat(' ')
    }
    LICENSES = [
        {
            "id": 1,
            "name": "",
            "url": ""
        }
    ]
    coco_output = {
        "info": INFO,
        "licenses": LICENSES,
        "categories": CATEGORIES,
        "images": [],
        "annotations": []
    }
    edges = np.array([],dtype=np.int)
    edges = np.append(edges,[[i,i+1] for i in range(1,5)])
    edges = np.append(edges,[[i,i+1] for i in range(6,9)])
    edges = np.append(edges,[[i,i+1] for i in range(10,13)])
    edges = np.append(edges,[[i,i+1] for i in range(14,17)])
    edges = np.append(edges,[[i,i+1] for i in range(18,21)])
    edges = np.append(edges,[[1,i] for i in [6,10,14,18]])
    edges = np.array(edges,dtype=int)
    edges = edges.reshape([-1,2])

    CATEGORIES = [
        {
            'id': 1,
            'name': 'hand',
            'supercategory': '',
            'keypoints':[str(i) for i in range(1,22)],
            # note: the skeleton is one-indexed
            'skeleton':[list(edges[r,:]) for r in range(edges.shape[0])]
        }
    ]

    hand_id = 1 
    for image_id,image_info in enumerate(kp):
        # image info:
        if image_id == 0:
            continue
        IMAGE = {}
        IMAGE['id'] = image_id
        IMAGE['file_name'] = image_info['name']
        im = Image.open(osp.join('keypoints_%03d'%i,image_info['name']))
        IMAGE['width'], IMAGE['height'] = im.size
        IMAGE['license'] = 1
        IMAGE['flickr_url'] = ''
        IMAGE['coco_url'] = ''
        IMAGE['date_captured'] = None
        coco_output['images'].append(IMAGE)
        # object_info:
        for hand_relevant_id,hand_info in enumerate(image_info['labels']['keypoints']):
            ANNOTATION = {}
            ANNOTATION['id'] = hand_id
            ANNOTATION['image_id'] = image_id
            ANNOTATION['category_id'] = 1
            ANNOTATION['segmentation'] = []
            ANNOTATION['bbox'] = []
            ANNOTATION['area'] = 0
            ANNOTATION['iscrowd'] = 0
            ANNOTATION['keypoints'] = COCO_keypoints(hand_info['keypoints'],IMAGE['width'],IMAGE['height'])
            # ANNOTATION['keypoints'] = _relative_COCO_keypoints(hand_info['keypoints'])
            ANNOTATION['num_keypoints'] = _count_num_keypoints(hand_info['keypoints'])
            coco_output['annotations'].append(ANNOTATION)
            hand_id = hand_id + 1
    
    # the output-dir of the new json
    f_json_parent_path, _ = osp.split(f_json) 
    f_json_name = osp.basename(f_json[0])
    f_json_name, _ = osp.splitext(f_json_name)
    with open(osp.join(f_json_parent_path, 'coco_output_%03d.json'%i),'w') as f:
        json.dump(coco_output,f,cls=MyEncoder,indent=2)
         
if __name__ == '__main__':
    main()