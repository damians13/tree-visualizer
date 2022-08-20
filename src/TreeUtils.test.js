import { binaryInsert, bstInsert, getTreeHeight } from "./TreeUtils"

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
		4,
		[],
		() => {}
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
	expect(bstInsert(singleNode, 3, [], () => {})).toStrictEqual(singleNode)

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
	expect(bstInsert(nodeOneChild, 4, [], () => {})).toStrictEqual(nodeOneChild)

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
		topOffset: undefined,
		leftOffset: undefined,
		parentID: null,
	}
	expect(bstInsert(duplicateDoubleChild, 2, [], () => {})).toStrictEqual(duplicateDoubleChild)
	expect(bstInsert(duplicateDoubleChild, 4, [], () => {})).toStrictEqual(duplicateDoubleChild)
	expect(bstInsert(duplicateDoubleChild, 6, [], () => {})).toStrictEqual(duplicateDoubleChild)
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
		4,
		[],
		() => {}
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
		5,
		[],
		() => {}
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
		2,
		[],
		() => {}
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
		1,
		[],
		() => {}
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
		1,
		[],
		() => {}
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
		3,
		[],
		() => {}
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
		5,
		[],
		() => {}
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
		7,
		[],
		() => {}
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
	binaryInsert(node, 4, [], () => {})

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
	binaryInsert(node, 4, [], () => {})

	expect(node).toBeInstanceOf(Object)
	expect(node.value).toBe(3)
	expect(node.id).toBeDefined()
	expect(node.children).toBeInstanceOf(Array)
	expect(node.children.length).toBe(2)
	expect(node.parentID).toBeNull()

	let firstChild = node.children[0]
	expect(firstChild).toBeInstanceOf(Object)
	expect(firstChild.value).toBe(45)
	expect(firstChild.id).toBeDefined()
	expect(firstChild.children).toStrictEqual([])
	expect(firstChild.parentID).toBe(node.id)

	let secondChild = node.children[1]
	expect(secondChild).toBeInstanceOf(Object)
	expect(secondChild.value).toBe(4)
	expect(secondChild.id).toBeDefined()
	expect(secondChild.children).toStrictEqual([])
	expect(secondChild.parentID).toBe(node.id)

	// Second insertion
	binaryInsert(node, 6, [], () => {})

	expect(node).toBeInstanceOf(Object)
	expect(node.value).toBe(3)
	expect(node.id).toBeDefined()
	expect(node.children).toBeInstanceOf(Array)
	expect(node.children.length).toBe(2)
	expect(node.parentID).toBeNull()

	firstChild = node.children[0]
	expect(firstChild).toBeInstanceOf(Object)
	expect(firstChild.value).toBe(45)
	expect(firstChild.id).toBeDefined()
	expect(firstChild.children).toBeInstanceOf(Array)
	expect(firstChild.children.length).toBe(1)
	expect(firstChild.parentID).toBe(node.id)

	let firstGrandChild = firstChild.children[0]
	expect(firstGrandChild).toBeInstanceOf(Object)
	expect(firstGrandChild.value).toBe(6)
	expect(firstGrandChild.id).toBeDefined()
	expect(firstGrandChild.children).toStrictEqual([])
	expect(firstGrandChild.parentID).toBe(firstChild.id)

	secondChild = node.children[1]
	expect(secondChild).toBeInstanceOf(Object)
	expect(secondChild.value).toBe(4)
	expect(secondChild.id).toBeDefined()
	expect(secondChild.children).toStrictEqual([])
	expect(secondChild.parentID).toBe(node.id)

	// Third insertion
	binaryInsert(node, 6, [], () => {})

	expect(node).toBeInstanceOf(Object)
	expect(node.value).toBe(3)
	expect(node.id).toBeDefined()
	expect(node.children).toBeInstanceOf(Array)
	expect(node.children.length).toBe(2)
	expect(node.parentID).toBeNull()

	firstChild = node.children[0]
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

	secondChild = node.children[1]
	expect(secondChild).toBeInstanceOf(Object)
	expect(secondChild.value).toBe(4)
	expect(secondChild.id).toBeDefined()
	expect(secondChild.children).toStrictEqual([])
	expect(secondChild.parentID).toBe(node.id)
})
// Complex test
test("binary insert complex test", () => {
	const id1 = Math.random()
	const id2 = Math.random()
	const id3 = Math.random()
	const id4 = Math.random()
	let three = {
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
	binaryInsert(three, 6, [], () => {})

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
