import { avlBalance, binaryInsert, bstInsert, generateLines, getTreeHeight, searchTreeForID } from "./TreeUtils"

// bstInsert tests
// No child test
test("inserts node in single node bst", () => {
	const node = bstInsert(
		{
			value: 3,
			id: Math.random(),
			children: [],
			parentID: null,
		},
		4
	)

	expect(node).toBeInstanceOf(Object)
	expect(node.value).toBe(3)
	expect(node.id).toBeDefined
	expect(node.children).toBeInstanceOf(Array)
	expect(node.children.length).toBe(1)
	expect(node.parentID).toBeNull()

	const child = node.children[0]
	expect(child).toBeInstanceOf(Object)
	expect(child.value).toBe(4)
	expect(child.id).toBeDefined()
	expect(child.children).toStrictEqual([])
	expect(child.parentID).toBe(node.id)
})
// Duplicate node test
test("duplicate nodes are not inserted in bsts", () => {
	// Single node
	const singleNode = {
		value: 3,
		id: Math.random(),
		children: [],
		parentID: null,
	}
	expect(bstInsert(singleNode, 3)).toStrictEqual(singleNode)

	// Recursive test
	const id = Math.random()
	const nodeOneChild = {
		value: 3,
		id: id,
		children: [
			{
				value: 4,
				id: Math.random(),
				children: [],
				parentID: id,
			},
		],
		topOffset: undefined,
		leftOffset: undefined,
		parentID: null,
	}
	expect(bstInsert(nodeOneChild, 4)).toStrictEqual(nodeOneChild)

	// Double child tests
	const duplicateDoubleChild = {
		value: 4,
		id: id,
		children: [
			{
				value: 2,
				id: Math.random(),
				children: [],
				parentID: id,
			},
			{
				value: 6,
				id: Math.random(),
				children: [],
				parentID: id,
			},
		],
		parentID: null,
	}
	expect(bstInsert(duplicateDoubleChild, 2)).toEqual(duplicateDoubleChild)
	expect(bstInsert(duplicateDoubleChild, 4)).toEqual(duplicateDoubleChild)
	expect(bstInsert(duplicateDoubleChild, 6)).toEqual(duplicateDoubleChild)
})

// Single child tests
// Higher insertion tests
test("inserts higher node as second child in bst with one lesser subnode", () => {
	const id = Math.random()
	const node = bstInsert(
		{
			value: 3,
			id: id,
			children: [
				{
					value: 2,
					id: Math.random(),
					children: [],
					parentID: id,
				},
			],
			parentID: null,
		},
		4
	)

	expect(node).toBeInstanceOf(Object)
	expect(node.value).toBe(3)
	expect(node.id).toBeDefined
	expect(node.children).toBeInstanceOf(Array)
	expect(node.children.length).toBe(2)

	const firstChild = node.children[0]
	expect(firstChild).toBeInstanceOf(Object)
	expect(firstChild.value).toBe(2)
	expect(firstChild.id).toBeDefined
	expect(firstChild.children).toStrictEqual([])

	const secondChild = node.children[1]
	expect(secondChild).toBeInstanceOf(Object)
	expect(secondChild.value).toBe(4)
	expect(secondChild.id).toBeDefined
	expect(secondChild.children).toStrictEqual([])
})
// Recursive test of above
test("inserts highest node on bst with higher child", () => {
	const node = bstInsert(
		{
			value: 3,
			id: Math.random(),
			children: [
				{
					value: 4,
					id: Math.random(),
					children: [],
				},
			],
		},
		5
	)

	expect(node).toBeInstanceOf(Object)
	expect(node.value).toBe(3)
	expect(node.id).toBeDefined
	expect(node.children).toBeInstanceOf(Array)
	expect(node.children.length).toBe(1)

	const child = node.children[0]
	expect(child).toBeInstanceOf(Object)
	expect(child.value).toBe(4)
	expect(child.id).toBeDefined
	expect(child.children).toBeInstanceOf(Array)
	expect(child.children.length).toBe(1)

	const grandChild = child.children[0]
	expect(grandChild).toBeInstanceOf(Object)
	expect(grandChild.value).toBe(5)
	expect(grandChild.id).toBeDefined
	expect(grandChild.children).toStrictEqual([])
})
// Lower insertion tests
test("inserts lower node as first child in bst with one greater subnode", () => {
	const node = bstInsert(
		{
			value: 3,
			id: Math.random(),
			children: [
				{
					value: 4,
					id: Math.random(),
					children: [],
				},
			],
		},
		2
	)

	expect(node).toBeInstanceOf(Object)
	expect(node.value).toBe(3)
	expect(node.id).toBeDefined
	expect(node.children).toBeInstanceOf(Array)
	expect(node.children.length).toBe(2)

	const firstChild = node.children[0]
	expect(firstChild).toBeInstanceOf(Object)
	expect(firstChild.value).toBe(2)
	expect(firstChild.id).toBeDefined
	expect(firstChild.children).toStrictEqual([])

	const secondChild = node.children[1]
	expect(secondChild).toBeInstanceOf(Object)
	expect(secondChild.value).toBe(4)
	expect(secondChild.id).toBeDefined
	expect(secondChild.children).toStrictEqual([])
})
// Recursive test of above
test("inserts lowest node on bst with lower child", () => {
	const node = bstInsert(
		{
			value: 3,
			id: Math.random(),
			children: [
				{
					value: 2,
					id: Math.random(),
					children: [],
				},
			],
		},
		1
	)

	expect(node).toBeInstanceOf(Object)
	expect(node.value).toBe(3)
	expect(node.id).toBeDefined
	expect(node.children).toBeInstanceOf(Array)
	expect(node.children.length).toBe(1)

	const child = node.children[0]
	expect(child).toBeInstanceOf(Object)
	expect(child.value).toBe(2)
	expect(child.id).toBeDefined
	expect(child.children).toBeInstanceOf(Array)
	expect(child.children.length).toBe(1)

	const grandChild = child.children[0]
	expect(grandChild).toBeInstanceOf(Object)
	expect(grandChild.value).toBe(1)
	expect(grandChild.id).toBeDefined
	expect(grandChild.children).toStrictEqual([])
})

