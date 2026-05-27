'use client';

import Link from 'next/link';
import { useProjects } from '@/lib/store/project-store';
import type { Project } from '@/lib/types';
import { formatDistanceToNow } from '@/lib/utils/date';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  ClipboardCheck,
  GitBranch,
  FileText,
  Code2,
  FolderOpen,
  Layers,
  Sparkles,
  Target,
  FileCode,
  Users,
  Zap,
  LayersIcon,
} from 'lucide-react';

/**
 * 根据项目已有数据，返回继续编辑的路径
 */
function getContinuePath(project: Project): string {
  if (!project.inputSources || project.inputSources.length === 0) {
    return `/projects/${project.id}/input`;
  }
  if (!project.productUnderstanding) {
    return `/projects/${project.id}/input`;
  }
  if (!project.featureTree) {
    return `/projects/${project.id}/analysis`;
  }
  if (!project.pageList || project.pageList.length === 0) {
    return `/projects/${project.id}/structure`;
  }
  if (!project.flows || project.flows.length === 0) {
    return `/projects/${project.id}/pages`;
  }
  if (!project.wireframes || project.wireframes.length === 0) {
    return `/projects/${project.id}/flows`;
  }
  if (!project.prd) {
    return `/projects/${project.id}/wireframes`;
  }
  if (!project.devHandoff) {
    return `/projects/${project.id}/prd`;
  }
  return `/projects/${project.id}/handoff`;
}

function getPlatformLabel(platform: string): string {
  const labels: Record<string, string> = {
    web: 'Web',
    h5: 'H5',
    app: 'App',
    'mini-program': '小程序',
  };
  return labels[platform] || platform;
}

