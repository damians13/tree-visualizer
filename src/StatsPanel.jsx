import React from "react"

const StatsPanel = props => {
	return (
		<div id="statsPanel">
			<div className="topBar"></div>
			<div id="innerStatsPanel">
				{props.viewMode === "avl" && (
					<div>
						<p>AVL tree (Adelson-Velsky and Landis tree)</p>
						<ul>
							<li>Self-balancing binary search tree</li>
						</ul>
					</div>
				)}
				{props.viewMode === "binary" && (
					<div>
						<p>Binary tree</p>
						<ul>
							<li>Each node can have up to two children</li>
						</ul>
					</div>
				)}
				{props.viewMode === "bst" && (
					<div>
						<p>BST (Binary search tree)</p>
						<ul>
							<li>Binary search trees follow these rules:</li>
						</ul>
					</div>
				)}
				{props.viewMode === "custom" && (
					<div>
						<p>Custom tree</p>
						<ul>
							<li>Make your own tree!</li>
							<li>
								Enter numerical values in the box at the top and
								press "Insert" to create nodes in the space to
								the left
							</li>
							<li>
								Connect these nodes with a line by dragging the
								handles onto other nodes
							</li>
							<li>
								These lines represent the relationships (child,
								parent) between nodes in the tree
							</li>
							<li>
								Remove a line between two nodes by clicking on
								it
							</li>
							<li>
								Remove a node (and all its children) by clicking
								on it
							</li>
						</ul>
					</div>
				)}
			</div>
		</div>
	)
}

export default StatsPanel
