import type { JsonValue } from "../types/json";

type JsonTreeNodeProps = {
  value: JsonValue;
  name?: string;
  nodeId: string;
  expandedNodes: Set<string>;
  onToggle: (nodeId: string) => void;
};

const getChildNodeId = (parentId: string, key: string | number) =>
  `${parentId}.${encodeURIComponent(String(key))}`;

export function JsonTreeNode({
  value,
  name,
  nodeId,
  expandedNodes,
  onToggle,
}: JsonTreeNodeProps) {
  const expanded = expandedNodes.has(nodeId);

  if (value === null) {
    return (
      <div className="json-tree-node json-tree-value">
        {name && <span className="json-tree-key">{name}</span>}

        <span className="json-tree-null">null</span>
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="json-tree-node">
        <button className="json-tree-toggle" onClick={() => onToggle(nodeId)}>
          <span className="json-tree-arrow">{expanded ? "▼" : "▶"}</span>

          {name && <span className="json-tree-key">{name}</span>}

          <span className="json-tree-meta">[{value.length}]</span>
        </button>

        {expanded && (
          <div className="json-tree-children">
            {value.map((item, index) => (
              <JsonTreeNode
                key={index}
                name={String(index)}
                value={item}
                nodeId={getChildNodeId(nodeId, index)}
                expandedNodes={expandedNodes}
                onToggle={onToggle}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (typeof value === "object") {
    return (
      <div className="json-tree-node">
        <button className="json-tree-toggle" onClick={() => onToggle(nodeId)}>
          <span className="json-tree-arrow">{expanded ? "▼" : "▶"}</span>

          {name && <span className="json-tree-key">{name}</span>}

          <span className="json-tree-meta">
            {`{${Object.keys(value).length}}`}
          </span>
        </button>

        {expanded && (
          <div className="json-tree-children">
            {Object.entries(value).map(([key, item]) => (
              <JsonTreeNode
                key={key}
                name={key}
                value={item}
                nodeId={getChildNodeId(nodeId, key)}
                expandedNodes={expandedNodes}
                onToggle={onToggle}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="json-tree-node json-tree-value">
      {name && <span className="json-tree-key">{name}</span>}

      <span className={`json-tree-${typeof value}`}>
        {typeof value === "string" ? `"${value}"` : String(value)}
      </span>
    </div>
  );
}