// Two child tests
// Left insert left child
test("two child left insert left child", () => {
	const node = bstInsert(
		{
			value: 4,
			id: Math.random(),
			children: [
				{
					value: 2,
					id: Math.random(),
					children: [],
				},
				{
					value: 6,
					id: Math.random(),
					children: [],
				},
			],
		},
		1
	)

	expect(node).toBeInstanceOf(Object)
	expect(node.value).toBe(4)
	expect(node.id).toBeDefined
	expect(node.children).toBeInstanceOf(Array)
	expect(node.children.length).toBe(2)

	const firstChild = node.children[0]
	expect(firstChild).toBeInstanceOf(Object)
	expect(firstChild.value).toBe(2)
	expect(firstChild.id).toBeDefined
	expect(firstChild.children).toBeInstanceOf(Array)
	expect(firstChild.children.length).toBe(1)

	const secondChild = node.children[1]
	expect(secondChild).toBeInstanceOf(Object)
	expect(secondChild.value).toBe(6)
	expect(secondChild.id).toBeDefined
	expect(secondChild.children).toStrictEqual([])

	const grandChild = firstChild.children[0]
	expect(grandChild).toBeInstanceOf(Object)
	expect(grandChild.value).toBe(1)
	expect(grandChild.id).toBeDefined
	expect(grandChild.children).toStrictEqual([])
})
// Right insert left child
test("two child right insert left child", () => {
	const node = bstInsert(
		{
			value: 4,
			id: Math.random(),
			children: [
				{
					value: 2,
					id: Math.random(),
					children: [],
				},
				{
					value: 6,
					id: Math.random(),
					children: [],
				},
			],
		},
		3
	)

	expect(node).toBeInstanceOf(Object)
	expect(node.value).toBe(4)
	expect(node.id).toBeDefined
	expect(node.children).toBeInstanceOf(Array)
	expect(node.children.length).toBe(2)

	const firstChild = node.children[0]
	expect(firstChild).toBeInstanceOf(Object)
	expect(firstChild.value).toBe(2)
	expect(firstChild.id).toBeDefined
	expect(firstChild.children).toBeInstanceOf(Array)
	expect(firstChild.children.length).toBe(1)

	const secondChild = node.children[1]
	expect(secondChild).toBeInstanceOf(Object)
	expect(secondChild.value).toBe(6)
	expect(secondChild.id).toBeDefined
	expect(secondChild.children).toStrictEqual([])

	const grandChild = firstChild.children[0]
	expect(grandChild).toBeInstanceOf(Object)
	expect(grandChild.value).toBe(3)
	expect(grandChild.id).toBeDefined
	expect(grandChild.children).toStrictEqual([])
})
// Left insert right child
test("two child left insert right child", () => {
	const node = bstInsert(
		{
			value: 4,
			id: Math.random(),
			children: [
				{
					value: 2,
					id: Math.random(),
					children: [],
				},
				{
					value: 6,
					id: Math.random(),
					children: [],
				},
			],
		},
		5
	)

	expect(node).toBeInstanceOf(Object)
	expect(node.value).toBe(4)
	expect(node.id).toBeDefined
	expect(node.children).toBeInstanceOf(Array)
	expect(node.children.length).toBe(2)

	const firstChild = node.children[0]
	expect(firstChild).toBeInstanceOf(Object)
	expect(firstChild.value).toBe(2)
	expect(firstChild.id).toBeDefined
	expect(firstChild.children).toStrictEqual([])

	const secondChild = node.children[1]
	expect(secondChild).toBeInstanceOf(Object)
	expect(secondChild.value).toBe(6)
	expect(secondChild.id).toBeDefined
	expect(secondChild.children).toBeInstanceOf(Array)
	expect(secondChild.children.length).toBe(1)

	const grandChild = secondChild.children[0]
	expect(grandChild).toBeInstanceOf(Object)
	expect(grandChild.value).toBe(5)
	expect(grandChild.id).toBeDefined
	expect(grandChild.children).toStrictEqual([])
})
// Right insert right child
test("two child right insert right child", () => {
	const node = bstInsert(
		{
			value: 4,
			id: Math.random(),
			children: [
				{
					value: 2,
					id: Math.random(),
					children: [],
				},
				{
					value: 6,
					id: Math.random(),
					children: [],
				},
			],
		},
		7
	)

	expect(node).toBeInstanceOf(Object)
	expect(node.value).toBe(4)
	expect(node.id).toBeDefined
	expect(node.children).toBeInstanceOf(Array)
	expect(node.children.length).toBe(2)

	const firstChild = node.children[0]
	expect(firstChild).toBeInstanceOf(Object)
	expect(firstChild.value).toBe(2)
	expect(firstChild.id).toBeDefined
	expect(firstChild.children).toStrictEqual([])

	const secondChild = node.children[1]
	expect(secondChild).toBeInstanceOf(Object)
	expect(secondChild.value).toBe(6)
	expect(secondChild.id).toBeDefined
	expect(secondChild.children).toBeInstanceOf(Array)
	expect(secondChild.children.length).toBe(1)

	const grandChild = secondChild.children[0]
	expect(grandChild).toBeInstanceOf(Object)
	expect(grandChild.value).toBe(7)
	expect(grandChild.id).toBeDefined
	expect(grandChild.children).toStrictEqual([])
})

