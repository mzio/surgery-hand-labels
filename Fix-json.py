# Fix the bugs caused by Labeler
import json
import numpy as np
import os.path as osp
import argparse 

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--json-file', help='Json file that needs to be modified')
    args = parser.parse_args()
    
    f_json = args.json_file

    with open(f_json,'r') as f:
        kp = json.load(f)
        kp = kp['data']

    img_names = []
    for image_id,image_info in enumerate(kp):
        if image_id == 0:
            continue
        img_names.append(image_info['name'])
    img_names.sort()

    for j in range(len(kp)):
        if j > 0:
            kp[j]['name'] = img_names[j - 1]
    # the output-dir of the new json
    f_json_parent_path, _ = osp.split(f_json) 
    f_json_name = osp.basename(f_json[0])
    f_json_name, _ = osp.splitext(f_json_name)
    
    with open(osp.join(f_json_parent_path, f_json_name + '_fixed.json'),'w') as f:
        kp_raw = {"data":kp}
        json.dump(kp_raw,f,indent=2)
        
if __name__ == '__main__':
    main()
