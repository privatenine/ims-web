import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace CheckApi {
  // 盘点单主表查询参数
  export interface InventoryMainSearchParam extends CommApi.PageParam {
    code?: string; // 盘点单号
    statusFlag?: number; // 盘点状态 1:草稿 2:盘点进行中 3:盘点完成 4:存档 5:驳回
    storeId?: number; // 仓库ID
  }

  // 盘点单主表实体
  export interface InventoryMain {
    id: number;
    action?: string;
    approveId?: number;
    approveName?: string;
    approveTime?: number;
    code: string; // 盘点单号
    createId?: number;
    createName?: string;
    createTime?: number;
    remark?: string;
    statusFlag: number; // 盘点状态 1:草稿 2:盘点进行中 3:盘点完成 4:存档 5:驳回
    storeId: number; // 仓库ID
    storeName?: string;
    storeSiteName?: string;
    totalActiNum?: number; // 实际总数量
    totalNum?: number; // 账面总数量
    version?: number;
  }

  // 盘点单列表查询结果
  export interface InventoryMainPageResponse {
    items: InventoryMain[];
    total: number;
  }

  // 盘盈盘亏查询参数
  export interface InventoryMain2SearchParam {
    code?: string; // 盘盈号
    endTime?: number; // 结束时间
    pageNum?: number; // 页码, 默认1
    pageSize?: number; // 每页数量, 默认20
    sortParam?: CommApi.SortParam; // 排序参数
    startTime?: number; // 开始时间
    statusFlag?: number; // 盘点状态 1:草稿 2:待审批 3:审批通过 4:驳回
    storeId?: number; // 仓库ID
  }

  // 盘盈盘亏响应实体
  export interface InventoryMain2RespVO {
    action?: string; // 盘点动作
    approveId?: number; // 审核员ID
    approveName?: string; // 审核员
    approveTime?: number; // 审核日期
    code?: string; // 盘盈单号
    createId?: number; // 创建用户id
    createName?: string; // 创建用户名
    createTime?: number; // 创建时间
    id?: number;
    remark?: string; // 备注
    statusFlag?: number; // 盘点状态 1:草稿 2:待审批 3:审批通过 4:驳回
    storeId?: number; // 仓库ID
    storeName?: string; // 仓库名称
    storeSiteName?: string; // 货位名称
    totalNum?: number; // 总数
    totalPrice?: number; // 总计成本
    updateId?: number; // 修改用户id
    updateTime?: number; // 修改时间
    version?: number; // 乐观锁
  }

  // 保持原有的接口定义，用于向后兼容
  export interface Check {
    id: number;
  }

  export interface CheckQuery extends CommApi.PageParam {
    name: string;
  }
}

/**
 * 获取盘点单列表数据
 */
async function findImList(data: CheckApi.InventoryMainSearchParam) {
  return requestClient.post<CommApi.Response<CheckApi.InventoryMain[]>>(
    `/balance/findImList`,
    data,
  );
}

/**
 * 获取盘点单详情
 */
async function getInventoryMain(id: number) {
  return requestClient.get<CommApi.Response<CheckApi.InventoryMain>>(
    `/balance/findImById?id=${id}`,
  );
}

/**
 * 获取盘点单号
 */
async function getInventoryCode() {
  return requestClient.get<CommApi.Response<string>>(`/balance/getImCode`);
}

/**
 * 获取盘盈盘亏单号
 */
async function getInventory2Code() {
  return requestClient.get<CommApi.Response<string>>(`/balance/getIm2Code`);
}

/**
 * 创建盘点单参数
 */
export interface CreateInventoryMainParam {
  code: string;
  remark: string;
  statusFlag: number;
  storeId: number;
}

/**
 * 创建盘点单
 */
async function createInventoryMain(data: CreateInventoryMainParam) {
  return requestClient.post<CommApi.Response<any>>(`/balance/addIm`, data);
}

/**
 * 库位查询参数
 */
