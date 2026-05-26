# PRODUCT_SPEC.md

# AI 产品交付工作台 MVP 产品需求文档

## 1. 产品定位

本项目不是 AI UI 生成器、AI 低代码平台、AI 应用开发平台。

本项目定位是：

> 把混乱页面、截图、想法和 AI 生成结果，整理成可评审、可交付、研发能接手的产品资产。

面向产品经理，把想法、截图、页面清单、AI 生成页面、竞品页面，自动整理为：

- 功能结构图
- 页面清单
- 页面模块拆解
- 页面跳转关系
- 产品经理式 PRD
- 研发理解说明
- 简单线框图 / 静态原型草图

本产品服务的是“交付效率”，不是“AI 创作”。

---

## 2. MVP 核心目标

MVP 只验证三件事：

1. 能不能帮助产品经理更快评审？
2. 能不能帮助产品经理更好交付？
3. 能不能让研发更快接手需求？

第一版不要追求复杂高保真 UI，不要做完整可点击交互原型，不要做 AI 生成完整应用。

第一版主流程：

```txt
输入想法 / 截图 / AI 生成页面
↓
AI 识别产品结构
↓
AI 生成功能结构图草案
↓
AI 生成待确认点
↓
用户确认和修改
↓
系统生成线框图、PRD、研发说明
```

---

## 3. MVP 必须输出

必须输出 7 类资产：

1. 功能结构图
2. 页面清单
3. 页面模块拆解
4. 页面跳转关系
5. 产品经理式 PRD
6. 研发理解说明
7. 简单线框图 / 静态原型草图

可选输出，暂不作为 MVP 必须项：

8. 给 AI 编程工具的开发提示词

---

## 4. MVP 不做

第一版不做：

- 复杂高保真 UI
- Figma / 墨刀 / Axure 导出
- 复杂可点击交互
- AI 自动开发应用
- 用户系统
- 团队协作
- 权限系统
- 复杂项目管理
- 真实后端
- 数据库
- 代码生成

MVP 使用前端本地状态和 localStorage 存储项目数据。

---

## 5. 推荐技术栈

前端：

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- Lucide React

存储：

- localStorage

AI：

- 先实现统一 AI Provider 接口
- 默认提供 Mock AI
- 后续可以替换成任意真实大模型 API
- 不要在业务代码里写死具体模型

---

## 6. 用户输入类型

MVP 支持两种输入。

### 6.1 文本输入

例如：

```txt
我要做一个中医预约小程序。
页面有：首页、医生列表页、医生详情页、预约确认页、我的预约页、个人中心。
医生列表页需要搜索框、科室筛选、医生卡片、评分、擅长领域、预约按钮。
```

### 6.2 截图上传

支持上传：

- 秒搭生成的页面截图
- 扣子生成的页面截图
- 墨刀原型截图
- 小程序截图
- H5 页面截图
- App 页面截图
- 竞品截图
- 已有业务页面截图

MVP 阶段截图可以只做前端预览和 Mock 分析，不要求真实 OCR 和真实视觉识别必须完成。

---

## 7. 核心产品流程

### Step 1：创建项目

用户填写：

- 产品名称
- 平台类型：web / h5 / app / mini-program
- 行业类型：医疗 / 教育 / 电商 / SaaS / 工具 / 社区 / 其他
- 产品描述

### Step 2：输入资料

用户可以：

- 输入文本需求
- 上传截图
- 查看上传内容预览
- 点击“开始分析”

### Step 3：AI 生成产品理解草案

系统输出：

- 产品解决的问题
- 核心用户
- 产品类型
- 主要使用场景
- 识别出的页面
- 识别出的主要模块
- 置信度

系统不能假装全部确定，必须区分：

- 已识别
- 推测
- 待确认

### Step 4：AI 生成功能结构图草案

功能结构图不是单纯页面树。

它是产品功能、页面、模块、字段、操作、弹窗、底部弹层、状态、规则之间的结构关系。

示例：

```txt
中医预约小程序
├── 首页 [页面]
│   ├── Banner [模块]
│   ├── 服务入口 [模块]
│   ├── 推荐医生 [模块]
│   └── 底部导航 [模块]
│
├── 医生列表页 [页面]
│   ├── 搜索框 [模块]
│   ├── 科室筛选 [底部弹层]
│   ├── 医生卡片 [模块]
│   │   ├── 医生头像 [字段]
│   │   ├── 医生姓名 [字段]
│   │   ├── 职称 [字段]
│   │   ├── 擅长领域 [字段]
│   │   └── 预约按钮 [操作]
│
├── 预约确认页 [页面]
│   ├── 就诊人信息 [模块]
│   ├── 预约时间 [模块]
│   ├── 症状描述 [字段]
│   └── 提交预约 [操作]
```

### Step 5：AI 生成待确认点

AI 把不确定问题挂到相关功能节点下。

例如：

