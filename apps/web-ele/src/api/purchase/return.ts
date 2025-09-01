import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

/**
 * 获取采购退货单号
 * @returns
 */
function getPurchaseReturnCode() {
  return requestClient.get<CommApi.Response<string>>(`/purchase/getPrmCode`);
}

/**
 * 获取采购退货单列表
 * @param data 查询参数
 * @returns
 */
function getPurchaseReturnList(data: {
  [key: string]: any;
  endTime?: number;
  pageNum?: number;
  pageSize?: number;
  sortParam?: {
    field: string;
    type: number;
  };
  startTime?: number;
}) {
  return requestClient.post<CommApi.Response<Array<Record<string, any>>>>(
    `/purchase/findPrmList`,
    data,
  );
}

/**
 * 获取采购退货单详情
 * @param id 退货单ID
 * @returns
 */
function getPurchaseReturnPrmById(id: number) {
  return requestClient.get<
    CommApi.Response<{
      approveId: number;
      approveName: string;
      approveTime: number;
      code: string;
      createId: number;
      createName: number;
      createTime: number;
      id: number;
      loadingPersons: Array<{
        realName: string;
        userId: number;
        username: string;
        userType: number;
      }>;
      pickingPersons: Array<{
        realName: string;
        userId: number;
        username: string;
        userType: number;
      }>;
      printFlag: number;
      printLabel: number;
      remark: string;
      statusFlag: number;
      supplierId: number;
      supplierName: string;
      totalMoney: number;
      totalNum: number;
      totalPrice: number;
      version: number;
    }>
  >(`/purchase/findPrmById?id=${id}`);
}

/**
 * 删除采购退货单
 * @param id 退货单ID
 * @returns
 */
function deletePurchaseReturnPrmById(id: number) {
  return requestClient.post<CommApi.Response<Record<string, any>>>(
    `/purchase/deletePrmById?id=${id}`,
    null,
  );
}

/**
 * 审核通过采购退货单
 * @param data 审核参数
 * @returns
 */
function approvePurchaseReturn(data: { id: number; version: number }) {
  return requestClient.post<CommApi.Response<Record<string, any>>>(
    `/purchase/approvePrm?mainId=${data.id}&version=${data.version}`,
    null,
  );
}

/**
 * 驳回采购退货单
 * @param data 驳回参数
 * @returns
 */
function rejectPurchaseReturn(data: { id: number; version: number }) {
  return requestClient.post<CommApi.Response<Record<string, any>>>(
    `/purchase/rejectPrm?mainId=${data.id}&version=${data.version}`,
    null,
  );
}

/**
 * 创建采购退货单
 * @param data 退货单数据
 * @returns
 */
function createPurchaseReturn(data: {
  code: string;
  details: Array<{
    actiNum: number;
    balanceId: number;
    formCode: string;
    formId: number;
    num: number;
    price: number;
    priceReference: number;
    productAttachmentIds: string;
    productAttachmentNames: string;
    productId: number;
    productName: string;
    productPlaceId: number;
    productPlaceName: string;
    remark: string;
    siteName: string;
    storeId: number;
    storeName: string;
    totalPrice: number;
  }>;
  loadingPersonIds: number[];
  pickingPersonIds: number[];
  printFlag: number;
  printLabel: number;
  remark: string;
  statusFlag: number;
  supplierId: number;
  supplierName: string;
  totalMoney: number;
  totalNum: number;
  totalPrice: number;
  version: number;
}) {
  return requestClient.post<CommApi.Response<Record<string, any>>>(
    `/purchase/createPrm`,
    data,
  );
}

/**
 * 添加采购退货单
 * @param data 退货单数据
 * @returns
 */
function addPurchaseReturn(data: {
  code: string; // 退货单号
  loadingPersonIds: number[]; // 装货人员ID列表
  pickingPersonIds: number[]; // 拣货人员ID列表
  printFlag: number; // 打印标志
  printLabel: number; // 打印标签
  remark: string; // 备注
  statusFlag: number; // 状态标志 1:草稿 2:待审批
  supplierId: number; // 供应商ID
  supplierName: string; // 供应商名称
}) {
  return requestClient.post<CommApi.Response<Record<string, any>>>(
    `/purchase/addPrm`,
    data,
  );
}

/**
 * 更新采购退货单
 * @param data 退货单数据
 * @returns
 */
function updatePurchaseReturn(data: {
  code: string;
  id: number;
  loadingPersonIds: number[];
  pickingPersonIds: number[];
  printFlag: number;
  printLabel: number;
  remark: string;
  statusFlag: number;
  supplierId: number;
  supplierName: string;
  version: number;
}) {
  return requestClient.put<CommApi.Response<Record<string, any>>>(
    `/purchase/updatePrm`,
    data,
  );
}

/**
 * 创建采购退货单明细
 * @param data 明细数据
 * @returns
 */
