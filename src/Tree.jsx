import React, { useState } from "react"

const INITIAL_OFFSET_WIDTH = 80
const INITIAL_OFFSET_HEIGHT = 40
const SCALING_FACTOR = 2

const id1 = Math.random()
const id2 = Math.random()
const id3 = Math.random()

const exampleBSTInArray = [
	{
		value: 6,
		id: id1,
		children: [
			{ value: 5, id: id2, children: [{ value: 1, id: Math.random(), children: [], parentID: id2, topOffset: 120, leftOffset: 80 }], parentID: id1, topOffset: 80, leftOffset: 120 },
			{
				value: 8,
				id: id3,
				children: [
					{ value: 7, id: Math.random(), children: [], parentID: id3, topOffset: 120, leftOffset: 240 },
					{ value: 9, id: Math.random(), children: [], parentID: id3, topOffset: 120, leftOffset: 320 },
				],
				parentID: id1,
				topOffset: 80,
				leftOffset: 280
			},
		],
		parentID: null,
		topOffset: 40,
		leftOffset: 200
	},
]

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
			leftOffset: node.leftOffset
		})
	})
	return ret
}

export const bstInsert = (node, value, parentID=null, depth=0) => {
	const newNode = { value: value, id: Math.random(), children: [], parentID: parentID, topOffset: node.topOffset + 40, leftOffset: node.leftOffset }

	// Check for duplicate
	if (value === node.value) return node

	// Node has no children
	if (node.children.length === 0) {
		newNode.parentID = node.id
		if (value > node.value) {
			newNode.leftOffset = node.leftOffset + INITIAL_OFFSET_WIDTH / SCALING_FACTOR ** depth
		} else {
			newNode.leftOffset = node.leftOffset - INITIAL_OFFSET_WIDTH / SCALING_FACTOR ** depth
		}
		newNode.topOffset = node.topOffset + INITIAL_OFFSET_HEIGHT
		return {
			value: node.value,
			id: node.id,
			children: [newNode],
			parentID: node.parentID,
			topOffset: node.topOffset,
			leftOffset: node.leftOffset
		}
	}

	// Node has one child
	else if (node.children.length === 1) {
		const child = node.children[0]

		// Insert to right on this node
		if (child.value < node.value && node.value < value) {
			newNode.parentID = node.id
			newNode.leftOffset = node.leftOffset + INITIAL_OFFSET_WIDTH / SCALING_FACTOR ** depth
			newNode.topOffset = node.topOffset + INITIAL_OFFSET_HEIGHT
			return {
				value: node.value,
				id: node.id,
				children: [child, newNode],
				parentID: node.parentID,
				topOffset: node.topOffset,
				leftOffset: node.leftOffset
			}
		}
		// Insert to left on this node
		else if (value < node.value && node.value < child.value) {
			newNode.parentID = node.id
			newNode.leftOffset = node.leftOffset - INITIAL_OFFSET_WIDTH / SCALING_FACTOR ** depth
			newNode.topOffset = node.topOffset + INITIAL_OFFSET_HEIGHT
			return {
				value: node.value,
				id: node.id,
				children: [newNode, child],
				parentID: node.parentID,
				topOffset: node.topOffset,
				leftOffset: node.leftOffset
			}
		}
		// Insert on child node
		return {
			value: node.value,
			id: node.id,
			children: [bstInsert(child, value, node.id, depth + 1)],
			parentID: node.parentID,
			topOffset: node.topOffset,
			leftOffset: node.leftOffset
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
				children: [firstChild, bstInsert(secondChild, value, node.id, depth + 1)],
				parentID: node.parentID,
				topOffset: node.topOffset,
				leftOffset: node.leftOffset
			}
		}

		// Insert on left of node (firstChild)
		else if (value < node.value) {
			return {
				value: node.value,
				id: node.id,
				children: [bstInsert(firstChild, value, node.id, depth + 1), secondChild],
				parentID: node.parentID,
				topOffset: node.topOffset,
				leftOffset: node.leftOffset
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

const Tree = props => {
	const [viewMode, setViewMode] = useState("bst")
	const [inputText, setInputText] = useState("")
	const [nodes, setNodes] = useState(exampleBSTInArray)
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
	const [dragCoordinates, setDragCoordinates] = useState({ x: 0, y: 0 })

	const handleViewModeChange = e => {
		setViewMode(e.target.value)
	}

	const handleInputChange = e => {
		setInputText(e.target.value)
	}

	const handleClick = e => {
		setNodes(searchNodesAndRemoveById(nodes, e.target.id))
	}

	const handleInsertClick = () => {
		if (inputText === "") return

		// Update the tree nodes and clear the input
		if (viewMode === "bst") {
			if (nodes.length > 0) setNodes([bstInsert(nodes[0], +inputText)])
			else {
				setNodes([
					{
						value: +inputText,
						id: Math.random(),
						children: [],
						parentID: null,
						topOffset: 40,
						leftOffset: 200
					},
				])
			}
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
			const flattenedTree = flattenTree(nodes[0])
			const nodeObj = flattenedTree.find(node => node.id === +e.target.id)
			nodeObj.topOffset = e.pageY - dragOffset.y - 16
			nodeObj.leftOffset = e.pageX - dragOffset.x
		}

		setDragCoordinates({ x: e.clientX, y: e.clientY })
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
					<Node
						onClick={handleClick}
						onDrag={handleDrag}
						onDragStart={handleDragStart}
						for={value}
						row={1}
						key={value.value}
					/>
				))}
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
				<Node
					onClick={props.onClick}
					onDrag={props.onDrag}
					onDragStart={props.onDragStart}
					for={value}
					row={props.row + 1}
					key={value.value}
				/>
			))}
		</>
	)
}

export default Tree
