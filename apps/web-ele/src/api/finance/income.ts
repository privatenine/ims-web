import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace InComeApi {
  export interface InCome {
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
    createId: number; // 创建用户id ,
    createName: string; // 创建用户 ,
    createTime: number; // 创建时间 ,
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

  export interface InComeQuery extends CommApi.PageParam {
    code: string; // 收款流水号 ,
    formCode: string; // 收款单据 ,
    statusFlag: number; // 收款状态 1:草稿 2:待结算 3:结算成功 4:结算驳回 ,
    typeName: string; // 类别
  }
}

/**
 * 获取列表数据
 */
async function getInComeList(data: InComeApi.InComeQuery) {
  return requestClient.post<CommApi.Response<InComeApi.InCome[]>>(
    `/finance/findRo2List`,
    data,
  );
}

/**
 * 详情
 */
async function getInCome(params: { id: number }) {
  return requestClient.get<CommApi.Response<InComeApi.InCome>>(
    `/finance/findRo2Detail`,
    {
      params,
    },
  );
}

/**
 * 创建
 * @param data 数据
 */
async function createInCome(data: Omit<InComeApi.InCome, 'id'>) {
  return requestClient.post('/finance/addRo2', data);
}

/**
 * 更新
 *
 * @param id ID
 * @param data data
 */
async function updateInCome(data: InComeApi.InCome) {
  return requestClient.post(`/finance/updateRo2`, data);
}

/**
 * 删除
 * @param id id
 */
async function deleteInComeById(params: { id: number }) {
  return requestClient.post(`/finance/deleteRo2ById`, null, { params });
}

/**
 * 结算
 * @param params
 * @returns
 */
function approveInComeById(params: { id: number; version: number }) {
  return requestClient.post(`/finance/approveRo2`, null, { params });
}

/**
 * 结算
 * @param params
 * @returns
 */
function rejectInComeById(params: { id: number; version: number }) {
  return requestClient.post(`/finance/rejectRo2`, null, { params });
}

export {
  approveInComeById,
  createInCome,
  deleteInComeById,
  getInCome,
  getInComeList,
  rejectInComeById,
  updateInCome,
};
