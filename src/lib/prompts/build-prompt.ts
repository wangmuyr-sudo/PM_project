/**
 * Prompt Builder
 * 按照规定的拼接顺序构建 Prompt
 * 
 * 拼接顺序：
 * 1. Product Delivery Skill
 * 2. 当前任务 Prompt
 * 3. 用户输入
 * 4. 当前已确认结构
 * 5. 输出格式要求
 */

import { loadSkill } from "../skills/skill-loader";
import type { Project, FeatureTree } from "../types";

/**
 * Prompt 构建参数
 */
export interface BuildPromptParams {
  /** 任务类型 */
  task: PromptTask;
  /** 用户输入 */
  userInput?: string;
  /** 当前项目 */
  project?: Partial<Project>;
  /** 当前功能结构图 */
  featureTree?: FeatureTree;
  /** 额外上下文 */
  extraContext?: string;
}

/**
 * 任务类型
 */
export type PromptTask =
  | "analyzeInput"
  | "generateFeatureTree"
  | "updateFeatureTree"
  | "generatePageList"
  | "generateFlows"
  | "generateWireframes"
  | "generatePRD"
  | "generateDevHandoff";

/**
 * 任务 Prompt 模板
 */
const TASK_PROMPTS: Record<PromptTask, string> = {
  analyzeInput: `你正在分析一个产品经理提供的混乱输入。

请根据用户输入，识别产品意图、核心用户、产品类型、主要场景、可能页面和主要模块。

不要假装全部确定。
必须把内容分成：
1. 已识别信息
2. 推测信息
3. 待确认信息

输出 ProductUnderstanding JSON。`,

  generateFeatureTree: `你正在为产品经理生成功能结构图草案。

功能结构图不是页面树，而是产品功能、页面、模块、字段、操作、弹窗、底部弹层、状态、规则之间的结构关系。

请严格使用 PRODUCT_DELIVERY_SKILL 中定义的节点类型和承载形式。

每个节点都必须包含：
id
name
type
presentationType
description
status
confidence
reason
children
questions

必须主动生成待确认点。
待确认点必须挂在相关节点下。
不要问随机问题。
不要把所有东西都当页面。
不要新增和用户输入无关的核心功能。

输出 FeatureTree JSON。`,

  updateFeatureTree: `你正在根据产品经理的确认结果更新功能结构图。

请保留原有已确认结构。
只根据用户的新回答和修改指令更新相关节点。

用户回答可能导致：
新增页面
新增模块
新增字段
新增操作
新增状态
新增规则
新增弹窗
新增底部弹层
新增流程

不要把每个回答都变成页面。
不要删除用户没有要求删除的节点。
不要改变产品方向。
不要随意新增无关功能。

输出完整更新后的 FeatureTree JSON。`,

  generatePageList: `你正在根据已确认的功能结构图生成页面清单。

只把 type 为 page 的节点，或明确应该作为页面承载的节点，生成到页面清单中。

不要把字段、按钮、Toast、规则、普通模块当成页面。

每个页面必须说明：
页面目标
包含模块
关键操作
入口来源
跳转目标
MVP 或后续版本

输出 ProductPage[] JSON。`,

  generateFlows: `你正在生成页面跳转关系。

请根据已确认的功能结构图和页面清单生成流程。

必须把流程分成三类：
recognized：从用户输入或结构中明确识别到的流程
assumed：根据常见产品逻辑推测的流程
pending：仍需产品经理确认的流程

不要假装所有流程都确定。
每个流程必须说明触发动作和目标页面。
输出 ProductFlow[] JSON。`,

  generateWireframes: `你正在生成简单线框图结构。

线框图不是高保真 UI。
不要生成复杂视觉设计。
不要生成 React。
不要生成 HTML。
不要生成代码。

线框图只需要表达：
页面区域
模块顺序
字段位置
按钮位置
弹窗
底部弹层
状态

每个页面生成一个 WireframePage。
每个模块生成对应 WireframeBlock。

输出 WireframePage[] JSON。`,

  generatePRD: `你正在生成产品经理式 PRD。

PRD 必须基于已确认的功能结构图生成。
不要直接根据用户一句话生成。
不要写空泛口号。
不要使用"优化用户体验""提升效率"这种空话，除非后面有具体说明。

PRD 必须包含：
1. 产品概述
2. 目标用户
3. 业务目标
4. MVP 范围
5. 后续版本范围
6. 页面清单
7. 页面说明
8. 模块说明
9. 字段说明
10. 按钮操作说明
11. 页面跳转关系
12. 状态说明
13. 弹窗 / 底部弹层说明
14. 异常状态
15. 待确认事项
16. 研发注意事项

输出 Markdown。`,

  generateDevHandoff: `你正在生成研发理解说明。

研发说明面向前端、后端、测试、技术负责人。

目标是让研发能快速接手，不需要反复问产品经理。

必须说明：
页面有哪些
每个页面有哪些模块
每个模块有哪些字段
每个按钮点击后发生什么
哪些地方需要接口
哪些地方可以用 mock 数据
有哪些状态
有哪些异常情况
哪些是 MVP 必须做
哪些是后续版本

输出 Markdown。`,
};

/**
 * 输出格式要求
 */
