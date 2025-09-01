import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace PaymentOrderApi {
  export interface PaymentOrder {
    id: number;
    amountPaid: number; // 已付金额 ,
    amountUnpaid: number; // 未付金额 ,
    approveId: number; // 审核员ID ,
    approveName: string; // 审核员 ,
    approveTime: number; // 审核日期 ,
    balanceMoney: number; // 总金额 ,
    bankAccount: string; // 银行账户 ,
    bankId: number; // 银行ID ,
    code: string; // 收款编码 ,
    countMoney: number; // 优惠金额 ,
    createId: number; // 创建用户id ,
    createName: string; // 创建用户 ,
    createTime: number; // 创建时间 ,
    formCode: string; // 核销单据 ,
    formId: number; // 单据id ,
    monthField: string; // 年月 ,
    remark: string; // 备注 ,
    statusFlag: number; // 付款状态 1:草稿 2:待结算 3:结算成功 4:结算驳回 ,
    supplierId: number; // 供应商ID ,
    supplierName: string; // 供应商 ,
    totalNum: number; // 总数 ,
    typeName: string;
    updateTime: number; // 修改时间 ,
    version: number; // 乐观锁
  }

  export interface PaymentOrderQuery extends CommApi.PageParam {
    code: string; // 付款编码 ,
    formCode: string; // 核销单据 ,
    statusFlag: number; // 付款状态 1:草稿 2:待结算 3:结算成功 4:结算驳回
  }
}

/**
 * 获取列表数据
 */
async function getPaymentOrderList(data: PaymentOrderApi.PaymentOrderQuery) {
  return requestClient.post<CommApi.Response<PaymentOrderApi.PaymentOrder[]>>(
    `/finance/findPoList`,
    data,
  );
}

/**
 * 详情数据
 */
async function getPaymentOrder(params: { id: number }) {
  return requestClient.post<CommApi.Response<PaymentOrderApi.PaymentOrder>>(
    `/finance/findPoDetail`,
    null,
    { params },
  );
}
/**
 * 创建
 * @param data 部门数据
 */
async function createPaymentOrder(
  data: Omit<PaymentOrderApi.PaymentOrder, 'id'>,
) {
  return requestClient.post('/finance/addPo', data);
}

/**
 * 更新
 *
 * @param id 部门 ID
 * @param data 部门数据
 */
async function updatePaymentOrder(data: PaymentOrderApi.PaymentOrder) {
  return requestClient.post(`/finance/updatePo`, data);
}

// /**
//  * 删除
//  * @param id 部门 ID
//  */
// async function deletePaymentOrder(id: string) {
//   return requestClient.delete(`/system/dept/${id}`);
// }
/**
 * 删除
 * @param id 部门 ID
 */
async function deletePaymentOrderById(params: { id: number }) {
  return requestClient.post(`/finance/deletePoById`, null, { params });
}

// /**
//  * 批量删除
//  */
// async function deletePaymentOrderByIds(data: { ids: number[] }) {
//   return requestClient.post(`/PaymentOrder/deleteByIds`, data);
// }
export {
  createPaymentOrder,
  deletePaymentOrderById,
  getPaymentOrder,
  // deletePaymentOrder,
  // deletePaymentOrderByIds,
  getPaymentOrderList,
  updatePaymentOrder,
};