```txt
预约模块 [待确认]
├── 是否需要支付？
├── 是否需要医生确认？
├── 是否支持取消预约？
├── 是否支持改约？
└── 是否需要微信通知？
```

用户回答后，系统自动更新功能结构图。

### Step 6：用户确认功能结构图

用户可以进行最小编辑：

- 新增节点
- 删除节点
- 重命名节点
- 修改节点类型
- 修改承载形式
- 回答待确认问题
- 标记 MVP
- 标记后续版本

### Step 7：生成页面清单

基于确认后的功能结构图，系统生成页面清单。

### Step 8：生成页面跳转关系

跳转关系区分：

- 已识别流程
- 推测流程
- 待确认流程

### Step 9：生成简单线框图 / 静态原型草图

MVP 必须生成简单线框图。

线框图不是高保真 UI。目标是让产品经理、老板、研发能看懂页面大概长什么样。

### Step 10：生成产品经理式 PRD

确认结构图后生成 PRD。

### Step 11：生成研发理解说明

研发理解说明必须说明：

- 页面有哪些
- 每个页面有哪些模块
- 每个模块有哪些字段
- 按钮点击后发生什么
- 哪些地方需要接口
- 哪些地方是假数据
- 有哪些状态
- 有哪些异常情况
- 哪些是 MVP 必须做
- 哪些是后续版本

---

## 8. 数据结构设计

### Project

```ts
export type Project = {
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
};
```

### PlatformType

```ts
export type PlatformType = "web" | "h5" | "app" | "mini-program";
```

### InputSource

```ts
export type InputSource = {
  id: string;
  type: "text" | "image";
  name?: string;
  content?: string;
  previewUrl?: string;
};
```

### ProductUnderstanding

```ts
export type ProductUnderstanding = {
  problem: string;
  targetUsers: string[];
  productType: string;
  scenarios: string[];
  recognizedPages: string[];
  recognizedModules: string[];
  confidence: "high" | "medium" | "low";
  assumptions: string[];
};
```

### FeatureTree

```ts
export type FeatureTree = {
  productName: string;
  nodes: FeatureNode[];
};
```

### FeatureNode

```ts
export type FeatureNode = {
  id: string;
  name: string;

  type:
    | "page"
    | "module"
    | "component"
    | "field"
    | "action"
    | "modal"
    | "bottom-sheet"
    | "drawer"
    | "toast"
    | "state"
    | "rule";

  presentationType:
    | "page"
    | "modal"
    | "bottom-sheet"
    | "drawer"
    | "inline"
    | "toast"
    | "none";

  description?: string;
  status: "confirmed" | "pending" | "optional" | "later";
  confidence: "high" | "medium" | "low";
  reason?: string;
  children?: FeatureNode[];
  questions?: ConfirmQuestion[];
};
```

### ConfirmQuestion

```ts
export type ConfirmQuestion = {
  id: string;
  question: string;
  options?: string[];
  answer?: string;

  impact:
    | "page"
    | "module"
    | "field"
    | "state"
    | "flow"
    | "rule"
    | "modal"
    | "bottom-sheet";
};
```

### ProductPage

```ts
export type ProductPage = {
  id: string;
  name: string;
  goal: string;
  modules: string[];
  keyActions: string[];
  entryFrom: string[];
  navigateTo: string[];
  status: "mvp" | "later";
};
```

### ProductFlow

```ts
export type ProductFlow = {
  id: string;
  name: string;
  type: "recognized" | "assumed" | "pending";
  from: string;
  trigger: string;
  to: string;
  description: string;
  confidence: "high" | "medium" | "low";
};
```

### WireframePage

```ts
export type WireframePage = {
  id: string;
  pageId: string;
  pageName: string;
  blocks: WireframeBlock[];
};
```

### WireframeBlock

```ts
export type WireframeBlock = {
  id: string;
  type:
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

  title: string;
  description?: string;
  fields?: string[];
  actions?: string[];
  children?: WireframeBlock[];
};
```

---

## 9. 页面设计

- 首页 `/`
- 创建项目页 `/projects/new`
- 输入资料页 `/projects/[id]/input`
- 分析结果页 `/projects/[id]/analysis`
- 功能结构图确认页 `/projects/[id]/structure`
- 页面清单页 `/projects/[id]/pages`
- 跳转关系页 `/projects/[id]/flows`
- 线框图页 `/projects/[id]/wireframes`
- PRD 页 `/projects/[id]/prd`
- 研发说明页 `/projects/[id]/handoff`

功能结构图确认页是 MVP 核心页面。

布局：

```txt
左侧：功能结构树
中间：当前节点详情
右侧：待确认问题
```

---

## 10. 线框图生成规则

线框图要从 FeatureTree 和 ProductPage 生成。

线框图不是设计稿。

线框图要求：

- 清晰表达页面结构
- 清晰表达模块顺序
- 清晰表达字段位置
- 清晰表达按钮和操作
- 标注弹窗和底部弹层
- 标注页面状态
