'use client';

import Link from 'next/link';
import { useProjects, useProjectStore } from '@/lib/store/project-store';
import type { Project } from '@/lib/types';
import { formatDistanceToNow } from '@/lib/utils/date';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, ArrowRight, Layers, GitBranch, FileCode } from 'lucide-react';

/**
 * 根据项目已有数据，返回继续编辑的路径
 */
function getContinuePath(project: Project): string {
  // 没有输入资料 -> 输入资料页
  if (!project.inputSources || project.inputSources.length === 0) {
    return `/projects/${project.id}/input`;
  }
  // 有输入资料但没有产品理解 -> 输入资料页
  if (!project.productUnderstanding) {
    return `/projects/${project.id}/input`;
  }
  // 有产品理解但没有功能结构图 -> 分析页
  if (!project.featureTree) {
    return `/projects/${project.id}/analysis`;
  }
  // 有功能结构图但没有页面清单 -> 功能结构图页
  if (!project.pageList) {
    return `/projects/${project.id}/structure`;
  }
  // 有页面清单但没有跳转关系 -> 页面清单页
  if (!project.flows) {
    return `/projects/${project.id}/pages`;
  }
  // 有跳转关系但没有线框图 -> 跳转关系页
  if (!project.wireframes) {
    return `/projects/${project.id}/flows`;
  }
  // 有线框图但没有 PRD -> 线框图页
  if (!project.prd) {
    return `/projects/${project.id}/wireframes`;
  }
  // 有 PRD 但没有研发说明 -> PRD 页
  if (!project.devHandoff) {
    return `/projects/${project.id}/prd`;
  }
  // 有研发说明 -> 研发说明页
  return `/projects/${project.id}/handoff`;
}

export default function HomePage() {
  const projects = useProjects();
  const recentProjects = projects.slice(-5).reverse();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            AI 产品交付工作台
          </h1>
          <p className="mt-4 text-lg text-gray-600 sm:text-xl">
            把混乱页面整理成可评审、可交付、研发能接手的产品资产。
          </p>
          <p className="mt-2 text-sm text-gray-500">
            不是生成 UI，而是把想法、截图和页面结果整理成产品经理可评审、研发可接手的交付资产。
          </p>
          
          {/* Core Value */}
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Layers className="h-5 w-5 text-blue-500" />
              <span>功能结构图</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <GitBranch className="h-5 w-5 text-violet-500" />
              <span>页面跳转关系</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FileText className="h-5 w-5 text-green-500" />
              <span>PRD 文档</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FileCode className="h-5 w-5 text-amber-500" />
              <span>研发说明</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-10">
            <Link href="/projects/new">
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                开始创建项目
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      {recentProjects.length > 0 && (
        <div className="mx-auto max-w-5xl px-6 pb-20">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">最近项目</h2>
            <span className="text-sm text-gray-500">共 {projects.length} 个项目</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map((project) => (
              <Link key={project.id} href={getContinuePath(project)}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{project.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {getPlatformLabel(project.platform)}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2 text-xs">
                      {project.description || '暂无描述'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{project.industry || '未设置行业'}</span>
                      <span>
                        {project.updatedAt 
                          ? `${formatDistanceToNow(new Date(project.updatedAt))}前更新`
                          : '刚刚创建'
                        }
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="mx-auto max-w-5xl px-6 pb-20">
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-12 w-12 text-gray-300" />
              <p className="mt-4 text-gray-500">还没有项目</p>
              <p className="text-sm text-gray-400">点击上方按钮开始创建第一个项目</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
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
