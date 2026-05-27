'use client';

import type { WireframeBlock } from '@/lib/types';

interface WireframeBlockRendererProps {
  block: WireframeBlock;
  platform: string;
  depth?: number;
}

// 字段标签样式
const FieldTag = ({ text }: { text: string }) => (
  <span className="h-6 px-2 flex items-center bg-slate-100 rounded-full text-xs text-slate-600 border border-slate-200">
    {text}
  </span>
);

// 操作按钮样式
const ActionTag = ({ text, primary = false }: { text: string; primary?: boolean }) => (
  <span className={`h-6 px-2 flex items-center rounded text-xs ${primary
    ? 'bg-slate-900 text-white'
    : 'bg-white text-slate-700 border border-slate-300'
    }`}>
    {text}
  </span>
);

// 渲染 header 类型的块
const renderHeader = (block: WireframeBlock) => (
  <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-4">
    <span className="text-sm font-medium text-slate-700">{block.title}</span>
    {block.description && (
      <span className="ml-2 text-xs text-slate-400">{block.description}</span>
    )}
  </div>
);

// 渲染 banner 类型的块
const renderBanner = (block: WireframeBlock) => (
  <div className="h-[120px] bg-sky-100 rounded-2xl flex flex-col items-center justify-center p-4 m-2">
    <span className="text-sm font-medium text-sky-700">{block.title}</span>
    {block.description && (
      <span className="mt-1 text-xs text-sky-500">{block.description}</span>
    )}
    {block.actions && block.actions.length > 0 && (
      <div className="flex gap-2 mt-2">
        {block.actions.map((action, i) => (
          <ActionTag key={i} text={action} />
        ))}
      </div>
    )}
  </div>
);

// 渲染 nav 类型的块
const renderNav = (block: WireframeBlock) => (
  <div className="h-14 bg-slate-50 border-t border-b border-slate-200 flex items-center px-4 gap-2">
    {block.actions && block.actions.length > 0 ? (
      block.actions.map((action, i) => (
        <span key={i} className="px-3 py-1 bg-slate-200 rounded-full text-xs text-slate-600">
          {action}
        </span>
      ))
    ) : (
      <span className="text-sm text-slate-500">{block.title}</span>
    )}
  </div>
);

