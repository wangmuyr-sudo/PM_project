import type {
  AIProvider,
  AnalyzeInputParams,
  GenerateFeatureTreeParams,
  GeneratePageListParams,
  GenerateFlowsParams,
  GenerateWireframesParams,
  GeneratePRDParams,
  GenerateDevHandoffParams,
  UpdateFeatureTreeParams,
} from './ai-provider';
import type {
  FeatureNode,
  FeatureTree,
  ProductPage,
  ProductFlow,
  WireframePage,
  WireframeBlock,
  ProductUnderstanding,
  PlatformType,
} from '@/lib/types';

const platformProfiles = {
  web: {
    label: 'Web 网页',
    layoutStyle: 'desktop-dashboard',
    navigationPattern: '顶部导航 / 侧边栏 / 内容区',
    wireframeDevice: 'desktop',
    commonComponents: ['顶部导航', '侧边栏', '筛选器', '表格', '表单', '弹窗'],
    interactionRules: ['适合桌面端操作', '支持表格筛选', '支持分页', '支持弹窗表单'],
    devNotes: ['注意响应式布局', '注意表格分页和筛选状态', '注意权限入口和路由结构'],
  },
  h5: {
    label: 'H5',
    layoutStyle: 'mobile-web',
    navigationPattern: '顶部标题栏 / 纵向滚动 / 底部操作按钮',
    wireframeDevice: 'mobile',
    commonComponents: ['顶部标题栏', '卡片列表', '表单', '底部固定按钮', '底部弹层'],
    interactionRules: ['适合移动浏览器', '需要考虑分享链接', '需要考虑页面加载速度'],
    devNotes: ['注意移动端适配', '注意浏览器兼容', '注意底部按钮安全区'],
  },
  app: {
    label: 'App',
    layoutStyle: 'native-mobile-app',
    navigationPattern: '原生导航栏 / 底部 Tab / 页面栈返回',
    wireframeDevice: 'mobile',
    commonComponents: ['状态栏', '原生导航栏', '底部 Tab', '列表', '卡片', 'Action Sheet'],
    interactionRules: ['适合原生 App 交互', '支持推送通知', '支持权限授权', '支持页面栈返回'],
    devNotes: ['注意原生导航体验', '注意权限申请', '注意推送和本地缓存'],
  },
  'mini-program': {
    label: '小程序',
    layoutStyle: 'wechat-mini-program',
    navigationPattern: '小程序导航栏 / TabBar / 页面栈',
    wireframeDevice: 'mini-program',
    commonComponents: ['小程序导航栏', 'TabBar', '授权弹窗', '订阅消息', '支付', '底部弹层'],
    interactionRules: ['适合微信小程序服务流程', '需要考虑微信授权', '需要考虑订阅消息和支付'],
    devNotes: ['注意小程序页面栈限制', '注意微信授权', '注意订阅消息', '注意支付能力'],
  },
} as const;

/**
 * Mock AI Provider - 使用"中医预约小程序"作为示例
 */
export class MockAIProvider implements AIProvider {
  
  async analyzeInput(params: AnalyzeInputParams): Promise<ProductUnderstanding> {
    // 模拟延迟
    await this.delay(500);

    return {
      problem: '用户在线预约中医服务流程不清晰，缺少可评审的页面结构和交付说明',
      targetUsers: ['需要中医咨询的用户', '需要中医调理服务的用户', '需要预约中医专家的用户'],
      productType: '中医预约小程序',
      scenarios: ['找医生', '查看医生详情', '预约服务', '查看我的预约', '管理个人信息'],
      recognizedPages: ['首页', '医生列表页', '医生详情页', '预约确认页', '我的预约页', '个人中心'],
      recognizedModules: ['Banner', '服务入口', '医生卡片', '科室筛选', '预约按钮', '预约状态', '用户信息'],
      confidence: 'medium',
      assumptions: [
        '是否需要支付功能',
        '是否支持改约',
        '是否需要医生确认预约',
        '是否需要微信通知',
      ],
    };
  }

  async generateFeatureTree(params: GenerateFeatureTreeParams): Promise<FeatureTree> {
    await this.delay(800);

    return this.createMockFeatureTree();
  }

  async generatePageList(params: GeneratePageListParams): Promise<ProductPage[]> {
    await this.delay(600);

    return [
      {
        id: 'page-1',
        name: '首页',
        goal: '展示核心服务入口，引导用户快速找到需要的中医服务',
        modules: ['Banner轮播', '服务入口导航', '推荐医生列表', '底部导航栏'],
        keyActions: ['点击服务入口', '查看推荐医生', '进入医生详情'],
        entryFrom: ['小程序启动', '分享链接进入'],
        navigateTo: ['医生列表页', '医生详情页', '个人中心'],
        status: 'mvp',
      },
      {
        id: 'page-2',
        name: '医生列表页',
        goal: '让用户能够搜索和筛选医生，找到合适的中医专家',
        modules: ['搜索框', '科室筛选栏', '医生卡片列表', '底部导航栏'],
        keyActions: ['搜索医生', '筛选科室', '查看医生详情', '发起预约'],
        entryFrom: ['首页服务入口', '首页推荐医生', '底部导航'],
        navigateTo: ['医生详情页', '首页', '个人中心'],
        status: 'mvp',
      },
      {
        id: 'page-3',
        name: '医生详情页',
        goal: '展示医生的完整信息，帮助用户了解医生并发起预约',
        modules: ['医生资料卡片', '擅长领域展示', '出诊时间表', '用户评价列表', '底部操作栏'],
        keyActions: ['查看出诊时间', '阅读用户评价', '发起预约'],
        entryFrom: ['医生列表页', '首页推荐医生', '我的预约页'],
        navigateTo: ['预约确认页', '医生列表页'],
        status: 'mvp',
      },
      {
        id: 'page-4',
        name: '预约确认页',
        goal: '让用户填写预约信息并确认预约',
        modules: ['就诊人信息表单', '预约时间选择', '症状描述输入', '提交按钮', '预约须知'],
        keyActions: ['填写就诊人信息', '选择预约时间', '填写症状描述', '提交预约'],
        entryFrom: ['医生详情页'],
        navigateTo: ['我的预约页', '医生详情页'],
        status: 'mvp',
      },
      {
        id: 'page-5',
        name: '我的预约页',
        goal: '展示用户的预约记录，管理预约状态',
        modules: ['预约记录列表', '预约状态标签', '预约详情卡片', '操作按钮组'],
        keyActions: ['查看预约详情', '取消预约', '改约', '再次预约'],
        entryFrom: ['底部导航', '预约确认页提交成功', '首页'],
        navigateTo: ['医生详情页', '预约确认页', '首页'],
        status: 'mvp',
      },
      {
        id: 'page-6',
        name: '个人中心',
        goal: '管理用户个人信息和账户设置',
        modules: ['用户头像昵称', '个人信息编辑', '我的收藏', '设置入口', '客服入口'],
        keyActions: ['编辑个人信息', '查看收藏医生', '联系客服', '查看设置'],
        entryFrom: ['底部导航', '首页'],
        navigateTo: ['首页', '医生详情页', '设置页'],
        status: 'later',
      },
    ];
  }

  async generateFlows(params: GenerateFlowsParams): Promise<ProductFlow[]> {
    await this.delay(600);
    
    const flows: ProductFlow[] = [
      {
        id: 'flow-1',
        name: '首页浏览医生',
        type: 'recognized',
        from: '首页',
        trigger: '点击推荐医生卡片',
        to: '医生详情页',
        description: '用户在首页看到推荐医生，点击进入详情',
        confidence: 'high',
      },
      {
        id: 'flow-2',
        name: '搜索医生',
        type: 'recognized',
        from: '医生列表页',
        trigger: '点击医生卡片',
        to: '医生详情页',
        description: '用户搜索或筛选后点击医生查看详情',
        confidence: 'high',
      },
      {
        id: 'flow-3',
        name: '发起预约',
        type: 'recognized',
        from: '医生详情页',
        trigger: '点击立即预约按钮',
        to: '预约确认页',
        description: '用户了解医生后发起预约',
        confidence: 'high',
      },
      {
        id: 'flow-4',
        name: '提交预约',
        type: 'recognized',
        from: '预约确认页',
        trigger: '点击提交预约',
        to: '我的预约页',
        description: '用户填写信息后提交预约',
        confidence: 'high',
      },
      {
        id: 'flow-5',
        name: '取消预约',
        type: 'assumed',
        from: '我的预约页',
        trigger: '点击取消预约按钮',
        to: '取消确认弹窗',
        description: '用户取消已有预约（需要确认是否支持）',
        confidence: 'medium',
      },
      {
        id: 'flow-6',
        name: '改约',
        type: 'pending',
        from: '我的预约页',
        trigger: '点击改约按钮',
        to: '预约确认页',
        description: '用户修改预约时间（待确认是否支持）',
        confidence: 'low',
      },
    ];

    return flows;
  }

