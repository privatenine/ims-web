/**
 * 仓库信息缓存管理工具
 */

export interface StorageInfo {
  id: number;
  name: string;
  code: string;
}

/**
 * 从本地缓存获取仓库信息
 */
export function getCachedStorageList(): StorageInfo[] {
  try {
    const cached = localStorage.getItem('storageList');
    return cached ? JSON.parse(cached) : [];
  } catch (error) {
    console.error('获取缓存仓库信息失败:', error);
    return [];
  }
}

/**
 * 根据仓库ID获取仓库信息
 */
export function getStorageById(id: number): StorageInfo | undefined {
  const storageList = getCachedStorageList();
  return storageList.find((storage) => storage.id === id);
}

/**
 * 根据仓库名称获取仓库信息
 */
export function getStorageByName(name: string): StorageInfo | undefined {
  const storageList = getCachedStorageList();
  return storageList.find((storage) => storage.name === name);
}

/**
 * 根据仓库编号获取仓库信息
 */
export function getStorageByCode(code: string): StorageInfo | undefined {
  const storageList = getCachedStorageList();
  return storageList.find((storage) => storage.code === code);
}

/**
 * 获取仓库选项列表（用于下拉选择）
 */
export function getStorageOptions() {
  const storageList = getCachedStorageList();
  return storageList.map((storage) => ({
    label: storage.name,
    value: storage.id,
    code: storage.code,
  }));
}

/**
 * 检查是否有缓存的仓库信息
 */
export function hasCachedStorageList(): boolean {
  const cached = localStorage.getItem('storageList');
  return !!cached;
}

/**
 * 清除仓库信息缓存
 */
export function clearStorageCache(): void {
  localStorage.removeItem('storageList');
}
