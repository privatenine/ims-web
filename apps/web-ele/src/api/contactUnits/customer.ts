import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace CustomerApi {
  export interface Customer {
    id: number;
    address: string; // 地址 ,
    assets: number; // 客户资产 ,
    bank1: string; // 开户行1 ,
    bank2: string; // 开户行2 ,
    bankAccount1: string; // 开户行账号1 ,
    bankAccount2: string; // 开户行账号2 ,
    bankAccountName1: string; // 户名1 ,
    bankAccountName2: string; // 户名2 ,
    businessType: string; // 业务类 ,
    carType: string; // 客户车型 ,
    code: string; // 代码 ,
    companyId: number; // 所属公司Id ,
    contact: string; // 联系人 ,
    createTime: number; // 创建时间 ,
    creditLimit: number; // 挂账限额 ,
    customerType: number; // 客户类型 ,
    discountRate: number; // 客户优惠率 ,
    fax: string; // 传真 ,
    fullName: string; // 全称 ,
    gender: number; // 0未知 1 男 2 女 ,
    idCard: string; // 证件号 ,
    isCompany: boolean; // 是否是企业 ,
    logistics: string; // 常用物流 ,
    mobilePhone: string; // 手机 ,
    payMethod: number; // 支付方式 ,
    postCode: string; // 邮编 ,
    priceLevel: number; // 价格级别 ,
    region1: string; // 区域一 ,
    region2: string; // 区域二 ,
    region3: string; // 区域三 ,
    remark: string; // 备注 ,
    salesmanId: number; // 所属业务员Id ,
    salesmanName: string; // 所属业务员名字 ,
    shortName: string; // 简称 ,
    taxNumber: string; // 税号 ,
    telephone: string; // 电话 ,
    transportType: number; // 运输方式 ,
    updateTime: number; // 修改时间
  }

  export interface CustomerQuery extends CommApi.PageParam {
    bank: string; // 开户行 ,
    bankAccount: string; // 开户行账号 ,
    fullName: string; // 全称 ,
    shortName: string; // 简称 ,
  }
}

/**
 * 获取列表数据
 */
async function getCustomerList(data: CustomerApi.CustomerQuery) {
  return requestClient.post<CommApi.Response<CustomerApi.Customer[]>>(
    `/contactUnits/findCustomerList`,
    data,
  );
}

/**
 * 详情
 */
async function getCustomer(id: number) {
  return requestClient.get<CommApi.Response<CustomerApi.Customer>>(
    `/contactUnits/findCustomerById?id=${id}`,
  );
}
/**
 * 创建
 * @param data 数据
 */
async function createCustomer(data: Omit<CustomerApi.Customer, 'id'>) {
  return requestClient.post('/contactUnits/addCustomer', data);
}

// /**
//  * 更新部门
//  *
//  * @param id  ID
//  * @param data 数据
//  */
// async function updateCarById(id: string, data: Omit<CustomerApi.Customer, 'id'>) {
//   return requestClient.put(`/car/updateById/${id}`, data);
// }

/**
 * 更新部门
 *
 * @param id  ID
 * @param data 数据
 */
async function updateCustomer(data: CustomerApi.Customer) {
  return requestClient.put(`/contactUnits/updateCustomerById`, data);
}

// /**
//  * 删除
//  * @param id  ID
//  */
// async function deleteCar(id: string) {
//   return requestClient.delete(`/system/dept/${id}`);
// }
/**
 * 批量删除
 */
async function deleteCustomerByIds(data: any) {
  return requestClient.post(`/contactUnits/deleteCustomerByIds`, data);
}
export {
  createCustomer,
  deleteCustomerByIds,
  getCustomer,
  getCustomerList,
  updateCustomer,
};
