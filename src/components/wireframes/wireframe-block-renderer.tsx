'use client';

import type { WireframeBlock } from '@/lib/types';

interface WireframeBlockRendererProps {
  block: WireframeBlock;
  platform: string;
  depth?: number;
}

// ============================================================
// 行业检测工具
// ============================================================

type Industry = 'medical' | 'ecommerce' | 'education' | 'resume' | 'saas' | 'local_service' | 'content' | 'general';

// 根据字段名、标题检测行业
function detectIndustry(block: WireframeBlock): Industry {
  const title = (block.title || '').toLowerCase();
  const fields = (block.fields || []).map(f => f.toLowerCase()).join(' ');
  const desc = (block.description || '').toLowerCase();
  const combined = title + ' ' + fields + ' ' + desc;

  // 医疗/中医/预约挂号
  if (
    combined.includes('医生') ||
    combined.includes('医师') ||
    combined.includes('医疗') ||
    combined.includes('中医') ||
    combined.includes('预约挂号') ||
    combined.includes('就诊') ||
    combined.includes('科室') ||
    combined.includes('症状') ||
    combined.includes('诊疗')
  ) {
    return 'medical';
  }

  // 电商/商品/订单
  if (
    combined.includes('商品') ||
    combined.includes('订单') ||
    combined.includes('购物') ||
    combined.includes('购物车') ||
    combined.includes('sku') ||
    combined.includes('销量') ||
    combined.includes('库存')
  ) {
    return 'ecommerce';
  }

  // 在线课程/教育
  if (
    combined.includes('课程') ||
    combined.includes('讲师') ||
    combined.includes('课时') ||
    combined.includes('学习') ||
    combined.includes('教育')
  ) {
    return 'education';
  }

  // 简历/招聘
  if (
    combined.includes('简历') ||
    combined.includes('候选人') ||
    combined.includes('岗位') ||
    combined.includes('招聘') ||
    combined.includes('匹配度')
  ) {
    return 'resume';
  }

  // SaaS后台/管理系统
  if (
    combined.includes('账号') ||
    combined.includes('角色') ||
    combined.includes('权限') ||
    combined.includes('后台') ||
    combined.includes('管理')
  ) {
    return 'saas';
  }

  // 本地生活/服务预约
  if (
    combined.includes('门店') ||
    combined.includes('技师') ||
    combined.includes('服务预约') ||
    combined.includes('足疗') ||
    combined.includes('按摩') ||
    combined.includes('美容')
  ) {
    return 'local_service';
  }

  // 内容社区/资讯
  if (
    combined.includes('文章') ||
    combined.includes('阅读量') ||
    combined.includes('点赞') ||
    combined.includes('评论') ||
    combined.includes('内容')
  ) {
    return 'content';
  }

  return 'general';
}

// ============================================================
// 示例数据映射工具（行业感知）
// ============================================================

