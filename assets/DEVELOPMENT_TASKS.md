# DEVELOPMENT_TASKS.md

# AI 产品交付工作台 MVP 开发任务文档

## 1. 核心要求

请严格按照以下文档开发，不要自行发挥产品方向：

```txt
/docs/PRODUCT_SPEC.md
/docs/PRODUCT_DELIVERY_SKILL.md
/docs/PROMPT_TEMPLATES.md
/docs/DEVELOPMENT_TASKS.md
```

产品定位：

> 把混乱页面、截图、想法和 AI 生成结果，整理成可评审、可交付、研发能接手的产品资产。

本项目不是：

- AI UI 生成器
- AI 低代码平台
- AI 应用开发平台
- 代码生成器

---

## 2. Prompt 拼接规则

创建文件：

```txt
src/lib/prompts/build-prompt.ts
```

Prompt 拼接顺序必须是：

```txt
Product Delivery Skill
+
当前任务 Prompt
+
用户输入
+
当前已确认结构
+
输出格式要求
```

禁止把 OpenUI / TypeUI 作为核心 Prompt 约束。

当前核心 Skill 是：

```txt
src/lib/skills/product-delivery/SKILL.md
```

任务级 Prompt 模板来自：

```txt
/docs/PROMPT_TEMPLATES.md
```

---

## 3. AI Workflow 设计

### 3.1 AI Provider

实现统一接口：

```ts
export interface AIProvider {
  analyzeInput(input: AnalyzeInput): Promise<ProductUnderstanding>;
  generateFeatureTree(input: GenerateFeatureTreeInput): Promise<FeatureTree>;
  updateFeatureTree(input: UpdateFeatureTreeInput): Promise<FeatureTree>;
  generatePageList(input: GeneratePageListInput): Promise<ProductPage[]>;
  generateFlows(input: GenerateFlowsInput): Promise<ProductFlow[]>;
  generateWireframes(input: GenerateWireframesInput): Promise<WireframePage[]>;
  generatePRD(input: GeneratePRDInput): Promise<string>;
  generateDevHandoff(input: GenerateDevHandoffInput): Promise<string>;
}
```

默认实现：

```txt
MockAIProvider
```

真实大模型后续接入，不要写死模型。

---

## 4. 推荐项目目录结构

```txt
src/
  app/
    page.tsx
    projects/
      new/
        page.tsx
      [id]/
        input/
          page.tsx
        analysis/
          page.tsx
        structure/
          page.tsx
        pages/
          page.tsx
        flows/
          page.tsx
        wireframes/
          page.tsx
        prd/
          page.tsx
        handoff/
          page.tsx

  components/
    layout/
      app-shell.tsx
      sidebar.tsx
      topbar.tsx

    project/
      project-form.tsx
      input-panel.tsx
      screenshot-uploader.tsx

    analysis/
      product-understanding-card.tsx
      confidence-badge.tsx

    structure/
      feature-tree.tsx
      feature-node-item.tsx
      node-detail-panel.tsx
      confirm-question-panel.tsx
      node-type-select.tsx

    pages/
      page-list-table.tsx

    flows/
      flow-table.tsx
      flow-diagram.tsx

    wireframes/
      wireframe-renderer.tsx
      wireframe-page.tsx
      wireframe-block.tsx

    prd/
      prd-viewer.tsx

    handoff/
      handoff-viewer.tsx

    ui/
      shadcn components

  lib/
    ai/
      ai-provider.ts
      mock-ai-provider.ts
      ai-client.ts

    skills/
      product-delivery/
        SKILL.md
      skill-loader.ts

    prompts/
      build-prompt.ts
      analyze-input.prompt.ts
      generate-feature-tree.prompt.ts
      update-feature-tree.prompt.ts
      generate-page-list.prompt.ts
      generate-flows.prompt.ts
      generate-wireframes.prompt.ts
      generate-prd.prompt.ts
      generate-dev-handoff.prompt.ts

    store/
      project-store.ts

    types/
      project.ts
      feature-tree.ts
      page.ts
      flow.ts
      wireframe.ts

    export/
      export-json.ts
      export-markdown.ts

    utils/
      id.ts
      cn.ts
      storage.ts
```

---

## 5. 状态管理

使用 Zustand。

Store 需要包含：

```ts
type ProjectStore = {
  projects: Project[];
  currentProjectId?: string;

  createProject: (input: Partial<Project>) => Project;
  updateProject: (projectId: string, patch: Partial<Project>) => void;

  setProductUnderstanding: (projectId: string, data: ProductUnderstanding) => void;
  setFeatureTree: (projectId: string, data: FeatureTree) => void;
  updateFeatureNode: (projectId: string, nodeId: string, patch: Partial<FeatureNode>) => void;

  setPageList: (projectId: string, pages: ProductPage[]) => void;
  setFlows: (projectId: string, flows: ProductFlow[]) => void;
  setWireframes: (projectId: string, wireframes: WireframePage[]) => void;

  setPRD: (projectId: string, prd: string) => void;
  setDevHandoff: (projectId: string, handoff: string) => void;
};
```

数据需要同步保存到 localStorage。

---

## 6. MVP 开发任务拆分

### Task 1：初始化项目

- 创建 Next.js + TypeScript 项目
- 集成 Tailwind CSS
- 集成 shadcn/ui
- 配置基础 layout

### Task 2：实现类型系统