const OUTPUT_FORMATS: Record<PromptTask, string> = {
  analyzeInput: `输出 JSON Schema：
{
  "problem": "string",
  "targetUsers": ["string"],
  "productType": "string",
  "scenarios": ["string"],
  "recognizedPages": ["string"],
  "recognizedModules": ["string"],
  "confidence": "high | medium | low",
  "assumptions": ["string"]
}

只输出 JSON，不要输出其他内容。`,

  generateFeatureTree: `输出 JSON Schema：
{
  "productName": "string",
  "nodes": [
    {
      "id": "string",
      "name": "string",
      "type": "page | module | component | field | action | modal | bottom-sheet | drawer | toast | state | rule",
      "presentationType": "page | modal | bottom-sheet | drawer | inline | toast | none",
      "description": "string",
      "status": "confirmed | pending | optional | later",
      "confidence": "high | medium | low",
      "reason": "string",
      "children": [],
      "questions": [
        {
          "id": "string",
          "question": "string",
          "options": ["string"],
          "answer": "",
          "impact": "page | module | field | state | flow | rule | modal | bottom-sheet"
        }
      ]
    }
  ]
}

只输出 JSON，不要输出其他内容。`,

  updateFeatureTree: `输出完整更新后的 FeatureTree JSON。
只输出 JSON，不要输出其他内容。`,

  generatePageList: `输出 JSON Schema：
[
  {
    "id": "string",
    "name": "string",
    "goal": "string",
    "modules": ["string"],
    "keyActions": ["string"],
    "entryFrom": ["string"],
    "navigateTo": ["string"],
    "status": "mvp | later"
  }
]

只输出 JSON，不要输出其他内容。`,

  generateFlows: `输出 JSON Schema：
[
  {
    "id": "string",
    "name": "string",
    "type": "recognized | assumed | pending",
    "from": "string",
    "trigger": "string",
    "to": "string",
    "description": "string",
    "confidence": "high | medium | low"
  }
]

只输出 JSON，不要输出其他内容。`,

  generateWireframes: `输出 JSON Schema：
[
  {
    "id": "string",
    "pageId": "string",
    "pageName": "string",
    "blocks": [
      {
        "id": "string",
        "type": "header | nav | banner | card | list | form | button | tabs | modal | bottom-sheet | table | empty-state | text",
        "title": "string",
        "description": "string",
        "fields": ["string"],
        "actions": ["string"],
        "children": []
      }
    ]
  }
]

只输出 JSON，不要输出其他内容。`,

  generatePRD: `输出 Markdown 格式的 PRD。

格式：
# PRD：产品名称

## 1. 产品概述
## 2. 目标用户
## 3. 业务目标
## 4. MVP 范围
## 5. 后续版本范围
## 6. 页面清单
## 7. 页面说明
## 8. 模块说明
## 9. 字段说明
## 10. 按钮操作说明
## 11. 页面跳转关系
## 12. 状态说明
## 13. 弹窗 / 底部弹层说明
## 14. 异常状态
## 15. 待确认事项
## 16. 研发注意事项`,

  generateDevHandoff: `输出 Markdown 格式的研发说明。

格式：
# 研发理解说明：产品名称

## 1. 页面总览
## 2. 页面与模块说明
## 3. 字段说明
## 4. 操作与跳转
## 5. 状态与异常
## 6. 接口建议
## 7. Mock 数据建议
## 8. MVP 范围
## 9. 后续版本范围
## 10. 研发注意事项`,
};

/**
 * 构建 Prompt
 */
export function buildPrompt(params: BuildPromptParams): string {
  const { task, userInput, project, featureTree, extraContext } = params;

  const sections: string[] = [];

  // 1. Product Delivery Skill
  const skillContent = loadSkill("product-delivery");
  sections.push(`# PRODUCT_DELIVERY_SKILL\n\n${skillContent}`);

  // 2. 当前任务 Prompt
  const taskPrompt = TASK_PROMPTS[task];
  sections.push(`# 任务说明\n\n${taskPrompt}`);

  // 3. 用户输入
  if (userInput) {
    sections.push(`# 用户输入\n\n${userInput}`);
  }

  // 4. 当前已确认结构
  const structureContext = buildStructureContext(project, featureTree);
  if (structureContext) {
    sections.push(`# 当前项目结构\n\n${structureContext}`);
  }

  // 5. 额外上下文
  if (extraContext) {
    sections.push(`# 额外信息\n\n${extraContext}`);
  }

  // 6. 输出格式要求
  const outputFormat = OUTPUT_FORMATS[task];
  sections.push(`# 输出格式要求\n\n${outputFormat}`);

  return sections.join("\n\n---\n\n");
}

/**
 * 构建项目结构上下文
 */
function buildStructureContext(
  project?: Partial<Project>,
  featureTree?: FeatureTree
): string {
  if (!project && !featureTree) {
    return "";
  }

  const parts: string[] = [];

  if (project) {
    parts.push(`产品名称：${project.name || "未命名"}`);
    parts.push(`平台类型：${project.platform || "未指定"}`);
    parts.push(`行业类型：${project.industry || "未指定"}`);
    parts.push(`产品描述：${project.description || "未提供"}`);

    if (project.productUnderstanding) {
      parts.push(`\n已识别的产品理解：`);
      parts.push(`- 问题：${project.productUnderstanding.problem}`);
      parts.push(
        `- 目标用户：${project.productUnderstanding.targetUsers.join("、")}`
      );
      parts.push(`- 产品类型：${project.productUnderstanding.productType}`);
    }
  }

  if (featureTree) {
    parts.push(`\n当前功能结构图：`);
    parts.push(`产品名称：${featureTree.productName}`);
    parts.push(`节点数量：${featureTree.nodes.length}`);
    parts.push(`\n节点结构：`);
    parts.push(JSON.stringify(featureTree, null, 2));
  }

  return parts.join("\n");
}

/**
 * 获取任务 Prompt（不包含 Skill）
 */
export function getTaskPrompt(task: PromptTask): string {
  return TASK_PROMPTS[task];
}

/**
 * 获取输出格式要求
 */
export function getOutputFormat(task: PromptTask): string {
  return OUTPUT_FORMATS[task];
}