// 根据字段名返回示例值（行业感知）
function getSampleValue(fieldName: string, industry: Industry = 'general'): string {
  const lowerField = fieldName.toLowerCase();

  // 医疗行业
  if (industry === 'medical') {
    if (lowerField.includes('姓名') && (lowerField.includes('医生') || lowerField.includes('专家') || lowerField.includes('医师'))) {
      return '张医生';
    }
    if (lowerField.includes('姓名') || lowerField === '姓名' || lowerField === '名字') {
      return '张三';
    }
    if (lowerField.includes('职称') || lowerField.includes('级别')) {
      return '主任医师';
    }
    if (lowerField.includes('科室') || lowerField.includes('科别')) {
      return '中医内科';
    }
    if (lowerField.includes('医院') || lowerField.includes('机构')) {
      return '三甲医院';
    }
    if (lowerField.includes('擅长') || lowerField.includes('领域')) {
      return '脾胃调理、针灸、失眠';
    }
    if (lowerField.includes('评分') || lowerField.includes('分值')) {
      return '4.9';
    }
    if (lowerField.includes('预约') && (lowerField.includes('次数') || lowerField.includes('量'))) {
      return '已预约 326 次';
    }
    if (lowerField.includes('手机') || lowerField === '电话') {
      return '138****8888';
    }
    if (lowerField.includes('身份证')) {
      return '320************';
    }
    if (lowerField.includes('时间') || lowerField.includes('日期')) {
      return '2026-05-28 周三 09:30';
    }
    if (lowerField.includes('状态')) {
      return '待确认';
    }
    if (lowerField.includes('症状') || lowerField.includes('描述')) {
      return '最近睡眠不好，胃部不适';
    }
    if (lowerField.includes('价格') || lowerField.includes('金额') || lowerField.includes('费用')) {
      return '¥99.00';
    }
    if (lowerField.includes('地址') || lowerField.includes('位置')) {
      return '北京市朝阳区建国路88号';
    }
  }

  // 电商行业
  if (industry === 'ecommerce') {
    if (lowerField.includes('商品') || lowerField.includes('名称') || lowerField.includes('产品')) {
      return '养生茶礼盒';
    }
    if (lowerField.includes('价格') || lowerField.includes('金额') || lowerField.includes('费用')) {
      return '¥99.00';
    }
    if (lowerField.includes('销量') || lowerField.includes('已售')) {
      return '已售 2361 件';
    }
    if (lowerField.includes('库存')) {
      return '库存 128 件';
    }
    if (lowerField.includes('规格')) {
      return '经典款 / 500g';
    }
    if (lowerField.includes('收货人') || lowerField.includes('买家')) {
      return '张三';
    }
    if (lowerField.includes('收货地址') || lowerField.includes('地址')) {
      return '上海市浦东新区XX路';
    }
    if (lowerField.includes('订单') && lowerField.includes('状态')) {
      return '待支付';
    }
    if (lowerField.includes('手机') || lowerField === '电话') {
      return '138****8888';
    }
    if (lowerField.includes('时间') || lowerField.includes('日期')) {
      return '2026-05-28 10:30';
    }
  }

  // 教育行业
  if (industry === 'education') {
    if (lowerField.includes('课程') || lowerField.includes('名称')) {
      return 'AI产品经理实战课';
    }
    if (lowerField.includes('讲师') || lowerField.includes('老师')) {
      return '李老师';
    }
    if (lowerField.includes('课时') || lowerField.includes('节数')) {
      return '24 节课';
    }
    if (lowerField.includes('学习') && lowerField.includes('人数')) {
      return '3268 人已学';
    }
    if (lowerField.includes('状态')) {
      return '学习中';
    }
    if (lowerField.includes('价格') || lowerField.includes('金额') || lowerField.includes('费用')) {
      return '¥199.00';
    }
    if (lowerField.includes('时间') || lowerField.includes('日期')) {
      return '2026-05-28 10:30';
    }
  }

  // 简历行业
  if (industry === 'resume') {
    if (lowerField.includes('简历') || lowerField.includes('名称')) {
      return '产品经理简历';
    }
    if (lowerField.includes('候选人') || lowerField.includes('姓名')) {
      return '张三';
    }
    if (lowerField.includes('岗位') || lowerField.includes('目标')) {
      return 'AI产品经理';
    }
    if (lowerField.includes('匹配度')) {
      return '86%';
    }
    if (lowerField.includes('建议') || lowerField.includes('优化')) {
      return '强化项目成果描述';
    }
    if (lowerField.includes('状态')) {
      return '已优化';
    }
  }

  // SaaS后台行业
  if (industry === 'saas') {
    if (lowerField.includes('用户') || lowerField.includes('名称') || lowerField.includes('账号')) {
      return '北京星河科技';
    }
    if (lowerField.includes('状态') && (lowerField.includes('账号') || lowerField.includes('状态'))) {
      return '正常';
    }
    if (lowerField.includes('角色')) {
      return '管理员';
    }
    if (lowerField.includes('创建') && lowerField.includes('时间')) {
      return '2026-05-28 10:30';
    }
    if (lowerField.includes('订单') && lowerField.includes('数')) {
      return '128';
    }
    if (lowerField.includes('转化')) {
      return '12.8%';
    }
    if (lowerField.includes('时间') || lowerField.includes('日期')) {
      return '2026-05-28 10:30';
    }
  }

  // 本地生活行业
  if (industry === 'local_service') {
    if (lowerField.includes('门店') || lowerField.includes('名称')) {
      return '星河养生馆';
    }
    if (lowerField.includes('服务') || lowerField.includes('项目')) {
      return '60分钟肩颈理疗';
    }
    if (lowerField.includes('技师')) {
      return '8号技师';
    }
    if (lowerField.includes('时间') || lowerField.includes('日期') || lowerField.includes('预约')) {
      return '今天 15:30';
    }
    if (lowerField.includes('价格') || lowerField.includes('金额') || lowerField.includes('费用')) {
      return '¥168.00';
    }
    if (lowerField.includes('状态')) {
      return '待服务';
    }
    if (lowerField.includes('手机') || lowerField === '电话') {
      return '138****8888';
    }
  }

  // 内容社区行业
  if (industry === 'content') {
    if (lowerField.includes('文章') || lowerField.includes('标题')) {
      return '如何提升产品评审效率';
    }
    if (lowerField.includes('作者')) {
      return '产品研究员';
    }
    if (lowerField.includes('阅读')) {
      return '1.2w阅读';
    }
    if (lowerField.includes('点赞')) {
      return '328';
    }
    if (lowerField.includes('发布时间') || lowerField.includes('时间')) {
      return '2小时前';
    }
    if (lowerField.includes('评论')) {
      return '42条评论';
    }
  }

  // 通用行业（默认）
  if (lowerField.includes('姓名') || lowerField === '姓名' || lowerField === '名字') {
    return '张三';
  }
  if (lowerField.includes('手机') || lowerField === '电话') {
    return '138****8888';
  }
  if (lowerField.includes('时间') || lowerField.includes('日期')) {
    return '2026-05-28 10:30';
  }
  if (lowerField.includes('状态')) {
    return '进行中';
  }
  if (lowerField.includes('价格') || lowerField.includes('金额') || lowerField.includes('费用')) {
    return '¥99.00';
  }
  if (lowerField.includes('数量')) {
    return '128';
  }
  if (lowerField.includes('地址')) {
    return '上海市浦东新区XX路';
  }
  if (lowerField.includes('描述') || lowerField.includes('说明')) {
    return '这里展示该模块的核心说明内容';
  }
  if (lowerField.includes('备注')) {
    return '这里填写补充说明';
  }

  // 默认返回字段名
  return fieldName;
}

// 获取行业感知的示例值
function getIndustryAwareValue(fieldName: string, block: WireframeBlock): string {
  const industry = detectIndustry(block);
  return getSampleValue(fieldName, industry);
}

// 检测是否为单个医生卡片（精确匹配）
function isDoctorCard(block: WireframeBlock): boolean {
  const title = (block.title || '').toLowerCase();
  return (
    title.includes('医生卡片') ||
    title.includes('单个医生') ||
    title.includes('医生资料卡片') ||
    title.includes('专家卡片') ||
    title.includes('医师卡片')
  );
}

// 检测是否为推荐医生区块
function isDoctorRecommendation(block: WireframeBlock): boolean {
  const title = (block.title || '').toLowerCase();
  return (
    title.includes('推荐医生') ||
    title.includes('医生推荐') ||
    title.includes('精选医生')
  );
}

