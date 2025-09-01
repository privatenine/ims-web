import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace ShareApi {
  // 共享库存查询参数
  export interface ShareInventorySearchParam extends CommApi.PageParam {
    productJpm?: string; // 产品简拼
    productName?: string; // 产品名称
    specification?: string; // 规格
    productPlaceId?: number; // 产地ID
    supplierName?: string; // 公司名称
    source?: string; // 来源
    storeName?: string; // 仓库名称
    siteName?: string; // 库位
  }

  // 共享库存项目实体
  export interface ShareInventoryItem {
    id: number;
    productId: number; // 产品ID
    productName: string; // 产品名称
    productJpm?: string; // 产品简拼
    specification?: string; // 规格
    productPlaceId?: number; // 产地ID
    productPlaceName?: string; // 产地名称
    supplierId?: number; // 供应商ID
    supplierName?: string; // 供应商名称
    storeId: number; // 仓库ID
    storeName?: string; // 仓库名称
    siteName?: string; // 库位名称
    actiNum: number; // 库存数量
    price?: number; // 价格
    priceReference?: number; // 参考价格

    // 产品特征属性
    rainSensor?: string; // 雨感器 1:有 0:无
    sealant?: string; // 胶条 1:有 0:无
    trademark?: string; // 商标
    bracket?: string; // 支架
    color?: string; // 颜色
    ribbon?: string; // 彩带
    featureCode?: string; // 特征码
    edge?: string; // 印边
    nightVision?: string; // 夜视
    plug?: string; // 插头

    // 附件信息
    productAttachmentIds?: string; // 产品附件ID组合
    productAttachmentNames?: string; // 产品附件名称组合

    // 基础字段
    createId?: number;
    createName?: string;
    createTime?: number;
    updateTime?: number;
    remark?: string;
    version?: number;
  }

  // 共享库存列表查询结果
  export interface ShareInventoryPageResponse {
    items: ShareInventoryItem[];
    total: number;
  }
}

/**
 * 获取共享库存列表数据
 */
async function findShareInventoryList(
  data: ShareApi.ShareInventorySearchParam,
) {
  return requestClient.post<CommApi.Response<ShareApi.ShareInventoryItem[]>>(
    `/sale/findShareInventoryList`,
    data,
  );
}

/**
 * 获取共享库存详情
 */
async function getShareInventoryItem(id: number) {
  return requestClient.get<CommApi.Response<ShareApi.ShareInventoryItem>>(
    `/sale/findShareInventoryById?id=${id}`,
  );
}

/**
 * 订单详情查询
 */
async function findOrderDetails(productId: number) {
  return requestClient.get<CommApi.Response<any>>(
    `/sale/findOrderDetailsByProductId?productId=${productId}`,
  );
}

/**
 * 采购订单查询
 */
async function findPurchaseOrders(productId: number) {
  return requestClient.get<CommApi.Response<any>>(
    `/purchase/findOrdersByProductId?productId=${productId}`,
  );
}

/**
 * 大类号查询
 */
async function findCategoryInfo(productId: number) {
  return requestClient.get<CommApi.Response<any>>(
    `/product/findCategoryByProductId?productId=${productId}`,
  );
}

export {
  findCategoryInfo,
  findOrderDetails,
  findPurchaseOrders,
  findShareInventoryList,
  getShareInventoryItem,
};
