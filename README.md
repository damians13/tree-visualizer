# Tree visualizer

## Purpose

A tool to help build understanding of tree data structures using interactive visuals.

## Features

### Tree operations

This project currently supports [AVL trees](https://en.wikipedia.org/wiki/AVL_tree), [binary trees](https://en.wikipedia.org/wiki/Binary_tree), [binary search trees](https://en.wikipedia.org/wiki/Binary_search_tree), [custom trees](<https://en.wikipedia.org/wiki/Tree_(data_structure)>), which can be creatued by inserting nodes:\
![Insertion into a binary search tree][bst-insert]

Inserted nodes will automatically conform to whichever tree format you have selected in the bar at the top. To change tree formats, just click and pick another one:\
![Changing the format of the tree][switch-formats]

Note: duplicate values are fine in binary and custom trees, but they will cause problems in AVL or binary search trees.

Delete nodes in any type of tree by clicking on them:\
![Deleting nodes][delete]

Note: this will also delete any child nodes.

AVL trees restructure/[self-balance](https://en.wikipedia.org/wiki/Self-balancing_binary_search_tree) themselves to stick with their format. This is done through rotations, and happens automatically when you try to insert a node that would cause the tree to be out of balance:\
![AVL tree self-balancing][self-balance]

Nodes can be repositioned by dragging them around the page:\
![Nodes being dragged around][moving-nodes]

Trees can be customized in the 'custom' tree format. Click on lines to remove a relationship between nodes, or drag the handle of a node onto another node to form a new relationship between them:\
![Nodes in a custom tree being reordered][custom-reorder]

Doing one of these operations will automatically switch the tree format to 'custom.'

### Traversal visualizations

Traversals of any format of tree (including your very own custom format!) can be visualized in the usual three orders. Simply select a traversal order from the dropdown menu and click 'Traverse':

-   Pre-order
    -   ![Pre-order traversal][pre-order]
-   In-order
    -   ![In-order traversal][in-order]
-   Post-order
    -   ![Post-order traversal][post-order]

## Setup

This project was created using [Node.js](https://nodejs.org/en/), [React.js](https://reactjs.org/), [Create React App](https://github.com/facebook/create-react-app), and [Jest](https://jestjs.io/).

To begin, ensure you have [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed on your local machine.
[Clone](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) the repository (or [download](https://github.com/turtle77777777/tree-visualizer/archive/refs/heads/main.zip) the code) and run:

```
npm install
```

in the project directory.\
That's it! You're ready to start the app as soon as `npm` is finished.

## Starting the app

In the project directory, you can run:

```
npm start
```

This starts the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

[bst-insert]: "https://github.com/turtle77777777/tree-visualizer/blob/main/public/bst-insert.gif?raw=true"
[switch-formats]: "https://github.com/turtle77777777/tree-visualizer/blob/main/public/switch-formats.gif?raw=true"
[delete]: "https://github.com/turtle77777777/tree-visualizer/blob/main/public/delete.gif?raw=true"
[self-balance]: "https://github.com/turtle77777777/tree-visualizer/blob/main/public/self-balance.gif?raw=true"
[moving-nodes]: "https://github.com/turtle77777777/tree-visualizer/blob/main/public/moving-nodes.gif?raw=true"
[custom-reorder]: "https://github.com/turtle77777777/tree-visualizer/blob/main/public/custom-reorder.gif?raw=true"
[pre-order]: "https://github.com/turtle77777777/tree-visualizer/blob/main/public/pre-order.gif?raw=true"
[in-order]: "https://github.com/turtle77777777/tree-visualizer/blob/main/public/in-order.gif?raw=true"
[post-order]: "https://github.com/turtle77777777/tree-visualizer/blob/main/public/post-order.gif?raw=true"
