'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useProjectStore, useCurrentProject } from '@/lib/store/project-store';
import { getAIProvider } from '@/lib/ai/ai-client';
import type { FeatureNode, FeatureNodeType, PresentationType, NodeStatus, ConfidenceLevel, ConfirmQuestion } from '@/lib/types';
import { findNodeById, flattenNodes, countNodesByType } from '@/lib/types/feature-tree';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  ArrowLeft, 
  ArrowRight,
  Loader2, 
  ChevronRight, 
  ChevronDown,
  Save,
  FileText,
  Layers,
  FormInput,
  MousePointer,
  Maximize2,
  ArrowUpCircle,
  CircleDot,
  Clock,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';

// 节点类型配置
const NODE_TYPE_CONFIG: Record<FeatureNodeType, { label: string; color: string; bgColor: string }> = {
  page: { label: '页面', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  module: { label: '模块', color: 'text-violet-700', bgColor: 'bg-violet-100' },
  component: { label: '组件', color: 'text-slate-700', bgColor: 'bg-slate-100' },
  field: { label: '字段', color: 'text-slate-700', bgColor: 'bg-slate-100' },
  action: { label: '操作', color: 'text-green-700', bgColor: 'bg-green-100' },
  modal: { label: '弹窗', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  'bottom-sheet': { label: '底部弹层', color: 'text-cyan-700', bgColor: 'bg-cyan-100' },
  drawer: { label: '抽屉', color: 'text-indigo-700', bgColor: 'bg-indigo-100' },
  toast: { label: '提示', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  state: { label: '状态', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  rule: { label: '规则', color: 'text-purple-700', bgColor: 'bg-purple-100' },
};

// 承载形式配置
const PRESENTATION_TYPE_CONFIG: Record<PresentationType, string> = {
  page: '页面',
  modal: '弹窗',
  'bottom-sheet': '底部弹层',
  drawer: '抽屉',
  inline: '内联',
  toast: 'Toast',
  none: '无',
};

// 状态配置
const STATUS_CONFIG: Record<NodeStatus, { label: string; color: string; bgColor: string }> = {
  confirmed: { label: '已确认', color: 'text-green-700', bgColor: 'bg-green-100' },
  pending: { label: '待确认', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  optional: { label: '可选', color: 'text-slate-700', bgColor: 'bg-slate-100' },
  later: { label: '后续版本', color: 'text-gray-700', bgColor: 'bg-gray-100' },
};

// 置信度配置
const CONFIDENCE_CONFIG: Record<ConfidenceLevel, { label: string; color: string; icon: React.ElementType }> = {
  high: { label: '高', color: 'text-green-600', icon: CheckCircle2 },
  medium: { label: '中', color: 'text-amber-600', icon: HelpCircle },
  low: { label: '低', color: 'text-red-600', icon: AlertCircle },
};

// 树形节点组件
function TreeNode({
  node,
  level = 0,
  selectedNodeId,
  onSelectNode,
  expandedNodes,
  toggleExpand,
}: {
  node: FeatureNode;
  level?: number;
  selectedNodeId: string | null;
  onSelectNode: (node: FeatureNode) => void;
  expandedNodes: Set<string>;
  toggleExpand: (nodeId: string) => void;
}) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  const isSelected = selectedNodeId === node.id;
  const typeConfig = NODE_TYPE_CONFIG[node.type];
  const statusConfig = STATUS_CONFIG[node.status];
  const confidenceConfig = CONFIDENCE_CONFIG[node.confidence];

  return (
    <div>
      <div
        className={`flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
          isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelectNode(node)}
      >
        {/* 展开/折叠按钮 */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(node.id);
            }}
            className="p-0.5 hover:bg-gray-200 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}

        {/* 节点名称 */}
        <span className="flex-1 text-sm truncate">{node.name}</span>

        {/* 类型标签 */}
        <Badge variant="outline" className={`text-xs ${typeConfig.bgColor} ${typeConfig.color} border-0`}>
          {typeConfig.label}
        </Badge>

        {/* 状态标签 */}
        <Badge variant="outline" className={`text-xs ${statusConfig.bgColor} ${statusConfig.color} border-0`}>
          {statusConfig.label}
        </Badge>

        {/* 置信度 */}
        <confidenceConfig.icon className={`h-4 w-4 ${confidenceConfig.color}`} />
      </div>

      {/* 子节点 */}
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedNodeId={selectedNodeId}
              onSelectNode={onSelectNode}
              expandedNodes={expandedNodes}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function StructurePage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const project = useCurrentProject();
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
  const setFeatureTree = useProjectStore((state) => state.setFeatureTree);
  const updateFeatureNode = useProjectStore((state) => state.updateFeatureNode);
  const addFeatureNode = useProjectStore((state) => state.addFeatureNode);
  const removeFeatureNode = useProjectStore((state) => state.removeFeatureNode);
  const answerQuestion = useProjectStore((state) => state.answerQuestion);
  const updateProject = useProjectStore((state) => state.updateProject);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // 表单状态
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    type: 'module' as FeatureNodeType,
    presentationType: 'page' as PresentationType,
    status: 'pending' as NodeStatus,
    reason: '',
  });

  // 新增节点表单状态
  const [addMode, setAddMode] = useState<'root' | 'child' | null>(null);
  const [addForm, setAddForm] = useState({
    name: '',
    type: 'module' as FeatureNodeType,
    presentationType: 'inline' as PresentationType,
  });

  // 确保当前项目ID设置正确
  useEffect(() => {
    if (projectId) {
      setCurrentProject(projectId);
    }
  }, [projectId, setCurrentProject]);

  // 如果没有 featureTree，自动生成
  useEffect(() => {
    const generateTree = async () => {
      if (project && !project.featureTree && !isLoading) {
        setIsLoading(true);
        try {
          const ai = getAIProvider();
          const tree = await ai.generateFeatureTree({
            productUnderstanding: project.productUnderstanding!,
            project: {
              name: project.name,
              platform: project.platform,
              industry: project.industry,
              description: project.description,
            },
          });
          setFeatureTree(projectId, tree);
          // 默认展开所有节点
          const allNodeIds = new Set(flattenNodes(tree.nodes).map((n) => n.id));
          setExpandedNodes(allNodeIds);
        } catch (error) {
          console.error('Failed to generate feature tree:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    generateTree();
  }, [project?.id, project?.featureTree, isLoading, projectId, setFeatureTree]);

  // 获取选中的节点
  const selectedNode = useMemo(() => {
    if (!project?.featureTree || !selectedNodeId) return null;
    return findNodeById(project.featureTree.nodes, selectedNodeId);
  }, [project?.featureTree?.nodes, selectedNodeId]);

  // 计算功能范围统计
  const scopeStats = useMemo(() => {
    if (!project?.featureTree) return null;
    const nodes = project.featureTree.nodes;
    const typeCounts = countNodesByType(nodes);

    // 递归统计状态
    const countByStatus = (nodes: FeatureNode[]): Record<NodeStatus, number> => {
      const counts: Record<NodeStatus, number> = { confirmed: 0, pending: 0, optional: 0, later: 0 };
      const traverse = (node: FeatureNode) => {
        counts[node.status]++;
        node.children?.forEach(traverse);
      };
      nodes.forEach(traverse);
      return counts;
    };

    const statusCounts = countByStatus(nodes);

    return {
      total: flattenNodes(nodes).length,
      page: typeCounts.page,
      module: typeCounts.module,
      field: typeCounts.field,
      action: typeCounts.action,
      modal: typeCounts.modal + typeCounts['bottom-sheet'] + typeCounts.drawer,
      state: typeCounts.state,
      rule: typeCounts.rule,
      pending: statusCounts.pending,
      optional: statusCounts.optional,
      later: statusCounts.later,
    };
  }, [project?.featureTree]);

  // 当选中节点变化时，更新表单
  useEffect(() => {
    if (selectedNode) {
      setEditForm({
        name: selectedNode.name,
        description: selectedNode.description || '',
        type: selectedNode.type,
        presentationType: selectedNode.presentationType,
        status: selectedNode.status,
        reason: selectedNode.reason || '',
      });
    }
  }, [selectedNode]);

  // 如果项目不存在，显示错误
  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>项目不存在</CardTitle>
            <CardDescription>该项目可能已被删除或不存在</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button>返回首页</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 切换节点展开状态
  const toggleExpand = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  // 选择节点
  const handleSelectNode = (node: FeatureNode) => {
    setSelectedNodeId(node.id);
  };

  // 功能结构图变更后，清空下游交付物
  const invalidateAfterFeatureTreeChange = () => {
    updateProject(projectId, {
      pageList: undefined,
      flows: undefined,
      wireframes: undefined,
      prd: undefined,
      devHandoff: undefined,
    });
  };

  // 保存节点修改
  const handleSaveNode = () => {
    if (!selectedNodeId) return;
    updateFeatureNode(projectId, selectedNodeId, {
      name: editForm.name,
      description: editForm.description,
      type: editForm.type,
      presentationType: editForm.presentationType,
      status: editForm.status,
      reason: editForm.reason,
    });
    invalidateAfterFeatureTreeChange();
  };

  // 回答问题
  const handleAnswerQuestion = (questionId: string, answer: string) => {
    if (!selectedNodeId) return;
    answerQuestion(projectId, selectedNodeId, questionId, answer);
    invalidateAfterFeatureTreeChange();
  };

  // 新增根节点
  const handleAddRootNode = () => {
    if (!addForm.name.trim()) return;
    const newNode: Omit<FeatureNode, 'id'> = {
      name: addForm.name.trim(),
      type: addForm.type,
      presentationType: addForm.presentationType,
      status: 'pending',
      confidence: 'low',
      description: '',
      reason: '用户手动新增，需进一步确认。',
      children: [],
    };
    const addedNode = addFeatureNode(projectId, null, newNode);
    if (addedNode) {
      setSelectedNodeId(addedNode.id);
      setExpandedNodes((prev) => new Set([...prev, addedNode.id]));
    }
    setAddForm({ name: '', type: 'module', presentationType: 'inline' });
    setAddMode(null);
    invalidateAfterFeatureTreeChange();
  };

  // 新增子节点
  const handleAddChildNode = () => {
    if (!selectedNodeId || !addForm.name.trim()) return;
    const newNode: Omit<FeatureNode, 'id'> = {
      name: addForm.name.trim(),
      type: addForm.type,
      presentationType: addForm.presentationType,
      status: 'pending',
      confidence: 'low',
      description: '',
      reason: '用户手动新增，需进一步确认。',
      children: [],
    };
    const addedNode = addFeatureNode(projectId, selectedNodeId, newNode);
    if (addedNode) {
      setSelectedNodeId(addedNode.id);
      setExpandedNodes((prev) => new Set([...prev, selectedNodeId, addedNode.id]));
    }
    setAddForm({ name: '', type: 'module', presentationType: 'inline' });
    setAddMode(null);
    invalidateAfterFeatureTreeChange();
  };

  // 删除节点
  const handleDeleteNode = () => {
    if (!selectedNodeId) return;
    const confirmed = window.confirm('确定要删除该节点及其所有子节点吗？此操作不可撤销。');
    if (!confirmed) return;
    removeFeatureNode(projectId, selectedNodeId);
    setSelectedNodeId(null);
    invalidateAfterFeatureTreeChange();
  };

  // 下一步：保存当前节点后跳转
  const handleNextStep = () => {
    if (selectedNodeId) {
      handleSaveNode();
    }
    router.push(`/projects/${projectId}/pages`);
  };

  // 展开所有节点
  const expandAllNodes = () => {
    if (project.featureTree) {
      const allNodeIds = new Set(flattenNodes(project.featureTree.nodes).map((n) => n.id));
      setExpandedNodes(allNodeIds);
    }
  };

  // 折叠所有节点
  const collapseAllNodes = () => {
    setExpandedNodes(new Set());
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/projects/${projectId}/analysis`}
                className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                返回分析结果
              </Link>
              <h1 className="text-lg font-semibold">{project.name} - 功能结构图</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/projects/${projectId}/analysis`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  返回分析结果
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSaveNode} disabled={!selectedNodeId}>
                <Save className="mr-2 h-4 w-4" />
                保存
              </Button>
              <Button size="sm" onClick={handleNextStep}>
                下一步：生成页面清单
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Three Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Feature Tree */}
        <div className="w-1/4 border-r bg-white overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-sm">功能结构树</h2>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-7 text-xs text-green-600" onClick={() => setAddMode('root')}>
                  + 新增根节点
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={expandAllNodes}>
                  全部展开
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={collapseAllNodes}>
                  全部折叠
                </Button>
              </div>
            </div>
          </div>

          {/* 功能范围统计 */}
          {scopeStats && (
            <div className="px-4 py-2 border-b bg-blue-50">
              <div className="text-xs text-blue-700 font-medium mb-1.5">功能范围</div>
              <div className="grid grid-cols-3 gap-x-3 gap-y-0.5 text-xs">
                <span>页面 <span className="font-medium">{scopeStats.page}</span></span>
                <span>模块 <span className="font-medium">{scopeStats.module}</span></span>
                <span>字段 <span className="font-medium">{scopeStats.field}</span></span>
                <span>操作 <span className="font-medium">{scopeStats.action}</span></span>
                <span>弹层 <span className="font-medium">{scopeStats.modal}</span></span>
                <span>状态 <span className="font-medium">{scopeStats.state}</span></span>
                <span>规则 <span className="font-medium">{scopeStats.rule}</span></span>
                <span className="text-amber-600">待确认 <span className="font-medium">{scopeStats.pending}</span></span>
                <span className="text-slate-500">可选 <span className="font-medium">{scopeStats.optional}</span></span>
                <span className="text-slate-500">后续 <span className="font-medium">{scopeStats.later}</span></span>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-auto p-2">
            {addMode === 'root' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3 space-y-3">
                <div className="text-sm font-medium text-green-700">新增根节点</div>
                <Input
                  placeholder="节点名称（必填）"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="h-8 text-sm"
                />
                <div className="flex gap-2">
                  <Select
                    value={addForm.type}
                    onValueChange={(value: FeatureNodeType) => setAddForm({ ...addForm, type: value })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(NODE_TYPE_CONFIG).map(([type, config]) => (
                        <SelectItem key={type} value={type}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={addForm.presentationType}
                    onValueChange={(value: PresentationType) => setAddForm({ ...addForm, presentationType: value })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PRESENTATION_TYPE_CONFIG).map(([type, label]) => (
                        <SelectItem key={type} value={type}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="h-7 text-xs flex-1" onClick={handleAddRootNode}>
                    确定新增
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setAddMode(null); setAddForm({ name: '', type: 'module', presentationType: 'inline' }); }}>
                    取消
                  </Button>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">正在生成功能结构图...</span>
              </div>
            ) : project.featureTree ? (
              <div className="space-y-0.5">
                {project.featureTree.nodes.map((node) => (
                  <TreeNode
                    key={node.id}
                    node={node}
                    selectedNodeId={selectedNodeId}
                    onSelectNode={handleSelectNode}
                    expandedNodes={expandedNodes}
                    toggleExpand={toggleExpand}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                暂无功能结构图
              </div>
            )}
          </div>
        </div>

        {/* Middle: Node Details */}
        <div className="w-2/5 border-r bg-white overflow-auto">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-medium text-sm">节点详情</h2>
          </div>
          <div className="p-4">
            {selectedNode ? (
              <div className="space-y-4">
                {/* 节点名称 */}
                <div className="space-y-2">
                  <Label htmlFor="name">节点名称</Label>
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>

                {/* 节点描述 */}
                <div className="space-y-2">
                  <Label htmlFor="description">节点描述</Label>
                  <Textarea
                    id="description"
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* 节点类型 */}
                <div className="space-y-2">
                  <Label>节点类型</Label>
                  <Select
                    value={editForm.type}
                    onValueChange={(value: FeatureNodeType) => 
                      setEditForm({ ...editForm, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(NODE_TYPE_CONFIG).map(([type, config]) => (
                        <SelectItem key={type} value={type}>
                          <span className={`${config.color} ${config.bgColor} px-1.5 py-0.5 rounded text-xs`}>
                            {config.label}
                          </span>
                          <span className="ml-2">{type}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 承载形式 */}
                <div className="space-y-2">
                  <Label>承载形式</Label>
                  <Select
                    value={editForm.presentationType}
                    onValueChange={(value: PresentationType) => 
                      setEditForm({ ...editForm, presentationType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PRESENTATION_TYPE_CONFIG).map(([type, label]) => (
                        <SelectItem key={type} value={type}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 状态 */}
                <div className="space-y-2">
                  <Label>状态</Label>
                  <Select
                    value={editForm.status}
                    onValueChange={(value: NodeStatus) => 
                      setEditForm({ ...editForm, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                        <SelectItem key={status} value={status}>
                          <span className={`${config.color} ${config.bgColor} px-1.5 py-0.5 rounded text-xs`}>
                            {config.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 置信度（只读） */}
                <div className="space-y-2">
                  <Label>置信度</Label>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const config = CONFIDENCE_CONFIG[selectedNode.confidence];
                      const Icon = config.icon;
                      return (
                        <>
                          <Icon className={`h-4 w-4 ${config.color}`} />
                          <span className={`text-sm ${config.color}`}>{config.label}</span>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* 判断理由 */}
                <div className="space-y-2">
                  <Label htmlFor="reason">判断理由</Label>
                  <Textarea
                    id="reason"
                    value={editForm.reason}
                    onChange={(e) => setEditForm({ ...editForm, reason: e.target.value })}
                    rows={2}
                    placeholder="为什么识别为该类型..."
                  />
                </div>

                {/* 保存按钮 */}
                <Button onClick={handleSaveNode} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  保存修改
                </Button>

                {/* 新增子节点按钮 */}
                <Button
                  variant="outline"
                  className="w-full text-green-600 border-green-200 hover:bg-green-50"
                  onClick={() => setAddMode('child')}
                >
                  + 新增子节点
                </Button>

                {/* 删除节点按钮 */}
                <Button
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  onClick={handleDeleteNode}
                >
                  删除当前节点
                </Button>

                {/* 新增子节点表单 */}
                {addMode === 'child' && selectedNode && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-3">
                    <div className="text-sm font-medium text-green-700">新增子节点</div>
                    <Input
                      placeholder="节点名称（必填）"
                      value={addForm.name}
                      onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                      className="h-8 text-sm"
                    />
                    <div className="flex gap-2">
                      <Select
                        value={addForm.type}
                        onValueChange={(value: FeatureNodeType) => setAddForm({ ...addForm, type: value })}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(NODE_TYPE_CONFIG).map(([type, config]) => (
                            <SelectItem key={type} value={type}>
                              {config.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={addForm.presentationType}
                        onValueChange={(value: PresentationType) => setAddForm({ ...addForm, presentationType: value })}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PRESENTATION_TYPE_CONFIG).map(([type, label]) => (
                            <SelectItem key={type} value={type}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="h-7 text-xs flex-1" onClick={handleAddChildNode}>
                        确定新增
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setAddMode(null); setAddForm({ name: '', type: 'module', presentationType: 'inline' }); }}>
                        取消
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 text-sm">
                <Layers className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>请在左侧选择一个节点</p>
                <p className="text-xs mt-1">查看和编辑节点详情</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Questions */}
        <div className="w-1/3 bg-white overflow-auto">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-medium text-sm">待确认问题</h2>
          </div>
          <div className="p-4">
            {selectedNode?.questions && selectedNode.questions.length > 0 ? (
              <div className="space-y-4">
                {selectedNode.questions.map((question) => (
                  <Card key={question.id}>
                    <CardHeader className="pb-2">
                      <CardDescription className="text-xs text-gray-500">
                        影响范围：{question.impact}
                      </CardDescription>
                      <CardTitle className="text-sm font-medium leading-relaxed">
                        {question.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {question.options ? (
                        <div className="space-y-1.5">
                          {question.options.map((option) => (
                            <Button
                              key={option}
                              variant={question.answer === option ? 'default' : 'outline'}
                              size="sm"
                              className="w-full justify-start text-left h-auto py-2 px-3"
                              onClick={() => handleAnswerQuestion(question.id, option)}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <Textarea
                          placeholder="请输入回答..."
                          value={question.answer || ''}
                          onChange={(e) => handleAnswerQuestion(question.id, e.target.value)}
                          rows={2}
                        />
                      )}
                      {question.answer && (
                        <p className="text-xs text-green-600">
                          已选择：{question.answer}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : selectedNode ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>该节点暂无待确认问题</p>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 text-sm">
                <HelpCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>选择包含问题的节点</p>
                <p className="text-xs mt-1">以查看和回答待确认问题</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
