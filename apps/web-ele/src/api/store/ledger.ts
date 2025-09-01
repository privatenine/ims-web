import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace LedgerApi {
  export interface Ledger {
    id: number;
  }

  export interface LedgerQuery extends CommApi.PageParam {
    name: string;
  }
}

/**
 * 获取列表数据
 */
async function getLedgerList(data: LedgerApi.LedgerQuery) {
  return requestClient.post<CommApi.Response<LedgerApi.Ledger[]>>(
    `/car/findList`,
    data,
  );
}

/**
 * 获取数据
 */
async function getLedger(id: number) {
  return requestClient.get<CommApi.Response<LedgerApi.Ledger>>(
    `/personnelMatters/findEmployeeById?userId=${id}`,
  );
}

/**
 * 创建
 * @param data 数据
 */
async function createLedger(data: Omit<LedgerApi.Ledger, 'id'>) {
  return requestClient.post('/car/addCar', data);
}

/**
 * 更新
 *
 * @param id  ID
 * @param data 数据
 */
async function updateLedger(data: LedgerApi.Ledger) {
  return requestClient.put(`/car/updateById`, data);
}
/**
 * 批量删除
 */
async function deleteLedgerByIds(data: { id: number[] }) {
  return requestClient.post(`/car/deleteByIds`, data);
}
export {
  createLedger,
  deleteLedgerByIds,
  getLedger,
  getLedgerList,
  updateLedger,
};