// Binary insert tests
// Single node
test("binary insert single node", () => {
	let node = {
		value: 3,
		id: Math.random(),
		children: [],
		parentID: null,
	}
	const output = binaryInsert(node, 4, [], () => {})

	expect(output).toBeInstanceOf(Object)
	expect(output.value).toBe(3)
	expect(output.id).toBeDefined
	expect(output.children).toBeInstanceOf(Array)
	expect(output.children.length).toBe(1)
	expect(output.parentID).toBeNull()

	const child = output.children[0]
	expect(child).toBeInstanceOf(Object)
	expect(child.value).toBe(4)
	expect(child.id).toBeDefined()
	expect(child.children).toStrictEqual([])
	expect(child.parentID).toBe(output.id)
})
// Compounding test
test("binary insert compounding tests", () => {
	const id1 = Math.random()
	let node = {
		value: 3,
		id: id1,
		children: [
			{
				value: 45,
				id: Math.random(),
				children: [],
				parentID: id1,
			},
		],
		parentID: null,
	}
	// First insertion
	const output1 = binaryInsert(node, 4, [], () => {})

	expect(output1).toBeInstanceOf(Object)
	expect(output1.value).toBe(3)
	expect(output1.id).toBeDefined()
	expect(output1.children).toBeInstanceOf(Array)
	expect(output1.children.length).toBe(2)
	expect(output1.parentID).toBeNull()

	let firstChild = output1.children[0]
	expect(firstChild).toBeInstanceOf(Object)
	expect(firstChild.value).toBe(45)
	expect(firstChild.id).toBeDefined()
	expect(firstChild.children).toStrictEqual([])
	expect(firstChild.parentID).toBe(output1.id)

	let secondChild = output1.children[1]
	expect(secondChild).toBeInstanceOf(Object)
	expect(secondChild.value).toBe(4)
	expect(secondChild.id).toBeDefined()
	expect(secondChild.children).toStrictEqual([])
	expect(secondChild.parentID).toBe(output1.id)

	// Second insertion
	const output2 = binaryInsert(output1, 6, [], () => {})

	expect(output2).toBeInstanceOf(Object)
	expect(output2.value).toBe(3)
	expect(output2.id).toBeDefined()
	expect(output2.children).toBeInstanceOf(Array)
	expect(output2.children.length).toBe(2)
	expect(output2.parentID).toBeNull()

	firstChild = output2.children[0]
	expect(firstChild).toBeInstanceOf(Object)
	expect(firstChild.value).toBe(45)
	expect(firstChild.id).toBeDefined()
	expect(firstChild.children).toBeInstanceOf(Array)
	expect(firstChild.children.length).toBe(1)
	expect(firstChild.parentID).toBe(output2.id)

	let firstGrandChild = firstChild.children[0]
	expect(firstGrandChild).toBeInstanceOf(Object)
	expect(firstGrandChild.value).toBe(6)
	expect(firstGrandChild.id).toBeDefined()
	expect(firstGrandChild.children).toStrictEqual([])
	expect(firstGrandChild.parentID).toBe(firstChild.id)

	secondChild = output2.children[1]
	expect(secondChild).toBeInstanceOf(Object)
	expect(secondChild.value).toBe(4)
	expect(secondChild.id).toBeDefined()
	expect(secondChild.children).toStrictEqual([])
	expect(secondChild.parentID).toBe(output2.id)

	// Third insertion
	const output3 = binaryInsert(output2, 6, [], () => {})

	expect(output3).toBeInstanceOf(Object)
	expect(output3.value).toBe(3)
	expect(output3.id).toBeDefined()
	expect(output3.children).toBeInstanceOf(Array)
	expect(output3.children.length).toBe(2)
	expect(output3.parentID).toBeNull()

	firstChild = output3.children[0]
	expect(firstChild).toBeInstanceOf(Object)
	expect(firstChild.value).toBe(45)
	expect(firstChild.id).toBeDefined()
	expect(firstChild.children).toBeInstanceOf(Array)
	expect(firstChild.children.length).toBe(2)
	expect(firstChild.parentID).toBe(node.id)

	firstGrandChild = firstChild.children[0]
	expect(firstGrandChild).toBeInstanceOf(Object)
	expect(firstGrandChild.value).toBe(6)
	expect(firstGrandChild.id).toBeDefined()
	expect(firstGrandChild.children).toStrictEqual([])
	expect(firstGrandChild.parentID).toBe(firstChild.id)

	let secondGrandChild = firstChild.children[1]
	expect(secondGrandChild).toBeInstanceOf(Object)
	expect(secondGrandChild.value).toBe(6)
	expect(secondGrandChild.id).toBeDefined()
	expect(secondGrandChild.children).toStrictEqual([])
	expect(secondGrandChild.parentID).toBe(firstChild.id)

	secondChild = output3.children[1]
	expect(secondChild).toBeInstanceOf(Object)
	expect(secondChild.value).toBe(4)
	expect(secondChild.id).toBeDefined()
	expect(secondChild.children).toStrictEqual([])
	expect(secondChild.parentID).toBe(output3.id)
})
// Complex test
test("binary insert complex test", () => {
	const id1 = Math.random()
	const id2 = Math.random()
	const id3 = Math.random()
	const id4 = Math.random()
	let node = {
		value: 3,
		id: id1,
		children: [
			{
				value: 45,
				id: id2,
				children: [
					{
						value: 76,
						id: Math.random(),
						children: [],
						parentID: id2,
					},
					{
						value: 4,
						id: Math.random(),
						children: [],
						parentID: id2,
					},
				],
				parentID: id1,
			},
			{
				value: 78,
				id: id3,
				children: [
					{
						value: 87,
						id: id4,
						children: [
							{
								value: 34,
								id: Math.random(),
								children: [],
								parentID: id4,
							},
						],
						parentID: id3,
					},
				],
				parentID: id1,
			},
		],
		parentID: null,
	}
	const three = binaryInsert(node, 6, [], () => {})

	expect(three).toBeInstanceOf(Object)
	expect(three.value).toBe(3)
	expect(three.id).toBeDefined()
	expect(three.children).toBeInstanceOf(Array)
	expect(three.children.length).toBe(2)
	expect(three.parentID).toBeNull()

	const fourtyFive = three.children[0]
	expect(fourtyFive).toBeInstanceOf(Object)
	expect(fourtyFive.value).toBe(45)
	expect(fourtyFive.id).toBeDefined()
	expect(fourtyFive.children).toBeInstanceOf(Array)
	expect(fourtyFive.children.length).toBe(2)
	expect(fourtyFive.parentID).toBe(three.id)

	const seventySix = fourtyFive.children[0]
	expect(seventySix).toBeInstanceOf(Object)
	expect(seventySix.value).toBe(76)
	expect(seventySix.id).toBeDefined()
	expect(seventySix.children).toStrictEqual([])
	expect(seventySix.parentID).toBe(fourtyFive.id)

	const four = fourtyFive.children[1]
	expect(four).toBeInstanceOf(Object)
	expect(four.value).toBe(4)
	expect(four.id).toBeDefined()
	expect(four.children).toStrictEqual([])
	expect(four.parentID).toBe(fourtyFive.id)

	const seventyEight = three.children[1]
	expect(seventyEight).toBeInstanceOf(Object)
	expect(seventyEight.value).toBe(78)
	expect(seventyEight.id).toBeDefined()
	expect(seventyEight.children).toBeInstanceOf(Array)
	expect(seventyEight.children.length).toBe(2)
	expect(seventyEight.parentID).toBe(three.id)

	const eightySeven = seventyEight.children[0]
	expect(eightySeven).toBeInstanceOf(Object)
	expect(eightySeven.value).toBe(87)
	expect(eightySeven.id).toBeDefined()
	expect(eightySeven.children).toBeInstanceOf(Array)
	expect(eightySeven.children.length).toBe(1)
	expect(eightySeven.parentID).toBe(seventyEight.id)

	const six = seventyEight.children[1]
	expect(six).toBeInstanceOf(Object)
	expect(six.value).toBe(6)
	expect(six.id).toBeDefined()
	expect(six.children).toStrictEqual([])
	expect(six.parentID).toBe(seventyEight.id)

	const thirtyFour = eightySeven.children[0]
	expect(thirtyFour).toBeInstanceOf(Object)
	expect(thirtyFour.value).toBe(34)
	expect(thirtyFour.id).toBeDefined()
	expect(thirtyFour.children).toStrictEqual([])
	expect(thirtyFour.parentID).toBe(eightySeven.id)
})

