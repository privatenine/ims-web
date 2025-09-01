import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace PayableApi {
  export interface Payable {
    id: number;
    amountPaid: number; // 已付金额 ,
    amountUnpaid: number; // 未付金额 ,
    contact: string; // 联系人 ,
    createTime: number; // 创建时间 ,
    mobilePhone: string; // 手机 ,
    remark: string; // 备注 ,
    shortName: string; // 简称 ,
    supplierId: number; // 供应商id ,
    supplierName: string; // 供应商名称 ,
    telephone: string; // 电话 ,
    totalMoney: number; // 合计金额 ,
    totalNum: number; // 总数 ,
    updateTime: number; // 修改时间
  }

  export interface PayableSub {
    id: number;
    amountPaid: number; // 已付金额 ,
    amountUnpaid: number; // 未付金额 ,
    balanceMoney: number; // 应付金额 ,
    bankId: number; // 结算账户ID ,
    bankName: string; // 结算账户名 ,
    code: string; // 付款单号 ,
    createTime: number; // 创建时间 ,
    formCode: string; // 核销单据 ,
    formId: number; // 单据id ,
    mainId: number; // 主表id ,
    remark: string; // 备注 ,
    statusFlag: number; // 状态 1：待结算 2：存档 3：驳回 ,
    totalNum: number; // 总数 ,
    typeName: string; // 单据类型 = ['FREE_PAYMENT', 'WAREHOUSING', 'HANDMADE', 'PURCHASE_RETURN']stringEnum:"FREE_PAYMENT", "WAREHOUSING", "HANDMADE", "PURCHASE_RETURN",
    typeNameZh: string; // 单据类型中文 ,
    updateTime: number; // 修改时间
  }
  export interface PayableQuery extends CommApi.PageParam {
    isExcludeZero?: boolean; // 是否排除数量0 ,
    name?: string; // 单位名称 ,
    code?: string; // 付款单号 ,
    formCode?: string; // 核销单据 ,
    mainId?: number; // 主表id ,
    statusFlag?: number; // 状态 1：待结算 2：存档 3：驳回
    supplierId?: number;
  }
  export interface PayableHand {
    balanceMoney: number; // 应付金额
    mainId: number; // 主表id ,
    remark: string; // 备注
  }
}

/**
 * 获取列表数据
 */
async function getPayableList(data: PayableApi.PayableQuery) {
  return requestClient.post<CommApi.Response<PayableApi.Payable[]>>(
    `/finance/findPayableMainList`,
    data,
  );
}

/**
 * 查询应付款明细
 * @param data
 * @returns
 */
async function getPayableSubList(data: PayableApi.PayableQuery) {
  return requestClient.post<CommApi.Response<PayableApi.PayableSub[]>>(
    `/finance/findPayableSubList`,
    data,
  );
}

/**
 * 手工单
 */
async function uptPayableHand(data: PayableApi.PayableHand) {
  return requestClient.post(`/finance/payableHmo`, data);
}

/**
 * 累计
 * @returns
 */
function payableAccumulatePm() {
  return requestClient.post<CommApi.Response<number>>(`/finance/accumulatePm`);
}

/**
 * 一键核销
 * @param params
 * @returns
 */
function cavPayableSubBatch(params: { mainId: number }) {
  return requestClient.post(`/finance/cavPayableSubBatch`, null, { params });
}
/**
 * 核销
 * @param params
 * @returns
 */
function cavPayableSub(data: { ids: number[] }) {
  return requestClient.post(`/finance/cavPayableSub`, data);
}

export {
  cavPayableSub,
  cavPayableSubBatch,
  getPayableList,
  getPayableSubList,
  payableAccumulatePm,
  uptPayableHand,
};
