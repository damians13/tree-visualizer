import React, { useState } from "react"
import * as Utils from "./TreeUtils"

const TopBar = props => {
	const [inputText, setInputText] = useState("")
	const [traverseMode, setTraverseMode] = useState("pre-order")

	const ANIMATION_TIMEOUT = 1000

	const highlightPreVisitedNode = id => {
		const nodeDiv = document.getElementById(id)
		if (nodeDiv !== null) {
			nodeDiv.children[1].firstChild.classList.add("pre-visit")
		}
	}
	const highlightVisitedNode = id => {
		const nodeDiv = document.getElementById(id)
		if (nodeDiv !== null) {
			nodeDiv.children[1].firstChild.classList.add("visit")
		}
	}

	const unHighlightAllNodes = () => {
		document.querySelectorAll(".pre-visit").forEach(node => {
			node.classList.remove("pre-visit")
		})
		document.querySelectorAll(".visit").forEach(node => {
			node.classList.remove("visit")
		})
		document.querySelectorAll(".post-visit").forEach(node => {
			node.classList.remove("post-visit")
		})
	}

	const traverse = _queue => {
		// Since we will be modifying queue with shift() and unshift(),
		// we need to copy its contents by value so we don't break anything
		// outside of this function
		let queue = JSON.parse(JSON.stringify(_queue))

		const prev = document.querySelector(".visit")
		if (prev !== null) {
			prev.classList.remove("visit")
			prev.classList.add("post-visit")
		}

		if (queue.length === 0) {
			setTimeout(unHighlightAllNodes, ANIMATION_TIMEOUT)
			return
		}

		let node = queue.shift()

		if (traverseMode === "pre-order") {
			if (
				typeof node.children !== "undefined" &&
				node.children.length === 2
			) {
				queue.unshift(node.children[1])
				highlightPreVisitedNode(node.children[1].id)
			}
			if (
				typeof node.children !== "undefined" &&
				node.children.length > 0
			) {
				queue.unshift(node.children[0])
				highlightPreVisitedNode(node.children[0].id)
			}
			//visit node
			highlightVisitedNode(node.id)
		} else if (traverseMode === "in-order") {
			if (
				typeof node.children !== "undefined" &&
				node.children.length === 2
			) {
				queue.unshift(node.children[1])
				highlightPreVisitedNode(node.children[1].id)
			}

			if (
				typeof node.children !== "undefined" &&
				node.children.length > 0
			) {
				//queue node for later
				queue.unshift({
					id: node.id,
					value: node.value,
					leftOffset: node.leftOffset,
					topOffset: node.topOffset,
					children: [],
				})
				highlightPreVisitedNode(node.id)

				//queue left subtree with higher priority
				queue.unshift(node.children[0])
				highlightPreVisitedNode(node.children[0].id)
			} else {
				//visit node
				highlightVisitedNode(node.id)
			}
		} else if (traverseMode === "post-order") {
			if (
				typeof node.children !== "undefined" &&
				node.children.length > 0
			) {
				//queue node for later
				queue.unshift({
					id: node.id,
					value: node.value,
					leftOffset: node.leftOffset,
					topOffset: node.topOffset,
					children: [],
				})
				highlightPreVisitedNode(node.id)

				if (
					typeof node.children !== "undefined" &&
					node.children.length === 2
				) {
					// queue right subtree before node if applicable
					queue.unshift(node.children[1])
					highlightPreVisitedNode(node.children[1].id)
				}
				//queue left subtree with higher priority
				queue.unshift(node.children[0])
				highlightPreVisitedNode(node.children[0].id)
			} else {
				//visit node
				highlightVisitedNode(node.id)
			}
		} else {
			console.error("Invalid traverseMode: " + traverseMode)
		}

		//trigger recursion
		setTimeout(() => {
			traverse(queue)
		}, ANIMATION_TIMEOUT)
	}

	const handleTraverseModeChange = e => {
		setTraverseMode(e.target.value)
	}

	const handleViewModeChange = e => {
		props.setViewMode(e.target.value)
	}

	const handleTraverseClick = e => {
		traverse(props.nodes)
	}

	const handleInputChange = e => {
		// Verify input is numeric before accepting update
		const inputRegex = /(?:-?\d*(?:\.\d*)?)?/
		const matches = e.target.value.match(inputRegex)

		if (matches !== null && e.target.value.length === matches[0].length) {
			setInputText(e.target.value)
		}
	}

	const handleKeyDown = e => {
		if (e.code === "Enter") handleInsertClick()
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
		if (inputText === "" || inputText === "-") return

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
			<div id="input">
				<input
					className="topRow"
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					value={inputText}
					placeholder="Enter node value (ex. 4, 53)"
				/>
				<button className="topRow" onClick={handleInsertClick}>
					Insert
				</button>
			</div>
			<div id="traverse">
				<select
					name="traverseMode"
					value={traverseMode}
					onChange={handleTraverseModeChange}
					className="topRow"
				>
					<option value="pre-order">Pre-order traversal</option>
					<option value="in-order">In-order traversal</option>
					<option value="post-order">Post-order traversal</option>
				</select>
				<button className="topRow" onClick={handleTraverseClick}>
					Traverse
				</button>
			</div>
			<select
				name="treeMode"
				value={props.viewMode}
				onChange={handleViewModeChange}
				className="topRow"
			>
				<option value="avl">Tree format: AVL</option>
				<option value="binary">Tree format: Binary</option>
				<option value="bst">Tree format: BST</option>
				<option value="custom">Tree format: Custom</option>
			</select>
		</div>
	)
}

export default TopBar
