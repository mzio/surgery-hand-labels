# Surgery Hands Labeling Tool

A minimal React app for bounding box and hand keypoint annotation of hands in surgical images.

Socially obligated to say this: this project was bootstrapped with `create-react-app`. For more info, see the original project [here](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md).

After git cloning, install ~~all~~ dependencies with: `cd surgery-labels && npm install .`

- Make sure you [have `npm` first](https://www.npmjs.com/get-npm)
- For a list of all dependencies, see `package.json`  

We want to install one dependency globally: `json-server`. This will serve as a makeshift backend server. To do so, run `npm install -g json-server`  
- If you get permission errors, do the following:  
  - Create a directory for global installations: `mkdir ~/.npm-global`  
  - Configure npm to use this new directory path: `npm config set prefix '~/.npm-global'`  
  - Create a new file `~/.profile` and add this line: `export PATH=~/.npm-global/bin:$PATH`  
  - Update system variables with `source ~/.profile`  
  - Should be good to go.   


## Todos

- [ ] Feed in images based on JSON file - JSON file should specify image path, labels (list of annotations: top, down, left, right, right or left hand, keypoints (1 - 23) (can be none))
