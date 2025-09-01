import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace DamageApi {
  export interface SortParam {
    field?: string;
    type?: number;
  }

  export interface ReportLossMainSearchParam {
    code?: string;
    endTime?: number;
    pageNum?: number;
    pageSize?: number;
    sortParam?: SortParam;
    startTime?: number;
    statusFlag?: number;
  }

  export interface ReportLossMainItem {
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
    totalMoney: number;
    totalNum: number;
    updateTime: number;
    version: number;
  }

  export interface Damage {
    id: number;
  }

  export interface DamageQuery extends CommApi.PageParam {
    name: string;
  }
}

/**
 * 获取报损列表数据
 */
async function getReportLossMainList(
  data: DamageApi.ReportLossMainSearchParam,
) {
  return requestClient.post<CommApi.Response<DamageApi.ReportLossMainItem[]>>(
    `/balance/findRlmList`,
    data,
  );
}

/**
 * 获取列表数据
 */
async function getDamageList(data: DamageApi.DamageQuery) {
  return requestClient.post<CommApi.Response<DamageApi.Damage[]>>(
    `/car/findList`,
    data,
  );
}

/**
 * 获取数据
 */
async function getDamage(id: number) {
  return requestClient.get<CommApi.Response<DamageApi.Damage>>(
    `/personnelMatters/findEmployeeById?userId=${id}`,
  );
}

/**
 * 创建
 * @param data 数据
 */
async function createDamage(data: Omit<DamageApi.Damage, 'id'>) {
  return requestClient.post('/car/addCar', data);
}

/**
 * 更新
 *
 * @param id  ID
 * @param data 数据
 */
async function updateDamage(data: DamageApi.Damage) {
  return requestClient.put(`/car/updateById`, data);
}
/**
 * 批量删除
 */
async function deleteDamageByIds(data: { id: number[] }) {
  return requestClient.post(`/car/deleteByIds`, data);
}

/**
 * 获取报损单号
 */
async function getReportLossCode() {
  return requestClient.get<CommApi.Response<string>>('/balance/getRlmCode');
}

/**
 * 删除报损单明细
 */
async function deleteReportLossSub(id: number) {
  return requestClient.post<CommApi.Response<any>>(
    `/balance/deleteRlsById?id=${id}`,
  );
}

/**
 * 删除报损单
 */
async function deleteReportLossMain(id: number) {
  return requestClient.post<CommApi.Response<any>>(
    `/balance/deleteRlmById?id=${id}`,
  );
}

/**
 * 新增报损单
 */
async function addReportLossMain(params: {
  code: string;
  moveUserId: number;
  remark: string;
  statusFlag: number;
  storeId: number;
  storeSiteName: string;
}) {
  return requestClient.post<CommApi.Response<any>>(`/balance/addRlm`, params);
}

/**
 * 新增报损单明细
 */
async function addReportLossSub(params: {
  actiNum: number;
  addReportLossMainParam: {
    code: string;
    moveUserId: number;
    remark: string;
    statusFlag: number;
    storeId: number;
    storeSiteName: string;
  };
  balanceId: number;
  buyPrice: number;
  code: string;
  img_path0: string;
  img_path1: string;
  img_path2: string;
  img_path3: string;
  img_path4: string;
  lossCategoryId: number;
  lossProcessId: number;
  mainId: number;
  num: number;
  operId: number;
  operName: string;
  price: number;
  productAttachmentIds: string;
  productAttachmentNames: string;
  productId: number;
  productName: string;
  productPlaceId: number;
  remark: string;
  storeId: number;
  storeSiteName: string;
  supplierId: number;
  supplierName: string;
}) {
  return requestClient.post<CommApi.Response<any>>(`/balance/addRls`, params);
}

/**
 * 查看报损单数据
 */
async function findReportLossMain(id: number) {
  return requestClient.get<
    CommApi.Response<{
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
      totalMoney: number;
      totalNum: number;
      updateTime: number;
      version: number;
    }>
  >(`/balance/findRlmById?id=${id}`);
}

/**
 * 搜索报损单明细
 */
async function findRlsList(params: {
  code: string;
  mainId: number;
  pageNum: number;
  pageSize: number;
  sortParam: {
    field: string;
    type: number;
  };
}) {
  return requestClient.post<
    CommApi.Response<
      Array<{
        actiNum: number;
        balanceId: number;
        code: string;
        createId: number;
        createTime: number;
        id: number;
        img_path0: string;
        img_path1: string;
        img_path2: string;
        img_path3: string;
        img_path4: string;
        lossCategoryId: number;
        lossCategoryZh: string;
        lossProcessId: number;
        lossProcessZh: string;
        mainId: number;
        num: number;
        operId: number;
        operName: string;
        price: number;
        productAttachmentIds: string;
        productAttachmentNames: string;
        productId: number;
        productName: string;
        productPlaceId: number;
        productPlaceName: string;
        remark: string;
        reportLossMainRespVO: {
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
          totalMoney: number;
          totalNum: number;
          updateTime: number;
          version: number;
        };
        statusFlag: number;
        storeId: number;
        storeName: string;
        storeSiteName: string;
        supplierId: number;
        supplierName: string;
        totalMoney: number;
        updateId: number;
        updateTime: number;
      }>
    >
  >(`/balance/findRlsList`, params);
}

export {
  addReportLossMain,
  addReportLossSub,
  createDamage,
  deleteDamageByIds,
  deleteReportLossMain,
  deleteReportLossSub,
  findReportLossMain,
  findRlsList,
  getDamage,
  getDamageList,
  getReportLossCode,
  getReportLossMainList,
  updateDamage,
};
