/**
 * 线框图块类型
 */
export type WireframeBlockType =
  | "header"
  | "nav"
  | "banner"
  | "card"
  | "list"
  | "form"
  | "button"
  | "tabs"
  | "modal"
  | "bottom-sheet"
  | "table"
  | "empty-state"
  | "text";

/**
 * 线框图块
 */
export interface WireframeBlock {
  id: string;
  type: WireframeBlockType;
  title: string;
  description?: string;
  fields?: string[];
  actions?: string[];
  children?: WireframeBlock[];
}

/**
 * 线框图页面
 */
export interface WireframePage {
  id: string;
  pageId: string;
  pageName: string;
  blocks: WireframeBlock[];
}

/**
 * 根据功能节点生成线框图块
 */
export function featureNodeToWireframeBlock(
  node: FeatureNode
): WireframeBlock | null {
  const blockTypeMap: Record<FeatureNodeType, WireframeBlockType | null> = {
    page: null, // 页面本身不是块
    module: "card",
    component: "card",
    field: "form",
    action: "button",
    modal: "modal",
    "bottom-sheet": "bottom-sheet",
    drawer: "modal",
    toast: "text",
    state: "text",
    rule: "text",
  };

  const blockType = blockTypeMap[node.type];
  if (!blockType) return null;

  const block: WireframeBlock = {
    id: `block-${node.id}`,
    type: blockType,
    title: node.name,
    description: node.description,
  };

  if (node.type === "module" && node.children) {
    block.fields = node.children
      .filter((c) => c.type === "field")
      .map((c) => c.name);
    block.actions = node.children
      .filter((c) => c.type === "action")
      .map((c) => c.name);
  }

  return block;
}

import type { FeatureNode, FeatureNodeType } from "./feature-tree";