// Tree height tests
// Single node
test("tree height: 1", () => {
	const singleNode = {
		value: 3,
		id: Math.random(),
		children: [],
		parentID: null,
	}
	const output = getTreeHeight(singleNode)

	expect(output).toBe(1)
})
// Tree with height 2, 3 nodes total
test("tree height: 2", () => {
	const tree = {
		value: 3,
		id: Math.random(),
		children: [
			{
				value: 1,
				id: Math.random(),
				children: [],
			},
			{
				value: 5,
				id: Math.random(),
				children: [],
			},
		],
	}

	const output = getTreeHeight(tree)

	expect(output).toBe(2)
})
// More complicated test with recursion
test("tree height: 3", () => {
	const tree = {
		value: 6,
		id: Math.random(),
		children: [
			{ value: 5, id: Math.random(), children: [{ value: 1, id: Math.random(), children: [] }] },
			{
				value: 8,
				id: Math.random(),
				children: [
					{ value: 7, id: Math.random(), children: [] },
					{ value: 9, id: Math.random(), children: [] },
				],
			},
		],
	}

	const output = getTreeHeight(tree)

	expect(output).toBe(3)
})

// searchTreeForID tests
// Single node
test("searchTreeForID single node", () => {
	const id = Math.random()
	const node = {
		value: 4,
		id: id,
		children: [],
		parentID: null,
	}

	expect(searchTreeForID(node, Math.random())).toBe(null)
	expect(searchTreeForID(node, id)).toBe(node)
})
// One child
test("searchTreeForID child node", () => {
	const id1 = Math.random()
	const id2 = Math.random()
	const node = {
		value: 4,
		id: id1,
		children: [
			{
				value: 17,
				id: id2,
				children: [],
			},
		],
		parentID: null,
	}

	expect(searchTreeForID(node, Math.random())).toBe(null)
	expect(searchTreeForID(node, id1)).toBe(node)
	expect(searchTreeForID(node, id2)).toBe(node.children[0])
})
// Larger tree
test("searchTreeForID larger tree", () => {
	const id1 = Math.random()
	const id2 = Math.random()
	const id3 = Math.random()
	const id4 = Math.random()
	const id5 = Math.random()
	const id6 = Math.random()
	const node = {
		value: 6,
		id: id1,
		children: [
			{ value: 5, id: id2, children: [{ value: 1, id: id3, children: [] }] },
			{
				value: 8,
				id: id4,
				children: [
					{ value: 7, id: id5, children: [] },
					{ value: 9, id: id6, children: [] },
				],
			},
		],
	}

	expect(searchTreeForID(node, Math.random())).toBe(null)
	expect(searchTreeForID(node, id1)).toBe(node)
	expect(searchTreeForID(node, id2)).toBe(node.children[0])
	expect(searchTreeForID(node, id3)).toBe(node.children[0].children[0])
	expect(searchTreeForID(node, id4)).toBe(node.children[1])
	expect(searchTreeForID(node, id5)).toBe(node.children[1].children[0])
	expect(searchTreeForID(node, id6)).toBe(node.children[1].children[1])
})

