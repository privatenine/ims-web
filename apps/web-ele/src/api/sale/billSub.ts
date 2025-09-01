import type { BillApi, CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace BillSubApi {
  export interface BillSub {
    id: number;
    actiNum: number; // 实际出货 ,
    balanceId: number; // 库存id ,
    baseId: number; // 基础资料id ,
    buyPrice: number; // 进货价 ,
    code: string; // 销售编号 ,
    createTime: number; // 创建时间 ,
    custFlag: string; // 标志 ,
    featureCode: string; // 特征码 ,
    limitSalePrice: number; // 最低销售价 ,
    nextShowFlag: string; // 核销标识 ,
    num: number; // 开单数量 ,
    price: number; // 实际售价 ,
    priceReference: number; // 参考售价 ,
    productAttachmentIds: string; // 产品附件id组合 ,
    productAttachmentNames: string; // 产品附件名称组合 ,
    productId: number; // 产品id ,
    productName: string; // 产品名称 ,
    productPlaceId: number; // 产品产地id ,
    productPlaceName: string; // 产品产地名称 ,
    remark: string; // 备注 ,
    returnFlag: number; // 是否可以退货0为可以1为不可以 ,
    returnGoodsNum: number; // 已退货数 ,
    saleId: number; // 销售ID ,
    saleMainRespVO: BillApi.Bill; // 销售单信息 ,
    siteName: string; // 库位名称 ,
    statusFlag: number; // 销售状态 1:草稿 2:待审批 3:待出库 4:出库完成 5:存档 6:退货 7:作废 8:驳回 9:已结算 ,
    storeId: number; // 仓库id ,
    storeName: string; // 仓库名称 ,
    supplierId: number; // 供应商id ,
    supplierName: string; // 供应商名字 ,
    totalPrice: number; // 总金额 ,
    updateTime: number; // 修改时间
  }

  export interface BillSubAdd {
    actiNum: number; // 实际出货 ,
    addSaleMainParam: BillApi.BillAdd; // 新增销售单信息 ,
    balanceId: number; // 库存id ,
    baseId: number; // 基础资料id ,
    code: string; // 销售编号 ,
    limitSalePrice: number; // 最低销售价 ,
    num: number; // 开单数量 ,
    price: number; // 实际价格（单价） ,
    priceReference: number; // 参考价格 ,
    printLabel: number; // 标签数 ,
    productAttachmentIds: string; // 产品附件id组合 ,
    productAttachmentNames: string; // 产品附件名称组合 ,
    productId: number; // 产品id ,
    productName: string; // 产品名称 ,
    productPlaceId: number; // 产品产地id ,
    productPlaceName: string; // 产品产地名称 ,
    remark: string; // 备注 ,
    saleId: number; // 销售ID ,
    siteName: string; // 库位名称 ,
    statusFlag: number; // 销售状态 1:草稿 2:待审批 3:待出库 4:出库完成 5:存档 6:退货 7:作废 8:驳回 9:已结算 ,
    storeId: number; // 仓库id ,
    supplierId: number; // 供应商id ,
    supplierName: string; // 供应商名字
  }

  export interface BalanceEntity {
    id: number;
    actiNum: number; // 库存数量 ,
    baseId: number; // 通用产品Id ,
    baseName: string; // 通用产品名称 ,
    batchPrice: number; // 最低销售价 ,
    buyPrice: number; // 进货价 ,
    createTime: number; // 创建时间 ,
    inventoryLock: number; // 盘点锁 1 未锁 2 已锁 ,
    isDefault: boolean; // 是否设置为默认货位 ,
    priceReference: number; // 进货参考价格 ,
    productAttachmentIds: string; // 产品附件id组合 ,
    productAttachmentNames: string; // 产品附件名称组合 ,
    productId: number; // 产品id ,
    productName: string; // 产品名称 ,
    productPlaceId: number; // 产品产地id ,
    productPlaceName: string; // 产品产地名称 ,
    siteName: string; // 货位名称 ,
    storeId: number; // 仓库id ,
    storeName: string; // 仓库名称 ,
    supplierId: number; // 供应商id ,
    supplierName: string; // 供应商名称 ,
    tradePrice1: number; // 批发价1 ,
    tradePrice2: number; // 批发价2 ,
    tradePrice3: number; // 批发价3 ,
    tradePrice4: number; // 批发价4 ,
    updateTime: number; // 修改时间
  }

  export interface BillSubQuery extends CommApi.PageParam {
    code: string; // 销售单编号 ,
    saleId: number; // 销售单id ,
  }

  export interface BalanceQuery extends CommApi.PageParam {
    isExcludeZero: boolean; // 是否排除数量0 ,
    isFuzzy: number; // 是否是模糊查询 1 是 0否 ,
    productJpm: string; // 产品简拼码 ,
    productName: string; // 产品名称 ,
    productPlaceId: number; // 产品产地id ,
    storeId: number; // 仓库id
  }
}

/**
 * 获取列表数据
 */
async function getBillSubList(data: BillSubApi.BillSubQuery) {
  return requestClient.post<CommApi.Response<BillSubApi.BillSub[]>>(
    `/sale/findSsList`,
    data,
  );
}

/**
 * 详情
 */
async function getBillSub(params: { id: number }) {
  return requestClient.get<CommApi.Response<BillSubApi.BillSub>>(
    `/sale/findSsById`,
    {
      params,
    },
  );
}

/**
 * 创建
 * @param data 数据
 */
async function createBillSub(data: Omit<BillSubApi.BillSubAdd, 'id'>) {
  return requestClient.post('/sale/addSs', data);
}

/**
 * 更新
 *
 * @param id ID
 * @param data data
 */
async function updateBillSub(data: Record<string, any>) {
  return requestClient.post(`/sale/updateSsById`, data);
}

/**
 * 删除
 * @param id id
 */
async function deleteBillSubById(params: { id: number }) {
  return requestClient.post(`/sale/deleteSsById`, null, { params });
}

/**
 * 获取列表数据
 */
async function findBalanceList(data: BillSubApi.BalanceQuery) {
  return requestClient.post<CommApi.Response<BillSubApi.BalanceEntity[]>>(
    `/sale/findBalanceList`,
    data,
  );
}

export {
  createBillSub,
  deleteBillSubById,
  findBalanceList,
  getBillSub,
  getBillSubList,
  updateBillSub,
};
