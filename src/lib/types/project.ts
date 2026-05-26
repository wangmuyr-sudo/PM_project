/**
 * 平台类型
 */
export type PlatformType = "web" | "h5" | "app" | "mini-program";

/**
 * 输入源类型
 */
export type InputSourceType = "text" | "image";

/**
 * 输入源
 */
export interface InputSource {
  id: string;
  type: InputSourceType;
  name?: string;
  content?: string;
  previewUrl?: string;
}

/**
 * 产品理解
 */
export interface ProductUnderstanding {
  /** 产品解决的问题 */
  problem: string;
  /** 目标用户 */
  targetUsers: string[];
  /** 产品类型 */
  productType: string;
  /** 主要使用场景 */
  scenarios: string[];
  /** 已识别页面 */
  recognizedPages: string[];
  /** 已识别模块 */
  recognizedModules: string[];
  /** 置信度 */
  confidence: "high" | "medium" | "low";
  /** 假设项 */
  assumptions: string[];
}

/**
 * 项目
 */
export interface Project {
  id: string;
  name: string;
  platform: PlatformType;
  industry: string;
  description: string;
  inputSources: InputSource[];
  productUnderstanding?: ProductUnderstanding;
  featureTree?: FeatureTree;
  pageList?: ProductPage[];
  flows?: ProductFlow[];
  wireframes?: WireframePage[];
  prd?: string;
  devHandoff?: string;
  createdAt: string;
  updatedAt: string;
}

// 导入相关类型
import type { FeatureTree } from "./feature-tree";
import type { ProductPage } from "./page";
import type { ProductFlow } from "./flow";
import type { WireframePage } from "./wireframe";