export default function HomePage() {
  const projects = useProjects();
  const recentProjects = projects.slice(-6).reverse();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 顶部导航 - sticky */}
      <header className="sticky top-0 z-50 h-[72px] border-b border-[#E2E8F0] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
          {/* Logo + 产品名 */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F172A]">
              <span className="text-sm font-bold text-white">交</span>
            </div>
            <span className="text-base font-semibold text-[#0F172A]">AI 产品交付工作台</span>
          </div>

          {/* 右侧按钮 */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="h-9 px-4 text-sm font-medium text-[#64748B] hover:text-[#0F172A] hidden sm:flex"
            >
              查看交付物
            </Button>
            <Link href="/projects/new">
              <Button className="h-10 px-5 text-sm font-semibold rounded-xl bg-[#0F172A] text-white hover:bg-[#1E293B]">
                <Plus className="mr-1.5 h-4 w-4" />
                开始创建项目
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero 首屏 */}
        <section className="mx-auto max-w-[1200px] px-6 pt-[72px]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center pt-16 pb-24">
            {/* Hero 左侧 */}
            <div className="max-w-[660px]">
              {/* 小标签 */}
              <div className="inline-flex h-8 items-center rounded-full bg-[#EFF6FF] px-4 border border-[#BFDBFE]">
                <span className="text-sm font-medium text-[#2563EB]">
                  面向产品经理的 AI 交付整理工具
                </span>
              </div>

              {/* 主标题 */}
              <h1 className="mt-6 text-[56px] font-bold leading-[1.08] tracking-[-0.045em] text-[#0F172A]">
                把混乱页面整理成可评审、可交付、研发能接手的产品资产。
              </h1>

              {/* 副标题 */}
              <p className="mt-6 text-lg leading-[32px] text-[#64748B]">
                上传想法、截图、竞品页面或 AI 生成页面，系统会整理成功能结构图、页面清单、跳转关系、线框图、PRD 和研发说明。
              </p>

              {/* 按钮区 */}
              <div className="mt-10 flex items-center gap-3">
                <Link href="/projects/new">
                  <Button className="h-[46px] px-[22px] text-[15px] font-semibold rounded-xl bg-[#0F172A] text-white hover:bg-[#1E293B]">
                    开始创建项目
                  </Button>
                </Link>
                <a href="#delivery链路">
                  <Button
                    variant="outline"
                    className="h-[46px] px-[20px] text-[15px] font-medium rounded-xl border border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F8FAFC]"
                  >
                    查看交付链路
                  </Button>
                </a>
              </div>

              {/* 按钮下方说明 */}
              <p className="mt-5 text-sm text-[#94A3B8]">
                不是生成漂亮 UI，而是把页面和想法整理成能评审、能交付、研发能接手的资产。
              </p>
            </div>

            {/* Hero 右侧 - 产品工作台预览 */}
            <div className="relative">
              <div className="w-full min-h-[540px] bg-white border border-[#E2E8F0] rounded-[28px] shadow-[0_24px_60px_rgba(15,23,42,0.12),0_1px_2px_rgba(15,23,42,0.06)] overflow-hidden">
                {/* 顶部模拟浏览器栏 */}
                <div className="h-[52px] border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center px-5">
                  <div className="flex gap-2">
                    <span className="size-[10px] rounded-full bg-[#FCA5A5]" />
                    <span className="size-[10px] rounded-full bg-[#FCD34D]" />
                    <span className="size-[10px] rounded-full bg-[#86EFAC]" />
                  </div>
                  <span className="flex-grow text-center text-[13px] text-[#64748B]">
                    中医预约小程序 · 产品交付分析
                  </span>
                </div>

                {/* 预览主体 */}
                <div className="p-6">
                  {/* 输入材料 */}
                  <div className="mb-5">
                    <h4 className="text-[14px] font-semibold text-[#0F172A] mb-3">输入材料</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex h-7 items-center rounded-full bg-[#F1F5F9] px-3 text-[12px] text-[#475569]">
                        产品想法
                      </span>
                      <span className="inline-flex h-7 items-center rounded-full bg-[#F1F5F9] px-3 text-[12px] text-[#475569]">
                        页面截图
                      </span>
                      <span className="inline-flex h-7 items-center rounded-full bg-[#F1F5F9] px-3 text-[12px] text-[#475569]">
                        AI 生成页面
                      </span>
                    </div>
                  </div>

                  {/* 功能结构图预览 */}
                  <div className="mb-5">
                    <h4 className="text-[14px] font-semibold text-[#0F172A] mb-3">功能结构图</h4>
                    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 text-[13px] text-[#0F172A] leading-6 font-mono">
                      中医预约小程序
                      <br />
                      <span className="text-[#94A3B8]">├─ </span>首页
                      <br />
                      <span className="text-[#94A3B8]">├─ </span>医生列表页
                      <br />
                      <span className="text-[#94A3B8]">│ &nbsp;├─ </span>搜索框
                      <br />
                      <span className="text-[#94A3B8]">│ &nbsp;├─ </span>科室筛选
                      <br />
                      <span className="text-[#94A3B8]">│ &nbsp;└─ </span>医生卡片
                      <br />
                      <span className="text-[#94A3B8]">├─ </span>预约确认页
                      <br />
                      <span className="text-[#94A3B8]">└─ </span>我的预约页
                    </div>
                  </div>

                  {/* 自动生成交付物 */}
                  <div>
                    <h4 className="text-[14px] font-semibold text-[#0F172A] mb-3">自动生成交付物</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        '功能结构图',
                        '页面清单',
                        '跳转关系',
                        '线框图',
                        'PRD',
                        '研发说明',
                      ].map((item) => (
                        <div
                          key={item}
                          className="h-11 border border-[#E2E8F0] rounded-xl bg-white text-[13px] text-[#334155] flex items-center justify-center"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 底部状态条 */}
                  <div className="mt-5 h-11 bg-[#ECFDF5] border border-[#BBF7D0] rounded-xl text-[13px] text-[#16A34A] flex items-center justify-center font-medium">
                    已整理为可评审交付资产
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 交付链路流程区 */}
        <section id="delivery链路" className="mx-auto max-w-[1200px] px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-[32px] font-bold tracking-[-0.02em] text-[#0F172A]">
              从混乱输入到研发接手
            </h2>
            <p className="mt-3 text-base text-[#64748B]">
              一条完整的产品交付链路，而不是单点 AI 生成。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                step: 1,
                title: '输入材料',
                desc: '想法、截图、AI 页面、竞品页面',
                icon: LayersIcon,
              },
              {
                step: 2,
                title: '理解产品',
                desc: '识别用户、场景、页面和模块',
                icon: Target,
              },
              {
                step: 3,
                title: '确认结构',
                desc: '功能结构图、待确认点、MVP 范围',
                icon: GitBranch,
              },
              {
                step: 4,
                title: '生成资产',
                desc: '线框图、PRD、研发说明',
                icon: FileCode,
              },
              {
                step: 5,
                title: '交付研发',
                desc: '导出文档和项目 JSON',
                icon: Users,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white border border-[#E2E8F0] rounded-[20px] p-5 min-h-[168px] flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
                    <span className="text-sm font-bold">{item.step}</span>
                  </div>
                  <item.icon className="h-5 w-5 text-[#64748B]" />
                </div>
                <h3 className="text-[15px] font-semibold text-[#0F172A]">{item.title}</h3>
                <p className="mt-2 text-[13px] leading-5 text-[#64748B]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 核心价值区 */}
        <section className="mx-auto max-w-[1200px] px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-[32px] font-bold tracking-[-0.02em] text-[#0F172A]">
              为什么不是普通 AI 生成工具？
            </h2>
            <p className="mt-3 text-base text-[#64748B] max-w-[600px] mx-auto">
              它不负责替产品经理拍脑袋，而是帮助产品经理把已有想法、页面和截图整理成可交付资产。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="bg-white border-[#E2E8F0] p-6 rounded-2xl">
              <CardHeader className="p-0 mb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EFF6FF]">
                  <ClipboardCheck className="h-5 w-5 text-[#2563EB]" />
                </div>
              </CardHeader>
              <CardTitle className="text-[16px] font-semibold text-[#0F172A] mb-2">
                更快评审
              </CardTitle>
              <CardDescription className="text-sm text-[#64748B] leading-relaxed">
                把零散想法、截图和页面整理成结构化页面范围与流程，方便团队快速对齐。
              </CardDescription>
            </Card>

            <Card className="bg-white border-[#E2E8F0] p-6 rounded-2xl">
              <CardHeader className="p-0 mb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F0FDF4]">
                  <FileText className="h-5 w-5 text-[#16A34A]" />
                </div>
              </CardHeader>
              <CardTitle className="text-[16px] font-semibold text-[#0F172A] mb-2">
                更好交付
              </CardTitle>
              <CardDescription className="text-sm text-[#64748B] leading-relaxed">
                自动生成页面清单、模块说明、字段说明和产品经理式 PRD，减少重复整理时间。
              </CardDescription>
            </Card>

            <Card className="bg-white border-[#E2E8F0] p-6 rounded-2xl">
              <CardHeader className="p-0 mb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFFBEB]">
                  <Code2 className="h-5 w-5 text-[#D97706]" />
                </div>
              </CardHeader>
              <CardTitle className="text-[16px] font-semibold text-[#0F172A] mb-2">
                研发更快接手
              </CardTitle>
              <CardDescription className="text-sm text-[#64748B] leading-relaxed">
                输出研发理解说明，明确页面、模块、字段、状态、异常和接口建议。
              </CardDescription>
            </Card>
          </div>
        </section>

        {/* 最终交付物区 */}
        <section className="mx-auto max-w-[1200px] px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-[32px] font-bold tracking-[-0.02em] text-[#0F172A]">
              最终交付物
            </h2>
            <p className="mt-3 text-base text-[#64748B]">
              从一个混乱输入，沉淀为完整的产品交付资产包。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: '功能结构图',
                desc: '页面、模块、字段、状态和规则',
                icon: Layers,
              },
              {
                title: '页面清单',
                desc: '确认产品页面范围和 MVP 边界',
                icon: FileText,
              },
              {
                title: '跳转关系',
                desc: '明确页面入口、触发动作和目标页面',
                icon: GitBranch,
              },
              {
                title: '线框图',
                desc: '低保真页面结构草图',
                icon: Sparkles,
              },
              {
                title: 'PRD',
                desc: '产品经理式评审文档',
                icon: ClipboardCheck,
              },
              {
                title: '研发说明',
                desc: '帮助研发理解页面、字段、接口和异常',
                icon: Code2,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="h-[108px] p-5 border border-[#E2E8F0] rounded-2xl bg-white flex flex-col justify-center hover:border-[#CBD5E1] transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className="h-4 w-4 text-[#64748B]" />
                  <p className="text-[15px] font-semibold text-[#0F172A]">{item.title}</p>
                </div>
                <p className="text-[13px] text-[#64748B]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 适用场景区 */}
        <section className="mx-auto max-w-[1200px] px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-[32px] font-bold tracking-[-0.02em] text-[#0F172A]">
              适合这些场景
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'AI 工具生成后整理',
                desc: '把秒搭、Coze 或其他 AI 工具生成的零散页面整理成产品经理能评审的交付物。',
                icon: Zap,
              },
              {
                title: '竞品页面拆解',
                desc: '把竞品截图和页面结构整理成功能结构、页面清单和流程说明。',
                icon: Target,
              },
              {
                title: '老项目重构',
                desc: '把已有系统页面重新梳理成 PRD 和研发说明。',
                icon: FileCode,
              },
              {
                title: '产品经理快速交付',
                desc: '减少整理页面、写 PRD、解释需求的重复工作。',
                icon: Users,
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="bg-white border-[#E2E8F0] p-5 rounded-2xl hover:shadow-md transition-shadow"
              >
                <CardHeader className="p-0 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <item.icon className="h-4 w-4 text-[#64748B]" />
                  </div>
                </CardHeader>
                <CardTitle className="text-[14px] font-semibold text-[#0F172A] mb-2">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-[13px] text-[#64748B] leading-relaxed">
                  {item.desc}
                </CardDescription>
              </Card>
            ))}
          </div>
        </section>

        {/* 开始创建入口 */}
        <section className="mx-auto max-w-[1200px] px-6 py-16 pb-24">
          <div className="bg-[#0F172A] rounded-[28px] p-10 text-center">
            <h2 className="text-[28px] font-bold text-white">准备好整理你的产品交付资产了吗？</h2>
            <p className="mt-3 text-[#94A3B8] text-base">
              上传想法、截图或 AI 生成页面，开始你的产品交付之旅。
            </p>
            <Link href="/projects/new" className="inline-block mt-8">
              <Button className="h-[46px] px-[22px] text-[15px] font-semibold rounded-xl bg-white text-[#0F172A] hover:bg-[#F8FAFC]">
                <Plus className="mr-1.5 h-4 w-4" />
                开始创建项目
              </Button>
            </Link>
          </div>
        </section>

        {/* 最近项目 */}
        {recentProjects.length > 0 && (
          <section className="mx-auto max-w-[1200px] px-6 pb-20">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#0F172A]">最近项目</h3>
              <span className="text-sm text-[#64748B]">共 {projects.length} 个项目</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentProjects.map((project) => (
                <Link key={project.id} href={getContinuePath(project)}>
                  <Card className="border-[#E2E8F0] transition-all hover:shadow-md hover:border-[#CBD5E1]">
                    <CardHeader className="p-5 pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-[15px] font-semibold text-[#0F172A] line-clamp-1">
                          {project.name}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="shrink-0 text-xs px-2 py-0.5 h-5 border-[#E2E8F0]"
                        >
                          {getPlatformLabel(project.platform)}
                        </Badge>
                      </div>
                      <CardDescription className="mt-2 text-xs text-[#94A3B8] line-clamp-2">
                        {project.description || '暂无描述'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                      <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                        <span>{project.industry || '未设置行业'}</span>
                        <span>
                          {project.updatedAt
                            ? `${formatDistanceToNow(new Date(project.updatedAt))}前更新`
                            : '刚刚创建'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 空状态 */}
        {projects.length === 0 && (
          <section className="mx-auto max-w-[1200px] px-6 pb-24">
            <div className="rounded-[24px] border border-dashed border-[#CBD5E1] bg-white py-20 text-center">
              <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-[#F8FAFC]">
                <FolderOpen className="h-7 w-7 text-[#94A3B8]" />
              </div>
              <p className="mt-5 text-base font-medium text-[#0F172A]">还没有项目</p>
              <p className="mt-2 text-sm text-[#64748B]">
                创建第一个产品交付项目，把想法、截图和页面整理成可评审资产。
              </p>
              <Link href="/projects/new" className="inline-block mt-8">
                <Button className="h-[46px] px-[22px] text-[15px] font-semibold rounded-xl bg-[#0F172A] text-white hover:bg-[#1E293B]">
                  <Plus className="mr-1.5 h-4 w-4" />
                  开始创建项目
                </Button>
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
