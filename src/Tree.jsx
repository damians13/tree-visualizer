import React, { useEffect, useState } from "react"

const exampleBSTInArray = [
	{
		value: 6,
		id: Math.random(),
		children: [
			{ value: 5, id: Math.random(), children: [{ value: 1, id: Math.random(), children: [] }] },
			{
				value: 8,
				id: Math.random(),
				children: [
					{ value: 7, id: Math.random(), children: [] },
					{ value: 9, id: Math.random(), children: [] },
				],
			},
		],
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
		})
	})
	return ret
}

/**
 * Determines the horizontal offset of each node in a given binary tree
 * @param {Object} node - is the first node of the binary tree
 * @param {Number} node.id - the ID of the node
 * @param {Number} offset is the offset of the node, 0 for initial call
 * @param {Number} depth is how far down the current node is in the tree, 0 for initial call
 * @return {Array} An array of objects with corresponding node IDs and horizontal offsets
 */
export const determineXOffsetBT = (node, offset = 0, depth = 0) => {
	if (node === undefined) return []

	const INITIAL_OFFSET_WIDTH = 80
	const SCALING_FACTOR = 2

	const offsetChange = INITIAL_OFFSET_WIDTH / SCALING_FACTOR ** depth

	return [
		{
			value: node.value, // For debug
			id: node.id,
			offset: offset,
		},
		...determineXOffsetBT(node.children[0], offset - offsetChange, depth + 1),
		...determineXOffsetBT(node.children[1], offset + offsetChange, depth + 1),
	]
}

export const bstInsert = (node, value) => {
	const newNode = { value: value, id: Math.random(), children: [] }

	// Check for duplicate
	if (value === node.value) return node

	// Node has no children
	if (node.children.length === 0) {
		return {
			value: node.value,
			id: node.id,
			children: [newNode],
		}
	}

	// Node has one child
	else if (node.children.length === 1) {
		const child = node.children[0]

		// Insert to right on this node
		if (child.value < node.value && node.value < value) {
			return {
				value: node.value,
				id: node.id,
				children: [child, newNode],
			}
		}
		// Insert to left on this node
		else if (value < node.value && node.value < child.value) {
			return {
				value: node.value,
				id: node.id,
				children: [newNode, child],
			}
		}
		// Insert on child node
		return {
			value: node.value,
			id: node.id,
			children: [bstInsert(child, value)],
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
				children: [firstChild, bstInsert(secondChild, value)],
			}
		}

		// Insert on left of node (firstChild)
		else if (value < node.value) {
			return {
				value: node.value,
				id: node.id,
				children: [bstInsert(firstChild, value), secondChild],
			}
		}
	}

	// Node is invalid BST
	else {
		console.error("Invalid BST: " + node)
		return node
	}
}

const Tree = props => {
	const [viewMode, setViewMode] = useState("bst")
	const [inputText, setInputText] = useState("")
	const [nodes, setNodes] = useState(exampleBSTInArray)
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
	const [numericOnly, setNumericOnly] = useState(true)
	const [offsets, setOffsets] = useState([])

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
			else
				setNodes([
					{
						value: +inputText,
						id: Math.random(),
						children: [],
					},
				])
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
			e.target.style.left = e.pageX - dragOffset.x + "px"
			e.target.style.top = e.pageY - dragOffset.y - 16 + "px"
		}
	}

	// Check if the nodes are numeric only whenever they are updated
	useEffect(() => {
		// TODO: Redo this with the new node model

		const numericOnlyViewModes = ["bst"]
		const willBeNumericOnly = nodes.reduce((rsf, value) => rsf && !isNaN(+value), true)

		// Switch view mode if necessary
		if (numericOnly && !willBeNumericOnly && numericOnlyViewModes.reduce((rsf, value) => rsf || value === viewMode, false)) {
			//setViewMode("custom") // change this to highlight the viewmodel in red, disable the insert and search buttons, and provide a tooltop
			//document.getElementsByName("treeMode")[0].animate([{ color: "red" }, { color: "black" }], { duration: 1000 })
		}

		// Update whether the tree is entirely numeric or not
		setNumericOnly(willBeNumericOnly)

		if (viewMode === "bst") setOffsets(determineXOffsetBT(nodes[0], +document.getElementById(nodes[0].id).style.left.split("px")[0]))

		// eslint-disable-next-line
	}, [nodes])
	useEffect(() => {
		console.log(offsets)
	}, [offsets])

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
						leftOffset={offsets.reduce((rsf, pair) => (pair.id === value.id ? pair.offset : rsf), undefined)}
						nodes={nodes}
						offsets={offsets}
						key={value.value}
					/>
				))}
			</div>
		</div>
	)
}

// TODO: Remove the determineXOffsetBT() function and move the functionality into the Node function, cleanup the props as well

const Node = props => {
	return (
		<>
			<div id={"node_" + props.for.value} className={"node"}>
				<p
					className="nodeText"
					draggable="true"
					id={props.for.id}
					onClick={props.onClick}
					onDrag={props.onDrag}
					onDragStart={props.onDragStart}
					style={{ top: props.row * 40 + document.getElementById(props.nodes[0].id).style.top.split("px")[0], left: props.leftOffset }}
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
					leftOffset={props.offsets.reduce((rsf, pair) => (pair.id === value.id ? pair.offset : rsf), undefined)}
					nodes={props.nodes}
					offsets={props.offsets}
					key={value.value}
				/>
			))}
		</>
	)
}

export default Tree