// 渲染 card 类型的块
const renderCard = (block: WireframeBlock) => (
  <div className="bg-white border border-slate-200 rounded-xl p-3 m-2 mb-0">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-sm font-medium text-slate-800">{block.title}</span>
    </div>
    {block.description && (
      <p className="text-xs text-slate-400 mb-2">{block.description}</p>
    )}
    {block.fields && block.fields.length > 0 && (
      <div className="flex flex-wrap gap-1">
        {block.fields.map((field, i) => (
          <FieldTag key={i} text={field} />
        ))}
      </div>
    )}
    {block.children && block.children.length > 0 && (
      <div className="mt-2 space-y-1">
        {block.children.map((child) => (
          <div key={child.id} className="bg-slate-50 rounded p-2 border border-slate-100">
            <span className="text-xs font-medium text-slate-600">{child.title}</span>
            {child.fields && (
              <div className="flex flex-wrap gap-1 mt-1">
                {child.fields.map((f, i) => (
                  <span key={i} className="text-xs bg-slate-100 text-slate-500 px-1 rounded">{f}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

// 渲染 list 类型的块
const renderList = (block: WireframeBlock) => (
  <div className="bg-white border border-slate-200 rounded-xl m-2 overflow-hidden">
    <div className="px-3 py-2 border-b border-slate-100">
      <span className="text-sm font-medium text-slate-700">{block.title}</span>
    </div>
    {[1, 2, 3].map((i) => (
      <div key={i} className="px-3 py-2 border-b border-slate-50 last:border-0">
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-slate-200 rounded" />
          <div className="flex-1">
            <div className="h-3 bg-slate-200 rounded w-24 mb-1" />
            <div className="h-2 bg-slate-100 rounded w-16" />
          </div>
        </div>
      </div>
    ))}
    {block.actions && block.actions.length > 0 && (
      <div className="px-3 py-2 bg-slate-50 flex gap-2">
        {block.actions.map((action, i) => (
          <ActionTag key={i} text={action} />
        ))}
      </div>
    )}
  </div>
);

// 渲染 form 类型的块
const renderForm = (block: WireframeBlock) => (
  <div className="bg-white border border-slate-200 rounded-xl p-3 m-2">
    <div className="text-sm font-medium text-slate-700 mb-2">{block.title}</div>
    {block.fields && block.fields.length > 0 ? (
      <div className="space-y-2">
        {block.fields.map((field, i) => (
          <div key={i} className="h-8 bg-slate-100 rounded flex items-center px-2">
            <span className="text-xs text-slate-400">{field}</span>
          </div>
        ))}
      </div>
    ) : (
      <div className="h-8 bg-slate-100 rounded flex items-center px-2">
        <span className="text-xs text-slate-400">输入框占位</span>
      </div>
    )}
    {block.actions && block.actions.length > 0 && (
      <div className="flex gap-2 mt-2">
        {block.actions.map((action, i) => (
          <ActionTag key={i} text={action} primary={i === 0} />
        ))}
      </div>
    )}
  </div>
);

// 渲染 button 类型的块
const renderButton = (block: WireframeBlock) => (
  <div className="px-4 py-2 m-2">
    <div className="h-10 bg-slate-900 rounded-lg flex items-center justify-center">
      <span className="text-sm font-medium text-white">{block.title}</span>
    </div>
    {block.description && (
      <p className="text-xs text-slate-400 text-center mt-1">{block.description}</p>
    )}
  </div>
);

// 渲染 tabs 类型的块
const renderTabs = (block: WireframeBlock) => (
  <div className="px-4 py-3">
    <div className="flex gap-2">
      {block.actions && block.actions.length > 0 ? (
        block.actions.map((action, i) => (
          <span
            key={i}
            className={`px-3 py-1.5 rounded-full text-xs ${i === 0
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600'
              }`}
          >
            {action}
          </span>
        ))
      ) : (
        <>
          <span className="px-3 py-1.5 bg-slate-900 rounded-full text-xs text-white">Tab 1</span>
          <span className="px-3 py-1.5 bg-slate-100 rounded-full text-xs text-slate-600">Tab 2</span>
        </>
      )}
    </div>
  </div>
);

// 渲染 modal 类型的块
const renderModal = (block: WireframeBlock) => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
    <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-4/5 max-w-xs">
      <div className="px-4 py-3 border-b border-slate-100">
        <span className="text-sm font-medium text-slate-700">{block.title || '弹窗'}</span>
      </div>
      <div className="p-4">
        {block.description && (
          <p className="text-xs text-slate-400 mb-3">{block.description}</p>
        )}
        {block.fields && block.fields.length > 0 && (
          <div className="space-y-2 mb-3">
            {block.fields.map((field, i) => (
              <div key={i} className="h-7 bg-slate-100 rounded flex items-center px-2">
                <span className="text-xs text-slate-400">{field}</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2 justify-end">
          <span className="px-3 py-1.5 bg-slate-100 rounded text-xs text-slate-600">取消</span>
          <span className="px-3 py-1.5 bg-slate-900 rounded text-xs text-white">确定</span>
        </div>
      </div>
    </div>
  </div>
);

// 渲染 bottom-sheet 类型的块
const renderBottomSheet = (block: WireframeBlock) => (
  <div className="absolute bottom-0 left-0 right-0 h-[180px] bg-white border-t border-slate-200 rounded-t-3xl shadow-lg">
    <div className="flex justify-center pt-2">
      <div className="w-8 h-1 bg-slate-300 rounded" />
    </div>
    <div className="px-4 py-3">
      <span className="text-sm font-medium text-slate-700">{block.title || '底部弹层'}</span>
      {block.description && (
        <p className="text-xs text-slate-400 mt-1">{block.description}</p>
      )}
      {block.actions && block.actions.length > 0 && (
        <div className="flex gap-2 mt-2">
          {block.actions.map((action, i) => (
            <ActionTag key={i} text={action} primary={i === 0} />
          ))}
        </div>
      )}
    </div>
  </div>
);

// 渲染 table 类型的块
const renderTable = (block: WireframeBlock) => (
  <div className="bg-white border border-slate-200 rounded-xl m-2 overflow-hidden">
    <div className="px-3 py-2 bg-slate-50 border-b border-slate-200">
      <span className="text-sm font-medium text-slate-700">{block.title}</span>
    </div>
    <table className="w-full">
      <thead>
        <tr className="border-b border-slate-100">
          {block.fields && block.fields.length > 0 ? (
            block.fields.map((field, i) => (
              <th key={i} className="px-3 py-2 text-left text-xs text-slate-500 font-medium">
                {field}
              </th>
            ))
          ) : (
            <>
              <th className="px-3 py-2 text-left text-xs text-slate-500 font-medium">列1</th>
              <th className="px-3 py-2 text-left text-xs text-slate-500 font-medium">列2</th>
              <th className="px-3 py-2 text-left text-xs text-slate-500 font-medium">列3</th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {[1, 2, 3].map((row) => (
          <tr key={row} className="border-b border-slate-50 last:border-0">
            {[1, 2, 3].map((col) => (
              <td key={col} className="px-3 py-2">
                <div className="h-4 bg-slate-100 rounded w-16" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// 渲染 empty-state 类型的块
const renderEmptyState = (block: WireframeBlock) => (
  <div className="flex flex-col items-center justify-center py-8 px-4">
    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
      <span className="text-slate-400">∅</span>
    </div>
    <span className="text-sm text-slate-500">{block.title || '暂无内容'}</span>
    {block.description && (
      <span className="text-xs text-slate-400 mt-1">{block.description}</span>
    )}
  </div>
);

// 渲染 text 类型的块
const renderText = (block: WireframeBlock) => (
  <div className="px-4 py-2">
    <span className="text-xs text-slate-500 leading-relaxed">
      {block.description || block.title}
    </span>
  </div>
);

// 统一渲染入口
export function WireframeBlockRenderer({ block, platform }: WireframeBlockRendererProps) {
  switch (block.type) {
    case 'header':
      return renderHeader(block);
    case 'banner':
      return renderBanner(block);
    case 'nav':
      return renderNav(block);
    case 'card':
      return renderCard(block);
    case 'list':
      return renderList(block);
    case 'form':
      return renderForm(block);
    case 'button':
      return renderButton(block);
    case 'tabs':
      return renderTabs(block);
    case 'modal':
      return renderModal(block);
    case 'bottom-sheet':
      return renderBottomSheet(block);
    case 'table':
      return renderTable(block);
    case 'empty-state':
      return renderEmptyState(block);
    case 'text':
      return renderText(block);
    default:
      return (
        <div className="h-10 bg-slate-50 border border-slate-200 rounded m-2 flex items-center px-3">
          <span className="text-xs text-slate-500">[{block.type}] {block.title}</span>
        </div>
      );
  }
}
