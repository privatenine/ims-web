import { requestClient } from '#/api/request';

export namespace PurchaseOrderApi {
  // 采购订单接口数据类型
  export interface PurchaseOrder {
    id: string;
    orderNo: string; // 单号
    orderStatus: string; // 订单状态
    supplierName: string; // 供应商
    totalAmount: number; // 总金额
    totalQuantity: number; // 总数量
    orderDate: string; // 订货日期
    bankAccount?: string; // 银行账号
    currency?: string; // 币种
    paidAdvance?: number; // 已付预付款
    paidDeposit?: number; // 已付定金
    expectedDate?: string; // 预计到货日期
    referenceMonths?: number; // 参考月数
    creator: string; // 制单员
    remark?: string; // 备注
  }

  // 采购订单明细项
  export interface PurchaseOrderItem {
    id: string;
    vehicleModel: string; // 通用车型
    productName: string; // 产品名称
    origin: string; // 产地
    quantity: number; // 数量
    arrivedQuantity: number; // 到货数量
    unArrivedQuantity: number; // 未到数量
    accumulatedQuantity: number; // 累结数
    stockQuantity: number; // 库存数
    cumulativeQuantity: number; // 累存数
    positiveQuantity: number; // 正定数
    inTransitQuantity: number; // 在途数
    policy: string; // 政策
    totalAmount: number; // 总金额
    trademark: string; // 商标
    bracket: string; // 支架
    color: string; // 颜色
    ribbon: string; // 彩带
  }

  // 查询参数
  export interface PurchaseOrderQuery {
    orderNo?: string; // 单号
    orderStatus?: string; // 订单状态
    supplierName?: string; // 供应商
    orderDate?: string; // 订货日期
    creator?: string; // 制单人
    pageNum: number;
    pageSize: number;
    sortParam?: {
      field: string;
      type: number;
    };
  }

  // 分页响应
  export interface PurchaseOrderPageResponse {
    data: PurchaseOrder[];
    total: number;
  }
}

// 获取采购订单列表
export async function getPurchaseOrderList(
  params: PurchaseOrderApi.PurchaseOrderQuery,
): Promise<PurchaseOrderApi.PurchaseOrderPageResponse> {
  return requestClient.get<PurchaseOrderApi.PurchaseOrderPageResponse>(
    '/purchase/order/findList',
    {
      params,
    },
  );
}

// 获取采购订单详情
export async function getPurchaseOrderDetail(
  id: string,
): Promise<PurchaseOrderApi.PurchaseOrder> {
  return requestClient.get<PurchaseOrderApi.PurchaseOrder>(
    `/purchase/order/${id}`,
  );
}

// 创建采购订单
export async function createPurchaseOrder(
  data: Partial<PurchaseOrderApi.PurchaseOrder>,
): Promise<PurchaseOrderApi.PurchaseOrder> {
  return requestClient.post<PurchaseOrderApi.PurchaseOrder>(
    '/purchase/order',
    data,
  );
}

// 更新采购订单
export async function updatePurchaseOrder(
  id: string,
  data: Partial<PurchaseOrderApi.PurchaseOrder>,
): Promise<PurchaseOrderApi.PurchaseOrder> {
  return requestClient.put<PurchaseOrderApi.PurchaseOrder>(
    `/purchase/order/${id}`,
    data,
  );
}

// 删除采购订单
export async function deletePurchaseOrder(id: string): Promise<void> {
  return requestClient.delete<void>(`/purchase/order/${id}`);
}
