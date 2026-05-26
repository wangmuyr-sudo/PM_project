/**
 * 日期工具函数
 */

/**
 * 格式化相对时间
 */
export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (seconds < 60) {
    return '几秒';
  }
  if (minutes < 60) {
    return `${minutes}分钟`;
  }
  if (hours < 24) {
    return `${hours}小时`;
  }
  if (days < 7) {
    return `${days}天`;
  }
  if (weeks < 4) {
    return `${weeks}周`;
  }
  if (months < 12) {
    return `${months}个月`;
  }
  
  return `${Math.floor(months / 12)}年`;
}

/**
 * 格式化日期
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 格式化日期时间
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
