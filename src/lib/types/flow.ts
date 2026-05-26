/**
 * 流程类型
 */
export type FlowType = "recognized" | "assumed" | "pending";

/**
 * 置信度
 */
export type ConfidenceLevel = "high" | "medium" | "low";

/**
 * 产品流程
 */
export interface ProductFlow {
  id: string;
  name: string;
  type: FlowType;
  /** 来源页面 */
  from: string;
  /** 触发动作 */
  trigger: string;
  /** 目标页面 */
  to: string;
  description: string;
  confidence: ConfidenceLevel;
}

/**
 * 按类型分组流程
 */
export function groupFlowsByType(
  flows: ProductFlow[]
): Record<FlowType, ProductFlow[]> {
  return {
    recognized: flows.filter((f) => f.type === "recognized"),
    assumed: flows.filter((f) => f.type === "assumed"),
    pending: flows.filter((f) => f.type === "pending"),
  };
}

/**
 * 获取页面相关的流程
 */
export function getFlowsByPage(
  flows: ProductFlow[],
  pageId: string
): {
  incoming: ProductFlow[];
  outgoing: ProductFlow[];
} {
  return {
    incoming: flows.filter((f) => f.to === pageId),
    outgoing: flows.filter((f) => f.from === pageId),
  };
}
