'use client';

import type { WireframePage } from '@/lib/types';

interface WireframePageNavProps {
  wireframes: WireframePage[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

// 按 pageId 分组
interface PageGroup {
  pageId: string;
  pageName: string; // 真实页面名称
  wireframes: WireframePage[];
}

function groupByPageId(wireframes: WireframePage[]): PageGroup[] {
  const groups = new Map<string, PageGroup>();

  wireframes.forEach((wf) => {
    const pageId = wf.pageId;
    const pageName = wf.pageName.split(' - ')[0]; // "医生列表页 - 默认状态" -> "医生列表页"

    if (!groups.has(pageId)) {
      groups.set(pageId, {
        pageId,
        pageName,
        wireframes: [],
      });
    }
    groups.get(pageId)!.wireframes.push(wf);
  });

  return Array.from(groups.values());
}

export function WireframePageNav({ wireframes, selectedIndex, onSelect }: WireframePageNavProps) {
  const groups = groupByPageId(wireframes);
  const realPageCount = groups.length;
  const stateFrameCount = wireframes.length;

  // 找到当前选中 wireframe 所在的 group
  const selectedWireframe = wireframes[selectedIndex];
  const selectedGroupIndex = groups.findIndex((g) => g.pageId === selectedWireframe?.pageId);

  return (
    <div className="w-60 bg-white border-r border-slate-200 overflow-y-auto">
      <div className="p-4">
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
          页面列表
        </div>

        <div className="space-y-3">
          {groups.map((group, groupIndex) => {
            const isGroupSelected = groupIndex === selectedGroupIndex;
            return (
              <div key={group.pageId}>
                {/* 父级：真实页面名称 */}
                <div
                  className={`text-sm font-medium px-2 py-1 rounded ${
                    isGroupSelected
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-slate-700'
                  }`}
                >
                  {group.pageName}
                </div>

                {/* 子级：状态帧列表 */}
                <div className="mt-1 ml-2 space-y-0.5">
                  {group.wireframes.map((wf) => {
                    const wireframeIndex = wireframes.findIndex((w) => w.id === wf.id);
                    const isSelected = wireframeIndex === selectedIndex;

                    // 从 pageName 提取状态名称 "医生列表页 - 默认状态" -> "默认状态"
                    const stateName = wf.pageName.includes(' - ')
                      ? wf.pageName.split(' - ')[1]
                      : wf.pageName;

                    return (
                      <button
                        key={wf.id}
                        onClick={() => onSelect(wireframeIndex)}
                        className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                          isSelected
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{stateName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 统计信息 */}
      <div className="p-4 border-t border-slate-200">
        <div className="text-xs text-slate-400">
          {realPageCount} 个真实页面
          <br />
          {stateFrameCount} 个状态帧
        </div>
      </div>
    </div>
  );
}

// 移动端页面选择器（横向 tabs + 分组显示）
export function WireframePageTabs({ wireframes, selectedIndex, onSelect }: WireframePageNavProps) {
  const groups = groupByPageId(wireframes);
  const selectedWireframe = wireframes[selectedIndex];
  const selectedGroupIndex = groups.findIndex((g) => g.pageId === selectedWireframe?.pageId);

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2 overflow-x-auto">
      <div className="flex gap-2 min-w-max">
        {groups.map((group, groupIndex) => {
          const isSelected = groupIndex === selectedGroupIndex;
          return (
            <div key={group.pageId} className="flex gap-1">
              {group.wireframes.map((wf) => {
                const wireframeIndex = wireframes.findIndex((w) => w.id === wf.id);
                const isThisSelected = wireframeIndex === selectedIndex;
                const stateName = wf.pageName.includes(' - ')
                  ? wf.pageName.split(' - ')[1]
                  : wf.pageName;

                return (
                  <button
                    key={wf.id}
                    onClick={() => onSelect(wireframeIndex)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      isThisSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {stateName}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