  async generateWireframes(params: GenerateWireframesParams): Promise<WireframePage[]> {
    await this.delay(1000);

    const platform = params.platform || 'mini-program';
    const platformLabel = platformProfiles[platform]?.label || '小程序';

    const wireframes: WireframePage[] = [
      {
        id: 'wireframe-1',
        pageId: 'page-1',
        pageName: '首页',
        blocks: this.createPlatformHomePageBlocks(platform),
      },
      {
        id: 'wireframe-2',
        pageId: 'page-2',
        pageName: '医生列表页',
        blocks: this.createPlatformDoctorListBlocks(platform),
      },
      {
        id: 'wireframe-3',
        pageId: 'page-3',
        pageName: '医生详情页',
        blocks: this.createPlatformDoctorDetailBlocks(platform),
      },
      {
        id: 'wireframe-4',
        pageId: 'page-4',
        pageName: '预约确认页',
        blocks: this.createPlatformBookingConfirmBlocks(platform),
      },
      {
        id: 'wireframe-5',
        pageId: 'page-5',
        pageName: '我的预约页',
        blocks: this.createPlatformMyBookingsBlocks(platform),
      },
      {
        id: 'wireframe-6',
        pageId: 'page-6',
        pageName: '个人中心',
        blocks: this.createPlatformPersonalCenterBlocks(platform),
      },
    ];

    return wireframes;
  }

