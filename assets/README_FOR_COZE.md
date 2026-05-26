# README_FOR_COZE.md

# 给扣子 / AI 开发工具的使用说明

请把本目录下的 4 个文档放入项目 `/docs` 目录：

```txt
/docs/PRODUCT_SPEC.md
/docs/PRODUCT_DELIVERY_SKILL.md
/docs/PROMPT_TEMPLATES.md
/docs/DEVELOPMENT_TASKS.md
```

请不要一次性让扣子完成全部开发。

第一次提示词请使用：

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

推荐分阶段开发：

1. 阶段 1：项目初始化、目录结构、类型定义、Zustand Store、Mock AI Provider。
2. 阶段 2：首页、项目创建页、输入资料页、分析结果页。
3. 阶段 3：功能结构图确认页。
4. 阶段 4：页面清单、跳转关系、线框图、PRD、研发说明页面。
5. 阶段 5：导出 JSON / Markdown。

重要提醒：

- 不要让扣子自行改变产品方向。
- 不要做成 AI UI 生成器。
- 不要做成低代码平台。
- 不要删掉功能结构图。
- 不要删掉待确认点。
- 不要删掉线框图。
- 不要删掉 PRD。
- 不要删掉研发说明。
