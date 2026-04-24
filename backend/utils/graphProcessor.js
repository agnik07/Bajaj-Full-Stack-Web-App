const EDGE_PATTERN = /^([A-Z])->([A-Z])$/;

const nodeComparator = (a, b) => a.localeCompare(b);

const buildTreeObject = (node, childrenMap) => {
  const children = childrenMap.get(node) || [];
  const branch = {};
  for (const child of children) {
    branch[child] = buildTreeObject(child, childrenMap);
  }
  return branch;
};

const getDepth = (node, childrenMap) => {
  const children = childrenMap.get(node) || [];
  if (children.length === 0) {
    return 1;
  }
  let maxDepth = 0;
  for (const child of children) {
    maxDepth = Math.max(maxDepth, getDepth(child, childrenMap));
  }
  return maxDepth + 1;
};

const buildUndirectedAdjacency = (edges) => {
  const adjacency = new Map();
  for (const [from, to] of edges) {
    if (!adjacency.has(from)) adjacency.set(from, new Set());
    if (!adjacency.has(to)) adjacency.set(to, new Set());
    adjacency.get(from).add(to);
    adjacency.get(to).add(from);
  }
  return adjacency;
};

const getComponents = (adjacency) => {
  const visited = new Set();
  const components = [];
  const nodes = [...adjacency.keys()].sort(nodeComparator);

  for (const node of nodes) {
    if (visited.has(node)) continue;
    const stack = [node];
    const component = new Set();
    visited.add(node);
    while (stack.length > 0) {
      const current = stack.pop();
      component.add(current);
      for (const neighbor of adjacency.get(current) || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          stack.push(neighbor);
        }
      }
    }
    components.push(component);
  }
  return components;
};

const isCyclicComponent = (componentNodes, directedAdjacency) => {
  const state = new Map();
  for (const node of componentNodes) state.set(node, 0);

  const dfs = (node) => {
    state.set(node, 1);
    for (const neighbor of directedAdjacency.get(node) || []) {
      if (!componentNodes.has(neighbor)) continue;
      const neighborState = state.get(neighbor);
      if (neighborState === 1) return true;
      if (neighborState === 0 && dfs(neighbor)) return true;
    }
    state.set(node, 2);
    return false;
  };

  for (const node of [...componentNodes].sort(nodeComparator)) {
    if (state.get(node) === 0 && dfs(node)) return true;
  }
  return false;
};

export const processHierarchyData = (inputData) => {
  const invalidEntries = [];
  const duplicateEdges = [];
  const duplicateEdgeSet = new Set();
  const acceptedEdges = [];
  const seenEdgeSet = new Set();
  const parentOf = new Map();

  for (const item of inputData) {
    const normalized = String(item).trim();
    const match = normalized.match(EDGE_PATTERN);

    if (!match) {
      invalidEntries.push(item);
      continue;
    }

    const from = match[1];
    const to = match[2];

    if (from === to) {
      invalidEntries.push(item);
      continue;
    }

    const edgeKey = `${from}->${to}`;
    if (seenEdgeSet.has(edgeKey)) {
      if (!duplicateEdgeSet.has(edgeKey)) {
        duplicateEdgeSet.add(edgeKey);
        duplicateEdges.push(edgeKey);
      }
      continue;
    }
    seenEdgeSet.add(edgeKey);

    if (parentOf.has(to)) {
      continue;
    }

    parentOf.set(to, from);
    acceptedEdges.push([from, to]);
  }

  const directedAdjacency = new Map();
  const allNodes = new Set();
  for (const [from, to] of acceptedEdges) {
    if (!directedAdjacency.has(from)) directedAdjacency.set(from, []);
    if (!directedAdjacency.has(to)) directedAdjacency.set(to, []);
    directedAdjacency.get(from).push(to);
    allNodes.add(from);
    allNodes.add(to);
  }

  for (const node of directedAdjacency.keys()) {
    directedAdjacency.get(node).sort(nodeComparator);
  }

  const undirectedAdjacency = buildUndirectedAdjacency(acceptedEdges);
  const hierarchies = [];
  let totalTrees = 0;
  let totalCycles = 0;
  let largestDepth = 0;
  let largestTreeRoot = "";

  for (const component of getComponents(undirectedAdjacency)) {
    const nodes = [...component].sort(nodeComparator);
    const cyclic = isCyclicComponent(component, directedAdjacency);

    if (cyclic) {
      totalCycles += 1;
      hierarchies.push({
        root: nodes[0],
        tree: {},
        has_cycle: true
      });
      continue;
    }

    const roots = nodes.filter((node) => !parentOf.has(node)).sort(nodeComparator);
    const root = roots[0] || nodes[0];
    const tree = {
      [root]: buildTreeObject(root, new Map([...directedAdjacency].map(([k, v]) => [k, v])))
    };
    const depth = getDepth(root, directedAdjacency);

    totalTrees += 1;
    if (
      depth > largestDepth ||
      (depth === largestDepth && (largestTreeRoot === "" || root.localeCompare(largestTreeRoot) < 0))
    ) {
      largestDepth = depth;
      largestTreeRoot = root;
    }

    hierarchies.push({
      root,
      tree,
      depth
    });
  }

  return {
    hierarchies,
    invalidEntries,
    duplicateEdges,
    summary: {
      totalTrees,
      totalCycles,
      largestTreeRoot
    }
  };
};