  async generatePRD(params: GeneratePRDParams): Promise<string> {
    await this.delay(800);

    const platform = params.platform || 'mini-program';
    const platformLabel = platformProfiles[platform]?.label || '小程序';
    const platformDevNotes = platformProfiles[platform]?.devNotes || [];

    const prd = `# 中医预约${platformLabel} 产品需求文档 (PRD)

## 1. 产品概述

### 1.1 产品名称
中医预约小程序

### 1.2 产品定位
为用户提供便捷的中医专家预约服务，解决找医生难、预约流程复杂的问题。

### 1.3 核心价值
- 降低用户预约中医专家的门槛
- 提高中医医疗资源的利用率
- 提升用户体验，减少排队等待时间

## 2. 目标用户

### 2.1 主要用户
- 需要中医咨询的用户
- 需要中医调理服务的用户
- 需要预约中医专家的用户

### 2.2 用户特征
- 以中青年为主（25-55岁）
- 注重健康管理
- 有线下就医需求

### 2.3 使用场景
- 日常身体不适寻求中医调理
- 慢性病需要长期随访
- 亚健康状态需要咨询

## 3. 业务目标

### 3.1 用户侧目标
- 提供便捷的预约体验
- 减少现场排队等待时间
- 透明展示医生信息

### 3.2 平台侧目标
- 积累用户规模
- 提高预约转化率
- 建立医生口碑数据

## 4. MVP 范围

### 4.1 核心功能
- 微信手机号授权 / 登录态校验（不作为独立登录页，通过微信授权弹窗完成）
- 浏览医生列表（按科室筛选）
- 查看医生详情（擅长领域、出诊时间）
- 发起预约（选择时间、填写就诊人信息）
- 查看我的预约（预约状态：待确认/已确认/已完成/已取消）
- 取消预约

### 4.2 边界功能
- 搜索医生
- 医生评价展示
- 预约提醒（后续版本）

### 4.3 不做功能
- 在线问诊
- 药品配送
- 支付功能（后续版本）
- 改约功能（待确认）
- 医生端管理后台

## 5. 后续版本范围

### 5.1 V2.0
- 微信支付
- 预约提醒通知
- 医生排班管理

### 5.2 V3.0
- 在线问诊
- 处方开具
- 药品配送

## 6. 页面清单

| 页面 | 路径 | 版本范围 | 说明 |
|------|------|----------|------|
| 首页 | /pages/index | MVP | 入口页面，展示 Banner、推荐医生 |
| 医生列表 | /pages/doctor/list | MVP | 搜索和筛选医生 |
| 医生详情 | /pages/doctor/detail | MVP | 医生信息、预约入口 |
| 预约确认 | /pages/booking/confirm | MVP | 填写预约信息 |
| 我的预约 | /pages/booking/list | MVP | 预约记录管理 |
| 个人中心 | /pages/user/index | 后续版本 | 用户信息、设置 |

## 7. 页面说明

### 7.1 首页
- **功能说明**：展示平台入口和推荐医生
- **页面结构**：
  - 顶部：微信小程序状态栏
  - Banner 区域：活动推广轮播
  - 服务入口：找医生、我的预约、在线咨询（后续版本/暂未开放）
  - 推荐医生卡片列表
  - 底部导航：首页、医生、预约、我的

### 7.2 医生列表页
- **功能说明**：搜索和筛选医生
- **页面结构**：
  - 顶部：页面标题
  - 搜索框：输入医生姓名
  - 科室筛选 Tab：全部、内科、外科、妇科、儿科
  - 医生卡片列表：头像、姓名、职称、擅长领域
  - 每个卡片有"预约"按钮
  - 底部导航

### 7.3 医生详情页
- **功能说明**：展示医生详细信息
- **页面结构**：
  - 顶部：页面标题
  - 医生资料卡片：头像、姓名、职称、科室、评分
  - 擅长领域：文本说明
  - 出诊时间表：日期、时间段、状态（可约/已满）
  - 用户评价列表
  - 底部：立即预约按钮

### 7.4 预约确认页
- **功能说明**：填写预约信息
- **页面结构**：
  - 顶部：页面标题
  - 就诊人信息表单：姓名、电话、身份证号
  - 预约时间选择：日期、时间段
  - 症状描述文本框
  - 预约须知说明
  - 底部：提交预约按钮

### 7.5 我的预约页
- **功能说明**：管理预约记录
- **页面结构**：
  - 顶部：页面标题
  - 状态筛选 Tab：全部、待确认、已确认、已完成、已取消
  - 预约记录列表
  - 每个卡片：医生、时间、状态、操作按钮
  - 底部导航

### 7.6 个人中心页
- **功能说明**：用户信息管理
- **页面结构**：
  - 顶部：页面标题
  - 用户信息卡片：头像、昵称、手机号
  - 功能入口：我的预约、我的收藏、设置

## 8. 模块说明

### 8.1 首页模块
| 模块名称 | 类型 | 说明 |
|----------|------|------|
| Banner 轮播 | Banner | 展示活动推广内容 |
| 服务入口 | Nav | 快速导航到各功能 |
| 推荐医生 | Card | 展示热门医生卡片 |

### 8.2 医生列表模块
| 模块名称 | 类型 | 说明 |
|----------|------|------|
| 搜索框 | Form | 搜索医生关键词 |
| 科室筛选 | Tabs | 按科室筛选医生 |
| 医生卡片 | Card | 展示医生简要信息 |

### 8.3 预约模块
| 模块名称 | 类型 | 说明 |
|----------|------|------|
| 就诊人表单 | Form | 填写就诊人信息 |
| 时间选择器 | Form | 选择预约日期和时间 |
| 预约按钮 | Button | 提交预约 |

## 9. 字段说明

### 9.1 用户字段
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| nickname | string | 是 | 用户昵称 |
| avatar | string | 否 | 头像 URL |
| phone | string | 是 | 手机号 |

### 9.2 医生字段
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 医生姓名 |
| title | string | 是 | 职称（主任医师/副主任医师等） |
| department | string | 是 | 科室 |
| specialties | string[] | 是 | 擅长领域数组 |
| avatar | string | 是 | 头像 URL |
| rating | number | 是 | 评分 1-5 |

### 9.3 预约字段
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| patientName | string | 是 | 就诊人姓名 |
| patientPhone | string | 是 | 就诊人电话 |
| patientIdCard | string | 待确认 | 就诊人身份证号（视实名制要求及法规而定） |
| doctorId | string | 是 | 医生 ID |
| bookingDate | string | 是 | 预约日期 YYYY-MM-DD |
| bookingTimeSlot | string | 是 | 预约时间段 |
| symptom | string | 否 | 症状描述 |
| status | enum | 是 | 预约状态 |
| createdAt | Date | 是 | 创建时间 |

## 10. 按钮操作说明

### 10.1 首页按钮
| 按钮 | 所在页面 | 前置条件 | 操作结果 | 备注 |
|------|----------|----------|----------|------|
| 找医生 | 首页 | 无 | 跳转医生列表页 | |
| 我的预约 | 首页 | 已授权登录 | 跳转我的预约页 | 未登录时跳转授权 |
| 在线咨询 | 首页 | 无 | 提示暂未开放 | 后续版本功能 |

### 10.2 医生列表按钮
| 按钮 | 所在页面 | 前置条件 | 操作结果 | 备注 |
|------|----------|----------|----------|------|
| 预约 | 医生卡片 | 已授权登录 | 跳转医生详情页 | 未登录时先跳转授权 |

### 10.3 医生详情按钮
| 按钮 | 所在页面 | 前置条件 | 操作结果 | 备注 |
|------|----------|----------|----------|------|
| 立即预约 | 医生详情 | 已授权登录 | 跳转预约确认页 | 未登录时先跳转授权 |

### 10.4 预约确认按钮
| 按钮 | 所在页面 | 前置条件 | 操作结果 | 备注 |
|------|----------|----------|----------|------|
| 提交预约 | 预约确认 | 表单校验通过 | 提交预约数据 | 需姓名+电话+时间必填 |

### 10.5 我的预约按钮
| 按钮 | 所在页面 | 前置条件 | 操作结果 | 备注 |
|------|----------|----------|----------|------|
| 取消 | 预约卡片 | 已登录 | 弹窗二次确认 | 确认后状态变为已取消 |
| 改约 | 预约卡片 | 已登录 | 待确认/后续版本 | 当前版本不开放 |
| 详情 | 预约卡片 | 无 | 查看预约详情 | |

## 11. 页面跳转关系

### 11.1 跳转流程图

\`\`\`
首页
  ├── 找医生 → 医生列表页
  │             └── 预约 → 医生详情页
  │                          └── 立即预约 → 预约确认页
  ├── 我的预约 → 我的预约页
  │               └── 取消 → 弹窗确认
  └── 个人中心 → 个人中心页（后续版本）
                  └── 我的预约 → 我的预约页
\`\`\`

### 11.2 跳转规则
- 医生列表 → 医生详情：传递 doctorId
- 医生详情 → 预约确认：传递 doctorId + 可用时间段
- 我的预约 → 取消：弹窗确认，不跳转页面

### 11.3 待确认跳转
- 改约功能：后续版本，当前版本不开放跳转

## 12. 状态说明

### 12.1 预约状态
| 状态 | 说明 | 可执行操作 |
|------|------|------------|
| pending | 待确认（是否需要医生确认后变为 confirmed 待确认） | 取消 |
| confirmed | 已确认 | 取消 |
| completed | 已完成 | 无 |
| cancelled | 已取消 | 无 |

### 12.2 时间段状态
| 状态 | 说明 |
|------|------|
| available | 可约 |
| full | 已满 |
| closed | 停诊 |

### 12.3 状态流转（是否需要医生确认为待确认项）
\`\`\`
预约提交 → pending → 医生确认？ → confirmed → 就诊完成 → completed
                    ↓
              用户取消 → cancelled
\`\`\`

## 13. 弹窗 / 底部弹层说明

### 13.1 预约成功弹窗
- **类型**：Modal
- **触发**：提交预约成功
- **标题**：预约成功
- **内容**：预约信息摘要（医生姓名、日期、时间）
- **按钮**：查看我的预约、返回首页

### 13.2 取消预约确认
- **类型**：Modal
- **触发**：点击取消按钮
- **标题**：取消预约
- **内容**：确定要取消该预约吗？
- **按钮**：确定、返回

### 13.3 科室选择底部弹层
- **类型**：Bottom Sheet
- **触发**：点击科室筛选
- **内容**：科室列表
- **操作**：点击选择，选择后自动关闭

### 13.4 预约时间选择
- **类型**：Bottom Sheet
- **触发**：选择预约日期后
- **内容**：时间段列表（上午/下午/晚上）
- **操作**：点击选择时间段

## 14. 异常状态

### 14.1 预约已满
- **场景**：选择的时间段已约满
- **提示**：该时段已约满，请选择其他时间
- **处理**：提示用户选择其他时间

### 14.2 医生停诊
- **场景**：医生当日停诊
- **提示**：医生当日停诊
- **处理**：不显示该医生的可约时间段

### 14.3 网络错误
- **场景**：接口请求失败
- **提示**：网络连接失败
- **处理**：显示错误提示，提供重试按钮

### 14.4 预约冲突
- **场景**：用户已有同一时间段预约
- **提示**：您在该时段已有预约
- **处理**：提示用户不能重复预约

### 14.5 表单校验失败
- **场景**：必填字段为空或格式错误
- **提示**：具体字段错误提示
- **处理**：表单内联错误提示

### 14.6 空状态
- **场景**：暂无预约记录
- **页面**：我的预约页
- **提示**：暂无预约记录，去预约医生吧
- **操作**：跳转医生列表

## 15. 待确认事项

### 15.1 功能范围

| 待确认项 | 影响范围 |
|----------|----------|
| 是否需要微信支付功能？ | 支付模块、预约确认页、订单状态、后续版本范围 |
| 是否支持改约功能？ | 我的预约页、预约确认页、页面跳转关系、状态流转 |
| 是否需要医生确认预约？ | 预约状态、接口设计、通知机制、状态流转 |
| 是否需要微信通知提醒？ | 通知模块、后端实现、用户触达方式 |
| 预约是否需要收取挂号费？ | 预约流程、支付模块、表单字段 |
| 取消预约的截止时间是多少？ | 取消按钮可用状态、异常提示、后端校验逻辑 |
| 医生端是否需要审核预约？ | 状态流转、医生工作台、通知机制 |
| 是否需要黑名单机制防止恶意预约？ | 后端风控、用户状态、预约限制 |
| 是否必须采集身份证号？ | 预约表单、字段校验、隐私合规（GDPR/个人信息保护法） |

### 15.2 技术实现

| 待确认项 | 影响范围 |
|----------|----------|
| 预约时间段粒度？ | 时间选择器组件、数据库存储、后端校验 |
| 单用户同时间段限制？ | 后端校验逻辑、预约冲突检测 |
| 医生排班管理方式？ | 医生端、后台系统、数据模型 |

## 16. 研发注意事项

### 16.1 ${platformLabel}平台限制
${platformDevNotes.map(note => `- ${note}`).join('\n')}

### 16.2 数据校验
- 手机号格式校验（11位）
- 预约时间不能早于当前时间
- 取消预约需在预约时间前 N 小时（待确认截止时间）
- 就诊人信息中姓名和电话必填
- 身份证号是否必填待确认，如需采集则格式校验（18位）
- 敏感信息不得明文存储，需加密

### 16.3 登录态与授权
${platform === 'web' ? `- 采用账号密码登录或 SSO 单点登录
- 设计独立登录页，支持记住登录状态
- 预约操作需校验登录态` : platform === 'h5' ? `- 移动端网页可采用手机号验证码登录
- 不设计独立登录页，通过授权弹窗或短信验证码完成
- 预约操作需校验登录态，未登录引导授权` : platform === 'app' ? `- 原生 App 可采用手机号验证码登录或一键登录
- 设计登录页面，支持第三方登录（微信、Apple 等）
- 预约操作需校验登录态，未登录跳转登录页` : `- 微信手机号授权通过 wx.login + 手机号授权弹窗实现
- 不设计独立登录页，用户首次使用时授权
- 预约操作需校验登录态，未登录引导授权`}

### 16.4 性能要求
- 页面首次加载 < 2s
- 接口响应时间 < 500ms
- 医生列表建议做分页（每页20条）
- 图片资源需压缩

### 16.5 安全要求
- 用户信息存储需加密
- 预约接口需登录态校验
- 防止恶意刷预约（频率限制）
- 敏感操作需二次确认

### 16.6 测试要点
- 预约流程全链路测试
- 并发预约冲突测试
- 取消预约状态流转测试
- 表单校验边界测试

## 17. 平台类型与设计约束

### 17.1 平台概述
- **平台类型**：${platformLabel}
- **布局样式**：${platformProfiles[platform]?.layoutStyle || '标准布局'}
- **导航模式**：${platformProfiles[platform]?.navigationPattern || '标准导航'}

### 17.2 通用组件
${(platformProfiles[platform]?.commonComponents || []).map(c => `- ${c}`).join('\n')}

### 17.3 交互规则
${(platformProfiles[platform]?.interactionRules || []).map(r => `- ${r}`).join('\n')}

### 17.4 平台差异说明
${platform === 'web' ? `**Web 网页平台**：
- 采用桌面端工作台布局，适合管理员或后台使用
- 支持表格筛选、分页、侧边栏导航
- 表单采用弹窗交互
- 适合鼠标操作，支持右键、快捷键等` : platform === 'h5' ? `**H5 移动网页平台**：
- 采用手机网页布局，适合移动端浏览器访问
- 考虑分享链接和社交传播
- 表单采用纵向滚动，底部固定操作按钮
- 考虑浏览器兼容和页面加载速度` : platform === 'app' ? `**App 原生应用平台**：
- 采用原生手机 App 布局，适配 iOS/Android
- 底部 Tab 导航，支持页面栈返回
- 表单采用底部弹层（Action Sheet）交互
- 考虑权限申请和推送通知` : `**小程序平台**：
- 采用微信小程序布局，适配手机屏幕
- 底部 TabBar 导航，页面栈最多 10 层
- 表单采用底部弹层交互
- 需要考虑微信授权、订阅消息、微信支付等微信能力`}
`;

    return prd;
  }

