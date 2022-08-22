let INITIAL_OFFSET_WIDTH = 200
const INITIAL_OFFSET_HEIGHT = 80
const SCALING_FACTOR = 2

/**
 * An object representing a node in a tree
 * @typedef {Object} Node
 * @property {Number} value - the value of the node
 * @property {Number} id - randomly generated ID unique to the node
 * @property {Node[]} children an array containing all child nodes of this node
 * @property {Number?} parentID the id of the parent of this node, null if no parent
 * @property {Number} topOffset represents the vertical position of this node in the treeView
 * @property {Number} leftOffset represents the horizontal position of this node in the treeView
 */

/**
 * A data structure to represent a parent-child relationship between nodes
 * @typedef {Object} Line
 * @property {Number} parentID the ID of the parent node in the relationship
 * @property {Number} childID the ID of the child node in the relationship
 */

/**
 * A data structure to store data relating to a node's handle drag event
 * @typedef {Object} LineInProgress
 * @property {Node} src the node whose handle is being dragged
 * @property {Number} mouseX the current mouse x coordinate
 * @property {Number} mouseY the current mouse y coordinate
 */

/**
 * Remove the node with the given id from the given list of nodes
 * @param {Node[]} nodes
 * @param {*} id
 * @returns {Node[]} the given list of nodes without the node that has the given ID
 */
export const searchNodesAndRemoveById = (nodes, id) => {
	let filt = nodes.filter(node => node.id !== +id)
	let ret = []
	filt.forEach(node => {
		ret.push({
			value: node.value,
			id: node.id,
			children: searchNodesAndRemoveById(node.children, id),
			parentID: node.parentID,
			topOffset: node.topOffset,
			leftOffset: node.leftOffset,
		})
	})
	return ret
}

/**
 * Flattens the tree from the given node
 * @param {Object} node
 * @returns {Node[]} an array containing every node in the tree in one dimension
 */
export const flattenTree = node => {
	return [node, ...node.children.reduce((rsf, child) => [...rsf, ...flattenTree(child)], [])]
}

/**
 * Returns the height of the tree from the given node
 * @param {Object} node
 * @param {Number} row 1 for default
 * @returns {Number} the height of the tree from the given node
 */
export const getTreeHeight = (node, row = 1) => {
	if (node.children.length === 0) {
		return row
	} else {
		return node.children.reduce((rsf, child) => Math.max(rsf, getTreeHeight(child, row + 1)), 0)
	}
}

/**
 * Clamp the given value between the given minimum and maximum values
 * @param {Number} value
 * @param {Number} min
 * @param {Number} max
 * @returns {Number} the number constrained between the upper and lower limits
 */
export const dimensionClamp = (value, min, max) => {
	return Math.max(min, Math.min(value, max))
}

/**
 * Insert a new node with the given value into the tree based off of the given node and add connecting lines
 * @param {Node} node the base node of the tree to insert the new node into
 * @param {Number} value the value of the new node to insert
 * @param {Line[]} lines the current list of connecting lines
 * @param {function(Line[]): null} lineCallbackFn the function to add a new connecting line
 * @param {Number?} parentID the id of the parent of the current base node, used for recursion
 * @param {Number?} depth how far down the current tree the new node is being inserted, used for recursion
 * @returns {Node} the original tree with the new node inserted
 */
