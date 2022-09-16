import React, { useReducer, useState } from "react"
import * as Utils from "./TreeUtils"
import Node from "./Node"
import { useEffect } from "react"

const Tree = props => {
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
	const [lineInProgress, setLineInProgress] = useState()
	const [, forceUpdate] = useReducer(x => x + 1, 0)
	// Seed ensures that all nodes re-render when a new node is added to preserve consistency in their props
	const [seed, setSeed] = useState(Math.random())

	const handleNodeClick = e => {
		props.setLines(
			props.lines.filter(
				l =>
					l.parentID !== +e.target.parentNode.parentNode.id &&
					l.childID !== +e.target.parentNode.parentNode.id
			)
		)
		props.setNodes(
			Utils.searchNodesAndRemoveById(
				props.nodes,
				e.target.parentNode.parentNode.id
			)
		)
	}

	const handleLineClick = e => {
		// Find IDs of parent and child nodes connecting to the clicked line
		const [parentID, childID] = e.target.id.split("-")
		// Since there is no guarantee we have a structured tree, gather all nodes in an array
		let allNodes = []
		props.nodes.forEach(tree => allNodes.push(...Utils.flattenTree(tree)))
		// Find node object corresponding to the child connected to the clicked line
		const childNode = allNodes.find(node => node.id === +childID)

		// Switch viewMode if currently in a structured tree mode
		if (
			props.viewMode === "bst" ||
			props.viewMode === "avl" ||
			props.viewMode === "redblack" ||
			props.viewMode === "binary"
		) {
			props.setViewMode("custom")
		}
		// Re-structure the nodes state and remove the clicked line
		const removed = Utils.searchNodesAndRemoveById(props.nodes, childID)
		childNode.parentID = null
		props.setNodes([...removed, childNode])
		props.setLines(
			props.lines.filter(
				line => line.childID !== +childID || line.parentID !== +parentID
			)
		)
	}

	const handleLineInProgressClick = () => {
		// This shouldn't be necessary, but it is here just in case
		setLineInProgress()
	}

	const handleDragStart = e => {
		setDragOffset({
			x: e.nativeEvent.offsetX,
			y: e.nativeEvent.offsetY,
		})
	}

	useEffect(() => {
		setSeed(Math.random())
	}, [props.nodes])

	const handleDragEnd = e => {}

	const handleDrag = e => {
		// This if statement filters out the last drag event which has coordinates (0, 0)
		if (!(e.clientX === 0 && e.clientY === 0)) {
			// Find the moved node in the tree and update its position
			let allNodes = []
			props.nodes.forEach(tree =>
				allNodes.push(...Utils.flattenTree(tree))
			)
			const nodeObj = allNodes.find(
				node => node.id === +e.target.parentNode.parentNode.id
			)

			// Keep the node in the treeView area
			const desiredTopOffset = e.pageY - dragOffset.y - 25
			const desiredLeftOffset = e.pageX - dragOffset.x
			const treeViewBox = document
				.getElementById("treeView")
				.getBoundingClientRect()
			nodeObj.topOffset = Utils.dimensionClamp(
				desiredTopOffset,
				treeViewBox.top - 25,
				treeViewBox.bottom - 50
			)
			nodeObj.leftOffset = Utils.dimensionClamp(
				desiredLeftOffset,
				treeViewBox.left,
				treeViewBox.right - 50
			)

			// Re-render the moved node
			forceUpdate()
		}
	}

	return (
		<div id="tree">
			<div id="treeView">
				{props.nodes.map(value => (
					<Node
						onClick={handleNodeClick}
						onDrag={handleDrag}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
						for={value}
						row={1}
						key={value.id + seed}
						viewMode={props.viewMode}
						stateData={{
							nodes: props.nodes,
							setNodes: props.setNodes,
							lines: props.lines,
							setLines: props.setLines,
							setLineInProgress: setLineInProgress,
						}}
					/>
				))}
				<svg>
					{props.lines.map(l => {
						// Flatten every tree on the page
						let flattenedTree = []
						for (let i = 0; i < props.nodes.length; i++) {
							flattenedTree.push(
								...Utils.flattenTree(props.nodes[i])
							)
						}

						const parent = flattenedTree.find(
							node => node.id === l.parentID
						)
						const child = flattenedTree.find(
							node => node.id === l.childID
						)

						if (parent !== undefined && child !== undefined) {
							return (
								<line
									onClick={handleLineClick}
									x1={parent.leftOffset + 25}
									y1={parent.topOffset + 12}
									x2={child.leftOffset + 25}
									y2={child.topOffset + 12}
									className="line"
									id={l.parentID + "-" + l.childID}
									key={l.parentID + "-" + l.childID}
								/>
							)
						}
						return <></>
					})}

					{lineInProgress !== undefined && (
						<line
							onClick={handleLineInProgressClick}
							x1={lineInProgress.src.leftOffset + 25}
							y1={lineInProgress.src.topOffset + 12}
							x2={lineInProgress.mouseX}
							y2={lineInProgress.mouseY}
							className="line inProgress"
							key={"mouse-drag-" + lineInProgress.src.id}
						/>
					)}
				</svg>
			</div>
		</div>
	)
}

export default Tree