  async generateDevHandoff(params: GenerateDevHandoffParams): Promise<string> {
    await this.delay(600);

    const platform = params.platform || 'mini-program';
    const platformLabel = platformProfiles[platform]?.label || '小程序';
    const platformDevNotes = platformProfiles[platform]?.devNotes || [];

    const devHandoff = `# 中医预约${platformLabel} 研发说明

## 1. 页面总览

### 1.1 页面清单
| 页面 | 路径 | 优先级 | 备注 |
|------|------|--------|------|
| 首页 | /pages/index | P0 | 入口页 |
| 医生列表 | /pages/doctor/list | P0 | 搜索筛选 |
| 医生详情 | /pages/doctor/detail | P0 | 预约入口 |
| 预约确认 | /pages/booking/confirm | P0 | 表单提交 |
| 我的预约 | /pages/booking/list | P0 | 记录管理 |
| 个人中心 | /pages/user/index | P1 | 用户信息 |

### 1.2 公共组件
- 底部导航栏（首页/医生/预约/我的）
- 页面标题栏
- 医生卡片组件
- 预约状态标签组件
- 空状态组件

## 2. 页面与模块说明

### 2.1 首页
- **模块**：Banner 轮播、服务入口、推荐医生列表、底部导航
- **数据**：Banner 列表、推荐医生列表（最多6条）
- **交互**：Banner 自动轮播（3s）、医生卡片点击跳转详情

### 2.2 医生列表页
- **模块**：搜索框、科室筛选 Tab、医生卡片列表
- **数据**：医生列表（分页，每页20条）
- **交互**：搜索防抖（300ms）、Tab 切换筛选、上拉加载更多
- **状态管理**：当前筛选条件、搜索关键词

### 2.3 医生详情页
- **模块**：医生资料卡片、擅长领域、出诊时间表、用户评价、立即预约按钮
- **数据**：医生详情、出诊时间、评价列表
- **交互**：时间段选择、评价展开/收起

### 2.4 预约确认页
- **模块**：就诊人表单、时间选择、症状描述、预约须知、提交按钮
- **数据**：就诊人信息（从用户信息预填）、可用时间段
- **交互**：表单校验、时间选择器、提交确认

### 2.5 我的预约页
- **模块**：状态筛选 Tab、预约记录列表
- **数据**：用户预约列表（按状态筛选）
- **交互**：Tab 切换、取消预约（二次确认）、下拉刷新

### 2.6 个人中心页
- **模块**：用户信息卡片、功能入口列表
- **数据**：用户基本信息
- **交互**：入口点击跳转

## 3. 字段说明

### 3.1 用户字段
| 字段名 | 类型 | 必填 | 前端展示 | 后端存储 |
|--------|------|------|----------|----------|
| nickname | string | 是 | 昵称 | 是 |
| avatar | string | 否 | 头像 | 是 |
| phone | string | 是 | 手机号 | 是（加密） |

### 3.2 医生字段
| 字段名 | 类型 | 必填 | 前端展示 | 后端存储 |
|--------|------|------|----------|----------|
| name | string | 是 | 姓名 | 是 |
| title | string | 是 | 职称 | 是 |
| department | string | 是 | 科室 | 是 |
| specialties | string[] | 是 | 擅长领域 | 是 |
| avatar | string | 是 | 头像 URL | 是 |
| rating | number | 是 | 评分 | 是 |

### 3.3 预约字段
| 字段名 | 类型 | 必填 | 前端展示 | 后端存储 |
|--------|------|------|----------|----------|
| patientName | string | 是 | 就诊人姓名 | 是 |
| patientPhone | string | 是 | 就诊人电话 | 是 |
| patientIdCard | string | 待确认 | 身份证号 | 是（加密存储，是否采集视实名制要求和合规要求而定） |
| doctorId | string | 是 | - | 是 |
| bookingDate | string | 是 | 预约日期 | 是 |
| bookingTimeSlot | string | 是 | 时间段 | 是 |
| symptom | string | 否 | 症状描述 | 是 |
| status | enum | 是 | 状态标签 | 是 |

## 4. 操作与跳转

### 4.1 页面跳转关系
\`\`\`
首页
  ├── 找医生 → 医生列表页
  │             └── 预约 → 医生详情页
  │                          └── 立即预约 → 预约确认页
  ├── 我的预约 → 我的预约页
  │               └── 取消 → 弹窗确认
  └── 个人中心 → 个人中心页（后续版本）
                  └── 我的预约 → 我的预约页
\`\`\`

### 4.2 参数传递
| 跳转 | 参数 | 类型 | 备注 |
|------|------|------|------|
| 医生列表 → 医生详情 | doctorId | string | |
| 医生详情 → 预约确认 | doctorId, timeSlot | string, object | |
| 我的预约 → 取消 | bookingId | string | 无需跳转页面，弹窗确认 |

### 4.3 待确认跳转（后续版本）
| 跳转 | 参数 | 说明 |
|------|------|------|
| 我的预约 → 改约 | bookingId | 待确认/后续版本，当前 MVP 不开放 |

### 4.4 按钮操作
| 按钮 | 页面 | 操作 | 备注 |
|------|------|------|------|
| 立即预约 | 医生详情 | 跳转预约确认 | 需登录态 |
| 提交预约 | 预约确认 | 提交表单 | 需校验 |
| 取消 | 我的预约 | 二次确认后取消 | 需判断截止时间 |
| 改约 | 我的预约 | 待确认/后续版本 | 当前 MVP 不开放 |

## 5. 状态与异常

### 5.1 预约状态流转（是否需要医生确认为待确认项）
\`\`\`
预约提交 → pending → （是否需要医生确认？） → confirmed → 就诊完成 → completed
                    ↓
              用户取消 → cancelled
\`\`\`

**说明**：预约提交后进入 pending 状态。是否需要医生确认后变为 confirmed 待确认。该决策会影响状态机和通知机制。

### 5.2 时间段状态
| 状态 | 说明 | 前端展示 |
|------|------|----------|
| available | 可约 | 绿色，可点击 |
| full | 已满 | 灰色，禁用 |
| closed | 停诊 | 灰色，禁用 |

### 5.3 异常处理
| 异常 | 触发条件 | 前端处理 | 后端处理 |
|------|----------|----------|----------|
| 预约已满 | 选择已满时段 | 提示选择其他时间 | 返回可用时段 |
| 医生停诊 | 医生当日停诊 | 不显示可约时段 | 返回停诊状态 |
| 网络错误 | 接口请求失败 | 错误提示+重试按钮 | - |
| 预约冲突 | 同时间段已有预约 | 提示不能重复预约 | 校验冲突 |
| 表单校验失败 | 必填字段为空 | 内联错误提示 | 返回校验错误 |
| 取消超时 | 超过取消截止时间 | 提示无法取消 | 校验时间 |

### 5.4 空状态
| 页面 | 空状态场景 | 提示文案 | 操作 |
|------|------------|----------|------|
| 我的预约 | 无预约记录 | 暂无预约，去预约医生吧 | 跳转医生列表 |
| 医生列表 | 无搜索结果 | 未找到相关医生 | 清空搜索 |

## 6. 接口建议

### 6.1 医生相关
\`\`\`
GET /api/doctors
  Query: { department?, keyword?, page?, size? }
  Response: { list: Doctor[], total: number }

GET /api/doctors/:id
  Response: Doctor

GET /api/doctors/:id/schedule
  Query: { date }
  Response: { date, slots: TimeSlot[] }
\`\`\`

### 6.2 预约相关
\`\`\`
POST /api/appointments
  Body: { doctorId, bookingDate, bookingTimeSlot, patientName, patientPhone, patientIdCard?, symptom? }
  Response: Appointment
  说明：patientIdCard 为可选/待确认字段，是否必传视实名制要求和合规要求而定

GET /api/appointments
  Query: { status?, page?, size? }
  Response: { list: Appointment[], total: number }

PUT /api/appointments/:id/cancel
  Response: Appointment
\`\`\`

### 6.3 用户相关
\`\`\`
GET /api/user/profile
  Response: User

PUT /api/user/profile
  Body: { nickname?, avatar?, phone? }
  Response: User
\`\`\`

### 6.4 后续版本/待确认接口
\`\`\`
POST /api/appointments/:id/reschedule  改约（待确认/后续版本）
POST /api/payments/create                 微信支付（后续版本）
POST /api/doctor/appointments/confirm     医生确认预约（待确认）
\`\`\`

### 6.5 接口通用规范
- 统一返回格式：{ code: number, data: any, message: string }
- 分页参数：page（从1开始）、size（默认20）
- 认证方式：JWT Token（存储在 localStorage）
- 错误码：200 成功、400 参数错误、401 未登录、403 无权限、500 服务器错误

## 7. Mock 数据建议

### 7.1 医生数据（Mock 10条）
\`\`\`json
[
  {
    "id": "doc-1",
    "name": "张医生",
    "title": "主任医师",
    "department": "内科",
    "specialties": ["脾胃病", "失眠"],
    "avatar": "https://example.com/avatar1.jpg",
    "rating": 4.8
  }
]
\`\`\`

### 7.2 预约数据（Mock 5条）
\`\`\`json
[
  {
    "id": "book-1",
    "doctorId": "doc-1",
    "doctorName": "张医生",
    "bookingDate": "2024-01-15",
    "bookingTimeSlot": "09:00-09:30",
    "status": "pending",
    "patientName": "张三",
    "patientPhone": "13800138000"
  }
]
说明：patientIdCard 在 Mock 中可选/待确认字段
\`\`\`

### 7.3 时间段数据
\`\`\`json
{
  "date": "2024-01-15",
  "slots": [
    { "time": "09:00-09:30", "status": "available" },
    { "time": "09:30-10:00", "status": "full" },
    { "time": "10:00-10:30", "status": "closed" }
  ]
}
\`\`\`

## 8. MVP 范围

### 8.1 必须实现（P0）
- [ ] 首页 Banner 和推荐医生
- [ ] 医生列表搜索筛选
- [ ] 医生详情展示
- [ ] 预约表单提交
- [ ] 我的预约列表
- [ ] 取消预约
- [ ] 微信手机号授权 / 登录态校验（不单独设计登录页，通过微信授权弹窗完成）

### 8.2 边界功能（P1）
- [ ] 医生评价展示
- [ ] 预约状态筛选
- [ ] 个人中心页面（后续版本）

### 8.3 不做功能
- [ ] 微信支付
- [ ] 在线问诊
- [ ] 改约功能（待确认/后续版本）
- [ ] 药品配送
- [ ] 医生端管理后台
- [ ] 用户登录/注册（改为微信手机号授权）

## 9. 后续版本范围

### 9.1 V2.0（预计 2 个月）
- 微信支付功能
- 微信消息通知（预约提醒）
- 医生排班管理
- 改约功能（待确认）

### 9.2 V3.0（预计 4 个月）
- 在线图文问诊
- 处方开具
- 药品配送
- 医生端管理后台

## 10. 研发注意事项

### 10.1 ${platformLabel}平台开发注意事项
${platformDevNotes.map(note => `- ${note}`).join('\n')}

### 10.2 登录态与授权
${platform === 'web' ? `- 采用账号密码登录或 SSO 单点登录
- 设计独立登录页，支持记住登录状态
- 预约操作需校验登录态` : platform === 'h5' ? `- 移动端网页可采用手机号验证码登录
- 不设计独立登录页，通过授权弹窗或短信验证码完成
- 预约操作需校验登录态，未登录引导授权` : platform === 'app' ? `- 原生 App 可采用手机号验证码登录或一键登录
- 设计登录页面，支持第三方登录（微信、Apple 等）
- 预约操作需校验登录态，未登录跳转登录页` : `- 小程序通过微信授权弹窗获取手机号
- 预约相关操作需要登录态校验，未登录引导用户授权
- JWT Token 或 session 管理登录态`}

### 10.3 数据校验规则
- 手机号：11位，以 1 开头
- 预约时间：不能早于当前时间，不能跨天
- 取消预约：需在预约时间前 N 小时（待确认截止时间）
- 就诊人信息：姓名和电话必填
- 身份证号（如采集）：必须加密存储，不得明文保存；是否采集视实名制要求和合规要求（GDPR/个人信息保护法）而定

### 10.4 性能要求
- 页面首次加载 < 2s（首屏内容）
- 接口响应时间 < 500ms（P95）
- 医生列表分页加载，每页 20 条
- 图片懒加载，使用 CDN 加速
- 列表页使用虚拟滚动（医生数量 > 100 时）

### 10.5 安全要求
- 用户信息存储需加密（AES-256）
- 预约接口需登录态校验（JWT）
- 防止恶意刷预约（同一用户 1 分钟内最多 3 次）
- 敏感操作需二次确认（取消预约）
- 接口防重放攻击（timestamp + nonce）

### 10.6 测试要点
- 预约流程全链路测试（创建 → 确认 → 完成）
- 并发预约冲突测试（同一时段多人预约）
- 取消预约状态流转测试
- 表单校验边界测试（空值、超长、特殊字符）
- 网络异常恢复测试
- 不同机型兼容性测试

## 11. 平台开发注意事项

### 11.1 平台概述
- **平台类型**：${platformLabel}
- **布局样式**：${platformProfiles[platform]?.layoutStyle || '标准布局'}
- **导航模式**：${platformProfiles[platform]?.navigationPattern || '标准导航'}

### 11.2 通用组件
${(platformProfiles[platform]?.commonComponents || []).map(c => `- ${c}`).join('\n')}

### 11.3 交互规则
${(platformProfiles[platform]?.interactionRules || []).map(r => `- ${r}`).join('\n')}

### 11.4 平台差异说明
${platform === 'web' ? `**Web 网页平台**：
- 采用桌面端工作台布局，适合管理员或后台使用
- 支持表格筛选、分页、侧边栏导航
- 表单采用弹窗交互
- 适合鼠标操作，支持右键、快捷键等
- 注意响应式布局适配不同屏幕尺寸` : platform === 'h5' ? `**H5 移动网页平台**：
- 采用手机网页布局，适合移动端浏览器访问
- 考虑分享链接和社交传播
- 表单采用纵向滚动，底部固定操作按钮
- 考虑浏览器兼容和页面加载速度
- 注意底部按钮安全区适配（如 iPhone X）` : platform === 'app' ? `**App 原生应用平台**：
- 采用原生手机 App 布局，适配 iOS/Android
- 底部 Tab 导航，支持页面栈返回
- 表单采用底部弹层（Action Sheet）交互
- 考虑权限申请和推送通知
- 注意不同机型的屏幕适配` : `**小程序平台**：
- 采用微信小程序布局，适配手机屏幕
- 底部 TabBar 导航，页面栈最多 10 层
- 表单采用底部弹层交互
- 需要考虑微信授权、订阅消息、微信支付等微信能力
- 注意小程序包大小限制（2MB）`}
`;

    return devHandoff;
  }

