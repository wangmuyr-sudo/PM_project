'use client';

import type { WireframePage } from '@/lib/types';

interface WireframePageNavProps {
  wireframes: WireframePage[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function WireframePageNav({ wireframes, selectedIndex, onSelect }: WireframePageNavProps) {
  return (
    <div className="w-60 bg-white border-r border-slate-200 overflow-y-auto">
      <div className="p-4">
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
          页面列表
        </div>
        <div className="space-y-1">
          {wireframes.map((wireframe, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={wireframe.id}
                onClick={() => onSelect(index)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${isSelected
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded flex items-center justify-center text-xs ${isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-500'
                    }`}>
                    {index + 1}
                  </span>
                  <span className="truncate">{wireframe.pageName}</span>
                </div>
                <div className="mt-1 ml-7 text-xs text-slate-400">
                  {wireframe.blocks.length} 个模块
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 统计信息 */}
      <div className="p-4 border-t border-slate-200">
        <div className="text-xs text-slate-400">
          共 {wireframes.length} 个页面线框图
        </div>
      </div>
    </div>
  );
}

// 移动端页面选择器（横向 tabs）
export function WireframePageTabs({ wireframes, selectedIndex, onSelect }: WireframePageNavProps) {
  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2 overflow-x-auto">
      <div className="flex gap-2 min-w-max">
        {wireframes.map((wireframe, index) => {
          const isSelected = index === selectedIndex;
          return (
            <button
              key={wireframe.id}
              onClick={() => onSelect(index)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${isSelected
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600'
                }`}
            >
              {wireframe.pageName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
