'use client';

import type { WireframePage, WireframeBlock } from '@/lib/types';
import { WireframeBlockRenderer } from './wireframe-block-renderer';

interface WireframeDeviceProps {
  wireframe: WireframePage;
  platform: string;
}

// ============================================================
// Helper 函数：判断 Block 类型
// ============================================================

// 判断是否为底部 TabBar block
function isBottomTabBlock(block: WireframeBlock): boolean {
  if (block.type !== 'tabs') return false;
  const title = (block.title || '').toLowerCase();

  // title 包含底部/TabBar/底部导航/底部 Tab 才认为是 TabBar
  return (
    title.includes('底部') ||
    title.includes('tabbar') ||
    title.includes('底部导航') ||
    title.includes('底部 tab')
  );
}

// 统一的底部 TabBar 获取函数
function getBottomTabBlock(blocks: WireframeBlock[]): WireframeBlock | undefined {
  return blocks.find(block => isBottomTabBlock(block));
}

// 判断是否为 header block（设备层已渲染）
function isHeaderBlock(block: WireframeBlock): boolean {
  return block.type === 'header';
}

// 判断是否为 Web 侧边栏 nav block（收紧规则）
function isWebSidebarNavBlock(block: WireframeBlock): boolean {
  if (block.type !== 'nav') return false;
  const title = (block.title || '').toLowerCase();

  // title 明确包含以下词才是侧边栏
  return (
    title.includes('侧边栏') ||
    title.includes('菜单') ||
    title.includes('功能导航') ||
    title.includes('页面导航') ||
    title.includes('管理菜单') ||
    title.includes('左侧导航')
  );
}

// 判断是否为服务入口 nav block（应保留在内容区）
function isServiceEntryBlock(block: WireframeBlock): boolean {
  if (block.type !== 'nav') return false;
  const title = (block.title || '').toLowerCase();
  return (
    title.includes('服务入口') ||
    title.includes('快捷入口') ||
    title.includes('功能入口') ||
    title.includes('应用入口')
  );
}

// 判断普通 tabs 是否应保留在内容区
function shouldKeepTabsInContent(block: WireframeBlock): boolean {
  if (block.type !== 'tabs') return false;
  const title = (block.title || '').toLowerCase();
  return (
    title.includes('科室') ||
    title.includes('状态') ||
    title.includes('筛选') ||
    title.includes('分类') ||
    title.includes('日期')
  );
}

// H5 内容区过滤规则 - 只过滤设备层已渲染的 block
function getH5ContentBlocks(blocks: WireframeBlock[]): WireframeBlock[] {
  const bottomTabBlock = getBottomTabBlock(blocks);
  return blocks.filter(block =>
    !isHeaderBlock(block) &&
    block.id !== bottomTabBlock?.id
  );
}

// App 内容区过滤规则 - 只过滤设备层已渲染的 block
function getAppContentBlocks(blocks: WireframeBlock[]): WireframeBlock[] {
  const bottomTabBlock = getBottomTabBlock(blocks);
  return blocks.filter(block =>
    !isHeaderBlock(block) &&
    block.id !== bottomTabBlock?.id
  );
}

// 小程序内容区过滤规则 - 只过滤设备层已渲染的 block
function getMiniProgramContentBlocks(blocks: WireframeBlock[]): WireframeBlock[] {
  const bottomTabBlock = getBottomTabBlock(blocks);
  return blocks.filter(block =>
    !isHeaderBlock(block) &&
    block.id !== bottomTabBlock?.id
  );
}

// Web 主内容区过滤规则 - 只过滤侧边栏 block by id
function getWebContentBlocks(blocks: WireframeBlock[]): WireframeBlock[] {
  const sidebarBlock = blocks.find(b => b.type === 'nav' && isWebSidebarNavBlock(b));
  return blocks.filter(block =>
    !(block.type === 'nav' && isWebSidebarNavBlock(block)) ||
    (sidebarBlock && block.id !== sidebarBlock.id)
  );
}