  async updateFeatureTree(params: UpdateFeatureTreeParams): Promise<FeatureTree> {
    await this.delay(400);

    // 简单的本地更新逻辑
    // 实际应该根据问题答案智能调整结构
    const featureTree = params.featureTree;

    return featureTree;
  }

  // ============ 私有方法 ============

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private createMockFeatureTree(): FeatureTree {
    return {
      productName: "中医预约小程序",
      nodes: [
        {
          id: 'page-home',
          name: '首页',
          type: 'page',
          presentationType: 'page',
          status: 'confirmed',
          confidence: 'high',
          description: '小程序首页，展示核心服务入口',
          children: [
            {
              id: 'module-banner',
              name: 'Banner轮播',
              type: 'module',
              presentationType: 'inline',
              status: 'confirmed',
              confidence: 'high',
              description: '展示活动或推广信息',
            },
            {
              id: 'module-service-entry',
              name: '服务入口',
              type: 'module',
              presentationType: 'inline',
              status: 'confirmed',
              confidence: 'high',
              description: '快速进入各服务模块的入口',
            },
            {
              id: 'module-recommend-doctors',
              name: '推荐医生',
              type: 'module',
              presentationType: 'inline',
              status: 'confirmed',
              confidence: 'high',
              description: '展示推荐医生列表',
            },
            {
              id: 'module-bottom-nav',
              name: '底部导航',
              type: 'module',
              presentationType: 'inline',
              status: 'confirmed',
              confidence: 'high',
              description: '小程序底部导航栏',
            },
          ],
        },
        {
          id: 'page-doctor-list',
          name: '医生列表页',
          type: 'page',
          presentationType: 'page',
          status: 'confirmed',
          confidence: 'high',
          description: '搜索和筛选医生',
          children: [
            {
              id: 'module-search',
              name: '搜索框',
              type: 'module',
              presentationType: 'inline',
              status: 'confirmed',
              confidence: 'high',
            },
            {
              id: 'module-department-filter',
              name: '科室筛选',
              type: 'module',
              presentationType: 'bottom-sheet',
              status: 'pending',
              confidence: 'medium',
              questions: [
                {
                  id: 'q-filter-style',
                  question: '科室筛选的展现形式？',
                  options: ['底部弹层', '顶部标签', '侧边栏'],
                  impact: 'module',
                },
              ],
            },
            {
              id: 'module-doctor-card',
              name: '医生卡片',
              type: 'module',
              presentationType: 'inline',
              status: 'confirmed',
              confidence: 'high',
              children: [
                {
                  id: 'field-avatar',
                  name: '医生头像',
                  type: 'field',
                  presentationType: 'inline',
                  status: 'confirmed',
                  confidence: 'high',
                },
                {
                  id: 'field-name',
                  name: '医生姓名',
                  type: 'field',
                  presentationType: 'inline',
                  status: 'confirmed',
                  confidence: 'high',
                },
                {
                  id: 'field-title',
                  name: '职称',
                  type: 'field',
                  presentationType: 'inline',
                  status: 'confirmed',
                  confidence: 'high',
                },
                {
                  id: 'field-specialty',
                  name: '擅长领域',
                  type: 'field',
                  presentationType: 'inline',
                  status: 'confirmed',
                  confidence: 'high',
                },
                {
                  id: 'action-book',
                  name: '预约按钮',
                  type: 'action',
                  presentationType: 'inline',
                  status: 'confirmed',
                  confidence: 'high',
                },
              ],
            },
          ],
        },
        {
          id: 'page-doctor-detail',
          name: '医生详情页',
          type: 'page',
          presentationType: 'page',
          status: 'confirmed',
          confidence: 'high',
          description: '展示医生完整信息',
          children: [
            {
              id: 'module-doctor-info',
              name: '医生资料',
              type: 'module',
              presentationType: 'inline',
              status: 'confirmed',
              confidence: 'high',
            },
            {
              id: 'module-specialties',
              name: '擅长领域',
              type: 'module',
              presentationType: 'inline',
              status: 'confirmed',
              confidence: 'high',
            },
            {
              id: 'module-schedule',
              name: '出诊时间',
              type: 'module',
              presentationType: 'inline',
              status: 'pending',
              confidence: 'medium',
              questions: [
                {
                  id: 'q-schedule-display',
                  question: '出诊时间的展示形式？',
                  options: ['日历视图', '列表展示', '周视图'],
                  impact: 'module',
                },
              ],
            },
            {
              id: 'module-reviews',
              name: '用户评价',
              type: 'module',
              presentationType: 'inline',
              status: 'optional',
              confidence: 'medium',
            },
            {
              id: 'action-book-now',
              name: '立即预约',
              type: 'action',
              presentationType: 'inline',
              status: 'confirmed',
              confidence: 'high',
            },
          ],
        },
        {
          id: 'page-booking-confirm',
          name: '预约确认页',
          type: 'page',
          presentationType: 'page',
          status: 'confirmed',
          confidence: 'high',
          description: '填写预约信息',
          children: [
            {
              id: 'module-patient-info',
              name: '就诊人信息',
              type: 'module',
              presentationType: 'inline',
              status: 'confirmed',
              confidence: 'high',
              children: [
                {
                  id: 'field-patient-name',
                  name: '就诊人姓名',
                  type: 'field',
                  presentationType: 'inline',
                  status: 'confirmed',
                  confidence: 'high',
                },
                {
                  id: 'field-patient-phone',
                  name: '联系电话',
                  type: 'field',
                  presentationType: 'inline',
                  status: 'confirmed',
                  confidence: 'high',
                },
              ],
            },
            {
              id: 'module-booking-time',
              name: '预约时间',
              type: 'module',
              presentationType: 'inline',
              status: 'confirmed',
              confidence: 'high',
            },
            {
              id: 'field-symptoms',
              name: '症状描述',
              type: 'field',
              presentationType: 'inline',
              status: 'optional',
              confidence: 'medium',
            },
            {
              id: 'action-submit-booking',
              name: '提交预约',
              type: 'action',
              presentationType: 'inline',
              status: 'confirmed',
              confidence: 'high',
            },
          ],
        },
        {
          id: 'page-my-bookings',
          name: '我的预约页',
          type: 'page',
          presentationType: 'page',
          status: 'confirmed',
          confidence: 'high',
          description: '查看预约记录',
          children: [
            {
              id: 'module-booking-list',
              name: '预约记录列表',
              type: 'module',
              presentationType: 'inline',
              status: 'confirmed',
              confidence: 'high',
            },
            {
              id: 'state-booking-status',
              name: '预约状态',
              type: 'state',
              presentationType: 'none',
              status: 'confirmed',
              confidence: 'high',
              description: '预约状态：待确认、已确认、已完成、已取消',
            },
            {
              id: 'action-cancel-booking',
              name: '取消预约',
              type: 'action',
              presentationType: 'inline',
              status: 'pending',
              confidence: 'medium',
              questions: [
                {
                  id: 'q-cancel-confirm',
                  question: '取消预约是否需要二次确认？',
                  options: ['需要确认弹窗', '直接取消', '不需要取消功能'],
                  impact: 'modal',
                },
              ],
            },
            {
              id: 'action-change-booking',
              name: '改约',
              type: 'action',
              presentationType: 'inline',
              status: 'pending',
              confidence: 'low',
              questions: [
                {
                  id: 'q-change-booking',
                  question: '是否支持改约功能？',
                  options: ['支持改约', '不支持改约', '暂不确定'],
                  impact: 'page',
                },
              ],
            },
          ],
        },
        {
          id: 'page-profile',
          name: '个人中心',
          type: 'page',
          presentationType: 'page',
          status: 'confirmed',
          confidence: 'high',
          description: '用户个人中心',
          children: [
            {
              id: 'module-user-info',
              name: '用户信息',
              type: 'module',
              presentationType: 'inline',
              status: 'confirmed',
              confidence: 'high',
            },
            {
              id: 'module-favorites',
              name: '我的收藏',
              type: 'module',
              presentationType: 'inline',
              status: 'optional',
              confidence: 'medium',
            },
            {
              id: 'module-settings',
              name: '设置',
              type: 'module',
              presentationType: 'inline',
              status: 'optional',
              confidence: 'medium',
            },
          ],
        },
        {
          id: 'module-booking-core',
          name: '预约模块',
          type: 'module',
          presentationType: 'none',
          status: 'confirmed',
          confidence: 'medium',
          description: '预约相关规则',
          children: [
            {
              id: 'q-payment',
              name: '是否需要支付？',
              type: 'rule',
              presentationType: 'none',
              status: 'pending',
              confidence: 'medium',
              questions: [
                {
                  id: 'q-payment-required',
                  question: '是否需要支付功能？',
                  options: ['需要支付', '不需要支付', '暂不确定'],
                  impact: 'page',
                },
              ],
            },
            {
              id: 'q-doctor-confirm',
              name: '是否需要医生确认？',
              type: 'rule',
              presentationType: 'none',
              status: 'pending',
              confidence: 'medium',
              questions: [
                {
                  id: 'q-doctor-confirm-required',
                  question: '是否需要医生确认预约？',
                  options: ['需要医生确认', '不需要医生确认', '暂不确定'],
                  impact: 'state',
                },
              ],
            },
            {
              id: 'q-cancel-policy',
              name: '取消预约规则',
              type: 'rule',
              presentationType: 'none',
              status: 'pending',
              confidence: 'medium',
              questions: [
                {
                  id: 'q-cancel-allowed',
                  question: '是否支持取消预约？',
                  options: ['支持取消', '不支持取消', '暂不确定'],
                  impact: 'modal',
                },
              ],
            },
            {
              id: 'q-notification',
              name: '微信通知',
              type: 'rule',
              presentationType: 'none',
              status: 'pending',
              confidence: 'medium',
              questions: [
                {
                  id: 'q-notification-required',
                  question: '是否需要微信通知？',
                  options: ['需要通知', '不需要通知', '暂不确定'],
                  impact: 'rule',
                },
              ],
            },
          ],
        },
      ],
    };
  }

