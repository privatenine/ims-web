import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace ChangeApi {
  // 移库单主表查询参数
  export interface TransferMainSearchParam extends CommApi.PageParam {
    code?: string; // 移库单号
    dateRange?: [string, string]; // 日期范围 [开始日期, 结束日期]
    endTime?: number; // 结束时间
    fashion?: 'CORRECT' | 'MOVE' | string; // 移库方式
    startTime?: number; // 开始时间
    statusFlag?: number; // 移库状态
  }

  // 移库单下载参数
  export interface TransferMainDownloadParam {
    code?: string; // 移库单号
    dateRange?: [string, string]; // 日期范围 [开始日期, 结束日期]
    endTime?: number; // 结束时间
    fashion?: 'CORRECT' | 'MOVE' | string; // 移库方式
    pageNum?: number; // 页码
    pageSize?: number; // 每页数量
    sortParam?: {
      field: string; // 排序字段
      type: number; // 排序类型
    };
    startTime?: number; // 开始时间
    statusFlag?: number; // 移库状态
  }

  // 移库单主表实体
  export interface TransferMainItem {
    approveId?: number;
    approveName?: string;
    approveTime?: number;
    code: string; // 移库单号
    createId?: number;
    createName?: string;
    createTime?: number;
    fashion?: 'CORRECT';
    fashionZh?: string;
    id: number;
    operId?: number;
    operName?: string;
    operTime?: number;
    remark?: string;
    statusFlag: number; // 移库状态
    totalNum?: number; // 总数量
    totalPrice?: number; // 总价格
    updateTime?: number;
    version?: number;
  }

  // 移库单明细实体
  export interface TransferSubItem {
    id: number;
    productId: number;
    productName: string;
    attachment?: string;
    origin?: string;
    oldWarehouseName?: string;
    oldWarehouseLocation?: string;
    transferQuantity: number;
    newWarehouse?: string;
    newWarehouseLocation?: string;
    transferMainId: number;
    // 新增字段，与API返回值匹配
    actiNum?: number;
    balanceId?: number;
    code?: string;
    createId?: number;
    createTime?: number;
    isDefault?: boolean;
    newStoreId?: number;
    newStoreName?: string;
    newStoreSiteName?: string;
    num?: number;
    oldStoreId?: number;
    oldStoreSiteName?: string;
    price?: number;
    productAttachmentIds?: string;
    productAttachmentNames?: string;
    productPlaceId?: number;
    productPlaceName?: string;
    remark?: string;
    statusFlag?: number;
    supplierId?: number;
    supplierName?: string;
    totalPrice?: number;
    transferMainRespVO?: TransferMainItem;
    updateId?: number;
    updateTime?: number;
  }

  // 移库单创建参数
  export interface TransferMainCreate {
    code: string;
    transferMethod: string;
    orderDate: string;
    orderCreator: string;
    transferPersonnel: string;
    quantity: number;
    remark?: string;
    statusFlag: number;
    details: TransferSubItem[];
  }

  // 移库单列表查询结果
  export interface TransferMainPageResponse {
    items: TransferMainItem[];
    total: number;
  }

  // 库存查询参数
  export interface BalanceSearchParam extends CommApi.PageParam {
    isExcludeZero?: boolean; // 是否排除零库存
    isFuzzy?: number; // 是否模糊查询 0:否 1:是
    productJpm?: string; // 产品简拼码
    productName?: string; // 产品名称
    productPlaceId?: number; // 产品位置ID
    siteName?: string; // 站点名称
    storeId?: number; // 仓库ID
  }

  // 库存实体
  export interface BalanceItem {
    actiNum: number; // 实际数量
    baseId: number; // 基础ID
    baseName: string; // 基础名称
    batchPrice: number; // 批次价格
    buyPrice: number; // 采购价格
    createTime: number; // 创建时间
    id: number;
    inventoryLock: number; // 库存锁定
    isDefault: boolean; // 是否默认
    priceReference: number; // 参考价格
    productAttachmentIds: string; // 产品附件ID
    productAttachmentNames: string; // 产品附件名称
    productId: number; // 产品ID
    productName: string; // 产品名称
    productPlaceId: number; // 产品位置ID
    productPlaceName: string; // 产品位置名称
    siteName: string; // 站点名称
    storeId: number; // 仓库ID
    storeName: string; // 仓库名称
    supplierId: number; // 供应商ID
    supplierName: string; // 供应商名称
    tradePrice1: number; // 贸易价格1
    tradePrice2: number; // 贸易价格2
    tradePrice3: number; // 贸易价格3
    tradePrice4: number; // 贸易价格4
    updateTime: number; // 更新时间
  }

  // 新增移库单主表参数
  export interface AddTransferMainParam {
    code?: string; // 移库单号
    fashion?: 'CORRECT' | 'MOVE'; // 移库方式
    operId?: number; // 移库员ID
    operName?: string; // 移库员
    operTime?: number; // 移库日期
    remark?: string; // 备注
    statusFlag?: number; // 移库状态 1:草稿 2:待审批 3:移库完成 4:驳回
  }

  // 新增移库单明细参数
  export interface AddTransferSubParam {
    actiNum?: number; // 原有数量
    addTransferMainParam?: AddTransferMainParam; // 新增移库单数据
    balanceId?: number; // 库存ID
    code?: string; // 移库单号
    isDefault?: boolean; // 是否设置为默认货位
    mainId?: number; // 移库单ID
    newStoreId?: number; // 新仓库ID
    newStoreSiteName?: string; // 新库货位名称
    num?: number; // 移库数量
    oldStoreId?: number; // 旧仓库ID
    oldStoreSiteName?: string; // 旧库货位名称
    price?: number; // 成本单价
    productAttachmentIds?: string; // 产品附件id组合
    productAttachmentNames?: string; // 产品附件名称组合
    productId?: number; // 产品ID
    productName?: string; // 产品名称
    productPlaceId?: number; // 产品产地id
    remark?: string; // 备注
    supplierId?: number; // 供应商id
    supplierName?: string; // 供应商名字
  }

  // 新增移库单明细响应
  export interface AddTransferSubResponse {
    actiNum?: number;
    balanceId?: number;
    code?: string;
    createId?: number;
    createTime?: number;
    id?: number;
    isDefault?: boolean;
    mainId?: number;
    newStoreId?: number;
    newStoreName?: string;
    newStoreSiteName?: string;
    num?: number;
    oldStoreId?: number;
    oldStoreName?: string;
    oldStoreSiteName?: string;
    price?: number;
    productAttachmentIds?: string;
    productAttachmentNames?: string;
    productId?: number;
    productName?: string;
    productPlaceId?: number;
    productPlaceName?: string;
    remark?: string;
    statusFlag?: number;
    supplierId?: number;
    supplierName?: string;
    totalPrice?: number;
    transferMainRespVO?: TransferMainItem;
    updateId?: number;
    updateTime?: number;
  }
}

