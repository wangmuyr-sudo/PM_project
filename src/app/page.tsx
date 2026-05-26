'use client';

import Link from 'next/link';
import { useProjects } from '@/lib/store/project-store';
import type { Project } from '@/lib/types';
import { formatDistanceToNow } from '@/lib/utils/date';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Layers, GitBranch, FileText, FileCode, FolderOpen } from 'lucide-react';

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
      {/* 顶部导航 */}
      <header className="h-16 border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto flex h-full max-w-[1180px] items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-[#0F172A]">AI 产品交付工作台</h1>
          <Link href="/projects/new">
            <Button className="h-9 px-4 text-sm font-medium" size="sm">
              <Plus className="mr-1.5 h-4 w-4" />
              开始创建项目
            </Button>
          </Link>
        </div>
      </header>

      {/* 主内容 */}
      <main className="mx-auto max-w-[1180px] px-6">
        {/* Hero 区域 */}
        <div className="mx-auto mt-20 max-w-[920px] text-center">
          {/* 小标签 */}
          <div className="inline-flex h-7 items-center rounded-full bg-[#EFF6FF] px-3">
            <span className="text-sm font-medium text-[#1D4ED8]">
              面向产品经理的 AI 交付整理工具
            </span>
          </div>

          {/* 主标题 */}
          <h2 className="mt-8 text-[48px] font-bold leading-[1.15] text-[#0F172A]">
            把混乱页面整理成可评审、可交付、研发能接手的产品资产。
          </h2>

          {/* 副标题 */}
          <p className="mt-5 text-lg leading-[30px] text-[#64748B] max-w-[760px] mx-auto">
            上传想法、截图或 AI 生成页面，系统会整理成功能结构图、页面清单、跳转关系、线框图、PRD 和研发说明。
          </p>

          {/* 按钮区 */}
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/projects/new">
              <Button className="h-11 px-5 text-sm font-medium">
                开始创建项目
              </Button>
            </Link>
            <Button variant="outline" className="h-11 px-5 text-sm font-medium" disabled>
              查看示例流程
            </Button>
          </div>
        </div>

        {/* 价值卡片区 */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-[#E2E8F0] p-6">
            <CardHeader className="p-0 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF]">
                <Layers className="h-5 w-5 text-[#3B82F6]" />
              </div>
            </CardHeader>
            <CardTitle className="text-base font-semibold text-[#0F172A] mb-2">更快评审</CardTitle>
            <CardDescription className="text-sm text-[#64748B] leading-relaxed">
              把零散想法、截图和页面整理成结构化页面范围与流程，方便团队快速对齐。
            </CardDescription>
          </Card>

          <Card className="border-[#E2E8F0] p-6">
            <CardHeader className="p-0 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0FDF4]">
                <FileText className="h-5 w-5 text-[#22C55E]" />
              </div>
            </CardHeader>
            <CardTitle className="text-base font-semibold text-[#0F172A] mb-2">更好交付</CardTitle>
            <CardDescription className="text-sm text-[#64748B] leading-relaxed">
              自动生成页面清单、模块说明、字段说明和产品经理式 PRD，减少重复整理时间。
            </CardDescription>
          </Card>

          <Card className="border-[#E2E8F0] p-6">
            <CardHeader className="p-0 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFFBEB]">
                <FileCode className="h-5 w-5 text-[#F59E0B]" />
              </div>
            </CardHeader>
            <CardTitle className="text-base font-semibold text-[#0F172A] mb-2">研发更快接手</CardTitle>
            <CardDescription className="text-sm text-[#64748B] leading-relaxed">
              输出研发理解说明，明确页面、模块、字段、状态、异常和接口建议。
            </CardDescription>
          </Card>
        </div>

        {/* 输出资产区 */}
        <div className="mt-12 rounded-2xl border border-[#E2E8F0] bg-white p-8">
          <h3 className="text-lg font-semibold text-[#0F172A]">最终交付物</h3>
          <p className="mt-1 text-sm text-[#64748B]">从想法到研发接手，全流程覆盖</p>

          <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { icon: Layers, label: '功能结构图' },
              { icon: GitBranch, label: '页面清单' },
              { icon: GitBranch, label: '跳转关系' },
              { icon: FileText, label: '线框图' },
              { icon: FileText, label: 'PRD' },
              { icon: FileCode, label: '研发说明' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]"
              >
                <item.icon className="h-4 w-4 text-[#64748B]" />
                <span className="text-sm text-[#334155]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 最近项目 */}
        {recentProjects.length > 0 && (
          <div className="mt-12 pb-20">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#0F172A]">最近项目</h3>
              <span className="text-sm text-[#64748B]">共 {projects.length} 个项目</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentProjects.map((project) => (
                <Link key={project.id} href={getContinuePath(project)}>
                  <Card className="border-[#E2E8F0] transition-shadow hover:shadow-sm hover:shadow-slate-200/80">
                    <CardHeader className="p-5 pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-[15px] font-semibold text-[#0F172A] line-clamp-1">
                          {project.name}
                        </CardTitle>
                        <Badge variant="outline" className="shrink-0 text-xs px-2 py-0.5 h-5 border-[#E2E8F0]">
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
          </div>
        )}

        {/* 空状态 */}
        {projects.length === 0 && (
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E2E8F0] bg-white py-20">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F8FAFC]">
              <FolderOpen className="h-7 w-7 text-[#94A3B8]" />
            </div>
            <p className="mt-4 font-medium text-[#334155]">还没有项目</p>
            <p className="mt-1 text-sm text-[#94A3B8]">点击上方按钮开始创建第一个项目</p>
          </div>
        )}
      </main>
    </div>
  );
}
