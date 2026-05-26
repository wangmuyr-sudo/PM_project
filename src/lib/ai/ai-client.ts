/**
 * AI Client
 * 统一的 AI 客户端入口
 */

import type { AIProvider, AIProviderType } from "./ai-provider";
import { MockAIProvider } from "./mock-ai-provider";

/**
 * 全局 AI Provider 实例
 */
let currentProvider: AIProvider | null = null;

/**
 * 获取当前 AI Provider
 */
export function getAIProvider(): AIProvider {
  if (!currentProvider) {
    currentProvider = new MockAIProvider();
  }
  return currentProvider;
}

/**
 * 设置 AI Provider
 */
export function setAIProvider(provider: AIProvider): void {
  currentProvider = provider;
}

/**
 * 创建 AI Provider
 */
export function createAIProvider(type: AIProviderType = "mock"): AIProvider {
  switch (type) {
    case "mock":
      return new MockAIProvider();
    // 未来可以添加其他 Provider
    // case "openai":
    //   return new OpenAIProvider();
    // case "anthropic":
    //   return new AnthropicProvider();
    default:
      return new MockAIProvider();
  }
}

/**
 * 初始化 AI Provider
 */
export function initAIProvider(type: AIProviderType = "mock"): void {
  currentProvider = createAIProvider(type);
}

// 导出类型和实现
export * from "./ai-provider";
export { MockAIProvider } from "./mock-ai-provider";
