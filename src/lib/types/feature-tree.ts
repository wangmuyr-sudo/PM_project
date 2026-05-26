/**
 * 功能节点类型
 */
export type FeatureNodeType =
  | "page"
  | "module"
  | "component"
  | "field"
  | "action"
  | "modal"
  | "bottom-sheet"
  | "drawer"
  | "toast"
  | "state"
  | "rule";

/**
 * 承载形式
 */
export type PresentationType =
  | "page"
  | "modal"
  | "bottom-sheet"
  | "drawer"
  | "inline"
  | "toast"
  | "none";

/**
 * 节点状态
 */
export type NodeStatus = "confirmed" | "pending" | "optional" | "later";

/**
 * 置信度
 */
export type ConfidenceLevel = "high" | "medium" | "low";

/**
 * 待确认问题影响类型
 */
export type QuestionImpact =
  | "page"
  | "module"
  | "field"
  | "state"
  | "flow"
  | "rule"
  | "modal"
  | "bottom-sheet";

/**
 * 待确认问题
 */
export interface ConfirmQuestion {
  id: string;
  question: string;
  options?: string[];
  answer?: string;
  impact: QuestionImpact;
}

/**
 * 功能节点
 */
export interface FeatureNode {
  id: string;
  name: string;
  type: FeatureNodeType;
  presentationType: PresentationType;
  description?: string;
  status: NodeStatus;
  confidence: ConfidenceLevel;
  reason?: string;
  children?: FeatureNode[];
  questions?: ConfirmQuestion[];
}

/**
 * 功能结构图
 */
export interface FeatureTree {
  productName: string;
  nodes: FeatureNode[];
}

/**
 * 递归查找节点
 */
export function findNodeById(
  nodes: FeatureNode[],
  id: string
): FeatureNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * 递归更新节点
 */
export function updateNodeById(
  nodes: FeatureNode[],
  id: string,
  patch: Partial<FeatureNode>
): FeatureNode[] {
  return nodes.map((node) => {
    if (node.id === id) {
      return { ...node, ...patch };
    }
    if (node.children) {
      return {
        ...node,
        children: updateNodeById(node.children, id, patch),
      };
    }
    return node;
  });
}

/**
 * 递归删除节点
 */
export function removeNodeById(
  nodes: FeatureNode[],
  id: string
): FeatureNode[] {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => {
      if (node.children) {
        return {
          ...node,
          children: removeNodeById(node.children, id),
        };
      }
      return node;
    });
}

/**
 * 获取所有待确认问题
 */
export function getAllQuestions(nodes: FeatureNode[]): Array<{
  nodeId: string;
  nodeName: string;
  question: ConfirmQuestion;
}> {
  const result: Array<{
    nodeId: string;
    nodeName: string;
    question: ConfirmQuestion;
  }> = [];

  function traverse(node: FeatureNode) {
    if (node.questions && node.questions.length > 0) {
      for (const question of node.questions) {
        result.push({
          nodeId: node.id,
          nodeName: node.name,
          question,
        });
      }
    }
    if (node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  for (const node of nodes) {
    traverse(node);
  }

  return result;
}

/**
 * 统计节点数量
 */
export function countNodes(nodes: FeatureNode[]): number {
  let count = 0;
  function traverse(node: FeatureNode) {
    count++;
    if (node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }
  for (const node of nodes) {
    traverse(node);
  }
  return count;
}

/**
 * 按类型统计节点
 */
export function countNodesByType(
  nodes: FeatureNode[]
): Record<FeatureNodeType, number> {
  const counts: Record<FeatureNodeType, number> = {
    page: 0,
    module: 0,
    component: 0,
    field: 0,
    action: 0,
    modal: 0,
    "bottom-sheet": 0,
    drawer: 0,
    toast: 0,
    state: 0,
    rule: 0,
  };

  function traverse(node: FeatureNode) {
    counts[node.type]++;
    if (node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  for (const node of nodes) {
    traverse(node);
  }

  return counts;
}

/**
 * 扁平化节点树为列表
 */
export function flattenNodes(nodes: FeatureNode[]): FeatureNode[] {
  const result: FeatureNode[] = [];

  function traverse(node: FeatureNode) {
    result.push(node);
    if (node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  for (const node of nodes) {
    traverse(node);
  }

  return result;
}
