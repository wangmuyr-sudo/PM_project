'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useProjectStore, useProjectById } from '@/lib/store/project-store';
import { getAIProvider } from '@/lib/ai/ai-client';
import type { WireframePage } from '@/lib/types';
import { WireframeBoard } from '@/components/wireframes/wireframe-board';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function WireframesPage() {
  const params = useParams();
  const projectId = params.id as string;

  const project = useProjectById(projectId);
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [wireframeList, setWireframeList] = useState<WireframePage[]>([]);
  const [errorState, setErrorState] = useState<{
    title: string;
    message: string;
    href: string;
    actionLabel: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (projectId) {
      setCurrentProject(projectId);
    }
  }, [projectId, setCurrentProject]);

  const generateWireframes = useCallback(async () => {
    if (!project?.featureTree) {
      setErrorState({
        title: '无法生成线框图',
        message: '缺少功能结构图，无法生成线框图。请先在功能结构图页生成并保存功能结构。',
        href: `/projects/${projectId}/structure`,
        actionLabel: '返回功能结构图',
      });
      return;
    }
    if (!project?.pageList || project.pageList.length === 0) {
      setErrorState({
        title: '无法生成线框图',
        message: '缺少页面清单，无法生成线框图。请先在页面清单页生成并保存页面范围。',
        href: `/projects/${projectId}/pages`,
        actionLabel: '返回页面清单',
      });
      return;
    }
    if (!project?.flows || project.flows.length === 0) {
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
        platform: project.platform,
      });
      setWireframeList(wireframes);
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
      generateWireframes();
    }
  }, [project, generateWireframes]);

  const handleSave = useCallback(() => {
    updateProject(projectId, {
      wireframes: wireframeList,
      prd: undefined,
      devHandoff: undefined,
    });
  }, [projectId, wireframeList, updateProject]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-sm text-slate-500">页面加载中...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <p className="text-slate-600">项目不存在或正在加载...</p>
      </div>
    );
  }

  // 错误状态
  if (errorState) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800">{errorState.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700 mb-4 text-sm">{errorState.message}</p>
            <Button asChild variant="outline">
              <a href={errorState.href}>{errorState.actionLabel}</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">正在生成线框图...</p>
        </div>
      </div>
    );
  }

  // 空状态
  if (wireframeList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>暂无线框图</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">项目还没有生成线框图。</p>
            <Button onClick={generateWireframes}>生成线框图</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 使用原型看板布局
  return (
    <WireframeBoard
      projectId={projectId}
      projectName={project.name}
      platform={project.platform}
      wireframes={wireframeList}
      onSave={handleSave}
    />
  );
}