  private createPlatformHomePageBlocks(platform: PlatformType): WireframeBlock[] {
    switch (platform) {
      case 'web':
        return [
          { id: 'b1', type: 'header', title: '顶部导航', description: 'Logo + 主导航菜单 + 用户信息' },
          { id: 'b2', type: 'nav', title: '侧边栏', description: '功能导航菜单', actions: ['首页', '医生管理', '预约管理', '用户管理', '系统设置'] },
          { id: 'b3', type: 'card', title: '数据概览', description: '今日预约数、医生数、用户数等核心指标', fields: ['今日预约', '在岗医生', '活跃用户'] },
          { id: 'b4', type: 'table', title: '最新预约列表', description: '近期预约记录表格', fields: ['患者', '医生', '时间', '状态', '操作'] },
          { id: 'b5', type: 'modal', title: '新增预约弹窗', description: '新建预约表单弹窗' },
        ];
      case 'h5':
        return [
          { id: 'b1', type: 'header', title: '顶部标题栏', description: '页面标题 + 返回按钮' },
          { id: 'b2', type: 'banner', title: 'Banner轮播', description: '活动推广轮播图' },
          { id: 'b3', type: 'nav', title: '服务入口', description: '快捷功能入口', actions: ['找医生', '我的预约', '健康资讯', '个人中心'] },
          { id: 'b4', type: 'card', title: '推荐医生', description: '推荐医生卡片列表', children: [
            { id: 'b4-1', type: 'card', title: '医生卡片', fields: ['头像', '姓名', '职称', '擅长'] },
          ]},
          { id: 'b5', type: 'button', title: '底部固定按钮', description: '悬浮快捷操作按钮' },
        ];
      case 'app':
        return [
          { id: 'b1', type: 'header', title: '状态栏', description: '手机状态栏 + 信号、电池' },
          { id: 'b2', type: 'header', title: '原生导航栏', description: '页面标题 + 右侧操作' },
          { id: 'b3', type: 'banner', title: 'Banner轮播', description: '运营活动推广' },
          { id: 'b4', type: 'nav', title: '功能入口', description: '图标+文字快捷入口', actions: ['找医生', '预约挂号', '健康档案', '我的'] },
          { id: 'b5', type: 'card', title: '推荐医生', description: '推荐医生列表', children: [
            { id: 'b5-1', type: 'card', title: '医生卡片', fields: ['头像', '姓名', '职称', '擅长'] },
          ]},
          { id: 'b6', type: 'tabs', title: '底部 Tab', actions: ['首页', '找医生', '预约', '我的'] },
        ];
      case 'mini-program':
      default:
        return [
          { id: 'b1', type: 'header', title: '小程序导航栏', description: '自定义导航栏 + 标题' },
          { id: 'b2', type: 'banner', title: 'Banner轮播', description: '活动推广' },
          { id: 'b3', type: 'nav', title: '服务入口', description: '找医生、预约、咨询等入口', actions: ['找医生', '我的预约', '在线咨询'] },
          { id: 'b4', type: 'card', title: '推荐医生', description: '推荐医生卡片列表', children: [
            { id: 'b4-1', type: 'card', title: '医生卡片', fields: ['头像', '姓名', '职称', '擅长'] },
          ]},
          { id: 'b5', type: 'tabs', title: '底部导航', actions: ['首页', '医生', '预约', '我的'] },
        ];
    }
  }