export interface StoreSiteSearchParam {
  pageNum: number;
  pageSize: number;
  siteName?: string;
  sortParam?: {
    field: string;
    type: number;
  };
  storeId?: number;
}

/**
 * 库位信息
 */
export interface StoreSiteItem {
  siteName: string;
  storeId: number;
  storeName: string;
}

/**
 * 库位查询响应
 */
export interface StoreSiteResponse {
  additionInfo: string;
  code: number;
  data: StoreSiteItem[];
  msg: string;
  requestTime: number;
  total: number;
}

/**
 * 查询库位列表
 */
async function findStoreSiteList(data: StoreSiteSearchParam) {
  return requestClient.post<CommApi.Response<StoreSiteItem[]>>(
    `/balance/findStoreSiteList`,
    data,
  );
}

/**
 * 添加盘点单明细参数
 */
export interface AddInventorySubParam {
  addInventoryMainParam: {
    code: string;
    remark: string;
    statusFlag: number;
    storeId: number;
  };
  code: string;
  mainId: number;
  remark: string;
  siteName: string;
  storeId: number;
}

/**
 * 盘点单主表响应
 */
export interface InventoryMainRespVO {
  action: string;
  approveId: number;
  approveName: string;
  approveTime: number;
  code: string;
  createId: number;
  createName: string;
  createTime: number;
  id: number;
  remark: string;
  statusFlag: number;
  storeId: number;
  storeName: string;
  storeSiteName: string;
  totalActiNum: number;
  totalNum: number;
  version: number;
}

/**
 * 盘点单明细响应
 */
export interface InventorySubRespVO {
  actiNum: number;
  balanceId: number;
  code: string;
  createTime: number;
  custFlag: number;
  id: number;
  mainId: number;
  num: number;
  productAttachmentIds: string;
  productAttachmentNames: string;
  productId: number;
  productName: string;
  productPlaceId: number;
  productPlaceName: string;
  remark: string;
  statusFlag: number;
  storeId: number;
  storeName: string;
  storeSiteName: string;
  supplierId: number;
  supplierName: string;
}

/**
 * 添加盘点单明细响应
 */
export interface AddInventorySubResponse {
  additionInfo: string;
  code: number;
  data: {
    mainRespVO: InventoryMainRespVO;
    subRespVOList: InventorySubRespVO[];
  };
  msg: string;
  requestTime: number;
  total: number;
}

/**
 * 添加盘点单明细
 */
async function addInventorySub(data: AddInventorySubParam) {
  return requestClient.post<CommApi.Response<AddInventorySubResponse['data']>>(
    `/balance/addIs`,
    data,
  );
}

/**
 * 批量添加盘点单明细参数
 */
export interface AddInventorySubBatchParam {
  addInventoryMainParam: {
    code: string;
    remark: string;
    statusFlag: number;
    storeId: number;
  };
  code: string;
  mainId: number;
  paramList: Array<{
    siteName: string;
    storeId: number;
  }>;
  remark: string;
}

/**
 * 批量添加盘点单明细
 */
async function addInventorySubBatch(data: AddInventorySubBatchParam) {
  return requestClient.post<CommApi.Response<AddInventorySubResponse['data']>>(
    `/balance/addIsBatch`,
    data,
  );
}

/**
 * 查询盘点单明细参数
 */
export interface FindIsListParam {
  code: string;
  mainId: number;
  pageNum: number;
  pageSize: number;
  sortParam: {
    field: string;
    type: number;
  };
}

/**
 * 查询盘点单明细
 */
async function findIsList(data: FindIsListParam) {
  return requestClient.post<CommApi.Response<InventorySubRespVO[]>>(
    `/balance/findIsList`,
    data,
  );
}

/**
 * 删除盘点单
 */
async function deleteInventoryMain(id: number) {
  return requestClient.post<CommApi.Response<any>>(
    `/balance/deleteImById?id=${id}`,
  );
}

/**
 * 删除盘点单明细
 */
async function deleteInventorySub(id: number) {
  return requestClient.post<CommApi.Response<any>>(
    `/balance/deleteIsById?id=${id}`,
  );
}

