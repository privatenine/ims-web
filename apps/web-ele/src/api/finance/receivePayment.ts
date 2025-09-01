import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace ReceivePaymentApi {
  export interface ReceivePayment {
    id: number;
    bankAccount: string; // 银行账户 ,
    bankId: number; // 银行ID ,
    code: string; // 单号 ,
    createId: number; // 创建用户id ,
    createName: string; // 创建者 ,
    createTime: number; // 创建时间 ,
    custId: number; // 客户ID ,
    custName: string; // 客户名称 ,
    formCode: string; // 免单核销单据 ,
    formId: number; // 免单核销单据id ,
    managerId: number; // 审核员ID ,
    managerName: string; // 审核员 ,
    managerTime: number; // 审核日期 ,
    remark: string; // 备注 ,
    statusFlag: number; // 状态 1：草稿 2：待审批 3：已完成 4：存档 5：驳回 ,
    updateId: number; // 修改用户id ,
    updateTime: number; // 修改时间 ,
    userMoney: number; // 金额 ,
    version: number; // 乐观锁
  }

  export interface ReceivePaymentQuery extends CommApi.PageParam {
    code: string; // 单号 ,
    custId: number; // 客户ID ,
    custName: string; // 客户名称 ,
    formCode: string; // 免单单号 ,
    statusFlag: number; // 状态 1：草稿 2：待审批 3：已完成 4：存档 5：驳回
  }
}

/**
 * 获取列表数据
 */
async function getReceivePaymentList(
  data: ReceivePaymentApi.ReceivePaymentQuery,
) {
  return requestClient.post<
    CommApi.Response<ReceivePaymentApi.ReceivePayment[]>
  >(`/finance/findErList`, data);
}

/**
 * 详情
 */
async function getReceivePayment(params: { id: number }) {
  return requestClient.get<CommApi.Response<ReceivePaymentApi.ReceivePayment>>(
    `/finance/findErDetail`,
    {
      params,
    },
  );
}

/**
 * 创建
 * @param data 数据
 */
async function createReceivePayment(
  data: Omit<ReceivePaymentApi.ReceivePayment, 'id'>,
) {
  return requestClient.post('/finance/addEr', data);
}

/**
 * 更新
 *
 * @param id ID
 * @param data data
 */
async function updateReceivePayment(data: ReceivePaymentApi.ReceivePayment) {
  return requestClient.post(`/finance/updateEr`, data);
}

/**
 * 删除
 * @param id id
 */
async function deleteReceivePaymentById(params: { id: number }) {
  return requestClient.post(`/finance/deleteErById`, null, { params });
}

/**
 * 审批
 * @param params
 * @returns
 */
async function approveReceivePaymentById(params: {
  id: number;
  version: number;
}) {
  return requestClient.post(`/finance/approveEr`, null, { params });
}

/**
 * 驳回
 * @param params
 * @returns
 */
async function rejectReceivePaymentById(params: {
  id: number;
  version: number;
}) {
  return requestClient.post(`/finance/rejectEr`, null, { params });
}
export {
  approveReceivePaymentById,
  createReceivePayment,
  deleteReceivePaymentById,
  getReceivePayment,
  getReceivePaymentList,
  rejectReceivePaymentById,
  updateReceivePayment,
};