  private createPlatformDoctorListBlocks(platform: PlatformType): WireframeBlock[] {
    switch (platform) {
      case 'web':
        return [
          { id: 'b1', type: 'header', title: '顶部导航', description: 'Logo + 主导航 + 用户信息' },
          { id: 'b2', type: 'nav', title: '侧边栏', description: '功能导航', actions: ['首页', '医生管理', '预约管理'] },
          { id: 'b3', type: 'form', title: '高级筛选', description: '多条件筛选医生', fields: ['科室', '职称', '擅长领域', '出诊状态'] },
          { id: 'b4', type: 'table', title: '医生列表', description: '医生信息表格', fields: ['姓名', '科室', '职称', '擅长领域', '今日出诊', '操作'] },
          { id: 'b5', type: 'nav', title: '分页器', description: '列表分页导航', actions: ['上一页', '1', '2', '3', '下一页'] },
        ];
      case 'h5':
        return [
          { id: 'b1', type: 'header', title: '顶部标题栏', description: '页面标题 + 返回' },
          { id: 'b2', type: 'form', title: '搜索框', description: '搜索医生关键词', fields: ['搜索医生...'] },
          { id: 'b3', type: 'tabs', title: '科室筛选', actions: ['全部', '内科', '外科', '妇科', '儿科'] },
          { id: 'b4', type: 'list', title: '医生卡片列表', description: '医生卡片列表', children: [
            { id: 'b4-1', type: 'card', title: '医生卡片', fields: ['头像', '姓名', '职称', '擅长'], actions: ['预约'] },
          ]},
          { id: 'b5', type: 'text', title: '底部加载更多', description: '上拉加载更多' },
        ];
      case 'app':
        return [
          { id: 'b1', type: 'header', title: '原生导航栏', description: '页面标题 + 搜索按钮' },
          { id: 'b2', type: 'form', title: '搜索框', description: '搜索医生', fields: ['搜索医生...'] },
          { id: 'b3', type: 'tabs', title: '科室 Tab', actions: ['全部', '内科', '外科', '妇科', '儿科'] },
          { id: 'b4', type: 'list', title: '医生列表', description: '医生卡片列表', children: [
            { id: 'b4-1', type: 'card', title: '医生卡片', fields: ['头像', '姓名', '职称', '擅长'], actions: ['预约'] },
          ]},
          { id: 'b5', type: 'tabs', title: '底部 Tab', actions: ['首页', '找医生', '预约', '我的'] },
        ];
      case 'mini-program':
      default:
        return [
          { id: 'b1', type: 'header', title: '顶部标题', description: '医生列表' },
          { id: 'b2', type: 'form', title: '搜索框', description: '搜索医生', fields: ['搜索关键词'] },
          { id: 'b3', type: 'tabs', title: '科室筛选', actions: ['全部', '内科', '外科', '妇科', '儿科'] },
          { id: 'b4', type: 'list', title: '医生列表', description: '医生卡片列表', children: [
            { id: 'b4-1', type: 'card', title: '医生卡片', fields: ['头像', '姓名', '职称', '擅长'], actions: ['预约'] },
          ]},
          { id: 'b5', type: 'tabs', title: '底部导航', actions: ['首页', '医生', '预约', '我的'] },
        ];
    }
  }

  private createPlatformDoctorDetailBlocks(platform: PlatformType): WireframeBlock[] {
    switch (platform) {
      case 'web':
        return [
          { id: 'b1', type: 'header', title: '顶部导航', description: 'Logo + 主导航 + 用户信息' },
          { id: 'b2', type: 'nav', title: '侧边栏', description: '页面导航' },
          { id: 'b3', type: 'card', title: '医生详情卡片', description: '医生完整信息', fields: ['头像', '姓名', '职称', '科室', '擅长领域', '出诊时间', '简介'] },
          { id: 'b4', type: 'table', title: '出诊时间表', description: '一周出诊时间安排', fields: ['日期', '上午', '下午', '晚上', '状态'] },
          { id: 'b5', type: 'table', title: '用户评价列表', description: '历史评价', fields: ['患者', '评分', '评价内容', '日期'] },
          { id: 'b6', type: 'modal', title: '预约弹窗', description: '发起预约表单弹窗', fields: ['预约日期', '预约时间段', '就诊人', '联系电话', '症状描述'] },
        ];
      case 'h5':
        return [
          { id: 'b1', type: 'header', title: '顶部标题栏', description: '页面标题 + 返回' },
          { id: 'b2', type: 'card', title: '医生资料', description: '医生基本信息', fields: ['头像', '姓名', '职称', '科室', '评分'] },
          { id: 'b3', type: 'text', title: '擅长领域', description: '医生擅长领域介绍' },
          { id: 'b4', type: 'list', title: '出诊时间', description: '可预约时间段', children: [
            { id: 'b4-1', type: 'card', title: '时间段卡片', fields: ['日期', '上午/下午', '剩余号源'] },
          ]},
          { id: 'b5', type: 'list', title: '用户评价', description: '评价列表' },
          { id: 'b6', type: 'bottom-sheet', title: '预约底部弹层', description: '选择时间提交预约' },
        ];
      case 'app':
        return [
          { id: 'b1', type: 'header', title: '原生导航栏', description: '返回 + 分享按钮' },
          { id: 'b2', type: 'card', title: '医生资料', description: '医生基本信息', fields: ['头像', '姓名', '职称', '科室', '评分'] },
          { id: 'b3', type: 'text', title: '擅长领域', description: '医生擅长领域介绍' },
          { id: 'b4', type: 'list', title: '出诊时间', description: '可预约时间段' },
          { id: 'b5', type: 'list', title: '用户评价', description: '评价列表' },
          { id: 'b6', type: 'bottom-sheet', title: '预约操作', description: '底部弹出预约操作' },
        ];
      case 'mini-program':
      default:
        return [
          { id: 'b1', type: 'header', title: '顶部标题', description: '医生详情' },
          { id: 'b2', type: 'card', title: '医生资料', description: '医生基本信息', fields: ['头像', '姓名', '职称', '科室', '评分'] },
          { id: 'b3', type: 'text', title: '擅长领域', description: '医生擅长领域介绍' },
          { id: 'b4', type: 'table', title: '出诊时间', description: '出诊时间表', fields: ['日期', '时间段', '状态'] },
          { id: 'b5', type: 'list', title: '用户评价', description: '评价列表' },
          { id: 'b6', type: 'button', title: '立即预约', description: '发起预约按钮' },
        ];
    }
  }