/**
 * 获取移库单列表数据
 */
async function getTransferMainList(data: ChangeApi.TransferMainSearchParam) {
  const params: any = {
    ...data,
  };

  // 只有当fashion有具体值时才传递，空字符串或undefined时不传递
  if (data.fashion && data.fashion !== '') {
    params.fashion = data.fashion;
  }

  return requestClient.post<CommApi.Response<ChangeApi.TransferMainItem[]>>(
    `/balance/findTmList`,
    params,
  );
}

/**
 * 获取移库单详情
 */
async function getTransferMain(id: number) {
  return requestClient.get<CommApi.Response<ChangeApi.TransferMainItem>>(
    `/transfer/findById?id=${id}`,
  );
}

/**
 * 创建移库单
 */
async function createTransferMain(data: ChangeApi.TransferMainCreate) {
  return requestClient.post<CommApi.Response<ChangeApi.TransferMainItem>>(
    '/transfer/add',
    data,
  );
}

/**
 * 更新移库单
 */
async function updateTransferMain(data: ChangeApi.TransferMainItem) {
  return requestClient.put<CommApi.Response<ChangeApi.TransferMainItem>>(
    `/transfer/updateById`,
    data,
  );
}

/**
 * 删除移库单
 */
async function deleteTransferMain(id: number) {
  return requestClient.delete<CommApi.Response<void>>(
    `/transfer/deleteById?id=${id}`,
  );
}

/**
 * 删除移库单（使用 balance 接口）
 */
async function deleteTmById(id: number) {
  return requestClient.post<CommApi.Response<{}>>(
    `/balance/deleteTmById?id=${id}`,
  );
}

