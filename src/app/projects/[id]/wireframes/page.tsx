'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useProjectStore, useCurrentProject } from '@/lib/store/project-store';
import { Button } from '@/components/ui/button';

export default function WireframesPage() {
  const params = useParams();
  const projectId = params.id as string;

  const project = useCurrentProject();
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (projectId) {
      setCurrentProject(projectId);
    }
  }, [projectId, setCurrentProject]);

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
            <Link href={`/projects/${projectId}/flows`}>
              <Button variant="outline">返回跳转关系</Button>
            </Link>
            <h1 className="text-xl font-semibold">{project.name} - 线框图</h1>
          </div>
        </div>
      </header>

      {/* 占位内容 */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">📐</div>
          <h2 className="text-xl font-semibold mb-2">线框图页面开发中</h2>
          <p className="text-gray-500 mb-6">
            4C 阶段功能，暂未开放
          </p>
          <div className="flex gap-4">
            <Link href={`/projects/${projectId}/flows`}>
              <Button variant="outline">返回跳转关系</Button>
            </Link>
            <Link href={`/projects/${projectId}/pages`}>
              <Button variant="outline">返回页面清单</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
