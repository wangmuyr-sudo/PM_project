'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProjectStore, useProjectById } from '@/lib/store/project-store';
import { getAIProvider } from '@/lib/ai/ai-client';
import type { ProductPage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PagesPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const project = useProjectById(projectId);
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageList, setPageList] = useState<ProductPage[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 确保当前项目ID设置正确
  useEffect(() => {
    if (projectId) {
      setCurrentProject(projectId);
    }
  }, [projectId, setCurrentProject]);

  const generatePageList = async () => {
    setIsLoading(true);
    try {
      if (!project?.featureTree) {
        console.error('缺少功能结构图，无法生成页面清单');
        return;
      }

      const ai = getAIProvider();
      const pages = await ai.generatePageList({
        featureTree: project.featureTree,
      });
      setPageList(pages);
      // 保存到 Store
      updateProject(projectId, { pageList: pages });
    } catch (error) {
      console.error('生成页面清单失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 加载或生成页面清单
  useEffect(() => {
    if (!project) return;

    if (project.pageList && project.pageList.length > 0) {
      setPageList(project.pageList);
    } else {
      // 自动生成页面清单
      generatePageList();
    }
  }, [project]);
  
  const handleStatusChange = (pageId: string, newStatus: 'mvp' | 'later') => {
    const updatedList = pageList.map(page => 
      page.id === pageId ? { ...page, status: newStatus } : page
    );
    setPageList(updatedList);
    // 页面清单变更后，清空下游交付物
    updateProject(projectId, { 
      pageList: updatedList,
      flows: undefined,
      wireframes: undefined,
      prd: undefined,
      devHandoff: undefined,
    });
  };
  
  const handleSave = () => {
    updateProject(projectId, { 
      pageList,
      flows: undefined,
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/projects/${projectId}/structure`}>
              <Button variant="outline">返回功能结构图</Button>
            </Link>
            <h1 className="text-xl font-semibold">{project.name} - 页面清单</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleSave} variant="outline">保存页面清单</Button>
            <Link href={`/projects/${projectId}/flows`}>
              <Button>下一步：生成跳转关系</Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p>正在生成页面清单...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 页面统计 */}
            <div className="flex items-center gap-4 mb-6">
              <Badge variant="outline" className="text-base px-3 py-1">
                共 {pageList.length} 个页面
              </Badge>
              <Badge className="bg-green-500 text-base px-3 py-1">
                MVP: {pageList.filter(p => p.status === 'mvp').length}
              </Badge>
              <Badge className="bg-gray-500 text-base px-3 py-1">
                后续版本: {pageList.filter(p => p.status === 'later').length}
              </Badge>
            </div>
            
            {/* 页面列表 */}
            {pageList.map((page) => (
              <Card key={page.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{page.name}</CardTitle>
                    <Select
                      value={page.status}
                      onValueChange={(value) => handleStatusChange(page.id, value as 'mvp' | 'later')}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mvp">MVP</SelectItem>
                        <SelectItem value="later">后续版本</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">页面目标</p>
                      <p>{page.goal}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">包含模块</p>
                      <div className="flex flex-wrap gap-1">
                        {page.modules.map((mod, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{mod}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">关键操作</p>
                      <div className="flex flex-wrap gap-1">
                        {page.keyActions.map((action, i) => (
                          <Badge key={i} className="bg-green-100 text-green-700 text-xs">{action}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">入口来源</p>
                      <div className="flex flex-wrap gap-1">
                        {page.entryFrom.map((entry, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{entry}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500 mb-1">跳转目标</p>
                      <div className="flex flex-wrap gap-1">
                        {page.navigateTo.map((nav, i) => (
                          <Badge key={i} className="bg-blue-100 text-blue-700 text-xs">{nav}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}