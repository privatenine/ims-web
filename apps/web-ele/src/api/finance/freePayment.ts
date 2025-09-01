import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace FreePaymentApi {
  export interface FreePayment {
    id: number;
    bankAccount: string; // 银行账户 ,
    bankId: number; // 银行ID ,
    code: string; // 单号 ,
    createId: number; // 创建用户id ,
    createName: string; // 创建者 ,
    createTime: number; // 创建时间 ,
    formCode: string; // 免单核销单据 ,
    formId: number; // 免单核销单据id ,
    managerId: number; // 审核员ID ,
    managerName: string; // 审核员 ,
    managerTime: number; // 审核日期 ,
    remark: string; // 备注 ,
    statusFlag: number; // 状态 1：草稿 2：待审批 3：已完成 4：存档 5：驳回 ,
    supplierId: number; // 供应商ID ,
    supplierName: string; // 供应商名称 ,
    updateId: number; // 修改用户id ,
    updateTime: number; // 修改时间 ,
    userMoney: number; // 金额 ,
    version: number; // 乐观锁
  }

  export interface FreePaymentQuery extends CommApi.PageParam {
    code: string; // 单号 ,
    formCode: string; // 免单单号 ,
    statusFlag: number; // 状态 1：草稿 2：待审批 3：已完成 4：存档 5：驳回 ,
    supplierId: number; // 供应商ID ,
    supplierName: string; // 供应商名称
  }
}

/**
 * 获取列表数据
 */
async function getFreePaymentList(data: FreePaymentApi.FreePaymentQuery) {
  return requestClient.post<CommApi.Response<FreePaymentApi.FreePayment[]>>(
    `/finance/findEpList`,
    data,
  );
}

/**
 * 详情
 */
async function getFreePayment(params: { id: number }) {
  return requestClient.get<CommApi.Response<FreePaymentApi.FreePayment>>(
    `/finance/findEpDetail`,
    {
      params,
    },
  );
}

/**
 * 创建
 * @param data 数据
 */
async function createFreePayment(data: Omit<FreePaymentApi.FreePayment, 'id'>) {
  return requestClient.post('/finance/addEp', data);
}

/**
 * 更新
 *
 * @param id ID
 * @param data data
 */
async function updateFreePayment(data: FreePaymentApi.FreePayment) {
  return requestClient.post(`/finance/updateEp`, data);
}

/**
 * 删除
 * @param id id
 */
async function deleteFreePaymentById(params: { id: number }) {
  return requestClient.post(`/finance/deleteEpById`, null, { params });
}
/**
 * 审批
 * @param params
 * @returns
 */
async function approveFreePaymentById(params: { id: number; version: number }) {
  return requestClient.post(`/finance/approveEp`, null, { params });
}

/**
 * 驳回
 * @param params
 * @returns
 */
async function rejectFreePaymentById(params: { id: number; version: number }) {
  return requestClient.post(`/finance/rejectEp`, null, { params });
}

export {
  approveFreePaymentById,
  createFreePayment,
  deleteFreePaymentById,
  getFreePayment,
  getFreePaymentList,
  rejectFreePaymentById,
  updateFreePayment,
};
