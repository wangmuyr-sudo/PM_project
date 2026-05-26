'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useProjectStore, useCurrentProject } from '@/lib/store/project-store';
import { getAIProvider } from '@/lib/ai/ai-client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Loader2, 
  Upload, 
  Image as ImageIcon, 
  FileText,
  Trash2 
} from 'lucide-react';

export default function InputPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const project = useCurrentProject();
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
  const addInputSource = useProjectStore((state) => state.addInputSource);
  const removeInputSource = useProjectStore((state) => state.removeInputSource);
  const setProductUnderstanding = useProjectStore((state) => state.setProductUnderstanding);

  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 确保当前项目ID设置正确
  useEffect(() => {
    if (projectId) {
      setCurrentProject(projectId);
    }
  }, [projectId, setCurrentProject]);

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

  // 获取已上传的图片
  const imageSources = project.inputSources.filter((s) => s.type === 'image');

  // 判断是否有输入内容（文本框有内容或有上传的图片）
  const hasInput = textInput.trim().length > 0 || imageSources.length > 0;

  // 处理图片上传
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        continue;
      }

      const fileId = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setUploadingFiles((prev) => [...prev, fileId]);

      try {
        // 读取文件为 base64 用于预览
        const reader = new FileReader();
        reader.onload = (event) => {
          const previewUrl = event.target?.result as string;
          addInputSource(projectId, {
            type: 'image',
            name: file.name,
            previewUrl,
          });
          setUploadingFiles((prev) => prev.filter((id) => id !== fileId));
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Failed to upload file:', error);
        setUploadingFiles((prev) => prev.filter((id) => id !== fileId));
      }
    }

    // 重置 input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 删除输入源
  const handleRemoveSource = (sourceId: string) => {
    removeInputSource(projectId, sourceId);
  };

  // 开始分析
  const handleStartAnalysis = async () => {
    if (!hasInput) return;

    setIsAnalyzing(true);

    try {
      const ai = getAIProvider();

      // 如果文本框有内容，先保存到 inputSources
      if (textInput.trim()) {
        addInputSource(projectId, {
          type: 'text',
          content: textInput.trim(),
        });
      }

      // 调用 AI 分析
      const understanding = await ai.analyzeInput({
        productName: project.name,
        platform: project.platform,
        industry: project.industry,
        description: project.description,
        textInput: textInput.trim() || undefined,
        screenshotDescriptions: imageSources.length > 0 
          ? [`已上传 ${imageSources.length} 张截图`] 
          : undefined,
      });

      // 保存分析结果
      setProductUnderstanding(projectId, understanding);

      // 跳转到分析结果页
      router.push(`/projects/${projectId}/analysis`);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('分析失败，请重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getPlatformLabel = (platform: string): string => {
    const labels: Record<string, string> = {
      web: 'Web 网站',
      h5: 'H5 移动端',
      app: 'App 应用',
      'mini-program': '小程序',
    };
    return labels[platform] || platform;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Project Info */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription className="mt-1">
                  {project.description || '暂无描述'}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">{getPlatformLabel(project.platform)}</Badge>
                <Badge variant="secondary">{project.industry}</Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Input Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Text Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                文本需求
              </CardTitle>
              <CardDescription>
                输入产品需求描述、功能说明或想法
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="例如：&#10;我要做一个中医预约小程序。&#10;页面有：首页、医生列表页、医生详情页、预约确认页、我的预约页、个人中心。&#10;医生列表页需要搜索框、科室筛选、医生卡片、评分、擅长领域、预约按钮。"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={8}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                截图上传
              </CardTitle>
              <CardDescription>
                上传页面截图、原型图或参考图片
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                className="w-full h-24 border-dashed"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-6 w-6 text-gray-400" />
                  <span className="text-sm text-gray-500">点击或拖拽上传图片</span>
                </div>
              </Button>

              {/* Image Preview Grid */}
              {imageSources.length > 0 && (
                <div className="grid grid-cols-2 gap-3 pt-4">
                  {imageSources.map((source) => (
                    <div
                      key={source.id}
                      className="group relative aspect-video overflow-hidden rounded-md border bg-gray-100"
                    >
                      {source.previewUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={source.previewUrl}
                          alt={source.name || '截图'}
                          className="h-full w-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveSource(source.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {source.name && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                          <p className="truncate text-xs text-white">{source.name}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Uploading Indicator */}
              {uploadingFiles.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  正在上传...
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between items-center">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            {!hasInput && (
              <span className="text-sm text-gray-500">请先输入需求或上传截图</span>
            )}
            <Button
              onClick={handleStartAnalysis}
              disabled={!hasInput || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  分析中...
                </>
              ) : (
                '开始分析'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
