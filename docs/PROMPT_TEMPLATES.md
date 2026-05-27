# PROMPT_TEMPLATES.md

# AI 产品交付工作台 Prompt 模板

## 0. 总原则

扣子或任何 AI 开发工具不得自行设计 Prompt 逻辑。

所有 AI 调用必须遵守以下拼接顺序：

```txt
Product Delivery Skill
+
当前任务 Prompt
+
用户输入
+
当前项目已确认结构
+
输出格式要求
```

Product Delivery Skill 来源：

```txt
/docs/PRODUCT_DELIVERY_SKILL.md
```

项目内建议放置：

```txt
src/lib/skills/product-delivery/SKILL.md
```

所有生成 JSON 的任务必须：

- 只输出 JSON
- 不输出 Markdown
- 不输出解释
- 不输出注释
- 不输出 React
- 不输出 JSX
- 不输出 HTML
- 不在 JSON 前后添加任何额外文本

---

## 1. analyzeInput.prompt

用途：

分析用户输入的文本和截图描述，生成产品理解草案。

输入：

- 产品名称
- 平台类型
- 行业类型
- 产品描述
- 用户文本输入
- 截图说明或上传文件信息

任务 Prompt：

```txt
你正在分析一个产品经理提供的混乱输入。

请根据用户输入，识别产品意图、核心用户、产品类型、主要场景、可能页面和主要模块。

不要假装全部确定。
必须把内容分成：
1. 已识别信息
2. 推测信息
3. 待确认信息

输出 ProductUnderstanding JSON。
```

输出 JSON Schema：

```json
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
```

---

## 2. generateFeatureTree.prompt

用途：

根据产品理解和用户输入，生成功能结构图草案。

任务 Prompt：

```txt
你正在为产品经理生成功能结构图草案。

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

输出 FeatureTree JSON。
```

输出 JSON Schema：

```json
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
```

---

## 3. updateFeatureTree.prompt

用途：

用户回答待确认点、修改节点后，更新功能结构图。

任务 Prompt：

```txt
你正在根据产品经理的确认结果更新功能结构图。

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

输出完整更新后的 FeatureTree JSON。
```

输出 JSON Schema：

```json
{
  "productName": "string",
  "nodes": []
}
```

---

## 4. generatePageList.prompt

用途：

根据确认后的功能结构图生成页面清单。

任务 Prompt：

```txt
你正在根据已确认的功能结构图生成页面清单。

只把 type 为 page 的节点，或明确应该作为页面承载的节点，生成到页面清单中。

不要把字段、按钮、Toast、规则、普通模块当成页面。

每个页面必须说明：
页面目标
包含模块
关键操作
入口来源
跳转目标
MVP 或后续版本

输出 ProductPage[] JSON。
```

输出 JSON Schema：

```json
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
```

---

## 5. generateFlows.prompt

用途：

根据确认后的功能结构图和页面清单，生成页面跳转关系。

任务 Prompt：

```txt
你正在生成页面跳转关系。

请根据已确认的功能结构图和页面清单生成流程。

必须把流程分成三类：
recognized：从用户输入或结构中明确识别到的流程
assumed：根据常见产品逻辑推测的流程
pending：仍需产品经理确认的流程

不要假装所有流程都确定。
每个流程必须说明触发动作和目标页面。
输出 ProductFlow[] JSON。
```

输出 JSON Schema：

```json
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
```

---

## 6. generateWireframes.prompt

用途：

根据确认后的功能结构图和页面清单生成线框图。

任务 Prompt：

```txt
你正在生成线框图结构。

线框图不是高保真 UI。
不要生成复杂视觉设计。
不要生成 React。
不要生成 HTML。
不要生成代码。

线框图只需要表达：
- 页面区域
- 模块顺序
- 字段位置
- 按钮位置
- 弹窗
- 底部弹层
- 状态

## 核心规则：真实页面 → 状态帧 → 模块

每个真实页面至少生成一个默认状态 WireframePage。
如果存在页面内交互状态，则为同一个 pageId 生成多个 WireframePage 状态帧。
状态帧只存在于 wireframes 中，不加入 pageList。

### 真实页面结构

每个真实页面可以包含多个状态帧：

真实页面
├── 默认状态
├── 弹窗打开状态
├── 底部弹层打开状态
├── Toast 状态
├── 表单错误状态
├── 提交中状态
├── 成功状态
├── 失败状态
├── 空状态
├── 筛选结果状态
├── Tab 状态
├── 授权弹窗
├── 支付确认
└── 其他交互状态

### 状态帧命名规则

- 默认状态：页面名 - 默认状态
- 其他状态：页面名 - 具体状态描述

例如：
- 医生列表页 - 默认状态
- 医生列表页 - 科室筛选底部弹层打开
- 医生列表页 - 无医生结果空状态
- 预约确认页 - 表单校验错误状态
- 预约确认页 - 提交成功状态

### pageId 规则

同一个真实页面的多个状态帧，pageId 必须相同。

例如：
{
  id: "doctor-list-default",
  pageId: "doctor-list",
  pageName: "医生列表页 - 默认状态",
  blocks: [...]
}

{
  id: "doctor-list-filter-sheet",
  pageId: "doctor-list",
  pageName: "医生列表页 - 科室筛选底部弹层打开",
  blocks: [...]
}

### blocks 必须表达树结构

WireframePage.blocks 不是简单平铺。
每个 block 可以通过 children 表达下级结构。

### 弹窗 / 底部弹层必须作为状态帧里的独立模块

不要把弹窗直接混在默认页面里。
弹窗打开状态应该保留原页面主要结构，再叠加弹窗/底部弹层。

### 页面跳转不生成状态帧

页面跳转由 flows 表达，不应该作为 wireframe 状态帧。
只要不跳转页面、但视觉状态变化，就生成独立状态帧。

每个模块生成对应 WireframeBlock。

输出 WireframePage[] JSON。
```

输出 JSON Schema：

```json
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
```

---

## 7. generatePRD.prompt

用途：

根据确认后的功能结构图、页面清单、流程和线框图，生成产品经理式 PRD。

任务 Prompt：

```txt
你正在生成产品经理式 PRD。

PRD 必须基于已确认的功能结构图生成。
不要直接根据用户一句话生成。
不要写空泛口号。
不要使用“优化用户体验”“提升效率”这种空话，除非后面有具体说明。

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

输出 Markdown。
```

输出格式：

```md
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

## 16. 研发注意事项
```

---

## 8. generateDevHandoff.prompt

用途：

生成研发理解说明。

任务 Prompt：

```txt
你正在生成研发理解说明。

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

输出 Markdown。
```

输出格式：

```md
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

## 10. 研发注意事项
```

---

## 9. Mock AI Provider 要求

即使暂时不接真实大模型，也必须按照以上 Prompt 的输出结构提供 Mock 数据。

Mock 数据必须覆盖：

- 产品理解
- 功能结构图
- 待确认点
- 更新后的功能结构图
- 页面清单
- 跳转关系
- 线框图
- PRD
- 研发说明

Mock 示例建议使用：

```txt
中医预约小程序
```

---

## 10. 禁止事项

扣子或任何 AI 开发工具不得自行更改以下设计：

- 不得把产品改成 AI UI 生成器
- 不得把产品改成低代码平台
- 不得把产品改成代码生成器
- 不得删掉功能结构图
- 不得删掉待确认点
- 不得删掉线框图
- 不得删掉 PRD
- 不得删掉研发说明
- 不得把所有节点都当页面
- 不得跳过用户确认功能结构图的步骤
