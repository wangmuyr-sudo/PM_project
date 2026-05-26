'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useProjectStore, useCurrentProject } from '@/lib/store/project-store';
import { getAIProvider } from '@/lib/ai/ai-client';
import type { ProductFlow } from '@/lib/types';
import { groupFlowsByType } from '@/lib/types/flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function FlowsPage() {
  const params = useParams();
  const projectId = params.id as string;

  const project = useCurrentProject();
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [flowList, setFlowList] = useState<ProductFlow[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 确保当前项目ID设置正确
  useEffect(() => {
    if (projectId) {
      setCurrentProject(projectId);
    }
  }, [projectId, setCurrentProject]);

  const generateFlows = useCallback(async () => {
    // 检查前置条件
    if (!project?.featureTree) {
      console.error('缺少功能结构图，无法生成跳转关系');
      return;
    }
    if (!project?.pageList || project.pageList.length === 0) {
      console.error('缺少页面清单，无法生成跳转关系');
      return;
    }

    setIsLoading(true);
    try {
      const ai = getAIProvider();
      const flows = await ai.generateFlows({
        featureTree: project.featureTree,
        pageList: project.pageList,
      });
      setFlowList(flows);
      // 保存到 Store
      updateProject(projectId, { flows });
    } catch (error) {
      console.error('生成跳转关系失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [project, projectId, updateProject]);

  // 加载或生成流程
  useEffect(() => {
    if (!project) return;

    if (project.flows && project.flows.length > 0) {
      setFlowList(project.flows);
    } else {
      // 自动生成流程
      generateFlows();
    }
  }, [project, generateFlows]);

  const handleSave = () => {
    updateProject(projectId, { flows: flowList });
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

  const groupedFlows = groupFlowsByType(flowList);

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const renderFlowSection = (title: string, flows: ProductFlow[]) => {
    if (flows.length === 0) return null;

    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="space-y-3">
          {flows.map((flow) => (
            <Card key={flow.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{flow.name}</span>
                      <Badge className={getConfidenceColor(flow.confidence)}>
                        {flow.confidence === 'high' ? '高' : flow.confidence === 'medium' ? '中' : '低'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">{flow.from}</span>
                      <span className="text-gray-400">→</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded">{flow.trigger}</span>
                      <span className="text-gray-400">→</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">{flow.to}</span>
                    </div>
                    <p className="text-sm text-gray-500">{flow.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
            <Link href={`/projects/${projectId}/pages`}>
              <Button variant="outline">返回页面清单</Button>
            </Link>
            <h1 className="text-xl font-semibold">{project.name} - 跳转关系</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleSave} variant="outline">保存跳转关系</Button>
            <Link href={`/projects/${projectId}/wireframes`}>
              <Button>下一步：生成线框图</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p>正在生成跳转关系...</p>
          </div>
        ) : (
          <div>
            {/* 流程统计 */}
            <div className="flex items-center gap-4 mb-6">
              <Badge variant="outline" className="text-base px-3 py-1">
                共 {flowList.length} 个流程
              </Badge>
              <Badge className="bg-green-500 text-base px-3 py-1">
                已识别: {groupedFlows.recognized.length}
              </Badge>
              <Badge className="bg-yellow-500 text-base px-3 py-1">
                推测: {groupedFlows.assumed.length}
              </Badge>
              <Badge className="bg-gray-500 text-base px-3 py-1">
                待确认: {groupedFlows.pending.length}
              </Badge>
            </div>

            {/* 已识别流程 */}
            {renderFlowSection('已识别流程', groupedFlows.recognized)}

            {/* 推测流程 */}
            {renderFlowSection('推测流程', groupedFlows.assumed)}

            {/* 待确认流程 */}
            {renderFlowSection('待确认流程', groupedFlows.pending)}

            {flowList.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                暂无跳转关系
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
