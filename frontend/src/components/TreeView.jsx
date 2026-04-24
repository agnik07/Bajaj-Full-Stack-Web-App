const TreeNode = ({ nodeName, nodeValue }) => {
  const children = Object.entries(nodeValue || {});
  return (
    <li className="ml-4 mt-2 list-none">
      <div className="inline-flex items-center rounded-lg bg-indigo-500/10 px-3 py-1 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
        {nodeName}
      </div>
      {children.length > 0 && (
        <ul className="border-l border-indigo-300 pl-3 dark:border-indigo-700">
          {children.map(([childName, childValue]) => (
            <TreeNode key={childName} nodeName={childName} nodeValue={childValue} />
          ))}
        </ul>
      )}
    </li>
  );
};

const TreeView = ({ hierarchy }) => {
  if (hierarchy.has_cycle) {
    return (
      <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-4 text-sm text-rose-700 dark:text-rose-300">
        Cyclic group detected. Root selected: <span className="font-semibold">{hierarchy.root}</span>
      </div>
    );
  }

  const [rootNode] = Object.keys(hierarchy.tree || {});
  if (!rootNode) {
    return <div className="text-sm text-slate-500">No tree data available</div>;
  }

  return (
    <div className="rounded-xl bg-slate-100/70 p-4 dark:bg-slate-800/50">
      <ul>
        <TreeNode nodeName={rootNode} nodeValue={hierarchy.tree[rootNode]} />
      </ul>
    </div>
  );
};

export default TreeView;
