'use client';

import type { WireframePage, WireframeBlock } from '@/lib/types';

interface WireframeInspectorProps {
  wireframe: WireframePage | null;
}

// 收集所有字段
function collectFields(blocks: WireframeBlock[]): string[] {
  const fields: string[] = [];
  const seen = new Set<string>();

  function traverse(block: WireframeBlock) {
    if (block.fields) {
      block.fields.forEach((f) => {
        if (!seen.has(f)) {
          seen.add(f);
          fields.push(f);
        }
      });
    }
    if (block.children) {
      block.children.forEach(traverse);
    }
  }

  blocks.forEach(traverse);
  return fields;
}

// 收集所有操作
function collectActions(blocks: WireframeBlock[]): string[] {
  const actions: string[] = [];
  const seen = new Set<string>();

  function traverse(block: WireframeBlock) {
    if (block.actions) {
      block.actions.forEach((a) => {
        if (!seen.has(a)) {
          seen.add(a);
          actions.push(a);
        }
      });
    }
    if (block.children) {
      block.children.forEach(traverse);
    }
  }

  blocks.forEach(traverse);
  return actions;
}

// 统计 block 类型
function countBlockTypes(blocks: WireframeBlock[]): Record<string, number> {
  const counts: Record<string, number> = {};

  function traverse(block: WireframeBlock) {
    counts[block.type] = (counts[block.type] || 0) + 1;
    if (block.children) {
      block.children.forEach(traverse);
    }
  }

  blocks.forEach(traverse);
  return counts;
}

export function WireframeInspector({ wireframe }: WireframeInspectorProps) {
  if (!wireframe) {
    return (
      <div className="w-80 bg-white border-l border-slate-200 p-5 flex items-center justify-center">
        <p className="text-sm text-slate-400">选择一个页面查看详情</p>
      </div>
    );
  }

  // 分割真实页面名称和状态名称
  // "预约确认页 - 表单校验错误状态" -> 真实页面: 预约确认页, 当前状态: 表单校验错误状态
  const nameParts = wireframe.pageName.includes(' - ')
    ? wireframe.pageName.split(' - ')
    : [wireframe.pageName, ''];
  const realPageName = nameParts[0];
  const stateName = nameParts.slice(1).join(' - ');

  const fields = collectFields(wireframe.blocks);
  const actions = collectActions(wireframe.blocks);
  const blockTypeCounts = countBlockTypes(wireframe.blocks);

  return (
    <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto">
      <div className="p-5">
        {/* 页面名称 - 真实页面 + 当前状态 */}
        <div className="mb-5">
          <div className="text-xs text-slate-400 mb-1">真实页面</div>
          <h3 className="text-base font-semibold text-slate-800">{realPageName}</h3>
          {stateName && (
            <>
              <div className="text-xs text-slate-400 mt-2 mb-1">当前状态</div>
              <h4 className="text-sm font-medium text-slate-600">{stateName}</h4>
            </>
          )}
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xl font-semibold text-slate-700">{wireframe.blocks.length}</div>
            <div className="text-xs text-slate-400">模块数量</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xl font-semibold text-slate-700">{fields.length}</div>
            <div className="text-xs text-slate-400">字段数量</div>
          </div>
        </div>

        {/* 模块列表 */}
        <div className="mb-5">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
            模块列表
          </div>
          <div className="space-y-1">
            {wireframe.blocks.map((block, index) => (
              <div
                key={block.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded bg-slate-50"
              >
                <span className="w-5 h-5 rounded bg-slate-200 flex items-center justify-center text-xs text-slate-500">
                  {index + 1}
                </span>
                <span className="text-sm text-slate-700 truncate flex-1">{block.title}</span>
                <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  {block.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 字段列表 */}
        {fields.length > 0 && (
          <div className="mb-5">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
              字段列表
            </div>
            <div className="flex flex-wrap gap-1.5">
              {fields.map((field, index) => (
                <span
                  key={index}
                  className="h-6 px-2 flex items-center bg-slate-100 rounded-full text-xs text-slate-600 border border-slate-200"
                >
                  {field}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 操作列表 */}
        {actions.length > 0 && (
          <div className="mb-5">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
              操作列表
            </div>
            <div className="flex flex-wrap gap-1.5">
              {actions.map((action, index) => (
                <span
                  key={index}
                  className="h-6 px-2 flex items-center bg-slate-900 text-white rounded-full text-xs"
                >
                  {action}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Block 类型统计 */}
        <div className="mb-5">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
            Block 类型
          </div>
          <div className="space-y-1">
            {Object.entries(blockTypeCounts).map(([type, count]) => (
              <div
                key={type}
                className="flex items-center justify-between px-2 py-1.5 bg-slate-50 rounded"
              >
                <span className="text-sm text-slate-600">{type}</span>
                <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
