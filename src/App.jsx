import "./App.css"
import Tree from "./Tree"
import TopBar from "./TopBar"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import React, { useState } from "react"

export const DragTypes = {
	NODE: "node",
	TOP_HANDLE: "top_handle",
	BOTTOM_HANDLE: "bottom_handle",
}

const App = () => {
	const [nodes, setNodes] = useState([])
	const [lines, setLines] = useState([])
	const [viewMode, setViewMode] = useState("bst")

	return (
		<DndProvider backend={HTML5Backend}>
			<div>
				<TopBar
					nodes={nodes}
					setNodes={setNodes}
					lines={lines}
					setLines={setLines}
					viewMode={viewMode}
					setViewMode={setViewMode}
				/>
				<Tree
					nodes={nodes}
					setNodes={setNodes}
					lines={lines}
					setLines={setLines}
					viewMode={viewMode}
					setViewMode={setViewMode}
				/>
			</div>
			<CodeViewer />
		</DndProvider>
	)
}

const CodeViewer = () => {
	return (
		<div id="codeView">
			<div className="topBar">
				<select name="insertMode" defaultValue="default">
					<option value="default">Insert: default</option>
					<option value="custom">Insert: custom</option>
				</select>
				<select name="selectMode" defaultValue="depthFirst">
					<option value="depthFirst">Search: depth first</option>
					<option value="breadthFirst">Search: breadth first</option>
				</select>
			</div>
		</div>
	)
}

export default App
