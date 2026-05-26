'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useProjectStore, useProjectById } from '@/lib/store/project-store';
import { getAIProvider } from '@/lib/ai/ai-client';
import type { WireframePage, WireframeBlock } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WireframesPage() {
  const params = useParams();
  const projectId = params.id as string;

  const project = useProjectById(projectId);
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [wireframeList, setWireframeList] = useState<WireframePage[]>([]);
  type ErrorState = {
    title: string;
    message: string;
    href: string;
    actionLabel: string;
  };
  const [errorState, setErrorState] = useState<ErrorState | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (projectId) {
      setCurrentProject(projectId);
    }
  }, [projectId, setCurrentProject]);

  const generateWireframes = useCallback(async () => {
    // 检查前置条件
    if (!project?.featureTree) {
      console.error('缺少功能结构图，无法生成线框图');
      setErrorState({
        title: '无法生成线框图',
        message: '缺少功能结构图，无法生成线框图。请先在功能结构图页生成并保存功能结构。',
        href: `/projects/${projectId}/structure`,
        actionLabel: '返回功能结构图',
      });
      return;
    }
    if (!project?.pageList || project.pageList.length === 0) {
      console.error('缺少页面清单，无法生成线框图');
      setErrorState({
        title: '无法生成线框图',
        message: '缺少页面清单，无法生成线框图。请先在页面清单页生成并保存页面范围。',
        href: `/projects/${projectId}/pages`,
        actionLabel: '返回页面清单',
      });
      return;
    }
    if (!project?.flows || project.flows.length === 0) {
      console.error('缺少跳转关系，无法生成线框图');
      setErrorState({
        title: '无法生成线框图',
        message: '缺少跳转关系，无法生成线框图。请先在跳转关系页生成并保存页面关系。',
        href: `/projects/${projectId}/flows`,
        actionLabel: '返回跳转关系',
      });
      return;
    }

    setErrorState(null);
    setIsLoading(true);
    try {
      const ai = getAIProvider();
      const wireframes = await ai.generateWireframes({
        featureTree: project.featureTree,
        pageList: project.pageList,
      });
      setWireframeList(wireframes);
      // 保存到 Store，同时清空下游 PRD 和研发说明
      updateProject(projectId, {
        wireframes,
        prd: undefined,
        devHandoff: undefined,
      });
    } catch (error) {
      console.error('生成线框图失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [project, projectId, updateProject]);

  // 加载或生成线框图
  useEffect(() => {
    if (!project) return;

    if (project.wireframes && project.wireframes.length > 0) {
      setWireframeList(project.wireframes);
    } else {
      // 自动生成线框图
      generateWireframes();
    }
  }, [project, generateWireframes]);

  const handleSave = () => {
    updateProject(projectId, {
      wireframes: wireframeList,
      prd: undefined,
      devHandoff: undefined,
    });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-gray-500">页面加载中...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>项目不存在或正在加载...</p>
      </div>
    );
  }

  // 根据 block 类型获取高度样式
  const getBlockHeight = (type: string): string => {
    switch (type) {
      case 'header':
        return 'h-10';
      case 'banner':
        return 'h-24';
      case 'nav':
        return 'h-12';
      case 'card':
        return 'h-20';
      case 'list':
        return 'h-32';
      case 'form':
        return 'h-28';
      case 'button':
        return 'h-10';
      case 'tabs':
        return 'h-10';
      case 'modal':
        return 'h-40';
      case 'bottom-sheet':
        return 'h-32';
      case 'table':
        return 'h-28';
      case 'empty-state':
        return 'h-16';
      case 'text':
        return 'h-8';
      default:
        return 'h-12';
    }
  };

  // 渲染单个线框图块（手机端样式）
  const renderMobileBlock = (block: WireframeBlock, depth = 0) => {
    const heightClass = getBlockHeight(block.type);
    const marginLeft = depth > 0 ? 'ml-2' : '';

    return (
      <div key={block.id} className={`${marginLeft}`}>
        <div className={`border border-gray-400 rounded bg-gray-50 p-1 ${heightClass}`}>
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xs text-gray-500">[{block.type}]</span>
            <span className="text-xs font-medium">{block.title}</span>
          </div>
          {block.fields && block.fields.length > 0 && (
            <div className="flex flex-wrap gap-0.5">
              {block.fields.map((field, i) => (
                <span key={i} className="text-xs bg-gray-200 text-gray-600 px-1 rounded">[{field}]</span>
              ))}
            </div>
          )}
          {block.actions && block.actions.length > 0 && (
            <div className="flex flex-wrap gap-0.5 mt-1">
              {block.actions.map((action, i) => (
                <span key={i} className="text-xs bg-blue-100 text-blue-700 px-1 rounded border border-blue-300">{action}</span>
              ))}
            </div>
          )}
          {block.description && !block.fields && !block.actions && (
            <p className="text-xs text-gray-400">{block.description}</p>
          )}
        </div>
        {block.children && block.children.length > 0 && (
          <div className="mt-1">
            {block.children.map((child) => renderMobileBlock(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // 渲染页面线框图（手机容器样式）
  const renderMobileWireframe = (wireframe: WireframePage) => {
    return (
      <div key={wireframe.id} className="flex-shrink-0">
        <div className="text-center mb-2 font-medium">{wireframe.pageName}</div>
        {/* 手机屏幕容器 */}
        <div className="w-[360px] border-2 border-gray-800 rounded-lg bg-white overflow-hidden">
          <div className="h-full flex flex-col">
            {wireframe.blocks.map((block) => renderMobileBlock(block))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/projects/${projectId}/flows`}>
              <Button variant="outline">返回跳转关系</Button>
            </Link>
            <h1 className="text-xl font-semibold">{project.name} - 线框图</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleSave} variant="outline">保存线框图</Button>
            <Link href={`/projects/${projectId}/prd`}>
              <Button>下一步：生成 PRD</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* 错误提示 */}
        {errorState && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-amber-800">{errorState.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700 mb-4">{errorState.message}</p>
              <Link href={errorState.href}>
                <Button variant="outline">{errorState.actionLabel}</Button>
              </Link>
            </CardContent>
          </Card>
        )}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p>正在生成线框图...</p>
          </div>
        ) : (
          <div>
            {/* 说明文案 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700">
                请确认每个页面的结构、字段和关键操作是否完整，线框图仅用于评审页面结构，不代表最终 UI。
              </p>
            </div>

            {/* 页面索引 */}
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-2">页面索引：</div>
              <div className="flex flex-wrap gap-2">
                {wireframeList.map((wireframe, index) => (
                  <Badge key={wireframe.id} variant="outline" className="text-sm px-3 py-1">
                    {index + 1}. {wireframe.pageName}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 统计 */}
            <div className="flex items-center gap-4 mb-6">
              <Badge variant="outline" className="text-base px-3 py-1">
                共 {wireframeList.length} 个页面线框图
              </Badge>
            </div>

            {/* 线框图列表（横向滚动） */}
            <div className="flex gap-6 overflow-x-auto pb-4">
              {wireframeList.map((wireframe) => renderMobileWireframe(wireframe))}
            </div>

            {wireframeList.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                暂无线框图
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
