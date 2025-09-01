import type { CommApi, PayableApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace ReceivablesApi {
  export interface Receivables {
    id: number;
    amountPaid: number; // 已收金额 ,
    amountUnpaid: number; // 未收金额 ,
    contact: string; // 联系人 ,
    createTime: number; // 创建时间 ,
    creditLimit: number; // 挂账限额 ,
    customerId: number; // 客户id ,
    customerName: string; // 客户名称 ,
    mobilePhone: string; // 手机 ,
    region1: string; // 区域一 ,
    region2: string; // 区域二 ,
    region3: string; // 区域三 ,
    remark: string; // 备注 ,
    shortName: string; // 简称 ,
    telephone: string; // 电话 ,
    totalMoney: number; // 合计金额 ,
    totalNum: number; // 总数 ,
    updateTime: number; // 修改时间
  }

  export interface ReceivablesSub {
    id: number;
    amountPaid: number; // 已收金额 ,
    amountUnpaid: number; // 未收金额 ,
    approveId: number; // 审核员ID ,
    approveName: string; // 审核员名称 ,
    approveTime: number; // 审核日期 ,
    balanceMoney: number; // 应收金额 ,
    bankId: number; // 结算账户ID ,
    bankName: string; // 结算账户名 ,
    code: string; // 收款单号 ,
    createId: number; // 创建者 ,
    createTime: number; // 创建时间 ,
    formCode: string; // 收款编码 ,
    formId: number; // 单据id ,
    mainId: number; // 主表id ,
    remark: string; // 备注 ,
    statusFlag: number; // 状态 1：待结算 2：存档 3：驳回 ,
    totalNum: number; // 总数 ,
    typeName: string; // 单据类型 = ['FREE_INVOICE', 'OUTBOUND', 'INSTALL', 'TO_INSTALL', 'HANDMADE', 'SALES', 'SALES_RETURN']stringEnum:"FREE_INVOICE", "OUTBOUND", "INSTALL", "TO_INSTALL", "HANDMADE", "SALES", "SALES_RETURN",
    typeNameZh: string; // 单据类型中文 ,
    updateTime: number; // 修改时间
  }
  export interface ReceivablesQuery extends CommApi.PageParam {
    isExcludeZero: boolean; // 是否排除数量0 ,
    name: string; // 单位名称 ,
    code: string; // 付款单号 ,
    formCode: string; // 核销单据 ,
    mainId: number; // 主表id ,
    statusFlag: number; // 状态 1：待结算 2：存档 3：驳回
  }
}

/**
 * 获取列表数据
 */
async function getReceivablesList(data: ReceivablesApi.ReceivablesQuery) {
  return requestClient.post<CommApi.Response<ReceivablesApi.Receivables[]>>(
    `/finance/findReceivablesMainList`,
    data,
  );
}

/**
 * 查询应付款明细
 * @param data
 * @returns
 */
async function getReceivablesSubList(data: ReceivablesApi.ReceivablesQuery) {
  return requestClient.post<CommApi.Response<ReceivablesApi.Receivables>>(
    `/finance/findReceivablesSubList`,
    data,
  );
}
/**
 * 手工单
 */
async function uptReceivablesHand(data: PayableApi.PayableHand) {
  return requestClient.post(`/finance/receivablesHmo`, data);
}

/**
 * 累计
 * @returns
 */
function accumulateRm() {
  return requestClient.post(`/finance/accumulateRm`);
}

/**
 * 一键核销
 * @param params
 * @returns
 */
function cavReceivablesSubBatch(params: { mainId: number }) {
  return requestClient.post(`/finance/cavReceivablesSubBatch`, null, {
    params,
  });
}
/**
 * 核销
 * @param params
 * @returns
 */
function cavReceivablesSub(data: { ids: number[] }) {
  return requestClient.post(`/finance/cavReceivablesSub`, data);
}

export {
  accumulateRm,
  cavReceivablesSub,
  cavReceivablesSubBatch,
  getReceivablesList,
  getReceivablesSubList,
  uptReceivablesHand,
};