  private createPlatformBookingConfirmBlocks(platform: PlatformType): WireframeBlock[] {
    switch (platform) {
      case 'web':
        return [
          { id: 'b1', type: 'header', title: '顶部导航', description: 'Logo + 主导航 + 用户信息' },
          { id: 'b2', type: 'nav', title: '侧边栏', description: '进度提示' },
          { id: 'b3', type: 'card', title: '医生信息', description: '预约医生信息', fields: ['医生姓名', '科室', '预约时间'] },
          { id: 'b4', type: 'form', title: '就诊人信息表单', description: '填写就诊人信息', fields: ['姓名', '手机号', '身份证号', '病情描述'] },
          { id: 'b5', type: 'table', title: '预约须知', description: '注意事项说明' },
          { id: 'b6', type: 'button', title: '提交预约', description: '确认提交按钮' },
          { id: 'b7', type: 'modal', title: '预约成功弹窗', description: '提交成功提示' },
        ];
      case 'h5':
        return [
          { id: 'b1', type: 'header', title: '顶部标题栏', description: '页面标题 + 返回' },
          { id: 'b2', type: 'card', title: '医生信息', description: '预约医生信息', fields: ['医生', '时间'] },
          { id: 'b3', type: 'form', title: '就诊人表单', description: '填写就诊人信息', fields: ['姓名', '电话', '身份证'] },
          { id: 'b4', type: 'form', title: '预约时间', description: '选择预约时间' },
          { id: 'b5', type: 'text', title: '预约须知', description: '预约相关说明' },
          { id: 'b6', type: 'button', title: '底部固定按钮', description: '提交预约按钮' },
        ];
      case 'app':
        return [
          { id: 'b1', type: 'header', title: '原生导航栏', description: '页面标题 + 返回' },
          { id: 'b2', type: 'card', title: '医生信息', description: '预约医生信息', fields: ['医生', '时间'] },
          { id: 'b3', type: 'form', title: '就诊人表单', description: '填写就诊人信息', fields: ['姓名', '电话', '身份证'] },
          { id: 'b4', type: 'form', title: '预约时间', description: '选择预约时间' },
          { id: 'b5', type: 'text', title: '预约须知', description: '预约相关说明' },
          { id: 'b6', type: 'bottom-sheet', title: '提交预约', description: '底部确认提交' },
        ];
      case 'mini-program':
      default:
        return [
          { id: 'b1', type: 'header', title: '顶部标题', description: '预约确认' },
          { id: 'b2', type: 'form', title: '就诊人信息', description: '填写就诊人信息', fields: ['姓名', '电话', '身份证号'] },
          { id: 'b3', type: 'form', title: '预约时间', description: '选择预约时间', fields: ['日期', '时间段'] },
          { id: 'b4', type: 'form', title: '症状描述', description: '填写症状', fields: ['症状描述'] },
          { id: 'b5', type: 'text', title: '预约须知', description: '预约相关说明' },
          { id: 'b6', type: 'button', title: '提交预约', description: '提交按钮' },
        ];
    }
  }

  private createPlatformMyBookingsBlocks(platform: PlatformType): WireframeBlock[] {
    switch (platform) {
      case 'web':
        return [
          { id: 'b1', type: 'header', title: '顶部导航', description: 'Logo + 主导航 + 用户信息' },
          { id: 'b2', type: 'nav', title: '侧边栏', description: '功能导航' },
          { id: 'b3', type: 'form', title: '状态筛选', description: '多条件筛选', fields: ['预约状态', '日期范围', '医生'] },
          { id: 'b4', type: 'table', title: '预约记录列表', description: '预约记录表格', fields: ['预约编号', '医生', '科室', '时间', '状态', '操作'] },
          { id: 'b5', type: 'nav', title: '分页器', description: '列表分页', actions: ['上一页', '1', '2', '3', '下一页'] },
          { id: 'b6', type: 'modal', title: '取消确认弹窗', description: '取消预约确认' },
        ];
      case 'h5':
        return [
          { id: 'b1', type: 'header', title: '顶部标题栏', description: '页面标题 + 返回' },
          { id: 'b2', type: 'tabs', title: '状态筛选', actions: ['全部', '待确认', '已确认', '已完成', '已取消'] },
          { id: 'b3', type: 'list', title: '预约列表', description: '预约记录列表', children: [
            { id: 'b3-1', type: 'card', title: '预约卡片', fields: ['医生', '时间', '状态'], actions: ['取消', '详情'] },
          ]},
          { id: 'b4', type: 'text', title: '底部加载更多', description: '上拉加载' },
        ];
      case 'app':
        return [
          { id: 'b1', type: 'header', title: '原生导航栏', description: '页面标题' },
          { id: 'b2', type: 'tabs', title: '状态 Tab', actions: ['全部', '待确认', '已确认', '已完成', '已取消'] },
          { id: 'b3', type: 'list', title: '预约列表', description: '预约记录列表', children: [
            { id: 'b3-1', type: 'card', title: '预约卡片', fields: ['医生', '时间', '状态'], actions: ['取消', '详情'] },
          ]},
          { id: 'b4', type: 'tabs', title: '底部 Tab', actions: ['首页', '找医生', '预约', '我的'] },
        ];
      case 'mini-program':
      default:
        return [
          { id: 'b1', type: 'header', title: '顶部标题', description: '我的预约' },
          { id: 'b2', type: 'tabs', title: '状态筛选', actions: ['全部', '待确认', '已确认', '已完成', '已取消'] },
          { id: 'b3', type: 'list', title: '预约列表', description: '预约记录列表', children: [
            { id: 'b3-1', type: 'card', title: '预约卡片', fields: ['医生', '时间', '状态'], actions: ['取消', '改约', '详情'] },
          ]},
          { id: 'b4', type: 'tabs', title: '底部导航', actions: ['首页', '医生', '预约', '我的'] },
        ];
    }
  }

  private createPlatformPersonalCenterBlocks(platform: PlatformType): WireframeBlock[] {
    switch (platform) {
      case 'web':
        return [
          { id: 'b1', type: 'header', title: '顶部导航', description: 'Logo + 主导航 + 用户信息' },
          { id: 'b2', type: 'nav', title: '侧边栏', description: '个人中心菜单', actions: ['个人信息', '修改密码', '预约管理', '消息通知', '系统设置', '退出登录'] },
          { id: 'b3', type: 'card', title: '用户信息卡片', description: '用户基本信息', fields: ['头像', '姓名', '手机号', '角色', '注册时间'] },
          { id: 'b4', type: 'table', title: '快捷操作记录', description: '最近操作', fields: ['操作类型', '时间', '状态'] },
          { id: 'b5', type: 'modal', title: '编辑信息弹窗', description: '编辑个人信息' },
        ];
      case 'h5':
        return [
          { id: 'b1', type: 'header', title: '顶部标题栏', description: '个人中心' },
          { id: 'b2', type: 'card', title: '用户信息', description: '用户头像和昵称', fields: ['头像', '昵称', '手机号'] },
          { id: 'b3', type: 'list', title: '功能入口', description: '常用功能入口', children: [
            { id: 'b3-1', type: 'card', title: '我的预约', actions: ['查看'] },
            { id: 'b3-2', type: 'card', title: '我的收藏', actions: ['查看'] },
            { id: 'b3-3', type: 'card', title: '消息通知', actions: ['查看'] },
            { id: 'b3-4', type: 'card', title: '设置', actions: ['查看'] },
          ]},
          { id: 'b4', type: 'button', title: '底部退出按钮', description: '退出登录' },
        ];
      case 'app':
        return [
          { id: 'b1', type: 'header', title: '原生导航栏', description: '设置按钮' },
          { id: 'b2', type: 'card', title: '用户信息', description: '用户头像和昵称', fields: ['头像', '昵称', '手机号'] },
          { id: 'b3', type: 'nav', title: '功能菜单', description: '个人中心菜单', actions: ['我的预约', '健康档案', '收藏医生', '消息通知', '设置', '帮助反馈'] },
          { id: 'b4', type: 'tabs', title: '底部 Tab', actions: ['首页', '找医生', '预约', '我的'] },
        ];
      case 'mini-program':
      default:
        return [
          { id: 'b1', type: 'header', title: '顶部标题', description: '个人中心' },
          { id: 'b2', type: 'card', title: '用户信息', description: '用户头像和昵称', fields: ['头像', '昵称', '手机号'] },
          { id: 'b3', type: 'list', title: '功能入口', description: '常用功能入口', children: [
            { id: 'b3-1', type: 'card', title: '我的预约', actions: ['查看'] },
            { id: 'b3-2', type: 'card', title: '我的收藏', actions: ['查看'] },
            { id: 'b3-3', type: 'card', title: '设置', actions: ['查看'] },
          ]},
          { id: 'b4', type: 'tabs', title: '底部导航', actions: ['首页', '医生', '预约', '我的'] },
        ];
    }
  }
}