// AVL balance tests
// Single node, no rotation required
test("avlBalance single node", () => {
	const node = {
		value: 6,
		id: Math.random(),
		children: [],
		parentID: null,
	}
	expect(avlBalance(node)).toBe(node)
})
// Proper trees, no rotation required
test("avlBalance proper trees", () => {
	const id1 = Math.random()
	const id2 = Math.random()
	const id3 = Math.random()
	const node1 = {
		value: 6,
		id: id1,
		children: [
			{
				value: 3,
				id: id2,
				children: [
					{ value: 1, id: Math.random(), children: [], parentID: id2 },
					{ value: 4, id: Math.random(), children: [], parentID: id2 },
				],
				parentID: id1,
			},
			{
				value: 7,
				id: id3,
				children: [{ value: 9, id: Math.random(), children: [], parentID: id3 }],
				parentID: id1,
			},
		],
	}
	expect(avlBalance(node1)).toStrictEqual(node1)

	const node2 = {
		value: 6,
		id: id1,
		children: [
			{
				value: 3,
				id: id2,
				children: [],
				parentID: id1,
			},
			{
				value: 7,
				id: id3,
				children: [{ value: 9, id: Math.random(), children: [], parentID: id3 }],
				parentID: id1,
			},
		],
	}
	expect(avlBalance(node2)).toStrictEqual(node2)

	const node3 = {
		value: 6,
		id: id1,
		children: [
			{
				value: 3,
				id: id2,
				children: [
					{ value: 1, id: Math.random(), children: [], parentID: id2 },
					{ value: 4, id: Math.random(), children: [], parentID: id2 },
				],
				parentID: id1,
			},
			{
				value: 8,
				id: id3,
				children: [
					{ value: 7, id: Math.random(), children: [], parentID: id3 },
					{ value: 9, id: Math.random(), children: [], parentID: id3 },
				],
				parentID: id1,
			},
		],
	}
	expect(avlBalance(node3)).toStrictEqual(node3)
})
// Unbalanced right->right
test("avlBalance right -> right", () => {
	const superID = Math.random()
	const id1 = Math.random()
	const id2 = Math.random()
	const id3 = Math.random()
	const node = {
		value: 6,
		id: id1,
		children: [
			{
				value: 7,
				id: id2,
				children: [{ value: 8, id: id3, children: [], parentID: id2 }],
				parentID: id1,
			},
		],
		parentID: superID,
	}

	const seven = avlBalance(node)
	expect(seven).toBeInstanceOf(Object)
	expect(seven.value).toBe(7)
	expect(seven.id).toBe(id2)
	expect(seven.children).toBeInstanceOf(Array)
	expect(seven.children.length).toBe(2)
	expect(seven.parentID).toBe(superID)

	const six = seven.children[0]
	expect(six).toBeInstanceOf(Object)
	expect(six.value).toBe(6)
	expect(six.id).toBe(id1)
	expect(six.children).toStrictEqual([])
	expect(six.parentID).toBe(seven.id)

	const eight = seven.children[1]
	expect(eight).toBeInstanceOf(Object)
	expect(eight.value).toBe(8)
	expect(eight.id).toBe(id3)
	expect(eight.children).toStrictEqual([])
	expect(eight.parentID).toBe(seven.id)
})
// Unbalanced right->left
test("avlBalance right -> left", () => {
	const superID = Math.random()
	const id1 = Math.random()
	const id2 = Math.random()
	const id3 = Math.random()
	const node = {
		value: 6,
		id: id1,
		children: [
			{
				value: 8,
				id: id2,
				children: [{ value: 7, id: id3, children: [], parentID: id2 }],
				parentID: id1,
			},
		],
		parentID: superID,
	}

	const seven = avlBalance(node)
	expect(seven).toBeInstanceOf(Object)
	expect(seven.value).toBe(7)
	expect(seven.id).toBe(id3)
	expect(seven.children).toBeInstanceOf(Array)
	expect(seven.children.length).toBe(2)
	expect(seven.parentID).toBe(superID)

	const six = seven.children[0]
	expect(six).toBeInstanceOf(Object)
	expect(six.value).toBe(6)
	expect(six.id).toBe(id1)
	expect(six.children).toStrictEqual([])
	expect(six.parentID).toBe(seven.id)

	const eight = seven.children[1]
	expect(eight).toBeInstanceOf(Object)
	expect(eight.value).toBe(8)
	expect(eight.id).toBe(id2)
	expect(eight.children).toStrictEqual([])
	expect(eight.parentID).toBe(seven.id)
})
// Unbalanced left->left
test("avlBalance left -> left", () => {
	const superID = Math.random()
	const id1 = Math.random()
	const id2 = Math.random()
	const id3 = Math.random()
	const node = {
		value: 8,
		id: id1,
		children: [
			{
				value: 7,
				id: id2,
				children: [{ value: 6, id: id3, children: [], parentID: id2 }],
				parentID: id1,
			},
		],
		parentID: superID,
	}

	const seven = avlBalance(node)
	expect(seven).toBeInstanceOf(Object)
	expect(seven.value).toBe(7)
	expect(seven.id).toBe(id2)
	expect(seven.children).toBeInstanceOf(Array)
	expect(seven.children.length).toBe(2)
	expect(seven.parentID).toBe(superID)

	const six = seven.children[0]
	expect(six).toBeInstanceOf(Object)
	expect(six.value).toBe(6)
	expect(six.id).toBe(id3)
	expect(six.children).toStrictEqual([])
	expect(six.parentID).toBe(seven.id)

	const eight = seven.children[1]
	expect(eight).toBeInstanceOf(Object)
	expect(eight.value).toBe(8)
	expect(eight.id).toBe(id1)
	expect(eight.children).toStrictEqual([])
	expect(eight.parentID).toBe(seven.id)
})
// Unbalanced left->right
test("avlBalance left -> right", () => {
	const superID = Math.random()
	const id1 = Math.random()
	const id2 = Math.random()
	const id3 = Math.random()
	const node = {
		value: 6,
		id: id1,
		children: [
			{
				value: 8,
				id: id2,
				children: [{ value: 7, id: id3, children: [], parentID: id2 }],
				parentID: id1,
			},
		],
		parentID: superID,
	}

	const seven = avlBalance(node)
	expect(seven).toBeInstanceOf(Object)
	expect(seven.value).toBe(7)
	expect(seven.id).toBe(id3)
	expect(seven.children).toBeInstanceOf(Array)
	expect(seven.children.length).toBe(2)
	expect(seven.parentID).toBe(superID)

	const six = seven.children[0]
	expect(six).toBeInstanceOf(Object)
	expect(six.value).toBe(6)
	expect(six.id).toBe(id1)
	expect(six.children).toStrictEqual([])
	expect(six.parentID).toBe(seven.id)

	const eight = seven.children[1]
	expect(eight).toBeInstanceOf(Object)
	expect(eight.value).toBe(8)
	expect(eight.id).toBe(id2)
	expect(eight.children).toStrictEqual([])
	expect(eight.parentID).toBe(seven.id)
})
// Unbalanced right->double, only possible on conversion from BST
test("avlBalance right -> double", () => {
	const superID = Math.random()
	const id1 = Math.random()
	const id2 = Math.random()
	const id3 = Math.random()
	const id4 = Math.random()
	const node = {
		value: 6,
		id: id1,
		children: [
			{
				value: 8,
				id: id2,
				children: [
					{ value: 7, id: id3, children: [], parentID: id2 },
					{ value: 9, id: id4, children: [], parentID: id2 },
				],
				parentID: id1,
			},
		],
		parentID: superID,
	}

	const eight = avlBalance(node)
	expect(eight).toBeInstanceOf(Object)
	expect(eight.value).toBe(8)
	expect(eight.id).toBe(id2)
	expect(eight.children).toBeInstanceOf(Array)
	expect(eight.children.length).toBe(2)
	expect(eight.parentID).toBe(superID)

	const seven = eight.children[0]
	expect(seven).toBeInstanceOf(Object)
	expect(seven.value).toBe(7)
	expect(seven.id).toBe(id3)
	expect(seven.children).toBeInstanceOf(Array)
	expect(seven.children.length).toBe(1)
	expect(seven.parentID).toBe(eight.id)

	const nine = eight.children[1]
	expect(nine).toBeInstanceOf(Object)
	expect(nine.value).toBe(9)
	expect(nine.id).toBe(id4)
	expect(nine.children).toStrictEqual([])
	expect(nine.parentID).toBe(eight.id)

	const six = seven.children[0]
	expect(six).toBeInstanceOf(Object)
	expect(six.value).toBe(6)
	expect(six.id).toBe(id1)
	expect(six.children).toStrictEqual([])
	expect(six.parentID).toBe(seven.id)
})
// Unbalanced left->double, only possible on conversion from BST
test("avlBalance left -> double", () => {
	const superID = Math.random()
	const id1 = Math.random()
	const id2 = Math.random()
	const id3 = Math.random()
	const id4 = Math.random()
	const node = {
		value: 6,
		id: id1,
		children: [
			{
				value: 4,
				id: id2,
				children: [
					{ value: 3, id: id3, children: [], parentID: id2 },
					{ value: 5, id: id4, children: [], parentID: id2 },
				],
				parentID: id1,
			},
		],
		parentID: superID,
	}

	const four = avlBalance(node)
	expect(four).toBeInstanceOf(Object)
	expect(four.value).toBe(4)
	expect(four.id).toBe(id2)
	expect(four.children).toBeInstanceOf(Array)
	expect(four.children.length).toBe(2)
	expect(four.parentID).toBe(superID)

	const three = four.children[0]
	expect(three).toBeInstanceOf(Object)
	expect(three.value).toBe(3)
	expect(three.id).toBe(id3)
	expect(three.children).toStrictEqual([])
	expect(three.parentID).toBe(four.id)

	const five = four.children[1]
	expect(five).toBeInstanceOf(Object)
	expect(five.value).toBe(5)
	expect(five.id).toBe(id4)
	expect(five.children).toBeInstanceOf(Array)
	expect(five.children.length).toBe(1)
	expect(five.parentID).toBe(four.id)

	const six = five.children[0]
	expect(six).toBeInstanceOf(Object)
	expect(six.value).toBe(6)
	expect(six.id).toBe(id1)
	expect(six.children).toStrictEqual([])
	expect(six.parentID).toBe(five.id)
})
// Unbalanced deep right imbalance
test("avlBalance deep right imbalance", () => {
	const id1 = Math.random()
	const id2 = Math.random()
	const id3 = Math.random()
	const id4 = Math.random()
	const id5 = Math.random()
	const id6 = Math.random()
	const superID = Math.random()
	const node = {
		value: 2,
		id: id1,
		children: [
			{ value: 1, id: id2, children: [], parentID: id1 },
			{
				value: 4,
				id: id3,
				children: [
					{ value: 3, id: id4, children: [], parentID: id3 },
					{ value: 5, id: id5, children: [{ value: 6, id: id6, children: [], parentID: id5 }], parentID: id3 },
				],
				parentID: id1,
			},
		],
		parentID: superID,
	}

	const four = avlBalance(node)
	expect(four).toBeInstanceOf(Object)
	expect(four.value).toBe(4)
	expect(four.id).toBe(id3)
	expect(four.children).toBeInstanceOf(Array)
	expect(four.children.length).toBe(2)
	expect(four.parentID).toBe(superID)

	const two = four.children[0]
	expect(two).toBeInstanceOf(Object)
	expect(two.value).toBe(2)
	expect(two.id).toBe(id1)
	expect(two.children).toBeInstanceOf(Array)
	expect(two.children.length).toBe(2)
	expect(two.parentID).toBe(four.id)

	const one = two.children[0]
	expect(one).toBeInstanceOf(Object)
	expect(one.value).toBe(1)
	expect(one.id).toBe(id2)
	expect(one.children).toStrictEqual([])
	expect(one.parentID).toBe(two.id)

	const three = two.children[1]
	expect(three).toBeInstanceOf(Object)
	expect(three.value).toBe(3)
	expect(three.id).toBe(id4)
	expect(three.children).toStrictEqual([])
	expect(three.parentID).toBe(two.id)

	const five = four.children[1]
	expect(five).toBeInstanceOf(Object)
	expect(five.value).toBe(5)
	expect(five.id).toBe(id5)
	expect(five.children).toBeInstanceOf(Array)
	expect(five.children.length).toBe(1)
	expect(five.parentID).toBe(four.id)

	const six = five.children[0]
	expect(six).toBeInstanceOf(Object)
	expect(six.value).toBe(6)
	expect(six.id).toBe(id6)
	expect(six.children).toStrictEqual([])
	expect(six.parentID).toBe(five.id)
})

