/**
 * 本地存储工具类
 */
class StorageUtil {
  /**
   * 设置本地存储
   */
  set(key: string, value: any): void {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    } catch (error) {
      console.error('localStorage set error:', error);
    }
  }

  /**
   * 获取本地存储
   */
  get<T = any>(key: string, defaultValue?: T): T | null {
    try {
      const value = localStorage.getItem(key);
      if (value === null) return defaultValue || null;

      try {
        return JSON.parse(value) as T;
      } catch {
        return value as T;
      }
    } catch (error) {
      console.error('localStorage get error:', error);
      return defaultValue || null;
    }
  }

  /**
   * 移除本地存储
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('localStorage remove error:', error);
    }
  }

  /**
   * 清空本地存储
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('localStorage clear error:', error);
    }
  }
}

/**
 * 会话存储工具类
 */
class SessionStorageUtil {
  /**
   * 设置会话存储
   */
  set(key: string, value: any): void {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      sessionStorage.setItem(key, stringValue);
    } catch (error) {
      console.error('sessionStorage set error:', error);
    }
  }

  /**
   * 获取会话存储
   */
  get<T = any>(key: string, defaultValue?: T): T | null {
    try {
      const value = sessionStorage.getItem(key);
      if (value === null) return defaultValue || null;

      try {
        return JSON.parse(value) as T;
      } catch {
        return value as T;
      }
    } catch (error) {
      console.error('sessionStorage get error:', error);
      return defaultValue || null;
    }
  }

  /**
   * 移除会话存储
   */
  remove(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('sessionStorage remove error:', error);
    }
  }

  /**
   * 清空会话存储
   */
  clear(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('sessionStorage clear error:', error);
    }
  }
}

export const storage = new StorageUtil();
export const sessionStore = new SessionStorageUtil();
