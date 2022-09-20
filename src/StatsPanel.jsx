import React from "react"

const StatsPanel = props => {
	return (
		<div id="statsPanel">
			<div className="topBar"></div>
			<div id="innerStatsPanel">
				{props.viewMode === "avl" && (
					<div>
						<a
							href="https://en.wikipedia.org/wiki/AVL_tree"
							target="_blank"
							rel="noreferrer noopener"
						>
							<strong>AVL tree</strong> (Adelson-Velsky and Landis
							tree)
						</a>
						<ul>
							<li>
								Binary search tree that automatically balances
								itself to optimize random operations
							</li>
							<li>
								Auto-balancing is done through rotations to
								ensure that each subtree of a node has similar
								height
							</li>
							<li>
								Ensuring that subtrees are similar in height
								reduces the difference between average and worst
								case operations and optimizes overall
								performance
							</li>
							<li>
								Operations are conducted similarly to those on
								regular binary search trees, except the tree is
								checked for balance after
							</li>
							<li>
								Rotations are performed by lifting the taller
								subtree to the parent's spot, and then inserting
								the parent into the subtree
							</li>
							<li>
								Duplicate values aren't allowed for simplicity
							</li>
							<li>
								Enter numerical values in the box at the top and
								press "Insert" to create nodes in the space to
								the left
							</li>
						</ul>
						<table>
							<tr>
								<th>Operation</th>
								<th>
									Average case (
									<a
										href="https://en.wikipedia.org/wiki/Big_O_notation"
										target="_blank"
										rel="noreferrer noopener"
									>
										big Θ
									</a>
									)
								</th>
								<th>
									Worst case (
									<a
										href="https://en.wikipedia.org/wiki/Big_O_notation"
										target="_blank"
										rel="noreferrer noopener"
									>
										big O
									</a>
									)
								</th>
								<th>Measure</th>
							</tr>
							<tr>
								<td>Insert</td>
								<td>Θ(log(n))</td>
								<td>O(log(n))</td>
								<td>Time</td>
							</tr>
							<tr>
								<td>Search</td>
								<td>Θ(log(n))</td>
								<td>O(log(n))</td>
								<td>Time</td>
							</tr>
							<tr>
								<td>Delete</td>
								<td>Θ(log(n))</td>
								<td>O(log(n))</td>
								<td>Time</td>
							</tr>
							<tr>
								<td>Space</td>
								<td>Θ(n)</td>
								<td>O(n)</td>
								<td>Memory</td>
							</tr>
						</table>
					</div>
				)}
				{props.viewMode === "binary" && (
					<div>
						<a
							href="https://en.wikipedia.org/wiki/Binary_tree"
							target="_blank"
							rel="noreferrer noopener"
						>
							<strong>Binary tree</strong>
						</a>
						<ul>
							<li>Each node can have up to two children</li>
							<li>
								Binary trees offer useful structure for
								representing data, but could be more efficient
								to operate on
							</li>
							<li>
								Enter numerical values in the box at the top and
								press "Insert" to create nodes in the space to
								the left
							</li>
						</ul>
						<table>
							<tr>
								<th>Operation</th>
								<th>
									Average case (
									<a
										href="https://en.wikipedia.org/wiki/Big_O_notation"
										target="_blank"
										rel="noreferrer noopener"
									>
										big Θ
									</a>
									)
								</th>
								<th>
									Worst case (
									<a
										href="https://en.wikipedia.org/wiki/Big_O_notation"
										target="_blank"
										rel="noreferrer noopener"
									>
										big O
									</a>
									)
								</th>
								<th>Measure</th>
							</tr>
							<tr>
								<td>Insert</td>
								<td>Θ(log(n))</td>
								<td>O(n)</td>
								<td>Time</td>
							</tr>
							<tr>
								<td>Search</td>
								<td>Θ(n)</td>
								<td>O(n)</td>
								<td>Time</td>
							</tr>
							<tr>
								<td>Delete</td>
								<td>Θ(n)</td>
								<td>O(n)</td>
								<td>Time</td>
							</tr>
							<tr>
								<td>Space</td>
								<td>Θ(n)</td>
								<td>O(n)</td>
								<td>Memory</td>
							</tr>
						</table>
					</div>
				)}
				{props.viewMode === "bst" && (
					<div>
						<a
							href="https://en.wikipedia.org/wiki/Binary_search_tree"
							target="_blank"
							rel="noreferrer noopener"
						>
							<strong>BST</strong> (Binary search tree)
						</a>
						<ul>
							<li>Binary tree sorted to speed up operations</li>
							<li>
								New nodes are inserted to the left of a parent
								node if the value is less than the parent's and
								to the right if the value is greater than the
								parent's
							</li>
							<li>
								This means all nodes in a parent's left subtree
								have lesser value and all nodes in the right
								subtree have greater value
							</li>
							<li>
								This sorting allows algorithms to follow a path
								down the tree, which is more efficient than
								operating on every node
							</li>
							<li>
								Duplicate values aren't allowed for simplicity
							</li>
							<li>
								Enter numerical values in the box at the top and
								press "Insert" to create nodes in the space to
								the left
							</li>
						</ul>
						<table>
							<tr>
								<th>Operation</th>
								<th>
									Average case (
									<a
										href="https://en.wikipedia.org/wiki/Big_O_notation"
										target="_blank"
										rel="noreferrer noopener"
									>
										big Θ
									</a>
									)
								</th>
								<th>
									Worst case (
									<a
										href="https://en.wikipedia.org/wiki/Big_O_notation"
										target="_blank"
										rel="noreferrer noopener"
									>
										big O
									</a>
									)
								</th>
								<th>Measure</th>
							</tr>
							<tr>
								<td>Insert</td>
								<td>Θ(log(n))</td>
								<td>O(n)</td>
								<td>Time</td>
							</tr>
							<tr>
								<td>Search</td>
								<td>Θ(log(n))</td>
								<td>O(n)</td>
								<td>Time</td>
							</tr>
							<tr>
								<td>Delete</td>
								<td>Θ(log(n))</td>
								<td>O(n)</td>
								<td>Time</td>
							</tr>
							<tr>
								<td>Space</td>
								<td>Θ(n)</td>
								<td>O(n)</td>
								<td>Memory</td>
							</tr>
						</table>
					</div>
				)}
				{props.viewMode === "custom" && (
					<div>
						<a
							href="https://en.wikipedia.org/wiki/Tree_(data_structure)"
							target="_blank"
							rel="noreferrer noopener"
						>
							<strong>Custom tree</strong>
						</a>
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
						<table>
							<tr>
								<th>Operation</th>
								<th>
									Average case (
									<a
										href="https://en.wikipedia.org/wiki/Big_O_notation"
										target="_blank"
										rel="noreferrer noopener"
									>
										big Θ
									</a>
									)
								</th>
								<th>
									Worst case (
									<a
										href="https://en.wikipedia.org/wiki/Big_O_notation"
										target="_blank"
										rel="noreferrer noopener"
									>
										big O
									</a>
									)
								</th>
								<th>Measure</th>
							</tr>
							<tr>
								<td>Insert</td>
								<td>
									Θ(1) (manual) / <br />
									Θ(n) (automated)
								</td>
								<td>
									O(1) (manual) / <br />
									O(n) (automated)
								</td>
								<td>Time</td>
							</tr>
							<tr>
								<td>Search</td>
								<td>Θ(n)</td>
								<td>O(n)</td>
								<td>Time</td>
							</tr>
							<tr>
								<td>Delete</td>
								<td>Θ(n)</td>
								<td>O(n)</td>
								<td>Time</td>
							</tr>
							<tr>
								<td>Space</td>
								<td>Θ(n)</td>
								<td>O(n)</td>
								<td>Memory</td>
							</tr>
						</table>
					</div>
				)}
			</div>
		</div>
	)
}

export default StatsPanel
