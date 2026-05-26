'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useCurrentProject, useProjectStore } from '@/lib/store/project-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  ArrowRight, 
  Target, 
  Users, 
  Smartphone, 
  MapPin,
  FileText,
  Layers,
  AlertCircle,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export default function AnalysisPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const project = useCurrentProject();
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);

  // 确保当前项目ID设置正确
  useEffect(() => {
    if (projectId) {
      setCurrentProject(projectId);
    }
  }, [projectId, setCurrentProject]);

  // 如果项目不存在，返回首页
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

  // 如果没有分析结果，返回输入页
  if (!project.productUnderstanding) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>暂无分析结果</CardTitle>
            <CardDescription>请先输入资料并进行分析</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/projects/${projectId}/input`}>
              <Button>前往输入资料</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const understanding = project.productUnderstanding;

  const getConfidenceConfig = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return {
          label: '高',
          color: 'bg-green-100 text-green-700',
          icon: CheckCircle2,
        };
      case 'medium':
        return {
          label: '中',
          color: 'bg-amber-100 text-amber-700',
          icon: HelpCircle,
        };
      case 'low':
        return {
          label: '低',
          color: 'bg-red-100 text-red-700',
          icon: AlertCircle,
        };
      default:
        return {
          label: '未知',
          color: 'bg-gray-100 text-gray-700',
          icon: HelpCircle,
        };
    }
  };

  const confidenceConfig = getConfidenceConfig(understanding.confidence);
  const ConfidenceIcon = confidenceConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/projects/${projectId}/input`}
              className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              返回输入资料
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{project.name}</span>
              <Badge variant="outline">分析结果</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">产品理解分析结果</h1>
          <p className="mt-2 text-gray-600">
            AI 已分析您输入的资料，以下是识别出的产品结构
          </p>
        </div>

        <div className="grid gap-6">
          {/* Product Problem */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-5 w-5 text-blue-500" />
                产品解决的问题
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{understanding.problem}</p>
            </CardContent>
          </Card>

          {/* Target Users & Product Type */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-5 w-5 text-violet-500" />
                  目标用户
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {understanding.targetUsers.map((user, index) => (
                    <Badge key={index} variant="secondary">
                      {user}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Smartphone className="h-5 w-5 text-cyan-500" />
                  产品类型
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{understanding.productType}</p>
              </CardContent>
            </Card>
          </div>

          {/* Scenarios */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-5 w-5 text-green-500" />
                使用场景
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {understanding.scenarios.map((scenario, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500" />
                    <span className="text-gray-700">{scenario}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Recognized Pages */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5 text-blue-500" />
                识别出的页面
              </CardTitle>
              <CardDescription>
                从输入资料中识别出的核心页面
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {understanding.recognizedPages.map((page, index) => (
                  <Badge key={index} variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                    {page}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recognized Modules */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Layers className="h-5 w-5 text-violet-500" />
                识别出的模块
              </CardTitle>
              <CardDescription>
                从输入资料中识别出的功能模块
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {understanding.recognizedModules.map((module, index) => (
                  <Badge key={index} variant="outline" className="border-violet-200 bg-violet-50 text-violet-700">
                    {module}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Confidence & Assumptions */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ConfidenceIcon className="h-5 w-5" />
                  分析置信度
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={confidenceConfig.color}>
                  {confidenceConfig.label}置信度
                </Badge>
                <p className="mt-3 text-sm text-gray-600">
                  {understanding.confidence === 'high' 
                    ? '分析结果较为确定，可以直接进入下一步'
                    : understanding.confidence === 'medium'
                    ? '部分内容需要确认，建议检查假设项'
                    : '分析结果不确定，请仔细核对假设项'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  假设项
                </CardTitle>
                <CardDescription>
                  AI 推测的内容，需要您确认
                </CardDescription>
              </CardHeader>
              <CardContent>
                {understanding.assumptions.length > 0 ? (
                  <ul className="space-y-2">
                    {understanding.assumptions.map((assumption, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <HelpCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                        <span className="text-gray-700">{assumption}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">暂无假设项</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between">
          <Link href={`/projects/${projectId}/input`}>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回输入资料
            </Button>
          </Link>
          <Link href={`/projects/${projectId}/structure`}>
            <Button>
              下一步：生成功能结构图
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