export const bstInsert = (node, value, lines, lineCallbackFn, parentID = null, depth = 0) => {
	const newNode = { value: value, id: Math.random(), children: [], parentID: parentID, topOffset: node.topOffset + 40, leftOffset: node.leftOffset }
	let treeViewBox
	if (document.getElementById("treeView") === null) {
		treeViewBox = { top: 0, bottom: 0, left: 0, right: 0 }
	} else {
		treeViewBox = document.getElementById("treeView").getBoundingClientRect()
	}

	// Check for duplicate
	if (value === node.value) return node

	// Node has no children
	if (node.children.length === 0) {
		newNode.parentID = node.id
		if (value > node.value) {
			newNode.leftOffset = dimensionClamp(node.leftOffset + INITIAL_OFFSET_WIDTH / SCALING_FACTOR ** depth, treeViewBox.left, treeViewBox.right - 50)
		} else {
			newNode.leftOffset = dimensionClamp(node.leftOffset - INITIAL_OFFSET_WIDTH / SCALING_FACTOR ** depth, treeViewBox.left, treeViewBox.right - 50)
		}
		newNode.topOffset = dimensionClamp(node.topOffset + INITIAL_OFFSET_HEIGHT, treeViewBox.top - 25, treeViewBox.bottom - 50)

		// Add a line from the parent node to the new child node
		lineCallbackFn([...lines, { parentID: node.id, childID: newNode.id }])

		return {
			value: node.value,
			id: node.id,
			children: [newNode],
			parentID: node.parentID,
			topOffset: node.topOffset,
			leftOffset: node.leftOffset,
		}
	}

	// Node has one child
	else if (node.children.length === 1) {
		const child = node.children[0]

		// Insert to right on this node
		if (child.value < node.value && node.value < value) {
			newNode.parentID = node.id
			newNode.leftOffset = dimensionClamp(node.leftOffset + INITIAL_OFFSET_WIDTH / SCALING_FACTOR ** depth, treeViewBox.left, treeViewBox.right - 50)
			newNode.topOffset = dimensionClamp(node.topOffset + INITIAL_OFFSET_HEIGHT, treeViewBox.top - 25, treeViewBox.bottom - 50)

			// Add a line from the parent node to the new child node
			lineCallbackFn([...lines, { parentID: node.id, childID: newNode.id }])

			return {
				value: node.value,
				id: node.id,
				children: [child, newNode],
				parentID: node.parentID,
				topOffset: node.topOffset,
				leftOffset: node.leftOffset,
			}
		}
		// Insert to left on this node
		else if (value < node.value && node.value < child.value) {
			newNode.parentID = node.id
			newNode.leftOffset = dimensionClamp(node.leftOffset - INITIAL_OFFSET_WIDTH / SCALING_FACTOR ** depth, treeViewBox.left, treeViewBox.right - 50)
			newNode.topOffset = dimensionClamp(node.topOffset + INITIAL_OFFSET_HEIGHT, treeViewBox.top - 25, treeViewBox.bottom - 50)

			// Add a line from the parent node to the new child node
			lineCallbackFn([...lines, { parentID: node.id, childID: newNode.id }])

			return {
				value: node.value,
				id: node.id,
				children: [newNode, child],
				parentID: node.parentID,
				topOffset: node.topOffset,
				leftOffset: node.leftOffset,
			}
		}
		// Insert on child node
		return {
			value: node.value,
			id: node.id,
			children: [bstInsert(child, value, lines, lineCallbackFn, node.id, depth + 1)],
			parentID: node.parentID,
			topOffset: node.topOffset,
			leftOffset: node.leftOffset,
		}
	}

	// Node has two children
	else if (node.children.length === 2) {
		const firstChild = node.children[0]
		const secondChild = node.children[1]

		// Insert on right of node (secondChild)
		if (value > node.value) {
			return {
				value: node.value,
				id: node.id,
				children: [firstChild, bstInsert(secondChild, value, lines, lineCallbackFn, node.id, depth + 1)],
				parentID: node.parentID,
				topOffset: node.topOffset,
				leftOffset: node.leftOffset,
			}
		}

		// Insert on left of node (firstChild)
		else if (value < node.value) {
			return {
				value: node.value,
				id: node.id,
				children: [bstInsert(firstChild, value, lines, lineCallbackFn, node.id, depth + 1), secondChild],
				parentID: node.parentID,
				topOffset: node.topOffset,
				leftOffset: node.leftOffset,
			}
		}
	}

	// Node is invalid BST
	else {
		console.error("Invalid BST: ")
		console.error(node)
		return node
	}
}

/**
 * Inserts the given node into the given tree in the first valid position given by breadth first search of the tree
 * @param {Node} node the base node of the tree to insert the new node into
 * @param {Number} value the value of the new node to insert
 * @param {Line[]} lines the current list of connecting lines
 * @param {function(Line[]): null} lineCallbackFn the function to add a new connecting line
 */
export const binaryInsert = (node, value, lines, lineCallbackFn) => {
	const newNode = { value: value, id: Math.random(), children: [] }
	let treeViewBox
	if (document.getElementById("treeView") === null) {
		treeViewBox = { top: 0, bottom: 0, left: 0, right: 0 }
	} else {
		treeViewBox = document.getElementById("treeView").getBoundingClientRect()
	}

	let visited = []
	let queue = []

	visited.push(node)
	queue.push(node)

	let i = 0
	while (queue.length > 0) {
		const n = queue.shift()
		i++

		if (n.children.length < 2) {
			newNode.parentID = n.id
			newNode.topOffset = dimensionClamp(n.topOffset + INITIAL_OFFSET_HEIGHT, treeViewBox.top - 25, treeViewBox.bottom - 50)

			// Find how deep in the tree we are inserting this node
			let depth = 0
			while (i > 0) {
				i -= 2 ** depth
				depth++
			}

			// If no child is present, insert to the left
			if (n.children.length === 0) {
				newNode.leftOffset = dimensionClamp(n.leftOffset - INITIAL_OFFSET_WIDTH / SCALING_FACTOR ** (depth - 1), treeViewBox.left, treeViewBox.right - 50)
			}
			// One child, insertion side varies
			else {
				// Present child is to the right, insert to the left
				if (n.children[0].leftOffset > n.leftOffset) {
					newNode.leftOffset = dimensionClamp(n.leftOffset - INITIAL_OFFSET_WIDTH / SCALING_FACTOR ** (depth - 1), treeViewBox.left, treeViewBox.right - 50)
				}
				// Present child is to the left, insert to the right
				else {
					newNode.leftOffset = dimensionClamp(n.leftOffset + INITIAL_OFFSET_WIDTH / SCALING_FACTOR ** (depth - 1), treeViewBox.left, treeViewBox.right - 50)
				}
			}

			lineCallbackFn([...lines, { parentID: n.id, childID: newNode.id }])

			n.children.push(newNode)
			break
		}

		n.children.forEach(child => {
			if (!visited.includes(child)) {
				visited.push(child)
				queue.push(child)
			}
		})
	}
}

/**
 * Returns the node with the given ID if it is in the tree stemming from the given node (depth first search)
 * @param {Node} node the node to search all subtrees of
 * @param {Number} id the ID to search for
 * @returns {Node} the node with the given ID if it is in the tree stemming from the given node (depth first search)
 */
export const searchTreeForID = (node, id) => {
	if (node === undefined) return null
	if (node.id === id) return node
	else return node.children.reduce((rsf, child) => (rsf !== null ? rsf : searchTreeForID(child, id)), null)
}
