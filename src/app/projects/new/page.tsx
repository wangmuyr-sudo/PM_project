'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProjectStore } from '@/lib/store/project-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import type { PlatformType } from '@/lib/types';

const PLATFORM_OPTIONS: Array<{ value: PlatformType; label: string }> = [
  { value: 'web', label: 'Web 网站' },
  { value: 'h5', label: 'H5 移动端页面' },
  { value: 'app', label: 'App 应用' },
  { value: 'mini-program', label: '小程序' },
];

const INDUSTRY_OPTIONS = [
  { value: 'medical', label: '医疗健康' },
  { value: 'education', label: '教育培训' },
  { value: 'ecommerce', label: '电商零售' },
  { value: 'saas', label: 'SaaS 工具' },
  { value: 'tools', label: '实用工具' },
  { value: 'community', label: '社区社交' },
  { value: 'other', label: '其他' },
];

export default function NewProjectPage() {
  const router = useRouter();
  const createProject = useProjectStore((state) => state.createProject);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    platform: '' as PlatformType | '',
    industry: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入产品名称';
    }

    if (!formData.platform) {
      newErrors.platform = '请选择平台类型';
    }

    if (!formData.industry) {
      newErrors.industry = '请选择行业类型';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const project = createProject({
        name: formData.name.trim(),
        platform: formData.platform as PlatformType,
        industry: formData.industry,
        description: formData.description.trim(),
      });

      router.push(`/projects/${project.id}/input`);
    } catch (error) {
      console.error('Failed to create project:', error);
      setErrors({ submit: '创建项目失败，请重试' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Card>
          <CardHeader>
            <CardTitle>创建新项目</CardTitle>
            <CardDescription>
              填写产品基本信息，开始整理您的产品资产
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  产品名称 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="例如：中医预约小程序"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Platform Type */}
              <div className="space-y-2">
                <Label htmlFor="platform">
                  平台类型 <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) =>
                    setFormData({ ...formData, platform: value as PlatformType })
                  }
                >
                  <SelectTrigger className={errors.platform ? 'border-red-500' : ''}>
                    <SelectValue placeholder="请选择平台类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORM_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.platform && (
                  <p className="text-sm text-red-500">{errors.platform}</p>
                )}
              </div>

              {/* Industry Type */}
              <div className="space-y-2">
                <Label htmlFor="industry">
                  行业类型 <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) =>
                    setFormData({ ...formData, industry: value })
                  }
                >
                  <SelectTrigger className={errors.industry ? 'border-red-500' : ''}>
                    <SelectValue placeholder="请选择行业类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.industry && (
                  <p className="text-sm text-red-500">{errors.industry}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">产品描述</Label>
                <Textarea
                  id="description"
                  placeholder="简要描述产品的核心功能和目标用户..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
                <p className="text-xs text-gray-500">
                  可以在后续步骤中补充更详细的需求说明
                </p>
              </div>

              {/* Error Message */}
              {errors.submit && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                  {errors.submit}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4">
                <Link href="/">
                  <Button type="button" variant="outline">
                    取消
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      创建中...
                    </>
                  ) : (
                    '创建项目'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
