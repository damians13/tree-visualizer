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
	return [
		node,
		...node.children.reduce(
			(rsf, child) => [...rsf, ...flattenTree(child)],
			[]
		),
	]
}

/**
 * Returns the height of the tree from the given node
 * @param {Object} node
 * @param {Number} row 1 for default
 * @returns {Number} the height of the tree from the given node
 */
export const getTreeHeight = (node, row = 1) => {
	if (typeof node === "undefined") {
		return row - 1
	} else if (node.children.length === 0) {
		return row
	} else {
		return node.children.reduce(
			(rsf, child) => Math.max(rsf, getTreeHeight(child, row + 1)),
			0
		)
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
 * @param {Number?} parentID the id of the parent of the current base node, used for recursion
 * @param {Number?} depth how far down the current tree the new node is being inserted, used for recursion
 * @param {Node} newNode the node to insert, automatically generated but overrideable
 * @returns {Node} the original tree with the new node inserted
 */
export const bstInsert = (
	node,
	value,
	parentID = null,
	depth = 0,
	newNode = {
		value: value,
		id: Math.random(),
		children: [],
		parentID: parentID,
		topOffset: node.topOffset + 40,
		leftOffset: node.leftOffset,
	}
) => {
	let treeViewBox
	if (document.getElementById("treeView") === null) {
		treeViewBox = { top: 0, bottom: 0, left: 0, right: 0 }
	} else {
		treeViewBox = document
			.getElementById("treeView")
			.getBoundingClientRect()
	}

	const nodeClone = JSON.parse(JSON.stringify(node))

	// Check for duplicate
	if (newNode.value === nodeClone.value) return nodeClone

	// Node has no children
	if (nodeClone.children.length === 0) {
		newNode.parentID = node.id
		if (value > node.value) {
			newNode.leftOffset = dimensionClamp(
				node.leftOffset +
					INITIAL_OFFSET_WIDTH / SCALING_FACTOR ** depth,
				treeViewBox.left,
				treeViewBox.right - 50
			)
		} else {
			newNode.leftOffset = dimensionClamp(
				node.leftOffset -
					INITIAL_OFFSET_WIDTH / SCALING_FACTOR ** depth,
				treeViewBox.left,
				treeViewBox.right - 50
			)
		}
		newNode.topOffset = dimensionClamp(
			node.topOffset + INITIAL_OFFSET_HEIGHT,
			treeViewBox.top - 25,
			treeViewBox.bottom - 50
		)

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
		const child = nodeClone.children[0]

		// Insert to right on this node
		if (child.value < node.value && node.value < newNode.value) {
			newNode.parentID = node.id
			newNode.leftOffset = dimensionClamp(
				node.leftOffset +
					INITIAL_OFFSET_WIDTH / SCALING_FACTOR ** depth,
				treeViewBox.left,
				treeViewBox.right - 50
			)
			newNode.topOffset = dimensionClamp(
				node.topOffset + INITIAL_OFFSET_HEIGHT,
				treeViewBox.top - 25,
				treeViewBox.bottom - 50
			)

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
		else if (newNode.value < node.value && node.value < child.value) {
			newNode.parentID = node.id
			newNode.leftOffset = dimensionClamp(
				node.leftOffset -
					INITIAL_OFFSET_WIDTH / SCALING_FACTOR ** depth,
				treeViewBox.left,
				treeViewBox.right - 50
			)
			newNode.topOffset = dimensionClamp(
				node.topOffset + INITIAL_OFFSET_HEIGHT,
				treeViewBox.top - 25,
				treeViewBox.bottom - 50
			)

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
		if (value === null) {
			return {
				value: node.value,
				id: node.id,
				children: [
					bstInsert(child, value, node.id, depth + 1, newNode, true),
				],
				parentID: node.parentID,
				topOffset: node.topOffset,
				leftOffset: node.leftOffset,
			}
		}
		return {
			value: node.value,
			id: node.id,
			children: [bstInsert(child, value, node.id, depth + 1)],
			parentID: node.parentID,
			topOffset: node.topOffset,
			leftOffset: node.leftOffset,
		}
	}

	// Node has two children
	else if (node.children.length === 2) {
		const firstChild = nodeClone.children[0]
		const secondChild = nodeClone.children[1]

		// Insert on right of node (secondChild)
		if (newNode.value > node.value) {
			if (value === null) {
				return {
					value: node.value,
					id: node.id,
					children: [
						firstChild,
						bstInsert(
							secondChild,
							value,
							node.id,
							depth + 1,
							newNode,
							true
						),
					],
					parentID: node.parentID,
					topOffset: node.topOffset,
					leftOffset: node.leftOffset,
				}
			}
			return {
				value: node.value,
				id: node.id,
				children: [
					firstChild,
					bstInsert(secondChild, value, node.id, depth + 1),
				],
				parentID: node.parentID,
				topOffset: node.topOffset,
				leftOffset: node.leftOffset,
			}
		}

		// Insert on left of node (firstChild)
		else if (newNode.value < node.value) {
			if (value === null) {
				return {
					value: node.value,
					id: node.id,
					children: [
						bstInsert(
							firstChild,
							value,
							node.id,
							depth + 1,
							newNode,
							true
						),
						secondChild,
					],
					parentID: node.parentID,
					topOffset: node.topOffset,
					leftOffset: node.leftOffset,
				}
			}
			return {
				value: node.value,
				id: node.id,
				children: [
					bstInsert(firstChild, value, node.id, depth + 1),
					secondChild,
				],
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
 * @returns {Node} the initial node with the new node inserted into a subtree
 */
export const binaryInsert = (node, value) => {
	const newNode = { value: value, id: Math.random(), children: [] }
	let treeViewBox
	if (document.getElementById("treeView") === null) {
		treeViewBox = { top: 0, bottom: 0, left: 0, right: 0 }
	} else {
		treeViewBox = document
			.getElementById("treeView")
			.getBoundingClientRect()
	}

	let visited = []
	let queue = []

	const nodeClone = JSON.parse(JSON.stringify(node))

	visited.push(nodeClone)
	queue.push(nodeClone)

	let i = 0
	while (queue.length > 0) {
		const n = queue.shift()
		i++

		if (n.children.length < 2) {
			newNode.parentID = n.id
			newNode.topOffset = dimensionClamp(
				n.topOffset + INITIAL_OFFSET_HEIGHT,
				treeViewBox.top - 25,
				treeViewBox.bottom - 50
			)

			// Find how deep in the tree we are inserting this node
			let depth = 0
			while (i > 0) {
				i -= 2 ** depth
				depth++
			}

			// If no child is present, insert to the left
			if (n.children.length === 0) {
				newNode.leftOffset = dimensionClamp(
					n.leftOffset -
						INITIAL_OFFSET_WIDTH / SCALING_FACTOR ** (depth - 1),
					treeViewBox.left,
					treeViewBox.right - 50
				)
			}
			// One child, insertion side varies
			else {
				// Present child is to the right, insert to the left
				if (n.children[0].leftOffset > n.leftOffset) {
					newNode.leftOffset = dimensionClamp(
						n.leftOffset -
							INITIAL_OFFSET_WIDTH /
								SCALING_FACTOR ** (depth - 1),
						treeViewBox.left,
						treeViewBox.right - 50
					)
				}
				// Present child is to the left, insert to the right
				else {
					newNode.leftOffset = dimensionClamp(
						n.leftOffset +
							INITIAL_OFFSET_WIDTH /
								SCALING_FACTOR ** (depth - 1),
						treeViewBox.left,
						treeViewBox.right - 50
					)
				}
			}

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

	return nodeClone
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
	else
		return node.children.reduce(
			(rsf, child) => (rsf !== null ? rsf : searchTreeForID(child, id)),
			null
		)
}

/**
 * Performs any necessary rotations on an AVL tree and all subtrees
 * @param {Node} node the node to balance the subtrees of
 * @returns {Node} the given node and all subtrees balanced to match AVL tree format
 */
export const avlBalance = node => {
	if (node.children.length === 0) {
		return node
	} else if (node.children.length === 1) {
		let nodeClone = JSON.parse(JSON.stringify(node))
		// Balance the subtree
		//const balancedChild = avlBalance(nodeClone.children[0])
		const balancedChild = nodeClone.children[0]
		// Perform rotation if necessary
		if (getTreeHeight(balancedChild) > 1) {
			balancedChild.parentID = node.parentID
			nodeClone.children = []
			// Branch right
			if (balancedChild.value > nodeClone.value) {
				// Two children
				if (balancedChild.children.length === 2) {
					// Insert nodeClone to left grandchild
					nodeClone.parentID = balancedChild.children[0].id
					balancedChild.children[0].children.push(nodeClone)
				}
				// Branch right again
				else if (
					balancedChild.children[0].value > balancedChild.value
				) {
					// Insert nodeClone to the left
					nodeClone.parentID = balancedChild.id
					balancedChild.children.unshift(nodeClone)
				}
				// Branch left this time
				else {
					// Insert nodeClone to grandchild
					nodeClone.parentID = balancedChild.children[0].id
					balancedChild.children[0].children.push(nodeClone)
				}
			}
			// Branch left
			else {
				// Two children
				if (balancedChild.children.length === 2) {
					// Insert nodeClone to right grandchild
					nodeClone.parentID = balancedChild.children[1].id
					balancedChild.children[1].children.push(nodeClone)
				}
				// Branch right this time
				else if (
					balancedChild.children[0].value > balancedChild.value
				) {
					// Insert nodeClone to grandchild
					nodeClone.parentID = balancedChild.children[0].id
					balancedChild.children[0].children.push(nodeClone)
				}
				// Branch left again
				else {
					// Insert nodeClone to the right
					nodeClone.parentID = balancedChild.id
					balancedChild.children.push(nodeClone)
				}
			}

			return avlBalance(balancedChild)
		}
		// No rotation needed
		else {
			return nodeClone
		}
	} else if (node.children.length === 2) {
		const nodeClone = JSON.parse(JSON.stringify(node))

		// Balance each subtree
		const balancedLeftChild = avlBalance(nodeClone.children[0])
		const balancedRightChild = avlBalance(nodeClone.children[1])

		let leftHeight, rightHeight
		if (typeof balancedLeftChild === "undefined") {
			leftHeight = 0
		} else {
			leftHeight = getTreeHeight(balancedLeftChild)
		}
		if (typeof balancedRightChild === "undefined") {
			rightHeight = 0
		} else {
			rightHeight = getTreeHeight(balancedRightChild)
		}

		// Left heavy
		if (leftHeight - rightHeight > 1) {
			balancedLeftChild.parentID = node.parentID
			nodeClone.children = nodeClone.children.filter(
				child => child.id !== balancedLeftChild.id
			)

			return avlBalance(
				bstInsert(balancedLeftChild, null, null, 0, nodeClone)
			)
		}
		// Right heavy
		else if (rightHeight - leftHeight > 1) {
			balancedRightChild.parentID = node.parentID
			nodeClone.children = nodeClone.children.filter(
				child => child.id !== balancedRightChild.id
			)

			const inserted = bstInsert(
				balancedRightChild,
				null,
				null,
				0,
				nodeClone
			)
			return avlBalance(inserted)
		}
		// Just right
		else {
			nodeClone.children = [balancedLeftChild, balancedRightChild]
			return nodeClone
		}
	}
}

export const generateLines = node => {
	return node.children.reduce(
		(rsf, child) => [
			...rsf,
			{ parentID: node.id, childID: child.id },
			...generateLines(child),
		],
		[]
	)
}
