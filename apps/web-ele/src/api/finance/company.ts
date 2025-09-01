import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace CompanyApi {
  export interface Company {
    id: number;
    accountName: string; // 账户名称 ,
    balanceType: string; // 支付类型 WECHAT:微信 ALIPAY:支付宝 CASH:现金 BANK:银行 = ['WECHAT', 'ALIPAY', 'CASH', 'BANK']stringEnum:"WECHAT", "ALIPAY", "CASH", "BANK",
    companyId: number; // 公司id ,
    createTime: number; // 创建时间 ,
    defaultAmount: number; // 期初余额 ,
    deleteFlag: boolean; // 逻辑删除 ,
    isUsed: boolean; // 是否在用 ,
    moneyUse: number; // 当前余额 ,
    remark: string; // 备注 ,
    updateTime: number; // 修改时间 ,
    version: number; // 乐观锁
  }

  export interface CompanyQuery extends CommApi.PageParam {
    accountName?: string; // 账户名称 ,
    balanceType?: string; // 支付类型 = ['WECHAT', 'ALIPAY', 'CASH', 'BANK']stringEnum:"WECHAT", "ALIPAY", "CASH", "BANK",
  }
}

/**
 * 获取列表数据
 */
async function getCompanyList(data: CompanyApi.CompanyQuery) {
  return requestClient.post<CommApi.Response<CompanyApi.Company[]>>(
    `/company/findBankList`,
    data,
  );
}

/**
 * 详情
 */
async function getCompany(params: { id: number }) {
  return requestClient.get<CommApi.Response<CompanyApi.Company>>(
    `/company/findBankById`,
    {
      params,
    },
  );
}

/**
 * 创建
 * @param data 数据
 */
async function createCompany(data: Omit<CompanyApi.Company, 'id'>) {
  return requestClient.post('/company/addBank', data);
}

/**
 * 更新
 *
 * @param id ID
 * @param data data
 */
async function updateCompany(data: CompanyApi.Company) {
  return requestClient.put(`/company/updateBankById`, data);
}

/**
 * 删除
 * @param id id
 */
async function deleteCompanyById(params: { id: number }) {
  return requestClient.post(`/company/deleteById`, null, { params });
}

export {
  createCompany,
  deleteCompanyById,
  getCompany,
  getCompanyList,
  updateCompany,
};
