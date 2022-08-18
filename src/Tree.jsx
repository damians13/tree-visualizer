import React, { useReducer, useState } from "react"
import * as Utils from "./TreeUtils"

const Tree = () => {
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
			const newNodes = Utils.bstInsert(nodes[0], value, lines, setLines)
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
		setLines(lines.filter(l => l.parentID !== +e.target.id && l.childID !== +e.target.id))
		setNodes(Utils.searchNodesAndRemoveById(nodes, e.target.id))
	}

	const handleInsertClick = () => {
		if (inputText === "") return

		// Update the tree nodes and clear the input
		if (viewMode === "bst") {
			insertBSTNode(+inputText)
		} else if (viewMode === "binary" || viewMode === "custom") {
			let newNode = { value: +inputText, id: Math.random(), children: [], parentID: null }

			if (nodes.length === 0) {
				newNode.topOffset = 40
				newNode.leftOffset = (document.getElementById("treeView").clientWidth - 25) / 2

				setNodes([newNode])
			} else {
				let allNodes = []
				nodes.forEach(tree => allNodes.push(...Utils.flattenTree(tree)))
				// Check for duplicate entry attempt
				console.log(allNodes)
				if (allNodes.reduce((rsf, node) => rsf || node.value === +inputText, false)) {
					// TODO: Handle duplicate node entry attempt with animation
					console.log("Attempted duplicate entry")
				} else {
					const treeViewBox = document.getElementById("treeView").getBoundingClientRect()
					newNode.topOffset = nodes[nodes.length - 1].topOffset
					newNode.leftOffset = Utils.dimensionClamp(nodes[nodes.length - 1].leftOffset + 80, treeViewBox.left, treeViewBox.right - 50)
					setNodes([...nodes, newNode])
				}
			}
		}
		setInputText("")
	}

	const handleDragStart = e => {
		e.target.classList.add("hidden")

		setDragOffset({
			x: e.nativeEvent.offsetX,
			y: e.nativeEvent.offsetY,
		})
	}

	const handleDragEnd = e => {
		e.target.classList.remove("hidden")
	}

	const handleDrag = e => {
		// This if statement filters out the last drag event which has coordinates (0, 0)
		if (!(e.clientX === 0 && e.clientY === 0)) {
			// Find the moved node in the tree and update its position
			const flattenedTree = Utils.flattenTree(nodes[0])
			const nodeObj = flattenedTree.find(node => node.id === +e.target.id)

			// Keep the node in the treeView area
			const desiredTopOffset = e.pageY - dragOffset.y - 16 - 25
			const desiredLeftOffset = e.pageX - dragOffset.x
			const treeViewBox = document.getElementById("treeView").getBoundingClientRect()
			nodeObj.topOffset = Utils.dimensionClamp(desiredTopOffset, treeViewBox.top - 16 - 25, treeViewBox.bottom - 66)
			nodeObj.leftOffset = Utils.dimensionClamp(desiredLeftOffset, treeViewBox.left, treeViewBox.right - 50)

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
					<option value="redblack">Tree format: Red-Black</option>
					<option value="avl">Tree format: AVL</option>
					<option value="bst">Tree format: BST</option>
					<option value="binary">Tree format: Binary</option>
					<option value="custom">Tree format: Custom</option>
				</select>
			</div>
			<div id="treeView">
				{nodes.map(value => (
					<Node onClick={handleClick} onDrag={handleDrag} onDragStart={handleDragStart} onDragEnd={handleDragEnd} for={value} row={1} key={value.value} />
				))}
				<svg>
					{
						// eslint-disable-next-line
						lines.map(l => {
							// Flatten every tree on the page
							let flattenedTree = []
							for (let i = 0; i < nodes.length; i++) {
								flattenedTree.push(...Utils.flattenTree(nodes[i]))
							}

							const parent = flattenedTree.find(node => node.id === l.parentID)
							const child = flattenedTree.find(node => node.id === l.childID)

							if (parent !== undefined && child !== undefined) {
								return (
									<line
										x1={parent.leftOffset + 25}
										y1={parent.topOffset + 28}
										x2={child.leftOffset + 25}
										y2={child.topOffset + 28}
										className="line"
										key={l.parentID + "-" + l.childID}
									/>
								)
							}
						})
					}
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
					onDragEnd={props.onDragEnd}
					style={{ top: props.for.topOffset, left: props.for.leftOffset }}
				>
					{props.for.value}
				</p>
			</div>

			{props.for.children.map(value => (
				<Node onClick={props.onClick} onDrag={props.onDrag} onDragStart={props.onDragStart} onDragEnd={props.onDragEnd} for={value} row={props.row + 1} key={value.value} />
			))}
		</>
	)
}

export default Tree
