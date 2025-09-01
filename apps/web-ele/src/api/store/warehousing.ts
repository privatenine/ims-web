import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace WarehousingApi {
  export interface Warehousing {
    id: number;
    actiNum: number; // 库存数量 ,
    baseName: string; // 通用产品名称 ,
    batchPrice: number; // 最低销售价 ,
    buyPrice: number; // 进货价 ,
    claimPrice: number; // 理赔价 ,
    createTime: number; // 创建时间 ,
    installPrice: number; // 安装价 ,
    inventoryLock: number; // 盘点锁 1 未锁 2 已锁 ,
    isDefault: boolean; // 是否设置为默认货位 ,
    priceReference: number; // 进货参考价格 ,
    productAttachmentIds: string; // 产品附件id组合 ,
    productAttachmentNames: string; // 产品附件名称组合 ,
    productId: number; // 产品id ,
    productName: string; // 产品名称 ,
    productPlaceId: number; // 产品产地id ,
    productPlaceName: string; // 产品产地名称 ,
    retailPrice: number; // 零售价 ,
    siteName: string; // 货位名称 ,
    spotPrice: number; // 调货价 ,
    storeId: number; // 仓库id ,
    storeName: string; // 仓库名称 ,
    supplierId: number; // 供应商id ,
    supplierName: string; // 供应商名字 ,
    updateTime: number; // 修改时间
  }

  export interface WarehousingSub {
    id: number;

    actiNum: number; // 库存数量 ,
    addNum: number; // 入库数量 ,
    balanceId: number; // 库存Id ,
    buyPrice: number; // 进货价 ,
    claimPrice: number; // 理赔价 ,
    createTime: number; // 创建时间 ,
    featureCode: string; // 特征码 ,
    formCode: string; // 订单编号 ,
    formId: number; // 订单ID ,
    installPrice: number; // 安装价 ,
    inventoryLock: number; // 盘点锁 ,
    minusNum: number; // 出库数量 ,
    monthField: string;
    priceReference: number; // 进货参考价格 ,
    productId: number; // 产品id ,
    productName: string; // 产品名称 ,
    productPlaceId: number; // 产品产地id ,
    productPlaceName: string; // 产品产地名称 ,
    retailPrice: number; // 零售价 ,
    spotPrice: number; // 调货价 ,
    storeId: number; // 仓库id ,
    storeName: string; // 仓库名称 ,
    storeSiteName: string; // 库位名称 ,
    tradePrice1: number; // 批发价1 ,
    tradePrice2: number; // 批发价2 ,
    tradePrice3: number; // 批发价3 ,
    tradePrice4: number; // 批发价4 ,
    typeName: string; // 类型 = ['PRODUCT', 'WAREHOUSING', 'INIT', 'CHANGE', 'REPORT_LOSS', 'INVENTORY_lOSS', 'INVENTORY_SURPLUS', 'TRANSFER', 'PURCHASE_RETURN', 'SALES_SLIP', 'SALES_REVIEW', 'SALES_RETURN']stringEnum:"PRODUCT", "WAREHOUSING", "INIT", "CHANGE", "REPORT_LOSS", "INVENTORY_lOSS", "INVENTORY_SURPLUS", "TRANSFER", "PURCHASE_RETURN", "SALES_SLIP", "SALES_REVIEW", "SALES_RETURN",
    typeNameZh: string; // 类型中文 ,
    updateTime: number; // 修改时间 ,
    version: number; // 乐观锁
  }

  export interface WarehousingQuery extends CommApi.PageParam {
    inventoryLock: number; // 盘点锁 1 未锁 2 已锁 ,
    isExcludeZero: boolean; // 是否排除数量0 ,
    productJpm: string; // 产品简拼码 ,
    productName: string; // 产品名称 ,
    productPlaceId: number; // 产品产地id ,
    siteName: string; // 货位名称 ,
    storeId: number; // 仓库id

    balanceId: number; // 库存Id ,
    endTime: number; // 结束时间 ,
    startTime: number; // 开始时间
  }
}

/**
 * 获取列表数据
 */
async function getWarehousingList(data: WarehousingApi.WarehousingQuery) {
  return requestClient.post<CommApi.Response<WarehousingApi.Warehousing[]>>(
    `/balance/findTempList`,
    data,
  );
}

/**
 * 获取数据
 */
async function getWarehousingSubList(id: number) {
  return requestClient.get<CommApi.Response<WarehousingApi.Warehousing>>(
    `/balance/findSubList?userId=${id}`,
  );
}

export { getWarehousingList, getWarehousingSubList };