// 获取 Web 侧边栏 block
function getWebSidebarBlock(blocks: WireframeBlock[]): WireframeBlock | undefined {
  return blocks.find(b => b.type === 'nav' && isWebSidebarNavBlock(b));
}

export function WireframeDevice({ wireframe, platform }: WireframeDeviceProps) {
  // Web 桌面端设备
  if (platform === 'web') {
    return (
      <div className="w-[960px] min-h-[640px] bg-white rounded-2xl border border-slate-300 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden">
        {/* 浏览器工具栏 */}
        <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 bg-red-400 rounded-full" />
            <div className="w-3 h-3 bg-yellow-400 rounded-full" />
            <div className="w-3 h-3 bg-green-400 rounded-full" />
          </div>
          <div className="flex-1 mx-4">
            <div className="h-6 bg-white rounded flex items-center px-3 text-xs text-slate-400">
              example.com / {wireframe.pageName}
            </div>
          </div>
          <div className="w-20 h-6 bg-white rounded border border-slate-200" />
        </div>

        {/* 桌面端布局：侧边栏 + 主内容区 */}
        <div className="flex h-[600px]">
          {/* 侧边栏 - 使用真实的 sidebarBlock.actions */}
          {(() => {
            const sidebarBlock = getWebSidebarBlock(wireframe.blocks);
            if (!sidebarBlock) return null;
            const actions = sidebarBlock.actions || [];
            return (
              <div className="w-56 bg-slate-50 border-r border-slate-200 p-3 overflow-y-auto">
                <div className="mb-3 pb-2 border-b border-slate-200">
                  <span className="text-sm font-semibold text-slate-700">{sidebarBlock.title || '导航菜单'}</span>
                </div>
                <div className="mb-1">
                  {actions.length > 0 ? (
                    actions.map((action: string, i: number) => (
                      <div
                        key={i}
                        className={`px-3 py-2 rounded text-sm ${i === 0 ? 'bg-slate-200 text-slate-900 font-medium' : 'text-slate-600 hover:bg-slate-100'
                          }`}
                      >
                        {action}
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-slate-600">{sidebarBlock.title}</div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* 主内容区 - 使用通用过滤规则 */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-100">
            <div className="mb-3 pb-2 border-b border-slate-200">
              <span className="text-base font-semibold text-slate-700">{wireframe.pageName}</span>
            </div>
            <div className="space-y-2">
              {getWebContentBlocks(wireframe.blocks).map((block) => (
                <WireframeBlockRenderer key={block.id} block={block} platform={platform} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // H5 手机网页设备
  if (platform === 'h5') {
    const bottomTabBlock = getBottomTabBlock(wireframe.blocks);

    return (
      <div className="w-[390px] min-h-[720px] bg-white rounded-[32px] border border-slate-300 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden relative">
        {/* H5 顶部标题栏 */}
        <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-center">
          <span className="text-sm font-medium text-slate-800">{wireframe.pageName}</span>
        </div>

        {/* 内容区 - 过滤掉 bottomTabBlock */}
        <div className={`bg-slate-50 overflow-y-auto ${bottomTabBlock ? 'min-h-[580px]' : 'min-h-[668px]'}`}>
          <div className="space-y-0">
            {getH5ContentBlocks(wireframe.blocks).map((block) => (
              <WireframeBlockRenderer key={block.id} block={block} platform={platform} />
            ))}
          </div>
        </div>

        {/* H5 底部 TabBar - 使用真实的 bottomTabBlock.actions */}
        {bottomTabBlock && bottomTabBlock.actions && bottomTabBlock.actions.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-white border-t border-slate-200 flex items-center justify-around px-4">
            {bottomTabBlock.actions.map((tab: string, i: number) => (
              <div key={i} className={`flex flex-col items-center ${i === 0 ? 'text-sky-600' : 'text-slate-400'}`}>
                <div className={`w-6 h-6 rounded ${i === 0 ? 'bg-sky-100' : 'bg-slate-100'}`} />
                <span className="text-xs mt-1">{tab}</span>
              </div>
            ))}
          </div>
        )}

        {/* 底部安全区提示 - 仅在没有 TabBar 时显示 */}
        {!bottomTabBlock && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-b-[32px]" />
        )}
      </div>
    );
  }

  // App 原生手机设备
  if (platform === 'app') {
    return (
      <div className="w-[390px] min-h-[720px] bg-white rounded-[36px] border border-slate-300 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden relative">
        {/* 状态栏 */}
        <div className="h-12 bg-black flex items-center justify-between px-6">
          <span className="text-white text-xs font-medium">9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-2 bg-white rounded-sm" />
            <div className="w-4 h-2 bg-white rounded-sm" />
            <div className="w-6 h-3 bg-white rounded-sm" />
          </div>
        </div>

        {/* App 原生导航栏 */}
        <div className="h-11 bg-white border-b border-slate-200 flex items-center justify-between px-4">
          <div className="w-8 h-8 flex items-center justify-center">
            <span className="text-slate-600">←</span>
          </div>
          <span className="text-sm font-medium text-slate-800">{wireframe.pageName}</span>
          <div className="w-8 h-8 flex items-center justify-center">
            <span className="text-slate-600">⋮</span>
          </div>
        </div>

        {/* 内容区 */}
        <div className="bg-slate-50 min-h-[568px] overflow-y-auto">
          <div className="space-y-0">
            {getAppContentBlocks(wireframe.blocks).map((block) => (
              <WireframeBlockRenderer key={block.id} block={block} platform={platform} />
            ))}
          </div>
        </div>

        {/* 底部 TabBar - 使用真实的 block.actions */}
        {getBottomTabBlock(wireframe.blocks) && (() => {
          const bottomTab = getBottomTabBlock(wireframe.blocks)!;
          const tabs = bottomTab.actions || [];
          return (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around px-4">
              {tabs.map((tab: string, i: number) => (
                <div key={tab} className={`flex flex-col items-center ${i === 0 ? 'text-blue-600' : 'text-slate-400'}`}>
                  <div className={`w-6 h-6 rounded ${i === 0 ? 'bg-blue-100' : 'bg-slate-100'}`} />
                  <span className="text-xs mt-1">{tab}</span>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    );
  }

  // 小程序（默认手机设备）
  return (
    <div className="w-[390px] min-h-[720px] bg-white rounded-[36px] border border-slate-300 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden relative">
      {/* 小程序导航栏 */}
      <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-center">
        <span className="text-sm font-medium text-slate-800">{wireframe.pageName}</span>
      </div>

      {/* 内容区 */}
      <div className="bg-slate-50 min-h-[600px] overflow-y-auto">
        <div className="space-y-0">
          {getMiniProgramContentBlocks(wireframe.blocks).map((block) => (
            <WireframeBlockRenderer key={block.id} block={block} platform={platform} />
          ))}
        </div>
      </div>

      {/* 小程序 TabBar - 使用真实的 block.actions */}
      {getBottomTabBlock(wireframe.blocks) && (() => {
        const bottomTab = getBottomTabBlock(wireframe.blocks)!;
        const tabs = bottomTab.actions || [];
        return (
          <div className="absolute bottom-0 left-0 right-0 h-[68px] bg-white border-t border-slate-200 pt-2">
            <div className="flex justify-around">
              {tabs.map((tab: string, i: number) => (
                <div key={tab} className={`flex flex-col items-center ${i === 0 ? 'text-green-600' : 'text-slate-400'}`}>
                  <div className={`w-5 h-5 rounded-full ${i === 0 ? 'bg-green-100' : 'bg-slate-100'}`} />
                  <span className="text-xs mt-1">{tab}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
