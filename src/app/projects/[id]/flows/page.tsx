'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useProjectStore, useProjectById } from '@/lib/store/project-store';
import { getAIProvider } from '@/lib/ai/ai-client';
import type { ProductFlow, FlowType } from '@/lib/types';
import { groupFlowsByType } from '@/lib/types/flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function FlowsPage() {
  const params = useParams();
  const projectId = params.id as string;

  const project = useProjectById(projectId);
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [flowList, setFlowList] = useState<ProductFlow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

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
      setErrorMessage('缺少功能结构图，无法生成跳转关系。请先在功能结构图页生成并保存功能结构。');
      return;
    }
    if (!project?.pageList || project.pageList.length === 0) {
      console.error('缺少页面清单，无法生成跳转关系');
      setErrorMessage('缺少页面清单，无法生成跳转关系。请先在页面清单页生成并保存页面范围。');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    try {
      const ai = getAIProvider();
      const flows = await ai.generateFlows({
        featureTree: project.featureTree,
        pageList: project.pageList,
      });
      setFlowList(flows);
      // 保存到 Store，同时清空下游交付物
      updateProject(projectId, {
        flows,
        wireframes: undefined,
        prd: undefined,
        devHandoff: undefined,
      });
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
    updateProject(projectId, {
      flows: flowList,
      wireframes: undefined,
      prd: undefined,
      devHandoff: undefined,
    });
  };

  // 更新流程状态
  const updateFlowStatus = (flowId: string, newType: FlowType) => {
    const updatedList = flowList.map((flow) => (flow.id === flowId ? { ...flow, type: newType } : flow));
    setFlowList(updatedList);
    // 跳转关系变更后，自动保存并清空下游交付物
    updateProject(projectId, {
      flows: updatedList,
      wireframes: undefined,
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

  const getStatusOptions = (): { value: FlowType; label: string }[] => [
    { value: 'recognized', label: '已识别' },
    { value: 'assumed', label: '推测' },
    { value: 'pending', label: '待确认' },
    { value: 'later', label: '后续版本' },
  ];

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
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-medium">{flow.name}</span>
                      <Badge className={getConfidenceColor(flow.confidence)}>
                        置信度：{flow.confidence === 'high' ? '高' : flow.confidence === 'medium' ? '中' : '低'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                      <div>
                        <span className="text-gray-500">来源页面：</span>
                        <span className="font-medium">{flow.from}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">触发动作：</span>
                        <span className="font-medium">{flow.trigger}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">目标页面：</span>
                        <span className="font-medium">{flow.to}</span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <span className="text-gray-500 text-sm">流程说明：</span>
                      <p className="text-sm text-gray-700 mt-1">{flow.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500">状态确认</span>
                    <select
                      value={flow.type}
                      onChange={(e) => updateFlowStatus(flow.id, e.target.value as FlowType)}
                      className="text-xs border rounded px-1 py-1"
                    >
                      {getStatusOptions().map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
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
        {/* 错误提示 */}
        {errorMessage && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-amber-800">无法生成跳转关系</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700 mb-4">{errorMessage}</p>
              <Link href={`/projects/${projectId}/pages`}>
                <Button variant="outline">返回页面清单</Button>
              </Link>
            </CardContent>
          </Card>
        )}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p>正在生成跳转关系...</p>
          </div>
        ) : (
          <div>
            {/* 说明文案 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700">
                请确认页面之间的来源、触发动作和目标页面是否正确，重点检查推测和待确认流程。
              </p>
            </div>

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
              <Badge className="bg-slate-400 text-base px-3 py-1">
                后续: {groupedFlows.later?.length || 0}
              </Badge>
            </div>

            {/* 已识别流程 */}
            {renderFlowSection('已识别流程', groupedFlows.recognized)}

            {/* 推测流程 */}
            {renderFlowSection('推测流程', groupedFlows.assumed)}

            {/* 待确认流程 */}
            {renderFlowSection('待确认流程', groupedFlows.pending)}

            {/* 后续版本流程 */}
            {renderFlowSection('后续版本', groupedFlows.later || [])}

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