/**
 * 批量删除盘点单明细
 */
async function deleteInventorySubBatch(ids: number[]) {
  return requestClient.post<CommApi.Response<any>>(`/balance/deleteIsByIds`, {
    ids: JSON.stringify(ids),
  });
}

/**
 * 修改盘点单参数
 */
export interface UpdateInventoryMainParam {
  id: number;
  remark: string;
  statusFlag: number;
  storeId: number;
  version: number;
}

/**
 * 修改盘点单
 */
async function updateInventoryMain(data: UpdateInventoryMainParam) {
  return requestClient.put<CommApi.Response<any>>(
    `/balance/updateImById`,
    data,
  );
}

/**
 * 修改盘点单明细盘点数量参数
 */
export interface UpdateInventorySubNumParam {
  id: number;
  num: number;
}

/**
 * 修改盘点单明细盘点数量
 */
async function updateInventorySubNum(data: UpdateInventorySubNumParam) {
  return requestClient.post<CommApi.Response<any>>(
    `/balance/updateIsById`,
    data,
  );
}

/**
 * 批量删除盘点单
 */
async function deleteInventoryMainByIds(ids: number[]) {
  return requestClient.post<CommApi.Response<void>>(`/balance/deleteImByIds`, {
    ids,
  });
}

/**
 * 获取盘盈盘亏列表数据
 */
async function findIm2List(data: CheckApi.InventoryMain2SearchParam) {
  return requestClient.post<CommApi.Response<CheckApi.InventoryMain2RespVO[]>>(
    `/balance/findIm2List`,
    data,
  );
}

// 兼容原有接口
async function getCheckList(data: CheckApi.CheckQuery) {
  return requestClient.post<CommApi.Response<CheckApi.Check[]>>(
    `/car/findList`,
    data,
  );
}

async function getCheck(id: number) {
  return requestClient.get<CommApi.Response<CheckApi.Check>>(
    `/personnelMatters/findEmployeeById?userId=${id}`,
  );
}

async function createCheck(data: Omit<CheckApi.Check, 'id'>) {
  return requestClient.post('/car/addCar', data);
}

async function updateCheck(data: CheckApi.Check) {
  return requestClient.put(`/car/updateById`, data);
}

async function deleteCheckByIds(data: { id: number[] }) {
  return requestClient.post(`/car/deleteByIds`, data);
}

/**
 * 创建盘盈盘亏单参数
 */
export interface CreateInventoryMain2Param {
  code: string;
  remark: string;
  statusFlag: number;
  storeId: number;
}

/**
 * 创建盘盈盘亏单
 */
async function createInventoryMain2(data: CreateInventoryMain2Param) {
  return requestClient.post<CommApi.Response<any>>(`/balance/addIm2`, data);
}

/**
 * 添加盘盈盘亏单明细参数
 */
export interface AddInventorySub2Param {
  addInventoryMain2Param: {
    code: string;
    remark: string;
    statusFlag: number;
    storeId: number;
  };
  balanceId: number;
  buyPrice: number;
  code: string;
  mainId: number;
  num: number;
  productAttachmentIds: string;
  productAttachmentNames: string;
  productId: number;
  productName: string;
  productPlaceId: number;
  remark: string;
  statusFlag: number;
  storeId: number;
  storeSiteName: string;
  supplierId: number;
  supplierName: string;
}

/**
 * 盘盈盘亏单明细响应实体
 */
export interface InventorySub2RespVO {
  balanceId: number;
  buyPrice: number;
  code: string;
  createTime: number;
  formCode: string;
  formId: number;
  id: number;
  inventoryMain2RespVO: CheckApi.InventoryMain2RespVO;
  mainId: number;
  num: number;
  productAttachmentIds: string;
  productAttachmentNames: string;
  productId: number;
  productName: string;
  productPlaceId: number;
  productPlaceName: string;
  remark: string;
  statusFlag: number;
  storeId: number;
  storeName: string;
  storeSiteName: string;
  supplierId: number;
  supplierName: string;
  totalBuyPrice: number;
  updateTime: number;
}

