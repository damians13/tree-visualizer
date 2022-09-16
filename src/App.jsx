import "./App.css"
import Tree from "./Tree"
import TopBar from "./TopBar"
import StatsPanel from "./StatsPanel"
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
			<div id="topBarBackground"></div>
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
			<StatsPanel viewMode={viewMode} />
		</DndProvider>
	)
}

export default App
