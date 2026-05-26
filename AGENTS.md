# AI 产品交付工作台 - 项目上下文

## 产品定位

> 把混乱页面、截图、想法和 AI 生成结果，整理成可评审、可交付、研发能接手的产品资产。

**不是** AI UI 生成器、低代码平台、应用开发平台或代码生成器。

## 版本技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4
- **状态管理**: Zustand

## 目录结构

```
├── public/                     # 静态资源
├── scripts/                    # 构建与启动脚本
├── src/
│   ├── app/                    # 页面路由
│   │   ├── page.tsx            # 首页
│   │   └── projects/           # 项目相关页面
│   │       ├── new/            # 创建项目
│   │       └── [id]/           # 项目详情
│   │           ├── input/      # 输入资料
│   │           ├── analysis/   # 分析结果
│   │           ├── structure/  # 功能结构图（核心）
│   │           ├── pages/      # 页面清单
│   │           ├── flows/      # 跳转关系
│   │           ├── wireframes/ # 线框图
│   │           ├── prd/        # PRD
│   │           └── handoff/    # 研发说明
│   │
│   ├── components/             # 组件
│   │   ├── layout/             # 布局组件
│   │   ├── project/            # 项目相关
│   │   ├── analysis/           # 分析结果
│   │   ├── structure/          # 功能结构图
│   │   ├── pages/              # 页面清单
│   │   ├── flows/              # 流程
│   │   ├── wireframes/         # 线框图
│   │   ├── prd/                # PRD
│   │   ├── handoff/            # 研发说明
│   │   └── ui/                 # shadcn/ui
│   │
│   └── lib/                    # 核心库
│       ├── ai/                 # AI Provider
│       │   ├── ai-provider.ts  # 接口定义
│       │   ├── mock-ai-provider.ts  # Mock 实现
│       │   └── ai-client.ts    # 统一入口
│       │
│       ├── skills/             # Skill 定义
│       │   ├── product-delivery/SKILL.md  # 核心技能
│       │   └── skill-loader.ts # 加载器
│       │
│       ├── prompts/            # Prompt 构建
│       │   └── build-prompt.ts # 拼接器
│       │
│       ├── store/              # 状态管理
│       │   └── project-store.ts  # Zustand Store
│       │
│       ├── types/              # 类型定义
│       │   ├── project.ts      # 项目类型
│       │   ├── feature-tree.ts # 功能结构图
│       │   ├── page.ts         # 页面类型
│       │   ├── flow.ts         # 流程类型
│       │   ├── wireframe.ts    # 线框图类型
│       │   └── index.ts        # 统一导出
│       │
│       ├── export/             # 导出功能
│       │   └── export.ts
│       │
│       └── utils/              # 工具函数
│           ├── helpers.ts      # 通用工具
│           └── utils.ts        # cn 等
│
├── next.config.ts
├── package.json
└── tsconfig.json
```

## 包管理规范

**仅允许使用 pnpm** 作为包管理器，严禁使用 npm 或 yarn。

## 开发规范

### 编码规范

- TypeScript strict 模式
- 禁止隐式 `any` 和 `as any`
- 函数参数、返回值需明确类型

### Hydration 问题防范

- 动态数据使用 'use client' + useEffect + useState
- 禁止使用 head 标签，使用 metadata

### UI 组件规范

- 默认采用 shadcn/ui 组件
- 位于 `src/components/ui/` 目录

## 核心数据结构

### Project

项目主体，包含所有产品资产。

### FeatureTree

功能结构图，核心资产，包含：
- 页面、模块、字段、操作、弹窗、底部弹层、状态、规则

### FeatureNode

功能节点，包含：
- type: 节点类型（page/module/field/action/modal/等）
- presentationType: 承载形式
- status: 状态（confirmed/pending/optional/later）
- confidence: 置信度
- questions: 待确认问题

## 核心流程

```
输入想法/截图/AI生成页面
    ↓
AI 识别产品结构
    ↓
AI 生成功能结构图草案 + 待确认点
    ↓
用户确认和修改
    ↓
生成线框图、PRD、研发说明
```

## AI Provider 使用

```typescript
import { getAIProvider } from '@/lib/ai/ai-client';

const ai = getAIProvider();
const understanding = await ai.analyzeInput({ ... });
const featureTree = await ai.generateFeatureTree({ ... });
```

## Store 使用

```typescript
import { useProjectStore, useCurrentProject } from '@/lib/store/project-store';

// 获取项目列表
const projects = useProjectStore(state => state.projects);

// 创建项目
const project = useProjectStore.getState().createProject({ ... });

// 更新功能节点
useProjectStore.getState().updateFeatureNode(projectId, nodeId, { ... });
```

## 验收标准

MVP 完成后，必须跑通：
1. 用户创建项目
2. 用户输入产品描述或上传截图
3. 点击开始分析
4. 系统生成产品理解
5. 系统生成功能结构图
6. 系统生成待确认点
7. 用户可以修改功能节点
8. 用户可以回答待确认点
9. 系统生成页面清单
10. 系统生成页面跳转关系
11. 系统生成线框图
12. 系统生成 PRD
13. 系统生成研发说明
14. 用户可以导出 JSON / Markdown
