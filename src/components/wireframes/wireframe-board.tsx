'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { WireframePage } from '@/lib/types';
import { WireframePageNav, WireframePageTabs } from './wireframe-page-nav';
import { WireframeDevice } from './wireframe-device';
import { WireframeInspector } from './wireframe-inspector';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WireframeBoardProps {
  projectId: string;
  projectName: string;
  platform: string;
  wireframes: WireframePage[];
  onSave: () => void;
}

export function WireframeBoard({
  projectId,
  projectName,
  platform,
  wireframes,
  onSave,
}: WireframeBoardProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);

  const selectedWireframe = wireframes[selectedIndex] || null;

  const platformLabels: Record<string, string> = {
    web: 'Web 网页',
    h5: 'H5',
    app: 'App',
    'mini-program': '小程序',
  };

  const platformLabel = platformLabels[platform] || '小程序';

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      {/* 顶部工具栏 */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/projects/${projectId}/flows`}>
            <Button variant="outline" size="sm">返回跳转关系</Button>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-slate-800">
              {projectName}
            </span>
            <Badge variant="outline" className="text-xs">
              {platformLabel}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onSave}>
            保存线框图
          </Button>
          <Link href={`/projects/${projectId}/prd`}>
            <Button size="sm">下一步：生成 PRD</Button>
          </Link>
        </div>
      </header>

      {/* 主体区域 - 桌面端三栏布局 */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* 左侧页面导航 */}
        <WireframePageNav
          wireframes={wireframes}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
        />

        {/* 中间原型画布 */}
        <main className="flex-1 bg-slate-100 p-10 overflow-auto flex items-start justify-center">
          {selectedWireframe ? (
            <WireframeDevice
              wireframe={selectedWireframe}
              platform={platform}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              暂无选中页面
            </div>
          )}
        </main>

        {/* 右侧页面说明 */}
        <WireframeInspector wireframe={selectedWireframe} />
      </div>

      {/* 移动端/平板布局 */}
      <div className="lg:hidden flex flex-col flex-1 overflow-hidden">
        {/* 移动端页面选择 tabs */}
        <WireframePageTabs
          wireframes={wireframes}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
        />

        {/* 移动端原型预览 */}
        <main className="flex-1 bg-slate-100 p-4 overflow-auto flex items-start justify-center">
          {selectedWireframe ? (
            <WireframeDevice
              wireframe={selectedWireframe}
              platform={platform}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              暂无选中页面
            </div>
          )}
        </main>

        {/* 移动端页面说明（折叠面板） */}
        <div className="bg-white border-t border-slate-200 p-4 flex-shrink-0">
          <WireframeInspector wireframe={selectedWireframe} />
        </div>
      </div>
    </div>
  );
}
