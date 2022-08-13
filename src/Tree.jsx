import React, { useReducer, useState } from "react"

let INITIAL_OFFSET_WIDTH = 200
const INITIAL_OFFSET_HEIGHT = 80
const SCALING_FACTOR = 2

const searchNodesAndRemoveById = (nodes, id) => {
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
 * Clamp the given value between the given minimum and maximum values
 * @param {Number} value
 * @param {Number} min
 * @param {Number} max
 * @returns the number constrained between the upper and lower limits
 */
const dimensionClamp = (value, min, max) => {
	return Math.max(min, Math.min(value, max))
}

export const bstInsert = (node, value, lines, lineCallbackFn, parentID = null, depth = 0) => {
	const newNode = { value: value, id: Math.random(), children: [], parentID: parentID, topOffset: node.topOffset + 40, leftOffset: node.leftOffset }
	const treeViewBox = document.getElementById("treeView").getBoundingClientRect()

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
		newNode.topOffset = dimensionClamp(node.topOffset + INITIAL_OFFSET_HEIGHT, treeViewBox.top - 16 - 25, treeViewBox.bottom - 66)

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
			newNode.topOffset = dimensionClamp(node.topOffset + INITIAL_OFFSET_HEIGHT, treeViewBox.top - 16 - 25, treeViewBox.bottom - 66)

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
			newNode.topOffset = dimensionClamp(node.topOffset + INITIAL_OFFSET_HEIGHT, treeViewBox.top - 16 - 25, treeViewBox.bottom - 66)

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
		console.error("Invalid BST: " + node)
		return node
	}
}

/**
 * Flattens the tree from the given node
 * @param {Object} node
 * @returns an array containing every node in the tree in one dimension
 */
const flattenTree = node => {
	return [node, ...node.children.reduce((rsf, child) => [...rsf, ...flattenTree(child)], [])]
}

/**
 * Returns the height of the tree from the given node
 * @param {Object} node
 * @param {Number} row 1 for default
 * @returns
 */
export const getTreeHeight = (node, row = 1) => {
	if (node.children.length === 0) {
		return row
	} else {
		return node.children.reduce((rsf, child) => Math.max(rsf, getTreeHeight(child, row + 1)), 0)
	}
}

const Tree = props => {
	const [viewMode, setViewMode] = useState("bst")
	const [inputText, setInputText] = useState("")
	const [nodes, setNodes] = useState([])
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
	const [lines, setLines] = useState([])
	const [, forceUpdate] = useReducer(x => x + 1, 0)

	const insertBSTNode = value => {
		if (nodes.length === 0) {
			setNodes([
				{
					value: value,
					id: Math.random(),
					children: [],
					parentID: null,
					topOffset: 40,
					leftOffset: (document.getElementById("treeView").clientWidth - 25) / 2,
				},
			])
		} else {
			const newNodes = bstInsert(nodes[0], value, lines, setLines)
			if (nodes.length > 0) setNodes([newNodes])
		}
	}

	const handleViewModeChange = e => {
		setViewMode(e.target.value)
	}

	const handleInputChange = e => {
		setInputText(e.target.value)
	}

	const handleClick = e => {
		setNodes(searchNodesAndRemoveById(nodes, e.target.id))
		setLines(lines.filter(l => l.parentID !== +e.target.id && l.childID !== +e.target.id))
	}

	const handleInsertClick = () => {
		if (inputText === "") return

		// Update the tree nodes and clear the input
		if (viewMode === "bst") {
			insertBSTNode(+inputText)
		}
		setInputText("")
	}

	const handleDragStart = e => {
		setDragOffset({
			x: e.nativeEvent.offsetX,
			y: e.nativeEvent.offsetY,
		})
	}

	const handleDrag = e => {
		// This if statement filters out the last drag event which has coordinates (0, 0)
		if (!(e.clientX === 0 && e.clientY === 0)) {
			// Find the moved node in the tree and update its position
			const flattenedTree = flattenTree(nodes[0])
			const nodeObj = flattenedTree.find(node => node.id === +e.target.id)

			// Keep the node in the treeView area
			const desiredTopOffset = e.pageY - dragOffset.y - 16 - 25
			const desiredLeftOffset = e.pageX - dragOffset.x
			const treeViewBox = document.getElementById("treeView").getBoundingClientRect()
			nodeObj.topOffset = dimensionClamp(desiredTopOffset, treeViewBox.top - 16 - 25, treeViewBox.bottom - 66)
			nodeObj.leftOffset = dimensionClamp(desiredLeftOffset, treeViewBox.left, treeViewBox.right - 50)

			// Re-render the moved node
			forceUpdate()
		}
	}

	return (
		<div id="tree">
			<div className="topBar">
				<input onChange={handleInputChange} value={inputText} />
				<button onClick={handleInsertClick}>Insert</button>
				<button>Search</button>
				<select name="treeMode" value={viewMode} onChange={handleViewModeChange}>
					<option value="bst">Tree format: BST</option>
					<option value="binary">Tree format: Binary</option>
					<option value="custom">Tree format: Custom</option>
				</select>
			</div>
			<div id="treeView">
				{nodes.map(value => (
					<Node onClick={handleClick} onDrag={handleDrag} onDragStart={handleDragStart} for={value} row={1} key={value.value} />
				))}
				<svg>
					{lines.map(l => {
						// Flatten every tree on the page
						let flattenedTree = []
						for (let i = 0; i < nodes.length; i++) {
							flattenedTree.push(...flattenTree(nodes[i]))
						}

						const parent = flattenedTree.find(node => node.id === l.parentID)
						const child = flattenedTree.find(node => node.id === l.childID)

						return <line x1={parent.leftOffset + 25} y1={parent.topOffset + 28} x2={child.leftOffset + 25} y2={child.topOffset + 28} className="line" key={l.parentID + "-" + l.childID} />
					})}
				</svg>
			</div>
		</div>
	)
}

const Node = props => {
	return (
		<>
			<div id={"node_" + props.for.value} className={"node"}>
				<p
					className={"nodeText row" + props.row}
					draggable="true"
					id={props.for.id}
					onClick={props.onClick}
					onDrag={props.onDrag}
					onDragStart={props.onDragStart}
					style={{ top: props.for.topOffset, left: props.for.leftOffset }}
				>
					{props.for.value}
				</p>
			</div>

			{props.for.children.map(value => (
				<Node onClick={props.onClick} onDrag={props.onDrag} onDragStart={props.onDragStart} for={value} row={props.row + 1} key={value.value} />
			))}
		</>
	)
}

export default Tree