/**
 * 批量删除移库单
 */
async function deleteTransferMainByIds(ids: number[]) {
  return requestClient.post<CommApi.Response<void>>(`/transfer/deleteByIds`, {
    ids,
  });
}

/**
 * 审核移库单（旧接口，已废弃）
 */
async function approveTransferMainOld(params: { id: number; version: number }) {
  return requestClient.post<CommApi.Response<void>>(
    `/transfer/approve?id=${params.id}&version=${params.version}`,
  );
}

/**
 * 驳回移库单（旧接口，已废弃）
 */
async function rejectTransferMainOld(params: {
  id: number;
  reason?: string;
  version: number;
}) {
  return requestClient.post<CommApi.Response<void>>(`/transfer/reject`, params);
}

/**
 * 获取库存列表数据
 */
async function getBalanceList(data: ChangeApi.BalanceSearchParam) {
  const params = {
    ...data,
    sortParam: data.sortParam || {
      field: 'name',
      type: 0,
    },
  };
  return requestClient.post<CommApi.Response<ChangeApi.BalanceItem[]>>(
    `/balance/findBalanceList`,
    params,
  );
}

/**
 * 新增移库单明细
 */
async function addTransferSub(data: ChangeApi.AddTransferSubParam) {
  return requestClient.post<CommApi.Response<ChangeApi.AddTransferSubResponse>>(
    `/balance/addTs`,
    data,
  );
}

/**
 * 获取移库单号
 */
async function getTransferCode() {
  return requestClient.get<CommApi.Response<string>>(`/balance/getTmCode`);
}

/**
 * 新增移库单主表（使用 balance 接口）
 */
async function addTransferMain(data: ChangeApi.AddTransferMainParam) {
  return requestClient.post<CommApi.Response<any>>(`/balance/addTm`, data);
}

/**
 * 审核通过移库单（使用 balance 接口）
 */
async function approveTransferMain(params: {
  mainId: number;
  version: number;
}) {
  return requestClient.post<CommApi.Response<any>>(
    `/balance/approveTm?mainId=${params.mainId}&version=${params.version}`,
  );
}

/**
 * 驳回移库单（使用 balance 接口）
 */
async function rejectTransferMain(params: {
  mainId: number;
  reason?: string;
  version: number;
}) {
  return requestClient.post<CommApi.Response<any>>(
    `/balance/rejectTm?mainId=${params.mainId}&version=${params.version}`,
  );
}

/**
 * 删除移库单明细（使用 balance 接口）
 */
async function deleteTransferSub(id: number) {
  return requestClient.post<CommApi.Response<any>>(
    `/balance/deleteTsById?id=${id}`,
  );
}

/**
 * 根据ID获取移库单详情
 */
async function findTmById(id: number) {
  return requestClient.get<CommApi.Response<ChangeApi.TransferMainItem>>(
    `/balance/findTmById?id=${id}`,
  );
}

/**
 * 根据移库单ID获取明细列表
 */
async function getTransferSubList(mainId: number) {
  return requestClient.get<CommApi.Response<ChangeApi.TransferSubItem[]>>(
    `/balance/findTsByMainId?mainId=${mainId}`,
  );
}

/**
 * 获取移库单明细列表（新接口）
 */
async function findTsList(params: {
  code?: string;
  mainId?: number;
  pageNum?: number;
  pageSize?: number;
  sortParam?: {
    field: string;
    type: number;
  };
}) {
  return requestClient.post<CommApi.Response<ChangeApi.TransferSubItem[]>>(
    `/balance/findTsList`,
    params,
  );
}

/**
 * 下载移库单据
 */
async function downloadTransferMainList(
  params: ChangeApi.TransferMainDownloadParam,
) {
  return requestClient.post<Blob>(`/balance/downTmList`, params, {
    responseType: 'blob',
  });
}

export {
  addTransferMain,
  addTransferSub,
  approveTransferMain,
  createTransferMain,
  deleteTmById,
  deleteTransferMain,
  deleteTransferMainByIds,
  deleteTransferSub,
  downloadTransferMainList,
  findTmById,
  findTsList,
  getBalanceList,
  getTransferCode,
  getTransferMain,
  getTransferMainList,
  getTransferSubList,
  rejectTransferMain,
  updateTransferMain,
};
