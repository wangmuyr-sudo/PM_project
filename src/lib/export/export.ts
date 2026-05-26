/**
 * 导出功能
 */

import type { Project } from "../types";

/**
 * 导出项目为 JSON
 */
export function exportProjectJSON(project: Project): string {
  return JSON.stringify(project, null, 2);
}

/**
 * 导出 PRD 为 Markdown
 */
export function exportPRDMarkdown(prd: string): string {
  return prd;
}

/**
 * 导出研发说明为 Markdown
 */
export function exportDevHandoffMarkdown(handoff: string): string {
  return handoff;
}

/**
 * 下载文件
 */
export function downloadFile(content: string, filename: string, type: string = "text/plain"): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 下载项目 JSON
 */
export function downloadProjectJSON(project: Project): void {
  const content = exportProjectJSON(project);
  downloadFile(content, `${project.name}-project.json`, "application/json");
}

/**
 * 下载 PRD Markdown
 */
export function downloadPRD(projectName: string, prd: string): void {
  downloadFile(prd, `${projectName}-PRD.md`, "text/markdown");
}

/**
 * 下载研发说明 Markdown
 */
export function downloadDevHandoff(projectName: string, handoff: string): void {
  downloadFile(handoff, `${projectName}-研发说明.md`, "text/markdown");
}

/**
 * 复制到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // 降级方案
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  }
}