/**
 * 添加盘盈盘亏单明细响应
 */
export interface AddInventorySub2Response {
  additionInfo: string;
  code: number;
  data: InventorySub2RespVO;
  msg: string;
  requestTime: number;
  total: number;
}

/**
 * 添加盘盈盘亏单明细
 */
async function addInventorySub2(data: AddInventorySub2Param) {
  return requestClient.post<CommApi.Response<InventorySub2RespVO>>(
    `/balance/addIs2`,
    data,
  );
}

/**
 * 删除盘盈盘亏单明细
 */
async function deleteInventorySub2ById(id: number) {
  return requestClient.post<CommApi.Response<any>>(
    `/balance/deleteIs2ById?id=${id}`,
  );
}

/**
 * 批量删除盘盈盘亏单明细
 */
async function deleteInventorySub2ByIds(ids: number[]) {
  return requestClient.post<CommApi.Response<any>>(`/balance/deleteIs2ByIds`, {
    ids,
  });
}

/**
 * 删除盘盈盘亏单
 */
async function deleteInventoryMain2ById(id: number) {
  return requestClient.post<CommApi.Response<any>>(
    `/balance/deleteIm2ById?id=${id}`,
  );
}

/**
 * 批量删除盘盈盘亏单
 */
async function deleteInventoryMain2ByIds(ids: number[]) {
  return requestClient.post<CommApi.Response<any>>(`/balance/deleteIm2ByIds`, {
    ids,
  });
}

/**
 * 查询盘盈盘亏单明细
 */
async function findInventoryRlsList(data: { mainId: number | string }) {
  return requestClient.post<CommApi.Response<InventorySub2RespVO[]>>(
    `/balance/findRlsList`,
    data,
  );
}

/**
 * 查询盘盈盘亏单明细参数接口
 */
export interface FindIs2ListParam {
  code?: string;
  mainId: number | string;
  pageNum?: number;
  pageSize?: number;
  sortParam?: CommApi.SortParam;
}

/**
 * 根据盘盈盘亏单搜索明细
 */
async function findIs2List(data: FindIs2ListParam) {
  return requestClient.post<CommApi.Response<InventorySub2RespVO[]>>(
    `/balance/findIs2List`,
    data,
  );
}

/**
 * 审核通过盘盈盘亏单
 */
async function approveInventory2(data: { id: number | string }) {
  return requestClient.post<CommApi.Response<any>>(
    `/balance/approveIm2?id=${data.id}`,
  );
}

/**
 * 审核驳回盘盈盘亏单
 */
async function rejectInventory2(data: { id: number | string }) {
  return requestClient.post<CommApi.Response<any>>(
    `/balance/rejectIm2?id=${data.id}`,
  );
}

/**
 * 获取盘盈盘亏单详情
 */
async function getInventoryMain2(id: number | string) {
  return requestClient.get<CommApi.Response<CheckApi.InventoryMain2RespVO>>(
    `/balance/findIm2ById?id=${id}`,
  );
}

export {
  addInventorySub,
  addInventorySub2,
  addInventorySubBatch,
  approveInventory2,
  // 兼容原有接口
  createCheck,
  // 新的盘点接口
  createInventoryMain,
  createInventoryMain2,
  deleteCheckByIds,
  deleteInventoryMain,
  deleteInventoryMain2ById,
  deleteInventoryMain2ByIds,
  deleteInventoryMainByIds,
  deleteInventorySub,
  deleteInventorySub2ById,
  deleteInventorySub2ByIds,
  deleteInventorySubBatch,
  findIm2List,
  findImList,
  findIsList,
  findInventoryRlsList,
  findIs2List,
  findStoreSiteList,
  getCheck,
  getCheckList,
  getInventory2Code,
  getInventoryCode,
  getInventoryMain,
  getInventoryMain2,
  rejectInventory2,
  updateCheck,
  updateInventoryMain,
  updateInventorySubNum,
};
