import "./App.css"
import Tree from "./Tree"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import React from "react"

export const DragTypes = {
	NODE: "node",
}

const App = () => {
	return (
		<DndProvider backend={HTML5Backend}>
			<Tree />
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
