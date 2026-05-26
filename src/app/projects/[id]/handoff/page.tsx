'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useProjectStore, useProjectById } from '@/lib/store/project-store';
import { getAIProvider } from '@/lib/ai/ai-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HandoffPage() {
  const params = useParams();
  const projectId = params.id as string;

  const project = useProjectById(projectId);
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [devHandoffContent, setDevHandoffContent] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (projectId) {
      setCurrentProject(projectId);
    }
  }, [projectId, setCurrentProject]);

  const generateDevHandoff = useCallback(async () => {
    // 检查前置条件
    if (!project?.featureTree) {
      console.error('缺少功能结构图，无法生成研发说明');
      return;
    }
    if (!project?.pageList || project.pageList.length === 0) {
      console.error('缺少页面清单，无法生成研发说明');
      return;
    }
    if (!project?.flows || project.flows.length === 0) {
      console.error('缺少跳转关系，无法生成研发说明');
      return;
    }
    if (!project?.wireframes || project.wireframes.length === 0) {
      console.error('缺少线框图，无法生成研发说明');
      return;
    }
    if (!project?.prd || project.prd.length === 0) {
      console.error('缺少 PRD，无法生成研发说明');
      return;
    }

    setIsLoading(true);
    try {
      const ai = getAIProvider();
      const devHandoff = await ai.generateDevHandoff({
        featureTree: project.featureTree,
        pageList: project.pageList,
        flows: project.flows,
        project: { name: project.name },
      });
      setDevHandoffContent(devHandoff);
      // 保存到 Store
      updateProject(projectId, { devHandoff });
    } catch (error) {
      console.error('生成研发说明失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [project, projectId, updateProject]);

  // 加载或生成研发说明
  useEffect(() => {
    if (!project) return;

    if (project.devHandoff && project.devHandoff.length > 0) {
      setDevHandoffContent(project.devHandoff);
    } else {
      // 自动生成研发说明
      generateDevHandoff();
    }
  }, [project, generateDevHandoff]);

  const handleSave = () => {
    updateProject(projectId, { devHandoff: devHandoffContent });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(devHandoffContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  const handleExport = () => {
    const blob = new Blob([devHandoffContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project?.name || '产品'}-研发说明.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (!project) return;

    const exportData = {
      id: project.id,
      name: project.name,
      description: project.description,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      inputSources: project.inputSources,
      productUnderstanding: project.productUnderstanding,
      featureTree: project.featureTree,
      pageList: project.pageList,
      flows: project.flows,
      wireframes: project.wireframes,
      prd: project.prd,
      devHandoff: project.devHandoff,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name}-project.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  // 简单的 Markdown 渲染
  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactElement[] = [];
    let inCodeBlock = false;
    let codeContent: string[] = [];
    let listItems: string[] = [];
    let listType = '';
    let tableRows: string[] = [];
    let inTable = false;

    const flushList = () => {
      if (listItems.length > 0) {
        if (listType === 'ul') {
          elements.push(
            <ul key={elements.length} className="list-disc list-inside my-2">
              {listItems.map((item, i) => (
                <li key={i} className="text-gray-700">{renderInline(item)}</li>
              ))}
            </ul>
          );
        } else if (listType === 'ol') {
          elements.push(
            <ol key={elements.length} className="list-decimal list-inside my-2">
              {listItems.map((item, i) => (
                <li key={i} className="text-gray-700">{renderInline(item)}</li>
              ))}
            </ol>
          );
        }
        listItems = [];
        listType = '';
      }
    };

    const flushTable = () => {
      if (tableRows.length > 0) {
        const headers = tableRows[0].split('|').filter((c) => c.trim());
        const rows = tableRows.slice(2).filter((r) => r.trim());
        elements.push(
          <div key={elements.length} className="overflow-x-auto my-4">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  {headers.map((h, i) => (
                    <th key={i} className="border border-gray-300 px-4 py-2 text-left font-semibold">{h.trim()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.split('|').filter((c) => c.trim()).map((cell, ci) => (
                      <td key={ci} className="border border-gray-300 px-4 py-2">{cell.trim()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    const renderInline = (text: string): React.ReactElement[] => {
      const parts: React.ReactElement[] = [];
      let remaining = text;
      let key = 0;

      while (remaining.length > 0) {
        // Bold
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
        if (boldMatch && boldMatch.index !== undefined) {
          if (boldMatch.index > 0) {
            parts.push(<span key={key++}>{remaining.slice(0, boldMatch.index)}</span>);
          }
          parts.push(<strong key={key++}>{boldMatch[1]}</strong>);
          remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
          continue;
        }
        // Inline code
        const codeMatch = remaining.match(/`(.+?)`/);
        if (codeMatch && codeMatch.index !== undefined) {
          if (codeMatch.index > 0) {
            parts.push(<span key={key++}>{remaining.slice(0, codeMatch.index)}</span>);
          }
          parts.push(<code key={key++} className="bg-gray-100 px-1 rounded text-sm">{codeMatch[1]}</code>);
          remaining = remaining.slice(codeMatch.index + codeMatch[0].length);
          continue;
        }
        break;
      }

      if (parts.length === 0) {
        parts.push(<span key={0}>{remaining}</span>);
      }

      return parts;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code block
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={elements.length} className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">
              <code>{codeContent.join('\n')}</code>
            </pre>
          );
          codeContent = [];
        } else {
          flushList();
          flushTable();
        }
        inCodeBlock = !inCodeBlock;
        continue;
      }
      if (inCodeBlock) {
        codeContent.push(line);
        continue;
      }

      // Table
      if (line.includes('|') && line.trim().startsWith('|')) {
        flushList();
        if (!inTable && line.includes('---')) {
          inTable = true;
          continue;
        }
        if (!inTable) {
          tableRows.push(line);
          continue;
        }
        if (inTable && line.includes('|')) {
          tableRows.push(line);
          continue;
        }
      } else if (inTable) {
        flushTable();
      }

      // Heading 1
      if (line.startsWith('# ')) {
        flushList();
        flushTable();
        elements.push(<h1 key={elements.length} className="text-2xl font-bold mt-6 mb-4">{line.slice(2)}</h1>);
        continue;
      }
      // Heading 2
      if (line.startsWith('## ')) {
        flushList();
        flushTable();
        elements.push(<h2 key={elements.length} className="text-xl font-bold mt-5 mb-3">{line.slice(3)}</h2>);
        continue;
      }
      // Heading 3
      if (line.startsWith('### ')) {
        flushList();
        flushTable();
        elements.push(<h3 key={elements.length} className="text-lg font-semibold mt-4 mb-2">{line.slice(4)}</h3>);
        continue;
      }
      // Heading 4
      if (line.startsWith('#### ')) {
        flushList();
        flushTable();
        elements.push(<h4 key={elements.length} className="text-base font-semibold mt-3 mb-2">{line.slice(5)}</h4>);
        continue;
      }

      // Unordered list
      if (line.match(/^[\-\*] /)) {
        flushTable();
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        listItems.push(line.slice(2));
        continue;
      }
      // Ordered list
      if (line.match(/^\d+\. /)) {
        flushTable();
        if (listType !== 'ol') {
          flushList();
          listType = 'ol';
        }
        listItems.push(line.replace(/^\d+\. /, ''));
        continue;
      }

      // Empty line
      if (line.trim() === '') {
        flushList();
        flushTable();
        continue;
      }

      // Paragraph
      flushList();
      flushTable();
      elements.push(<p key={elements.length} className="text-gray-700 my-2">{renderInline(line)}</p>);
    }

    flushList();
    flushTable();

    return elements;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/projects/${projectId}/prd`}>
              <Button variant="outline">返回 PRD</Button>
            </Link>
            <h1 className="text-xl font-semibold">{project.name} - 研发说明</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleSave} variant="outline">保存研发说明</Button>
            <Button onClick={handleCopy} variant="outline">
              {copySuccess ? '已复制' : '复制研发说明'}
            </Button>
            <Button onClick={handleExport} variant="outline">导出 Markdown</Button>
            <Button onClick={handleExportJSON} variant="outline">导出完整项目 JSON</Button>
            <Button onClick={generateDevHandoff} disabled={isLoading} variant="outline">
              {isLoading ? '正在重新生成...' : '重新生成研发说明'}
            </Button>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* 研发说明说明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            这份研发说明用于帮助研发理解页面、模块、字段、操作、接口和 Mock 边界，不是 PRD 的重复版本。
          </p>
        </div>

        {/* 研发说明完整性检查 */}
        {(() => {
          const requiredChapters = [
            '页面总览',
            '页面与模块说明',
            '字段说明',
            '操作与跳转',
            '状态与异常',
            '接口建议',
            'Mock 数据建议',
            'MVP 范围',
            '后续版本范围',
            '研发注意事项',
          ];
          const found = requiredChapters.filter((c) => devHandoffContent.includes(c));
          const missing = requiredChapters.filter((c) => !devHandoffContent.includes(c));
          return (
            <div className="bg-white rounded-lg border p-4 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-medium">研发说明完整性检查</h2>
                <span className="text-sm text-gray-500">
                  已包含 {found.length} / {requiredChapters.length} 个章节
                </span>
              </div>
              {missing.length === 0 ? (
                <p className="text-sm text-green-600">✅ 研发说明章节完整，所有 10 个章节均已包含</p>
              ) : (
                <div>
                  <p className="text-sm text-amber-600 mb-2">⚠️ 缺少以下章节：</p>
                  <div className="flex flex-wrap gap-1">
                    {missing.map((chapter) => (
                      <Badge key={chapter} variant="outline" className="text-xs text-amber-600 border-amber-300">
                        {chapter}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p>正在生成研发说明...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border p-8 shadow-sm">
            <article className="prose prose-gray max-w-none">
              {renderMarkdown(devHandoffContent)}
            </article>
          </div>
        )}
      </main>
    </div>
  );
}
