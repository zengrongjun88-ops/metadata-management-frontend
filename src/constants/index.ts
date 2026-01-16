/**
 * Mock模式开关（开发验收时使用）
 * true: 使用Mock数据，不依赖后端服务
 * false: 使用真实API，需要后端服务运行
 */
export const USE_MOCK = true;

/**
 * API基础地址
 */
export const API_BASE_URL = '/api';

/**
 * 默认分页大小
 */
export const DEFAULT_PAGE_SIZE = 10;

/**
 * 默认页码
 */
export const DEFAULT_PAGE_NUM = 1;

/**
 * 分页大小选项
 */
export const PAGE_SIZE_OPTIONS = ['10', '20', '50', '100'];

/**
 * 默认操作人（实际应从用户登录信息中获取）
 */
export const DEFAULT_OPERATOR = 'admin';

/**
 * 日期时间格式
 */
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * 日期格式
 */
export const DATE_FORMAT = 'YYYY-MM-DD';
