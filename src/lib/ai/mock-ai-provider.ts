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
} from '@/lib/types';

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
    
    const wireframes: WireframePage[] = [
      {
        id: 'wireframe-1',
        pageId: 'page-1',
        pageName: '首页',
        blocks: this.createHomePageBlocks(),
      },
      {
        id: 'wireframe-2',
        pageId: 'page-2',
        pageName: '医生列表页',
        blocks: this.createDoctorListBlocks(),
      },
      {
        id: 'wireframe-3',
        pageId: 'page-3',
        pageName: '医生详情页',
        blocks: this.createDoctorDetailBlocks(),
      },
      {
        id: 'wireframe-4',
        pageId: 'page-4',
        pageName: '预约确认页',
        blocks: this.createBookingConfirmBlocks(),
      },
      {
        id: 'wireframe-5',
        pageId: 'page-5',
        pageName: '我的预约页',
        blocks: this.createMyBookingsBlocks(),
      },
    ];

    return wireframes;
  }

  async generatePRD(params: GeneratePRDParams): Promise<string> {
    await this.delay(800);
    
    const prd = `# 中医预约小程序 产品需求文档 (PRD)

## 1. 产品概述

### 1.1 产品名称
中医预约小程序

### 1.2 产品定位
为用户提供便捷的中医专家预约服务，解决找医生难、预约流程复杂的问题。

### 1.3 目标用户
- 需要中医咨询的用户
- 需要中医调理服务的用户
- 需要预约中医专家的用户

## 2. 核心功能

### 2.1 首页
- 展示 Banner 轮播
- 提供服务入口导航
- 展示推荐医生列表
- 底部导航栏

### 2.2 医生列表页
- 搜索医生功能
- 科室筛选功能
- 医生卡片列表展示
- 快速预约入口

### 2.3 医生详情页
- 医生基本信息展示
- 擅长领域介绍
- 出诊时间表
- 用户评价展示
- 预约入口

### 2.4 预约确认页
- 就诊人信息填写
- 预约时间选择
- 症状描述输入
- 预约须知展示

### 2.5 我的预约页
- 预约记录列表
- 预约状态展示
- 取消/改约功能

## 3. 非功能需求

### 3.1 性能要求
- 页面加载时间 < 2s
- 接口响应时间 < 500ms

### 3.2 安全要求
- 用户信息加密存储
- 接口请求鉴权

## 4. 待确认事项

- 是否需要支付功能？
- 是否支持改约？
- 是否需要医生确认预约？
- 是否需要微信通知？
`;

    return prd;
  }

  async generateDevHandoff(params: GenerateDevHandoffParams): Promise<string> {
    await this.delay(600);
    
    const devHandoff = `# 中医预约小程序 研发说明

## 1. 技术栈

### 1.1 前端
- 微信小程序原生框架
- TypeScript
- WXSS 样式

### 1.2 后端
- Node.js
- Express
- PostgreSQL

## 2. 数据结构

### 2.1 用户表 (users)
\`\`\`typescript
interface User {
  id: string;
  openid: string;
  nickname: string;
  avatar: string;
  phone?: string;
  createdAt: Date;
}
\`\`\`

### 2.2 医生表 (doctors)
\`\`\`typescript
interface Doctor {
  id: string;
  name: string;
  title: string;
  department: string;
  specialties: string[];
  avatar: string;
  rating: number;
  schedule: Schedule[];
}
\`\`\`

### 2.3 预约表 (appointments)
\`\`\`typescript
interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  datetime: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  symptoms?: string;
  createdAt: Date;
}
\`\`\`

## 3. API 接口

### 3.1 获取医生列表
- GET /api/doctors
- Query: department?, keyword?, page?, size?
- Response: Doctor[]

### 3.2 获取医生详情
- GET /api/doctors/:id
- Response: Doctor

### 3.3 创建预约
- POST /api/appointments
- Body: { doctorId, datetime, symptoms }
- Response: Appointment

### 3.4 获取用户预约列表
- GET /api/appointments
- Query: status?, page?, size?
- Response: Appointment[]

### 3.5 取消预约
- PUT /api/appointments/:id/cancel
- Response: Appointment

## 4. 待确认技术方案

- 支付功能是否需要接入微信支付？
- 改约功能的具体逻辑？
- 医生端是否需要独立的管理后台？
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

  private createHomePageBlocks(): WireframeBlock[] {
    return [
      { id: 'b1', type: 'header', title: '顶部状态栏', description: '小程序状态栏' },
      { id: 'b2', type: 'banner', title: 'Banner轮播', description: '活动推广' },
      { id: 'b3', type: 'nav', title: '服务入口', description: '找医生、预约、咨询等入口', actions: ['找医生', '我的预约', '在线咨询'] },
      { id: 'b4', type: 'card', title: '推荐医生', description: '推荐医生卡片列表', children: [
        { id: 'b4-1', type: 'card', title: '医生卡片', fields: ['头像', '姓名', '职称', '擅长'] },
      ]},
      { id: 'b5', type: 'tabs', title: '底部导航', actions: ['首页', '医生', '预约', '我的'] },
    ];
  }

  private createDoctorListBlocks(): WireframeBlock[] {
    return [
      { id: 'b1', type: 'header', title: '顶部标题', description: '医生列表' },
      { id: 'b2', type: 'form', title: '搜索框', description: '搜索医生', fields: ['搜索关键词'] },
      { id: 'b3', type: 'tabs', title: '科室筛选', actions: ['全部', '内科', '外科', '妇科', '儿科'] },
      { id: 'b4', type: 'list', title: '医生列表', description: '医生卡片列表', children: [
        { id: 'b4-1', type: 'card', title: '医生卡片', fields: ['头像', '姓名', '职称', '擅长'], actions: ['预约'] },
        { id: 'b4-2', type: 'card', title: '医生卡片', fields: ['头像', '姓名', '职称', '擅长'], actions: ['预约'] },
      ]},
      { id: 'b5', type: 'tabs', title: '底部导航', actions: ['首页', '医生', '预约', '我的'] },
    ];
  }

  private createDoctorDetailBlocks(): WireframeBlock[] {
    return [
      { id: 'b1', type: 'header', title: '顶部标题', description: '医生详情' },
      { id: 'b2', type: 'card', title: '医生资料', description: '医生基本信息', fields: ['头像', '姓名', '职称', '科室', '评分'] },
      { id: 'b3', type: 'text', title: '擅长领域', description: '医生擅长领域介绍' },
      { id: 'b4', type: 'table', title: '出诊时间', description: '出诊时间表', fields: ['日期', '时间段', '状态'] },
      { id: 'b5', type: 'list', title: '用户评价', description: '评价列表' },
      { id: 'b6', type: 'button', title: '立即预约', description: '发起预约按钮' },
    ];
  }

  private createBookingConfirmBlocks(): WireframeBlock[] {
    return [
      { id: 'b1', type: 'header', title: '顶部标题', description: '预约确认' },
      { id: 'b2', type: 'form', title: '就诊人信息', description: '填写就诊人信息', fields: ['姓名', '电话', '身份证号'] },
      { id: 'b3', type: 'form', title: '预约时间', description: '选择预约时间', fields: ['日期', '时间段'] },
      { id: 'b4', type: 'form', title: '症状描述', description: '填写症状', fields: ['症状描述'] },
      { id: 'b5', type: 'text', title: '预约须知', description: '预约相关说明' },
      { id: 'b6', type: 'button', title: '提交预约', description: '提交按钮' },
    ];
  }

  private createMyBookingsBlocks(): WireframeBlock[] {
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