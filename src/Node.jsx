import React, { useEffect } from "react"
import { useDrag, useDrop } from "react-dnd"
import { DragTypes } from "./App"
import * as Utils from "./TreeUtils"

const Node = props => {
	const [, dragRef, preview] = useDrag(monitor => ({
		type: DragTypes.NODE,
	}))
	const [, dropRef] = useDrop(() => ({
		accept: [DragTypes.BOTTOM_HANDLE, DragTypes.TOP_HANDLE],
		drop: item => {
			let newChild, newParent
			if (item.type === DragTypes.BOTTOM_HANDLE) {
				// bottom handle to top handle
				newChild = props.stateData.nodes.reduce((rsf, node) => (rsf !== null ? rsf : Utils.searchTreeForID(node, props.for.id)), null)
				newParent = props.stateData.nodes.reduce((rsf, node) => (rsf !== null ? rsf : Utils.searchTreeForID(node, item.forID)), null)
				props.stateData.setLineInProgress()
			} else if (item.type === DragTypes.TOP_HANDLE) {
				// top handle to bottom handle
				newChild = props.stateData.nodes.reduce((rsf, node) => (rsf !== null ? rsf : Utils.searchTreeForID(node, item.forID)), null)
				newParent = props.stateData.nodes.reduce((rsf, node) => (rsf !== null ? rsf : Utils.searchTreeForID(node, props.for.id)), null)
			}

			newChild.parentID = item.forID
			newParent.children.push(newChild)

			props.stateData.setNodes(props.stateData.nodes.filter(node => node.id !== newChild.id))
			props.stateData.setLines([...props.stateData.lines, { parentID: newParent.id, childID: newChild.id }])
			props.stateData.setLineInProgress()
		},
		canDrop: item => {
			const customMode = props.viewMode === "custom"
			const hasParent = props.for.parentID !== null
			const bottomHandle = item.type === DragTypes.BOTTOM_HANDLE
			const topHandle = item.type === DragTypes.TOP_HANDLE
			const lessThanTwoChildren = props.for.children.length < 2
			const loopOntoSelf = props.for.id === item.forID

			if (loopOntoSelf) return false
			else if (bottomHandle && !hasParent) return true
			else if (topHandle && (customMode || lessThanTwoChildren)) return true
			else return false
		},
	}))

	// Clear drag preview images
	useEffect(() => {
		const img = new Image()
		preview(img)
	}, [])

	const handleHandleDrag = e => {
		// This if statement filters out the last drag event which has coordinates (0, 0)
		if (!(e.clientX === 0 && e.clientY === 0)) {
			const treeViewBox = document.getElementById("treeView").getBoundingClientRect()

			props.stateData.setLineInProgress({
				src: props.for,
				mouseX: Utils.dimensionClamp(e.pageX, treeViewBox.left, treeViewBox.right),
				mouseY: Utils.dimensionClamp(e.pageY - 25, treeViewBox.top, treeViewBox.bottom),
			})
		}
	}

	const handleHandleDragEnd = () => {
		props.stateData.setLineInProgress()
	}

	return (
		<>
			<div id={props.for.id} className={"node"} style={{ top: props.for.topOffset, left: props.for.leftOffset }}>
				<Handle for={props.for} side="top" onDrag={handleHandleDrag} onDragEnd={handleHandleDragEnd} />

				<div ref={dropRef} style={{ position: "relative", top: "-16px" }}>
					<p
						className={"nodeText row" + props.row}
						draggable="true"
						onClick={props.onClick}
						onDrag={props.onDrag}
						onDragStart={props.onDragStart}
						onDragEnd={props.onDragEnd}
						style={{ zIndex: "1" }}
						ref={dragRef}
					>
						{props.for.value}
					</p>
				</div>

				<Handle for={props.for} side="bottom" onDrag={handleHandleDrag} onDragEnd={handleHandleDragEnd} />
			</div>

			{props.for.children.map(value => (
				<Node
					onClick={props.onClick}
					onDrag={props.onDrag}
					onDragStart={props.onDragStart}
					onDragEnd={props.onDragEnd}
					for={value}
					row={props.row + 1}
					key={value.id}
					viewMode={props.viewMode}
					stateData={props.stateData}
				/>
			))}
		</>
	)
}

const Handle = props => {
	const [, dragRef, preview] = useDrag(() => ({
		type: props.side === "top" ? DragTypes.TOP_HANDLE : DragTypes.BOTTOM_HANDLE,
		item: { type: props.side === "top" ? DragTypes.TOP_HANDLE : DragTypes.BOTTOM_HANDLE, forID: props.for.id },
	}))
	const [, dragRef2, preview2] = useDrag(() => ({
		type: props.side === "top" ? DragTypes.TOP_HANDLE : DragTypes.BOTTOM_HANDLE,
		item: { type: props.side === "top" ? DragTypes.TOP_HANDLE : DragTypes.BOTTOM_HANDLE, forID: props.for.id },
	}))

	// Clear drag preview images
	useEffect(() => {
		const img = new Image()
		preview(img)
		preview2(img)
	}, [])

	const createTopHandle = () => {
		return (
			<div style={{ position: "relative", height: "16px", top: "-12px" }}>
				{props.for.parentID === null && (
					<div className="handle top">
						<div className="handle" ref={dragRef} draggable onDrag={props.onDrag} onDragEnd={props.onDragEnd} />
					</div>
				)}
			</div>
		)
	}

	const createBottomHandles = () => {
		return (
			<div style={{ display: "flex", position: "relative", height: "16px", top: "-20px" }}>
				{(props.viewMode === "custom" || props.for.children.length === 1) && (
					<div className="handle bottom">
						<div className="handle" ref={dragRef} draggable onDrag={props.onDrag} onDragEnd={props.onDragEnd} />
					</div>
				)}
				{props.viewMode !== "custom" && props.for.children.length === 0 && (
					<>
						<div className="handle bottom">
							<div className="handle" ref={dragRef} draggable onDrag={props.onDrag} onDragEnd={props.onDragEnd} />
						</div>
						<div className="handle bottom">
							<div className="handle" ref={dragRef2} draggable onDrag={props.onDrag} onDragEnd={props.onDragEnd} />
						</div>
					</>
				)}
			</div>
		)
	}
	return (
		<>
			{props.side === "top" && createTopHandle(props.handleHandleClick)}
			{props.side === "bottom" && createBottomHandles(props.onHandleClick)}
		</>
	)
}

export default Node
