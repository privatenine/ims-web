import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace ReceiptApi {
  export interface Receipt {
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
    customerId: number; // 客户ID ,
    customerName: string; // 客户 ,
    formCode: string; // 核销单据 ,
    formId: number; // 单据id ,
    monthField: string; // 年月 ,
    remark: string; // 备注 ,
    statusFlag: number; // 收款状态 1:草稿 2:待结算 3:结算成功 4:结算驳回 ,
    totalNum: number; // 总数 ,
    typeName: string;
    updateTime: number; // 修改时间 ,
    version: number; // 乐观锁
  }

  export interface ReceiptQuery extends CommApi.PageParam {
    code: string; // 收款编码 ,
    formCode: string; // 核销单据 ,
    statusFlag: number; // 收款状态 1:草稿 2:待结算 3:结算成功 4:结算驳回
  }
}

/**
 * 获取列表数据
 */
async function getReceiptList(data: ReceiptApi.ReceiptQuery) {
  return requestClient.post<CommApi.Response<ReceiptApi.Receipt[]>>(
    `/finance/findRoList`,
    data,
  );
}

/**
 * 详情
 */
async function getReceipt(params: { id: number }) {
  return requestClient.post<CommApi.Response<ReceiptApi.Receipt>>(
    `/finance/findRoDetail`,
    null,
    { params },
  );
}

/**
 * 创建
 * @param data 数据
 */
async function createReceipt(data: Omit<ReceiptApi.Receipt, 'id'>) {
  return requestClient.post('/finance/addRo', data);
}

/**
 * 更新
 *
 * @param id ID
 * @param data data
 */
async function updateReceipt(data: ReceiptApi.Receipt) {
  return requestClient.put(`/finance/updateRo`, data);
}

// /**
//  * 删除
//  * @param id  ID
//  */
// async function deleteReceipt(id: string) {
//   return requestClient.delete(`/system/dept/${id}`);
// }
/**
 * 删除
 * @param id id
 */
async function deleteReceiptById(params: { id: number }) {
  return requestClient.post(`/finance/deleteRoById`, null, { params });
}

// /**
//  * 批量删除
//  */
// async function deleteReceiptByIds(data: { ids: number[] }) {
//   return requestClient.post(`/Receipt/deleteByIds`, data);
// }

/**
 * 结算收款单
 * @param id id
 */
async function approveReceipt(params: { id: number; version: number }) {
  return requestClient.post(`/finance/approveRo`, null, { params });
}

export {
  approveReceipt,
  createReceipt,
  deleteReceiptById,
  getReceipt,
  // deleteReceipt,
  // deleteReceiptByIds,
  getReceiptList,
  updateReceipt,
};