// 检测是否为预约记录相关卡片
function isBookingCard(block: WireframeBlock): boolean {
  const title = (block.title || '').toLowerCase();
  return (
    title.includes('预约') ||
    title.includes('记录') ||
    title.includes('我的预约')
  );
}

// 检测是否为医生列表
function isDoctorList(block: WireframeBlock): boolean {
  const title = (block.title || '').toLowerCase();
  return (
    title.includes('医生') && title.includes('列表') ||
    title.includes('医生') && title.includes('卡片')
  );
}

// 检测是否为预约列表
function isBookingList(block: WireframeBlock): boolean {
  const title = (block.title || '').toLowerCase();
  return (
    title.includes('预约') && title.includes('列表') ||
    title.includes('预约') && title.includes('记录')
  );
}

// ============================================================
// 字段标签样式
// ============================================================

const FieldTag = ({ text }: { text: string }) => (
  <span className="h-6 px-2 flex items-center bg-slate-100 rounded-full text-xs text-slate-600 border border-slate-200">
    {text}
  </span>
);

// ============================================================
// 渲染医生卡片
// ============================================================

function renderDoctorCard(block: WireframeBlock) {
  const fields = block.fields || [];
  const actions = block.actions || [];

  // 检查是否有医疗相关字段
  const hasMedicalFields = fields.some(f =>
    f.includes('姓名') || f.includes('医生') || f.includes('职称') ||
    f.includes('科') || f.includes('医院') || f.includes('擅长') ||
    f.includes('评分') || f.includes('预约')
  );

  // 如果没有医疗相关字段，不渲染医生卡片
  if (!hasMedicalFields) {
    // 返回通用信息卡片
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-3 m-2">
        <div className="text-sm font-medium text-slate-800 mb-2">{block.title}</div>
        {block.description && (
          <p className="text-xs text-slate-400">{block.description}</p>
        )}
      </div>
    );
  }

  // 提取实际字段值并显示示例数据
  const nameField = fields.find(f => f.includes('姓名') || f.includes('医生'));
  const titleField = fields.find(f => f.includes('职称'));
  const deptField = fields.find(f => f.includes('科'));
  const hospitalField = fields.find(f => f.includes('医院'));
  const goodAtField = fields.find(f => f.includes('擅长'));
  const ratingField = fields.find(f => f.includes('评分'));
  const timesField = fields.find(f => f.includes('预约') && f.includes('次'));

  // 医生姓名存在时显示示例值"张医生"
  const displayName = nameField ? getSampleValue('医生姓名', 'medical') : null;
  // 职称存在时显示示例值"主任医师"
  const displayTitle = titleField ? getSampleValue('职称', 'medical') : null;
  // 科室存在时显示示例值"中医内科"
  const displayDept = deptField ? getSampleValue('科室', 'medical') : null;
  // 医院存在时显示示例值"三甲医院"
  const displayHospital = hospitalField ? getSampleValue('医院', 'medical') : null;
  // 擅长存在时显示示例值"脾胃调理、针灸、失眠"
  const displayGoodAt = goodAtField ? getSampleValue('擅长', 'medical') : null;
  // 评分存在时显示示例值"4.9"
  const displayRating = ratingField ? getSampleValue('评分', 'medical') : null;
  // 预约次数存在时显示示例值"已预约 326 次"
  const displayTimes = timesField ? getSampleValue('预约次数', 'medical') : null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 m-2 flex gap-3">
      {/* 头像占位 */}
      <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-slate-400 text-sm font-medium">医</span>
      </div>

      {/* 右侧信息 */}
      <div className="flex-1 min-w-0">
        {/* 第一行：姓名 + 职称标签 */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-slate-800">{displayName || '医生'}</span>
          {displayTitle && (
            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">{displayTitle}</span>
          )}
        </div>

        {/* 第二行：科室 · 医院 */}
        {(displayDept || displayHospital) && (
          <div className="text-xs text-slate-500 mb-1">
            {[displayDept, displayHospital].filter(Boolean).join(' · ')}
          </div>
        )}

        {/* 第三行：擅长 */}
        {displayGoodAt && (
          <div className="text-xs text-slate-400 mb-1">
            擅长：{displayGoodAt}
          </div>
        )}

        {/* 第四行：评分 · 预约次数 */}
        {(displayRating || displayTimes) && (
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            {displayRating && <span>评分 {displayRating}</span>}
            {displayRating && displayTimes && <span>·</span>}
            {displayTimes && <span>{displayTimes}</span>}
          </div>
        )}

        {/* 操作按钮 - 只有 actions 不为空时才显示 */}
        {actions.length > 0 && (
          <div className="flex justify-end">
            <span className="px-3 py-1 bg-slate-900 text-white rounded text-xs">{actions[0]}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 渲染推荐医生区块
// ============================================================

function renderDoctorRecommendation(block: WireframeBlock, platform: string, depth: number) {
  const industry = detectIndustry(block);

  // 如果没有 children，只显示区块标题和说明
  if (!block.children || block.children.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl m-2 overflow-hidden">
        <div className="px-3 py-2 border-b border-slate-100">
          <span className="text-sm font-medium text-slate-700">{block.title || '推荐医生'}</span>
        </div>
        <div className="p-4 text-center">
          <span className="text-xs text-slate-400">暂无推荐医生</span>
        </div>
      </div>
    );
  }

  const action = block.actions?.[0];

  return (
    <div className="bg-white border border-slate-200 rounded-xl m-2 overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-100">
        <span className="text-sm font-medium text-slate-700">{block.title || '推荐医生'}</span>
      </div>

      {block.children.map((child) => (
        <div key={child.id} className="p-3 border-b border-slate-50 last:border-0">
          <DoctorCardItem block={child} action={action} industry={industry} />
        </div>
      ))}
    </div>
  );
}

// ============================================================
// 医生卡片项（用于推荐列表）
// ============================================================

function DoctorCardItem({ block, action, industry }: { block: WireframeBlock; action?: string; industry: Industry }) {
  const fields = block.fields || [];
  const name = fields.find(f => f.includes('姓名') || f.includes('医生')) ? getSampleValue('医生姓名', industry) : (block.title || getSampleValue('名称', industry));
  const title2 = fields.find(f => f.includes('职称')) ? getSampleValue('职称', industry) : '';
  const dept = fields.find(f => f.includes('科')) ? getSampleValue('科室', industry) : '';
  const hospital = fields.find(f => f.includes('医院')) ? getSampleValue('医院', industry) : '';
  const goodAt = fields.find(f => f.includes('擅长')) ? getSampleValue('擅长', industry) : '';
  const rating = fields.find(f => f.includes('评分')) ? getSampleValue('评分', industry) : '';
  const times = fields.find(f => f.includes('预约') && f.includes('次')) ? getSampleValue('预约次数', industry) : '';

  return (
    <div className="flex gap-3">
      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-slate-400 text-xs">{getSampleValue('名称', industry)[0]}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-800">{name}</span>
          {title2 && <span className="px-1 py-0.5 bg-slate-100 text-slate-500 rounded text-xs">{title2}</span>}
        </div>
        {dept && <div className="text-xs text-slate-500">{dept}{hospital && ` · ${hospital}`}</div>}
        {goodAt && <div className="text-xs text-slate-400">擅长：{goodAt}</div>}
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-slate-500">
            {rating && `评分 ${rating}`}{rating && times && ' · '}{times}
          </span>
          {action && <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-xs">{action}</span>}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 渲染预约记录卡片
// ============================================================

function renderBookingCard(block: WireframeBlock) {
  const industry = detectIndustry(block);
  const fields = block.fields || [];
  const actions = block.actions;

  // 使用字段名匹配获取值，如果没有对应字段则为空
  const doctorName = fields.find(f => f.includes('医生') || f.includes('姓名')) ? getSampleValue('医生姓名', industry) : (block.title || getSampleValue('名称', industry));
  const title2 = fields.find(f => f.includes('职称')) ? getSampleValue('职称', industry) : '';
  const dept = fields.find(f => f.includes('科')) ? getSampleValue('科室', industry) : '';
  const time = fields.find(f => f.includes('时间') || f.includes('日期')) ? getSampleValue('时间', industry) : '';
  const patient = fields.find(f => f.includes('就诊人') || f.includes('姓名')) ? getSampleValue('姓名', industry) : '';
  const status = fields.find(f => f.includes('状态')) ? getSampleValue('状态', industry) : '';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 m-2">
      {/* 顶部：信息 */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
          <span className="text-slate-400 text-xs">{doctorName[0] || '?'}</span>
        </div>
        <div>
          <div className="text-sm font-medium text-slate-800">{doctorName}</div>
          {(title2 || dept) && <div className="text-xs text-slate-500">{title2}{title2 && dept && ' · '}{dept}</div>}
        </div>
      </div>

      {/* 中部：详情 */}
      <div className="space-y-1 mb-2 pl-10">
        {time && (
          <div className="text-xs text-slate-500">
            {time.includes('时间') ? '' : '时间：'}<span className="text-slate-700">{time}</span>
          </div>
        )}
        {patient && (
          <div className="text-xs text-slate-500">
            {patient.includes('人') ? '' : '人：'}<span className="text-slate-700">{patient}</span>
          </div>
        )}
        {status && (
          <div className="text-xs text-slate-500">
            状态：<span className={`${status.includes('待') ? 'text-amber-600' : status.includes('已') ? 'text-green-600' : 'text-slate-500'}`}>{status}</span>
          </div>
        )}
      </div>

      {/* 底部：操作按钮 - 有 actions 才显示 */}
      {actions && actions.length > 0 && (
        <div className="flex justify-end gap-2">
          {actions.map((action, i) => (
            <span
              key={i}
              className={`px-2 py-1 rounded text-xs ${action.includes('取消') ? 'text-red-500 border border-red-200' : 'text-slate-600 border border-slate-200'
                }`}
            >
              {action}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// 渲染医生列表
// ============================================================

function renderDoctorList(block: WireframeBlock) {
  const industry = detectIndustry(block);
  const action = block.actions?.[0];

  // 如果有 children，使用 children 渲染
  if (block.children && block.children.length > 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl m-2 overflow-hidden">
        <div className="px-3 py-2 border-b border-slate-100">
          <span className="text-sm font-medium text-slate-700">{block.title}</span>
        </div>
        {block.children.map((child) => (
          <div key={child.id} className="p-3 border-b border-slate-50 last:border-0">
            <DoctorCardItem block={child} action={action} industry={industry} />
          </div>
        ))}
      </div>
    );
  }

  // 没有 children，显示占位提示
  return (
    <div className="bg-white border border-slate-200 rounded-xl m-2 overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-100">
        <span className="text-sm font-medium text-slate-700">{block.title}</span>
      </div>
      <div className="p-4 text-center">
        <span className="text-xs text-slate-400">暂无列表数据</span>
      </div>
    </div>
  );
}

// ============================================================
// 渲染预约列表
// ============================================================

function renderBookingList(block: WireframeBlock) {
  const industry = detectIndustry(block);

  // 如果有 children，使用 children 渲染
  if (block.children && block.children.length > 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl m-2 overflow-hidden">
        <div className="px-3 py-2 border-b border-slate-100">
          <span className="text-sm font-medium text-slate-700">{block.title}</span>
        </div>
        {block.children.map((child) => (
          <BookingListItem key={child.id} block={child} industry={industry} />
        ))}
      </div>
    );
  }

  // 没有 children，显示占位提示
  return (
    <div className="bg-white border border-slate-200 rounded-xl m-2 overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-100">
        <span className="text-sm font-medium text-slate-700">{block.title}</span>
      </div>
      <div className="p-4 text-center">
        <span className="text-xs text-slate-400">暂无预约记录</span>
      </div>
    </div>
  );
}

// 预约列表项
function BookingListItem({ block, industry }: { block: WireframeBlock; industry: Industry }) {
  const fields = block.fields || [];
  const name = fields.find(f => f.includes('医生') || f.includes('姓名')) ? getSampleValue('医生姓名', industry) : (block.title || getSampleValue('名称', industry));
  const status = fields.find(f => f.includes('状态')) ? getSampleValue('状态', industry) : '';
  const time = fields.find(f => f.includes('时间') || f.includes('日期')) ? getSampleValue('时间', industry) : '';
  const dept = fields.find(f => f.includes('科')) ? getSampleValue('科室', industry) : '';

  const statusColor = status.includes('待') ? 'text-amber-600 bg-amber-50' : status.includes('已') && status.includes('确认') ? 'text-green-600 bg-green-50' : 'text-slate-500 bg-slate-100';

  return (
    <div className="p-3 border-b border-slate-50">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
          <span className="text-slate-400 text-[10px]">{name[0] || '?'}</span>
        </div>
        <span className="text-sm font-medium text-slate-800">{name}</span>
        {status && <span className={`text-xs px-1 rounded ${statusColor}`}>{status}</span>}
      </div>
      {time && <div className="text-xs text-slate-500 pl-8">{time}{dept && ` · ${dept}`}</div>}
    </div>
  );
}

// ============================================================
// 渲染普通列表
// ============================================================

function renderNormalList(block: WireframeBlock) {
  const industry = detectIndustry(block);

  // 如果有 children，使用 children 渲染
  if (block.children && block.children.length > 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl m-2 overflow-hidden">
        <div className="px-3 py-2 border-b border-slate-100">
          <span className="text-sm font-medium text-slate-700">{block.title}</span>
        </div>
        {block.children.map((child) => (
          <NormalListItem key={child.id} block={child} industry={industry} />
        ))}
      </div>
    );
  }

  // 没有 children，显示占位提示
  return (
    <div className="bg-white border border-slate-200 rounded-xl m-2 overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-100">
        <span className="text-sm font-medium text-slate-700">{block.title}</span>
      </div>
      <div className="p-4 text-center">
        <span className="text-xs text-slate-400">暂无列表数据</span>
      </div>
    </div>
  );
}

// 普通列表项
function NormalListItem({ block, industry }: { block: WireframeBlock; industry: Industry }) {
  const title = block.title || getSampleValue('标题', industry);
  const description = block.description || '';

  return (
    <div className="px-3 py-2.5 border-b border-slate-50 flex items-center justify-between">
      <div>
        <div className="text-sm text-slate-700">{title}</div>
        {description && <div className="text-xs text-slate-400">{description}</div>}
      </div>
      <div className="text-slate-300">›</div>
    </div>
  );
}

// ============================================================
// 渲染真实表单
// ============================================================

function renderRealForm(block: WireframeBlock) {
  const fields = block.fields || [];
  const isValidationError = block.title?.includes('错误') || block.title?.includes('校验');

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 m-2">
      <div className="text-sm font-medium text-slate-700 mb-3">{block.title}</div>
      <div className="space-y-3">
        {fields.map((field, i) => {
          const sampleValue = getIndustryAwareValue(field, block);
          return (
            <div key={i}>
              <label className="text-xs text-slate-500 mb-1 block">{field}</label>
              <div
                className={`h-9 rounded-lg flex items-center px-3 text-sm ${
                  isValidationError && i < 2
                    ? 'border border-red-300 bg-red-50 text-red-700'
                    : 'bg-slate-50 border border-slate-200 text-slate-700'
                }`}
              >
                {sampleValue}
              </div>
            </div>
          );
        })}
      </div>
      {isValidationError && (
        <div className="mt-2 text-xs text-red-500">请填写必填信息</div>
      )}
    </div>
  );
}

// ============================================================
// 渲染真实 Banner
// ============================================================

function renderRealBanner(block: WireframeBlock) {
  const industry = detectIndustry(block);

  // 根据行业检测 Banner 文案
  let title = block.title;
  let description = block.description;

  // 如果 title/description 为空，根据行业生成通用文案
  if (!title) {
    switch (industry) {
      case 'medical':
        title = '在线预约中医服务';
        break;
      case 'ecommerce':
        title = '精选好物';
        break;
      case 'education':
        title = '精品课程';
        break;
      case 'resume':
        title = '简历优化';
        break;
      case 'saas':
        title = '数据管理';
        break;
      case 'local_service':
        title = '服务预约';
        break;
      case 'content':
        title = '热门内容';
        break;
      default:
        title = '核心功能入口';
    }
  }

  if (!description) {
    switch (industry) {
      case 'medical':
        description = '精选医生、便捷预约、健康调理';
        break;
      case 'ecommerce':
        description = '品质好物限时优惠';
        break;
      case 'education':
        description = '跟着行业专家学习';
        break;
      case 'resume':
        description = 'AI 助您打造高分简历';
        break;
      case 'saas':
        description = '高效管理业务数据';
        break;
      case 'local_service':
        description = '专业技师品质服务';
        break;
      case 'content':
        description = '发现更多精彩内容';
        break;
      default:
        description = '这里展示该页面的核心信息和操作入口';
    }
  }

  return (
    <div className="h-[120px] bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl flex flex-col items-center justify-center p-4 m-2 border border-sky-100">
      <span className="text-base font-medium text-sky-800">{title}</span>
      <span className="text-xs text-sky-600 mt-1">{description}</span>
      {block.actions && block.actions.length > 0 && (
        <span className="mt-3 px-4 py-1.5 bg-sky-600 text-white rounded-full text-xs font-medium">
          {block.actions[0]}
        </span>
      )}
    </div>
  );
}

// ============================================================
// 渲染服务入口
// ============================================================

function renderServiceNav(block: WireframeBlock) {
  const actions = block.actions;

  // 如果没有 actions，不渲染
  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <div className="h-14 bg-white border-t border-b border-slate-200 flex items-center justify-around px-4">
      {actions.map((action, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5">
          <div className="w-6 h-6 bg-slate-200 rounded flex items-center justify-center">
            <span className="text-slate-400 text-[8px]">{action[0]}</span>
          </div>
          <span className={`text-[10px] ${i === 0 ? 'text-sky-600' : 'text-slate-500'}`}>{action}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// 渲染真实 TabBar
// ============================================================

function renderRealTabBar(block: WireframeBlock) {
  const actions = block.actions;

  // 如果没有 actions，不渲染
  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <div className="h-14 bg-white border-t border-slate-200 flex items-center justify-around">
      {actions.map((action, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5">
          <div
            className={`w-6 h-6 rounded flex items-center justify-center ${
              i === 0 ? 'bg-sky-100' : 'bg-slate-100'
            }`}
          >
            <span className={`text-[8px] ${i === 0 ? 'text-sky-600' : 'text-slate-400'}`}>
              {action[0]}
            </span>
          </div>
          <span className={`text-[10px] ${i === 0 ? 'text-sky-600 font-medium' : 'text-slate-400'}`}>
            {action}
          </span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// 渲染真实弹窗
// ============================================================

function renderRealModal(block: WireframeBlock) {
  const actions = block.actions;

  // 如果没有 actions，不渲染按钮
  if (!actions || actions.length === 0) {
    return (
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
        <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-4/5 max-w-xs">
          <div className="px-4 py-3 border-b border-slate-100">
            <span className="text-sm font-medium text-slate-700">{block.title || '提示'}</span>
          </div>
          <div className="p-4">
            {block.description && (
              <p className="text-xs text-slate-500 leading-relaxed">{block.description}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 判断弹窗类型
  const isCancel = block.title?.includes('取消');
  const isAuth = block.title?.includes('授权') || block.title?.includes('登录');
  const isSuccess = block.title?.includes('成功');

  let actionPrimary = 1; // 默认最后一个为主操作
  if (isCancel) actionPrimary = 1;
  if (isAuth) actionPrimary = 0;
  if (isSuccess) actionPrimary = 0;

  // 确保 actionPrimary 不会越界
  if (actionPrimary >= actions.length) {
    actionPrimary = actions.length - 1;
  }

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-4/5 max-w-xs">
        <div className="px-4 py-3 border-b border-slate-100">
          <span className="text-sm font-medium text-slate-700">{block.title || '提示'}</span>
        </div>
        <div className="p-4">
          {block.description && (
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">{block.description}</p>
          )}
          <div className="flex gap-2 justify-end">
            {actions.map((action, i) => (
              <span
                key={i}
                className={`px-3 py-1.5 rounded text-xs ${
                  i === actionPrimary
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {action}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 渲染真实底部弹层
// ============================================================

function renderRealBottomSheet(block: WireframeBlock) {
  const actions = block.actions || [];
  const fields = block.fields || [];

  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 rounded-t-3xl shadow-lg">
      <div className="flex justify-center pt-2">
        <div className="w-8 h-1 bg-slate-300 rounded" />
      </div>
      <div className="px-4 py-3">
        <div className="text-sm font-medium text-slate-700 mb-2">{block.title || '选择'}</div>

        {/* fields 渲染为选项列表 */}
        {fields.length > 0 && (
          <div className="space-y-1 mb-3">
            {fields.map((item, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-lg text-sm ${
                  i === 0 ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'text-slate-600'
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        )}

        {block.description && fields.length === 0 && (
          <p className="text-xs text-slate-400 mb-3">{block.description}</p>
        )}

        {/* actions 渲染为底部操作按钮 */}
        {actions.length > 0 && (
          <div className="flex gap-2">
            {actions.map((action, i) => (
              <span
                key={i}
                className={`flex-1 px-3 py-2 rounded-lg text-sm text-center ${
                  i === actions.length - 1
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {action}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 渲染真实 Toast
// ============================================================

function renderRealToast(block: WireframeBlock) {
  const isSuccess = block.title?.includes('成功') || block.description?.includes('成功');
  const isError = block.title?.includes('失败') || block.title?.includes('错误') || block.description?.includes('失败');

  return (
    <div
      className={`pointer-events-none mx-auto mt-4 px-4 py-2 rounded-full text-xs font-medium shadow-md ${
        isSuccess
          ? 'bg-green-500 text-white'
          : isError
            ? 'bg-red-500 text-white'
            : 'bg-slate-800 text-white'
      }`}
    >
      {block.title || block.description}
    </div>
  );
}

// ============================================================
// 渲染 header
// ============================================================

const renderHeader = (block: WireframeBlock) => (
  <div className="h-12 bg-white border-b border-slate-200 flex items-center px-4">
    <span className="text-sm font-medium text-slate-700">{block.title}</span>
    {block.description && (
      <span className="ml-2 text-xs text-slate-400">{block.description}</span>
    )}
  </div>
);

// ============================================================
// 渲染 banner
// ============================================================

const renderBanner = (block: WireframeBlock) => {
  // 检测是否需要显示真实 Banner
  const title = (block.title || '').toLowerCase();
  const isService = title.includes('banner') || title.includes('轮播') || title.includes('活动');

  if (isService || block.description?.includes('推广') || block.description?.includes('活动')) {
    return renderRealBanner(block);
  }

  return (
    <div className="h-[120px] bg-sky-100 rounded-2xl flex flex-col items-center justify-center p-4 m-2">
      <span className="text-sm font-medium text-sky-700">{block.title}</span>
      {block.description && (
        <span className="mt-1 text-xs text-sky-500">{block.description}</span>
      )}
    </div>
  );
};

// ============================================================
// 渲染 nav
// ============================================================

const renderNav = (block: WireframeBlock) => {
  const title = (block.title || '').toLowerCase();
  const isService = title.includes('服务') || title.includes('入口') || title.includes('功能');

  if (isService) {
    return renderServiceNav(block);
  }

  return (
    <div className="h-14 bg-white border-t border-b border-slate-200 flex items-center px-4 gap-2">
      {block.actions && block.actions.length > 0 ? (
        block.actions.map((action, i) => (
          <span key={i} className="px-3 py-1 bg-slate-200 rounded-full text-xs text-slate-600">
            {action}
          </span>
        ))
      ) : (
        <span className="text-sm text-slate-500">{block.title}</span>
      )}
    </div>
  );
};

// ============================================================
// 渲染 card
// ============================================================

const renderCard = (block: WireframeBlock, platform: string, depth: number) => {
  // 限制递归深度
  const maxDepth = 3;
  const currentDepth = depth || 0;

  // 检测推荐医生区块
  if (isDoctorRecommendation(block)) {
    return renderDoctorRecommendation(block, platform, currentDepth);
  }

  // 检测医生卡片
  if (isDoctorCard(block)) {
    return renderDoctorCard(block);
  }

  // 检测预约卡片
  if (isBookingCard(block)) {
    return renderBookingCard(block);
  }

  // 如果有 children，递归渲染
  if (block.children && block.children.length > 0 && currentDepth < maxDepth) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-3 m-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-slate-800">{block.title}</span>
        </div>
        {block.description && (
          <p className="text-xs text-slate-400 mb-2">{block.description}</p>
        )}
        <div className="space-y-1">
          {block.children.map((child) => (
            <WireframeBlockRenderer
              key={child.id}
              block={child}
              platform={platform}
              depth={currentDepth + 1}
            />
          ))}
        </div>
      </div>
    );
  }

  // 默认卡片 - 使用信息行展示
  const fields = block.fields || [];

  // 如果有字段，渲染成信息行
  if (fields.length > 0) {
    const infoRows = fields.map((field) => ({
      label: field,
      value: getIndustryAwareValue(field, block)
    }));

    return (
      <div className="bg-white border border-slate-200 rounded-xl p-3 m-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-slate-800">{block.title}</span>
        </div>
        {block.description && (
          <p className="text-xs text-slate-400 mb-2">{block.description}</p>
        )}
        <div className="space-y-1.5">
          {infoRows.map((row, i) => (
            <div key={i} className="flex items-center text-xs">
              <span className="w-20 text-slate-400 flex-shrink-0">{row.label}</span>
              <span className="text-slate-700">{row.value}</span>
            </div>
          ))}
        </div>
        {block.actions && block.actions.length > 0 && (
          <div className="flex gap-2 mt-3 pt-2 border-t border-slate-100">
            {block.actions.map((action, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded text-xs ${i === 0
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-300'
                  }`}
              >
                {action}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 既没有 children 也没有 fields 的默认卡片
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 m-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-800">{block.title}</span>
      </div>
      {block.description && (
        <p className="text-xs text-slate-400 mt-1">{block.description}</p>
      )}
    </div>
  );
};

// ============================================================
// 渲染 list
// ============================================================

const renderList = (block: WireframeBlock) => {
  // 检测医生列表
  if (isDoctorList(block)) {
    return renderDoctorList(block);
  }

  // 检测预约列表
  if (isBookingList(block)) {
    return renderBookingList(block);
  }

  // 默认普通列表
  return renderNormalList(block);
};

// ============================================================
// 渲染 form
// ============================================================

const renderForm = (block: WireframeBlock) => {
  const title = (block.title || '').toLowerCase();
  // 如果是真实表单（有明确字段）
  if (block.fields && block.fields.length > 0 && block.fields.some(f => f.includes('姓名') || f.includes('电话') || f.includes('描述'))) {
    return renderRealForm(block);
  }

  // 默认表单
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 m-2">
      <div className="text-sm font-medium text-slate-700 mb-2">{block.title}</div>
      {block.fields && block.fields.length > 0 ? (
        <div className="space-y-2">
          {block.fields.map((field, i) => (
            <div key={i} className="h-8 bg-slate-100 rounded flex items-center px-2">
              <span className="text-xs text-slate-400">{getIndustryAwareValue(field, block)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-8 bg-slate-100 rounded flex items-center px-2">
          <span className="text-xs text-slate-400">输入框占位</span>
        </div>
      )}
      {block.actions && block.actions.length > 0 && (
        <div className="flex gap-2 mt-2">
          {block.actions.map((action, i) => (
            <span
              key={i}
              className={`h-6 px-2 flex items-center rounded text-xs ${i === 0
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-700 border border-slate-300'
                }`}
            >
              {action}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// 渲染 button
// ============================================================

const renderButton = (block: WireframeBlock) => (
  <div className="px-4 py-2 m-2">
    <div className="h-10 bg-slate-900 rounded-lg flex items-center justify-center">
      <span className="text-sm font-medium text-white">{block.title}</span>
    </div>
    {block.description && (
      <p className="text-xs text-slate-400 text-center mt-1">{block.description}</p>
    )}
  </div>
);

// ============================================================
// 渲染 tabs
// ============================================================

const renderTabs = (block: WireframeBlock) => {
  const title = (block.title || '').toLowerCase();
  const isTabBar = title.includes('tab') || title.includes('底部') || title.includes('导航');

  if (isTabBar) {
    return renderRealTabBar(block);
  }

  // tabs 必须来自 block.actions，如果没有 actions 则不渲染 Tab 项
  const actions = block.actions;

  return (
    <div className="px-4 py-3">
      <div className="flex gap-2">
        {actions && actions.length > 0 ? (
          actions.map((action, i) => (
            <span
              key={i}
              className={`px-3 py-1.5 rounded-full text-xs ${i === 0
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600'
                }`}
            >
              {action}
            </span>
          ))
        ) : (
          <span className="text-xs text-slate-400">暂无 Tab</span>
        )}
      </div>
    </div>
  );
};

// ============================================================
// 渲染 modal
// ============================================================

const renderModal = (block: WireframeBlock) => {
  // 检测 Toast
  const title = (block.title || '').toLowerCase();
  if (title.includes('toast') || title.includes('提示') && block.title?.includes('成功')) {
    return renderRealToast(block);
  }

  return renderRealModal(block);
};

// ============================================================
// 渲染 bottom-sheet
// ============================================================

const renderBottomSheet = (block: WireframeBlock) => renderRealBottomSheet(block);

// ============================================================
// 渲染 table
// ============================================================

const renderTable = (block: WireframeBlock) => {
  const industry = detectIndustry(block);
  const fields = block.fields || [];

  // 如果有 children，使用 children 渲染行
  const hasChildren = block.children && block.children.length > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl m-2 overflow-hidden">
      <div className="px-3 py-2 bg-slate-50 border-b border-slate-200">
        <span className="text-sm font-medium text-slate-700">{block.title}</span>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100">
            {fields.length > 0 ? (
              fields.map((field, i) => (
                <th key={i} className="px-3 py-2 text-left text-xs text-slate-500 font-medium">
                  {field}
                </th>
              ))
            ) : (
              <th className="px-3 py-2 text-left text-xs text-slate-500 font-medium">数据项</th>
            )}
          </tr>
        </thead>
        <tbody>
          {hasChildren ? (
            block.children!.map((child) => (
              <tr key={child.id} className="border-b border-slate-50 last:border-0">
                {fields.length > 0 ? (
                  fields.map((field, i) => (
                    <td key={i} className="px-3 py-2 text-xs text-slate-600">
                      {getIndustryAwareValue(field, child)}
                    </td>
                  ))
                ) : (
                  <td className="px-3 py-2 text-xs text-slate-600">{child.title || '数据项'}</td>
                )}
              </tr>
            ))
          ) : (
            // 没有 children，显示 1 行占位
            <tr className="border-b border-slate-50">
              {fields.length > 0 ? (
                fields.map((field, i) => (
                  <td key={i} className="px-3 py-2 text-xs text-slate-600">
                    {getSampleValue(field, industry)}
                  </td>
                ))
              ) : (
                <td className="px-3 py-2 text-xs text-slate-400">暂无数据</td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// ============================================================
// 渲染 empty-state
// ============================================================

const renderEmptyState = (block: WireframeBlock) => (
  <div className="flex flex-col items-center justify-center py-8 px-4">
    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
      <span className="text-slate-400">∅</span>
    </div>
    <span className="text-sm text-slate-500">{block.title || '暂无内容'}</span>
    {block.description && (
      <span className="text-xs text-slate-400 mt-1">{block.description}</span>
    )}
  </div>
);

// ============================================================
// 渲染 text
// ============================================================

const renderText = (block: WireframeBlock) => {
  // 检测 Toast
  const title = (block.title || '').toLowerCase();
  if (title.includes('toast') || (title.includes('成功') && !title.includes('弹窗'))) {
    return renderRealToast(block);
  }

  return (
    <div className="px-4 py-2">
      <span className="text-xs text-slate-500 leading-relaxed">
        {block.description || block.title}
      </span>
    </div>
  );
};

// ============================================================
// 统一渲染入口
// ============================================================

export function WireframeBlockRenderer({ block, platform, depth = 0 }: WireframeBlockRendererProps) {
  switch (block.type) {
    case 'header':
      return renderHeader(block);
    case 'banner':
      return renderBanner(block);
    case 'nav':
      return renderNav(block);
    case 'card':
      return renderCard(block, platform, depth);
    case 'list':
      return renderList(block);
    case 'form':
      return renderForm(block);
    case 'button':
      return renderButton(block);
    case 'tabs':
      return renderTabs(block);
    case 'modal':
      return renderModal(block);
    case 'bottom-sheet':
      return renderBottomSheet(block);
    case 'table':
      return renderTable(block);
    case 'empty-state':
      return renderEmptyState(block);
    case 'text':
      return renderText(block);
    default:
      return (
        <div className="h-10 bg-slate-50 border border-slate-200 rounded m-2 flex items-center px-3">
          <span className="text-xs text-slate-500">[{block.type}] {block.title}</span>
        </div>
      );
  }
}
