/**
 * 页面状态（MVP范围）
 */
export type PageStatus = "mvp" | "later";

/**
 * 产品页面
 */
export interface ProductPage {
  id: string;
  name: string;
  /** 页面目标 */
  goal: string;
  /** 包含模块 */
  modules: string[];
  /** 关键操作 */
  keyActions: string[];
  /** 入口来源 */
  entryFrom: string[];
  /** 跳转目标 */
  navigateTo: string[];
  status: PageStatus;
}

/**
 * 根据功能结构图提取页面列表
 */
export function extractPagesFromFeatureTree(
  nodes: FeatureNode[]
): Array<{ id: string; name: string; modules: string[] }> {
  const pages: Array<{ id: string; name: string; modules: string[] }> = [];

  function traverse(node: FeatureNode) {
    if (node.type === "page") {
      const modules: string[] = [];
      if (node.children) {
        for (const child of node.children) {
          if (child.type === "module") {
            modules.push(child.name);
          }
        }
      }
      pages.push({
        id: node.id,
        name: node.name,
        modules,
      });
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

  return pages;
}

import type { FeatureNode } from "./feature-tree";
