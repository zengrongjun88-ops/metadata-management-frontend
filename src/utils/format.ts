import dayjs from 'dayjs';
import { DATE_TIME_FORMAT, DATE_FORMAT } from '../constants';

/**
 * 格式化日期时间
 */
export function formatDateTime(dateTime?: string | Date | null): string {
  if (!dateTime) return '-';
  return dayjs(dateTime).format(DATE_TIME_FORMAT);
}

/**
 * 格式化日期
 */
export function formatDate(date?: string | Date | null): string {
  if (!date) return '-';
  return dayjs(date).format(DATE_FORMAT);
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes?: number | null): string {
  if (!bytes || bytes === 0) return '-';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * 格式化数字（添加千分位分隔符）
 */
export function formatNumber(num?: number | null): string {
  if (!num && num !== 0) return '-';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 解析JSON字符串，失败时返回默认值
 */
export function parseJSON<T = any>(jsonStr?: string | null, defaultValue: T = [] as T): T {
  if (!jsonStr) return defaultValue;

  try {
    return JSON.parse(jsonStr) as T;
  } catch (error) {
    console.error('JSON parse error:', error);
    return defaultValue;
  }
}

/**
 * 将对象转换为JSON字符串
 */
export function stringifyJSON(obj: any): string {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.error('JSON stringify error:', error);
    return '';
  }
}

/**
 * 获取枚举显示文本
 */
export function getEnumLabel(
  value: string | undefined,
  options: Array<{ label: string; value: string }>
): string {
  if (!value) return '-';
  const option = options.find((opt) => opt.value === value);
  return option?.label || value;
}

/**
 * 截取字符串
 */
export function truncateString(str: string, maxLength: number): string {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
}

/**
 * 高亮搜索关键词
 */
export function highlightKeyword(text: string, keyword: string): string {
  if (!keyword) return text;
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}
