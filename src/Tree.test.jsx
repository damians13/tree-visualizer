import { bstInsert, getNodeParentElementByID } from "./Tree"

// bstInsert tests
// No child test
test("inserts node in single node bst", () => {
	const node = bstInsert(
		{
			value: 3,
			id: Math.random(),
			children: [],
			parentID: null
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
		parentID: null
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
				parentID: id
			},
		],
		parentID: null
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
				parentID: id
			},
			{
				value: 6,
				id: Math.random(),
				children: [],
				parentID: id
			},
		],
		parentID: null
	}
	expect(bstInsert(duplicateDoubleChild, 2)).toStrictEqual(duplicateDoubleChild)
	expect(bstInsert(duplicateDoubleChild, 4)).toStrictEqual(duplicateDoubleChild)
	expect(bstInsert(duplicateDoubleChild, 6)).toStrictEqual(duplicateDoubleChild)
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
					parentID: id
				},
			],
			parentID: null
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