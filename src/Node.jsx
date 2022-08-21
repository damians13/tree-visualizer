import React from "react"
import { useDrag } from "react-dnd"
import { DragTypes } from "./App"

const Node = props => {
	const [, dragRef] = useDrag(() => ({
		type: DragTypes.NODE,
	}))
	const createBottomHandles = handleHandleClick => {
		return (
			<div style={{ display: "flex", position: "relative", height: "16px", top: "-20px" }}>
				{(props.viewMode === "custom" || props.for.children.length === 1) && <div className="handle bottom" onClick={handleHandleClick}></div>}
				{props.viewMode !== "custom" && props.for.children.length === 0 && (
					<>
						<div className="handle bottom" onClick={handleHandleClick}></div>
						<div className="handle bottom" onClick={handleHandleClick}></div>
					</>
				)}
			</div>
		)
	}

	return (
		<>
			<div id={props.for.id} className={"node"} style={{ top: props.for.topOffset, left: props.for.leftOffset }}>
				<div style={{ position: "relative", height: "16px", top: "-12px" }}>
					{props.for.parentID === null && (
						<div className="handle top">
							<div className="handle" onClick={props.onHandleClick} draggable />
						</div>
					)}
				</div>

				<p
					className={"nodeText row" + props.row}
					draggable="true"
					onClick={props.onClick}
					onDrag={props.onDrag}
					onDragStart={props.onDragStart}
					onDragEnd={props.onDragEnd}
					style={{ top: "-16px", zIndex: "1" }}
					ref={dragRef}
				>
					{props.for.value}
				</p>

				{createBottomHandles(props.onHandleClick)}
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
					onHandleClick={props.onHandleClick}
				/>
			))}
		</>
	)
}

export default Node
