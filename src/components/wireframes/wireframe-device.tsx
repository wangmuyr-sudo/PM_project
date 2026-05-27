'use client';

import type { WireframePage, WireframeBlock } from '@/lib/types';
import { WireframeBlockRenderer } from './wireframe-block-renderer';

interface WireframeDeviceProps {
  wireframe: WireframePage;
  platform: string;
}

// 检查 block 是否有指定 actions
function hasActions(block: WireframeBlock, actionList: string[]): boolean {
  return block.actions?.some((a: string) => actionList.includes(a)) ?? false;
}

// 检查是否有指定类型的 block 且该 block 有指定 actions
function hasBlockWithActions(blocks: WireframeBlock[], type: string, actionList: string[]): boolean {
  return blocks.some(b => b.type === type && hasActions(b, actionList));
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
          {/* 侧边栏 */}
          {hasBlockWithActions(wireframe.blocks, 'nav', ['首页', '医生管理', '预约管理', '用户管理', '系统设置']) && (
            <div className="w-56 bg-slate-50 border-r border-slate-200 p-3 overflow-y-auto">
              <div className="mb-3 pb-2 border-b border-slate-200">
                <span className="text-sm font-semibold text-slate-700">导航菜单</span>
              </div>
              {wireframe.blocks
                .filter(b => b.type === 'nav' && hasActions(b, ['首页', '医生管理', '预约管理', '用户管理', '系统设置']))
                .map((block) => (
                  <div key={block.id} className="mb-1">
                    {block.actions && block.actions.length > 0 ? (
                      block.actions.map((action: string, i: number) => (
                        <div
                          key={i}
                          className={`px-3 py-2 rounded text-sm ${i === 0 ? 'bg-slate-200 text-slate-900 font-medium' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                          {action}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-slate-600">{block.title}</div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {/* 主内容区 */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-100">
            <div className="mb-3 pb-2 border-b border-slate-200">
              <span className="text-base font-semibold text-slate-700">{wireframe.pageName}</span>
            </div>
            <div className="space-y-2">
              {wireframe.blocks
                .filter(b => b.type !== 'nav' || !hasActions(b, ['首页', '医生管理', '预约管理', '用户管理', '系统设置']))
                .map((block) => (
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
    return (
      <div className="w-[390px] min-h-[720px] bg-white rounded-[32px] border border-slate-300 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden relative">
        {/* H5 顶部标题栏 */}
        <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-center">
          <span className="text-sm font-medium text-slate-800">{wireframe.pageName}</span>
        </div>

        {/* 内容区 */}
        <div className="bg-slate-50 min-h-[668px] overflow-y-auto pb-4">
          <div className="space-y-0">
            {wireframe.blocks.map((block) => (
              <div key={block.id} className="relative">
                <WireframeBlockRenderer block={block} platform={platform} />
                {block.type === 'bottom-sheet' && (
                  <div className="absolute bottom-0 left-0 right-0 h-[180px] bg-white border-t border-slate-200 rounded-t-3xl shadow-lg">
                    <div className="flex justify-center pt-2">
                      <div className="w-8 h-1 bg-slate-300 rounded" />
                    </div>
                    <div className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-700">{block.title || '底部弹层'}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 底部安全区提示 */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-b-[32px]" />
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
            {wireframe.blocks
              .filter(b => b.type !== 'header')
              .map((block) => (
                <div key={block.id} className="relative">
                  <WireframeBlockRenderer block={block} platform={platform} />
                  {block.type === 'bottom-sheet' && (
                    <div className="absolute bottom-0 left-0 right-0 h-[180px] bg-white border-t border-slate-200 rounded-t-3xl shadow-lg">
                      <div className="flex justify-center pt-2">
                        <div className="w-8 h-1 bg-slate-300 rounded" />
                      </div>
                      <div className="px-4 py-3">
                        <span className="text-sm font-medium text-slate-700">{block.title || '底部弹层'}</span>
                      </div>
                    </div>
                  )}
                  {block.type === 'modal' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-4/5">
                        <div className="px-4 py-3 border-b border-slate-100">
                          <span className="text-sm font-medium text-slate-700">{block.title || '弹窗'}</span>
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-slate-400 mb-3">{block.description}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* 底部 TabBar */}
        {hasBlockWithActions(wireframe.blocks, 'tabs', ['首页', '找医生', '预约', '我的']) && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around px-4">
            {['首页', '找医生', '预约', '我的'].map((tab, i) => (
              <div key={tab} className={`flex flex-col items-center ${i === 0 ? 'text-blue-600' : 'text-slate-400'}`}>
                <div className={`w-6 h-6 rounded ${i === 0 ? 'bg-blue-100' : 'bg-slate-100'}`} />
                <span className="text-xs mt-1">{tab}</span>
              </div>
            ))}
          </div>
        )}
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
          {wireframe.blocks.map((block) => (
            <div key={block.id} className="relative">
              <WireframeBlockRenderer block={block} platform={platform} />
              {block.type === 'bottom-sheet' && (
                <div className="absolute bottom-0 left-0 right-0 h-[180px] bg-white border-t border-slate-200 rounded-t-3xl shadow-lg">
                  <div className="flex justify-center pt-2">
                    <div className="w-8 h-1 bg-slate-300 rounded" />
                  </div>
                  <div className="px-4 py-3">
                    <span className="text-sm font-medium text-slate-700">{block.title || '底部弹层'}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 小程序 TabBar */}
      {hasBlockWithActions(wireframe.blocks, 'tabs', ['首页', '医生', '预约', '我的']) && (
        <div className="absolute bottom-0 left-0 right-0 h-[68px] bg-white border-t border-slate-200 pt-2">
          <div className="flex justify-around">
            {['首页', '医生', '预约', '我的'].map((tab, i) => (
              <div key={tab} className={`flex flex-col items-center ${i === 0 ? 'text-green-600' : 'text-slate-400'}`}>
                <div className={`w-5 h-5 rounded-full ${i === 0 ? 'bg-green-100' : 'bg-slate-100'}`} />
                <span className="text-xs mt-1">{tab}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
