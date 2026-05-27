/**
 * AI Provider 接口定义
 * 统一的 AI 能力抽象层，支持后续替换真实大模型
 */

import type {
  ProductUnderstanding,
  FeatureTree,
  ProductPage,
  ProductFlow,
  WireframePage,
  Project,
  FeatureNode,
  PlatformType,
} from "../types";

/**
 * 分析输入参数
 */
export interface AnalyzeInputParams {
  /** 产品名称 */
  productName: string;
  /** 平台类型 */
  platform: string;
  /** 行业类型 */
  industry: string;
  /** 产品描述 */
  description: string;
  /** 用户文本输入 */
  textInput?: string;
  /** 截图描述列表 */
  screenshotDescriptions?: string[];
}

/**
 * 生成功能结构图参数
 */
export interface GenerateFeatureTreeParams {
  /** 产品理解 */
  productUnderstanding: ProductUnderstanding;
  /** 用户输入 */
  userInput?: string;
  /** 项目信息 */
  project: Partial<Project>;
}

/**
 * 更新功能结构图参数
 */
export interface UpdateFeatureTreeParams {
  /** 当前功能结构图 */
  featureTree: FeatureTree;
  /** 用户修改指令 */
  userInstruction: string;
  /** 用户回答的问题 */
  answeredQuestions?: Array<{
    nodeId: string;
    questionId: string;
    answer: string;
  }>;
}

/**
 * 生成页面清单参数
 */
export interface GeneratePageListParams {
  /** 功能结构图 */
  featureTree: FeatureTree;
}

/**
 * 生成流程参数
 */
export interface GenerateFlowsParams {
  /** 功能结构图 */
  featureTree: FeatureTree;
  /** 页面清单 */
  pageList: ProductPage[];
}

/**
 * 生成线框图参数
 */
export interface GenerateWireframesParams {
  /** 功能结构图 */
  featureTree: FeatureTree;
  /** 页面清单 */
  pageList: ProductPage[];
  /** 平台类型 */
  platform?: PlatformType;
}

/**
 * 生成 PRD 参数
 */
export interface GeneratePRDParams {
  /** 功能结构图 */
  featureTree: FeatureTree;
  /** 页面清单 */
  pageList: ProductPage[];
  /** 流程列表 */
  flows: ProductFlow[];
  /** 线框图 */
  wireframes: WireframePage[];
  /** 项目信息 */
  project: Partial<Project>;
  /** 平台类型 */
  platform?: PlatformType;
}

/**
 * 生成研发说明参数
 */
export interface GenerateDevHandoffParams {
  /** 功能结构图 */
  featureTree: FeatureTree;
  /** 页面清单 */
  pageList: ProductPage[];
  /** 流程列表 */
  flows: ProductFlow[];
  /** PRD 内容 */
  prd: string;
  /** 项目信息 */
  project: Partial<Project>;
  /** 平台类型 */
  platform?: PlatformType;
}

/**
 * AI Provider 接口
 */
export interface AIProvider {
  /**
   * 分析用户输入，生成产品理解
   */
  analyzeInput(params: AnalyzeInputParams): Promise<ProductUnderstanding>;

  /**
   * 根据产品理解生成功能结构图
   */
  generateFeatureTree(
    params: GenerateFeatureTreeParams
  ): Promise<FeatureTree>;

  /**
   * 根据用户确认更新功能结构图
   */
  updateFeatureTree(params: UpdateFeatureTreeParams): Promise<FeatureTree>;

  /**
   * 根据功能结构图生成页面清单
   */
  generatePageList(params: GeneratePageListParams): Promise<ProductPage[]>;

  /**
   * 根据功能结构图和页面清单生成流程
   */
  generateFlows(params: GenerateFlowsParams): Promise<ProductFlow[]>;

  /**
   * 根据功能结构图和页面清单生成线框图
   */
  generateWireframes(
    params: GenerateWireframesParams
  ): Promise<WireframePage[]>;

  /**
   * 根据确认后的结构生成 PRD
   */
  generatePRD(params: GeneratePRDParams): Promise<string>;

  /**
   * 根据确认后的结构生成研发说明
   */
  generateDevHandoff(params: GenerateDevHandoffParams): Promise<string>;
}

/**
 * AI Provider 类型
 */
export type AIProviderType = "mock" | "openai" | "anthropic" | "custom";