// Generate lines tests
// Single node
test("generateLines single node", () => {
	const node = {
		value: 6,
		id: Math.random(),
		children: [],
		parentID: null,
	}
	expect(generateLines(node)).toStrictEqual([])
})
// One child
test("generateLines single child", () => {
	const id1 = Math.random()
	const id2 = Math.random()
	const node = {
		value: 6,
		id: id1,
		children: [{ value: 5, id: id2, children: [], parentID: id1 }],
		parentID: null,
	}
	expect(generateLines(node)).toStrictEqual([{ parentID: id1, childID: id2 }])
})
// Two children
test("generateLines two children", () => {
	const id1 = Math.random()
	const id2 = Math.random()
	const id3 = Math.random()
	const node = {
		value: 6,
		id: id1,
		children: [
			{ value: 5, id: id2, children: [], parentID: id1 },
			{ value: 7, id: id3, children: [], parentID: id1 },
		],
		parentID: null,
	}
	expect(generateLines(node)).toStrictEqual([
		{ parentID: id1, childID: id2 },
		{ parentID: id1, childID: id3 },
	])
})
// Single recursion
test("generateLines recursive", () => {
	const id1 = Math.random()
	const id2 = Math.random()
	const id3 = Math.random()
	const node = {
		value: 5,
		id: id1,
		children: [{ value: 7, id: id2, children: [{ value: 6, id: id3, children: [], parentID: id2 }], parentID: id1 }, ,],
		parentID: null,
	}
	expect(generateLines(node)).toStrictEqual([
		{ parentID: id1, childID: id2 },
		{ parentID: id2, childID: id3 },
	])
})