- Project
- FeatureTree
- FeatureNode
- ConfirmQuestion
- ProductPage
- ProductFlow
- WireframePage

### Task 3：实现 Product Delivery Skill

创建：

```txt
src/lib/skills/product-delivery/SKILL.md
```

写入 `/docs/PRODUCT_DELIVERY_SKILL.md` 完整内容。

实现：

```txt
src/lib/skills/skill-loader.ts
```

用于读取 Skill 文本。

### Task 4：实现 Prompt Builder

创建：

```txt
src/lib/prompts/build-prompt.ts
```

实现：

- 读取 Product Delivery Skill
- 拼接当前任务 Prompt
- 拼接用户输入
- 拼接当前项目结构
- 拼接输出格式要求

### Task 5：实现 Zustand Store

- 项目创建
- 项目更新
- 功能结构图更新
- PRD 更新
- 研发说明更新
- localStorage 持久化

### Task 6：实现项目创建和输入页面

- 创建项目页
- 文本输入
- 截图上传
- 文件预览
- 开始分析按钮

### Task 7：实现 Mock AI Provider

必须提供 mock 数据：

- 产品理解
- 功能结构图
- 待确认点
- 页面清单
- 跳转关系
- 线框图
- PRD
- 研发说明

### Task 8：实现分析结果页

- 展示产品理解
- 展示识别页面
- 展示识别模块
- 展示置信度
- 展示假设项

### Task 9：实现功能结构图确认页

这是 MVP 核心。

必须支持：

- 树形展示 FeatureTree
- 节点类型标签
- 承载形式标签
- 置信度标签
- 节点详情查看
- 节点重命名
- 节点类型修改
- 承载形式修改
- 节点状态修改
- 待确认问题回答

### Task 10：实现页面清单页

- 展示页面名称
- 页面目标
- 包含模块
- 入口来源
- 跳转目标
- MVP / 后续版本标记

### Task 11：实现跳转关系页

- 展示已识别流程
- 展示推测流程
- 展示待确认流程

### Task 12：实现线框图页

- 根据 WireframePage 渲染简单线框图
- 支持 page/module/field/action/modal/bottom-sheet/state/rule 的基础显示
- 不追求高保真
- 重点是清晰

### Task 13：实现 PRD 页

- 展示 Markdown PRD
- 复制 PRD
- 导出 Markdown

### Task 14：实现研发说明页

- 展示研发说明
- 复制研发说明
- 导出 Markdown

### Task 15：实现导出

- 导出完整项目 JSON
- 导出 PRD Markdown
- 导出研发说明 Markdown

---

## 7. 验收标准

MVP 完成后，必须跑通以下流程：

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

MVP 成功标准不是 UI 多漂亮，而是：

- 产品经理能拿去评审
- 研发能看懂页面和功能边界
- 系统能发现待确认点
- 用户能少写大量 PRD 和交付说明

---

## 8. 最重要的开发原则

### 8.1 不要做 AI 创作平台

本项目不是让 AI 发挥创造力，而是让 AI 帮产品经理整理、确认和交付。

### 8.2 不要把所有东西都当页面

功能结构图里的节点必须区分：

- 页面
- 模块
- 字段
- 操作
- 弹窗
- 底部弹层
- Toast
- 状态
- 规则

### 8.3 不要假装 AI 全知道

系统必须展示：

- 已识别
- 推测
- 待确认
- 置信度
- 判断理由

### 8.4 线框图必须进入 MVP

线框图不是高保真 UI，但必须有。

因为评审需要可视化。

### 8.5 PRD 和研发说明必须基于确认后的功能结构图生成

不要直接根据用户一句话生成 PRD。

正确流程是：

```txt
输入
↓
功能结构图
↓
用户确认
↓
PRD / 研发说明 / 线框图
```

---

## 9. 给 AI 开发工具的执行建议

请不要一次性实现全部功能。

请按以下阶段开发：

### 阶段 1

只完成：

- 项目初始化
- 目录结构
- 类型定义
- Zustand Store
- Mock AI Provider

不要做复杂 UI。

### 阶段 2

完成：

- 首页
- 项目创建页
- 输入资料页
- 分析结果页

使用 Mock 数据跑通创建到分析流程。

### 阶段 3

完成功能结构图确认页。

这是核心页面，必须支持：

- 节点查看
- 节点类型修改
- 承载形式修改
- 待确认问题回答

### 阶段 4

完成：

- 页面清单
- 跳转关系
- 线框图
- PRD
- 研发说明页面

### 阶段 5

实现：

- 导出完整项目 JSON
- 导出 PRD Markdown
- 导出研发说明 Markdown

---

## 10. 第一次让 AI 开发工具读取文档时的提示词

请把下面这段发给 AI 开发工具：

```txt
请先不要写代码。

请先读取 /docs/PRODUCT_SPEC.md、/docs/PRODUCT_DELIVERY_SKILL.md、/docs/PROMPT_TEMPLATES.md、/docs/DEVELOPMENT_TASKS.md。

然后先输出：

1. 你理解的产品目标
2. 需要创建的目录结构
3. 需要实现的页面
4. 需要实现的数据类型
5. 第一阶段开发计划

等我确认后，再开始写代码。
```

---

## 11. 最终一句话

第一版只做一件事：

> 把用户输入的想法、截图或 AI 生成页面，整理成功能结构图、待确认点、线框图、PRD 和研发说明。

这就是本 MVP 的全部核心。
