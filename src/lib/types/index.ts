/**
 * 类型定义统一导出
 */

// 项目相关
export type {
  PlatformType,
  InputSourceType,
  InputSource,
  ProductUnderstanding,
  Project,
} from "./project";

// 功能结构图相关
export type {
  FeatureNodeType,
  PresentationType,
  NodeStatus,
  ConfidenceLevel,
  QuestionImpact,
  ConfirmQuestion,
  FeatureNode,
  FeatureTree,
} from "./feature-tree";

export {
  findNodeById,
  updateNodeById,
  removeNodeById,
  getAllQuestions,
  countNodes,
  countNodesByType,
  flattenNodes,
} from "./feature-tree";

// 页面相关
export type { PageStatus, ProductPage } from "./page";
export { extractPagesFromFeatureTree } from "./page";

// 流程相关
export type { FlowType, ProductFlow } from "./flow";
export { groupFlowsByType, getFlowsByPage } from "./flow";

// 线框图相关
export type { WireframeBlockType, WireframeBlock, WireframePage } from "./wireframe";
export { featureNodeToWireframeBlock } from "./wireframe";