function createPurchaseReturnSub(data: {
  actiNum?: number; // 库存数量
  addPurchaseReturnMainParam?: {
    code?: string; // 退货流水号
    loadingPersonIds?: number[]; // 装货人员id列表
    pickingPersonIds?: number[]; // 拣货人员id列表
    printFlag?: number; // 打印次数
    printLabel?: number; // 打印标签
    remark?: string; // 备注
    statusFlag?: number; // 采购退货状态 1:草稿 2:待审批 3:已完成 4:驳回
    supplierId?: number; // 供应商id
    supplierName?: string; // 供应商名称
  }; // 退货单信息
  balanceId?: number; // 库存id
  code?: string; // 退货流水号
  formCode?: string; // 采购流水号
  formId?: number; // 采购id
  mainId?: number; // 退货ID
  num?: number; // 退货数量
  price?: number; // 单价
  priceReference?: number; // 参考售价
  productAttachmentIds?: string; // 产品附件id组合
  productAttachmentNames?: string; // 产品附件名称组合
  productId?: number; // 产品id
  productName?: string; // 产品名称
  productPlaceId?: number; // 产品产地id
  remark?: string; // 备注
  siteName?: string; // 库位名称
  statusFlag?: number; // 采购退货状态 1:草稿 2:待审批 3:已完成 4:驳回
  storeId?: number; // 仓库id
}) {
  return requestClient.post<CommApi.Response<Record<string, any>>>(
    `/purchase/addPrs`,
    data,
  );
}

/**
 * 修改采购退货单明细
 * @param data 明细数据
 * @returns
 */
function updatePurchaseReturnSub(data: {
  balanceId?: number;
  id: number;
  mainId: number;
  num: number;
  price: number;
  productAttachmentIds?: string;
  productAttachmentNames?: string;
  productId: number;
  productName: string;
  productPlaceId?: number;
  productPlaceName?: string;
  remark?: string;
  siteName?: string;
  storeId?: number;
  storeName?: string;
  totalPrice: number;
}) {
  return requestClient.post<CommApi.Response<Record<string, any>>>(
    `/purchase/addPrs`,
    data,
  );
}

/**
 * 删除采购退货单明细
 * @param params 删除参数
 * @returns
 */
function deletePurchaseReturnSubById(params: { id: number }) {
  return requestClient.post<CommApi.Response<Record<string, any>>>(
    `/purchase/deletePrsById?id=${params.id}`,
  );
}

/**
 * 获取采购退货单明细列表（详情页面用）
 * @param params 查询参数
 * @returns
 */
function getPurchaseReturnPrmSubListForDetail(params: {
  code: string;
  mainId: number;
  pageNum: number;
  pageSize: number;
  sortParam?: {
    field: string;
    type: number;
  };
}) {
  return requestClient.post<
    CommApi.Response<
      Array<{
        actiNum: number;
        createTime: number;
        id: number;
        mainId: number;
        price: number;
        priceReference: number;
        printLabel: number;
        productId: number;
        productName: string;
        remark: string;
        totalPrice: number;
        updateTime: number;
      }>
    >
  >(`/purchase/findPrsList`, params);
}

/**
 * 获取采购退货单明细列表
 * @param data 查询参数
 * @returns
 */
function getPurchaseReturnSubList(data: {
  code?: string;
  mainId?: number;
  pageNum?: number;
  pageSize?: number;
  sortParam?: {
    field: string;
    type: number;
  };
}) {
  return requestClient.post<
    CommApi.Response<
      Array<{
        actiNum: number;
        balanceId: number;
        code: string;
        createId: number;
        createTime: number;
        formCode: string;
        formId: number;
        id: number;
        mainId: number;
        num: number;
        price: number;
        priceReference: number;
        productAttachmentIds: string;
        productAttachmentNames: string;
        productId: number;
        productName: string;
        productPlaceId: number;
        productPlaceName: string;
        purchaseReturnMainRespVO: {
          approveId: number;
          approveName: string;
          approveTime: number;
          code: string;
          createId: number;
          createName: number;
          createTime: number;
          id: number;
          loadingPersons: Array<{
            realName: string;
            userId: number;
            username: string;
            userType: number;
          }>;
          pickingPersons: Array<{
            realName: string;
            userId: number;
            username: string;
            userType: number;
          }>;
          printFlag: number;
          printLabel: number;
          remark: string;
          statusFlag: number;
          supplierId: number;
          supplierName: string;
          totalMoney: number;
          totalNum: number;
          totalPrice: number;
          version: number;
        };
        remark: string;
        siteName: string;
        statusFlag: number;
        storeId: number;
        storeName: string;
        totalPrice: number;
      }>
    >
  >(`/purchase/findPrsList`, data);
}

export {
  addPurchaseReturn,
  approvePurchaseReturn,
  createPurchaseReturn,
  createPurchaseReturnSub,
  deletePurchaseReturnPrmById,
  deletePurchaseReturnSubById,
  getPurchaseReturnCode,
  getPurchaseReturnList,
  getPurchaseReturnPrmById,
  getPurchaseReturnPrmSubListForDetail,
  getPurchaseReturnSubList,
  rejectPurchaseReturn,
  updatePurchaseReturn,
  updatePurchaseReturnSub,
};
