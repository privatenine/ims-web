import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace SupplierApi {
  export interface Supplier {
    id: number;
    address: string; // 地址 ,
    assets: number; // 供应商资产 ,
    bank1: string; // 开户行1 ,
    bank2: string; // 开户行2 ,
    bankAccount1: string; // 开户行账号1 ,
    bankAccount2: string; // 开户行账号2 ,
    businessType: string; // 业务类 ,
    carType: string; // 供应商车型 ,
    code: string; // 代码 ,
    companyId: number; // 所属公司Id ,
    contact: string; // 联系人 ,
    createTime: number; // 创建时间 ,
    creditLimit: number; // 挂账限额 ,
    device: string; // 拥有设备 ,
    discountRate: number; // 供应商优惠率 ,
    fax: string; // 传真 ,
    fullName: string; // 全称 ,
    gender: number; // 0未知 1 男 2 女 ,
    idCard: string; // 证件号 ,
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
    supplierType: number; // 供应商类型 ,
    taxNumber: string; // 税号 ,
    telephone: string; // 电话 ,
    transportType: number; // 运输方式 ,
    updateTime: number; // 修改时间
  }

  export interface SupplierQuery extends CommApi.PageParam {
    fullName: string; // 全称 ,
    shortName: number; // 简称 ,
    taxNumber: string; // 税号
  }
}

/**
 * 获取列表数据
 */
async function getSupplierList(data: SupplierApi.SupplierQuery) {
  return requestClient.post<CommApi.Response<SupplierApi.Supplier[]>>(
    `/contactUnits/findSupplierList`,
    data,
  );
}

/**
 * 详情
 */
async function getSupplier(id: number) {
  return requestClient.get<CommApi.Response<SupplierApi.Supplier>>(
    `/contactUnits/findSupplierById?id=${id}`,
  );
}
/**
 * 创建
 * @param data 数据
 */
async function createSupplier(data: Omit<SupplierApi.Supplier, 'id'>) {
  return requestClient.post('/contactUnits/addSupplier', data);
}

// /**
//  * 更新
//  *
//  * @param id  ID
//  * @param data 数据
//  */
// async function updateCarById(id: string, data: Omit<SupplierApi.Supplier, 'id'>) {
//   return requestClient.put(`/car/updateById/${id}`, data);
// }

/**
 * 更新
 *
 * @param id  ID
 * @param data 数据
 */
async function updateSupplier(data: SupplierApi.Supplier) {
  return requestClient.put(`/contactUnits/updateSupplierById`, data);
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
async function deleteSupplierByIds(data: any) {
  return requestClient.post(`/contactUnits/deleteSupplierByIds`, data);
}
export {
  createSupplier,
  deleteSupplierByIds,
  getSupplier,
  getSupplierList,
  updateSupplier,
};
