import React, { useState } from "react"
import * as Utils from "./TreeUtils"

const TopBar = props => {
	const [inputText, setInputText] = useState("")

	const handleViewModeChange = e => {
		props.setViewMode(e.target.value)
	}

	const handleInputChange = e => {
		// Verify input is numeric before accepting update
		const inputRegex = /(?:\d+(?:\.\d*)?)?/
		const matches = e.target.value.match(inputRegex)

		if (matches !== null && e.target.value.length === matches[0].length) {
			setInputText(e.target.value)
		}
	}

	const insertBSTNode = value => {
		if (props.nodes.length === 0) {
			let newNode = {
				value: value,
				id: Math.random(),
				children: [],
				parentID: null,
			}
			newNode.topOffset = 40
			newNode.leftOffset =
				(document.getElementById("treeView").clientWidth - 25) / 2

			props.setNodes([newNode])
		} else {
			const newNode = Utils.bstInsert(props.nodes[0], value)

			props.setNodes([newNode])
			props.setLines(Utils.generateLines(newNode))
		}
	}

	const insertBinaryNode = value => {
		if (props.nodes.length === 0) {
			let newNode = {
				value: value,
				id: Math.random(),
				children: [],
				parentID: null,
			}
			newNode.topOffset = 40
			newNode.leftOffset =
				(document.getElementById("treeView").clientWidth - 25) / 2

			props.setNodes([newNode])
		} else {
			// This function updates nodes and has a callback to setLines, so there is no need to call setNodes
			const newNode = Utils.binaryInsert(props.nodes[0], value)

			props.setNodes([newNode])
			props.setLines(Utils.generateLines(newNode))
		}
	}

	const insertAVLNode = value => {
		if (props.nodes.length === 0) {
			let newNode = {
				value: value,
				id: Math.random(),
				children: [],
				parentID: null,
			}
			newNode.topOffset = 40
			newNode.leftOffset =
				(document.getElementById("treeView").clientWidth - 25) / 2

			props.setNodes([newNode])
		} else {
			const inserted = Utils.bstInsert(props.nodes[0], value)
			const newNode = Utils.avlBalance(inserted)

			props.setNodes([newNode])
			props.setLines(Utils.generateLines(newNode))
		}
	}

	const insertCustomNode = value => {
		let newNode = {
			value: value,
			id: Math.random(),
			children: [],
			parentID: null,
		}

		if (props.nodes.length === 0) {
			newNode.topOffset = 40
			newNode.leftOffset =
				(document.getElementById("treeView").clientWidth - 25) / 2

			props.setNodes([newNode])
		} else {
			let allNodes = []
			props.nodes.forEach(tree =>
				allNodes.push(...Utils.flattenTree(tree))
			)
			// Check for duplicate entry attempt
			if (
				allNodes.reduce(
					(rsf, node) => rsf || node.value === value,
					false
				)
			) {
				// TODO: Handle duplicate node entry attempt with animation
				console.log("Attempted duplicate entry")
			} else {
				const treeViewBox = document
					.getElementById("treeView")
					.getBoundingClientRect()
				newNode.topOffset =
					props.nodes[props.nodes.length - 1].topOffset
				newNode.leftOffset = Utils.dimensionClamp(
					props.nodes[props.nodes.length - 1].leftOffset + 80,
					treeViewBox.left,
					treeViewBox.right - 50
				)
				props.setNodes([...props.nodes, newNode])
			}
		}
	}

	const handleInsertClick = () => {
		if (inputText === "") return

		// Update the tree nodes
		if (props.viewMode === "bst") {
			insertBSTNode(+inputText)
		} else if (props.viewMode === "binary") {
			insertBinaryNode(+inputText)
		} else if (props.viewMode === "avl") {
			insertAVLNode(+inputText)
		} else if (props.viewMode === "custom") {
			insertCustomNode(+inputText)
		}
		// Clear the input text bar
		setInputText("")
	}

	return (
		<div className="topBar">
			<input onChange={handleInputChange} value={inputText} />
			<button onClick={handleInsertClick}>Insert</button>
			<button>Search</button>
			<select
				name="treeMode"
				value={props.viewMode}
				onChange={handleViewModeChange}
			>
				<option value="redblack">Tree format: Red-Black</option>
				<option value="avl">Tree format: AVL</option>
				<option value="bst">Tree format: BST</option>
				<option value="binary">Tree format: Binary</option>
				<option value="custom">Tree format: Custom</option>
			</select>
		</div>
	)
}

export default TopBar
