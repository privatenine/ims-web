import { requestClient } from '#/api/request';

export namespace DeliveryApi {
  /** 用户信息 */
  export interface UserRespVO {
    realName: string;
    userId: number;
    userType: number;
    username: string;
  }

  /** 排序参数 */
  export interface SortParam {
    field?: string;
    type?: number; // 1 正序 -1 倒序
  }

  /** 配送订单主表信息 */
  export interface DeliveryOrderMainRespVO {
    id?: number;
    code?: string; // 配送流水号
    statusFlag?: number; // 配送状态 1:草稿 2:待审批 3:配送结束 4:驳回
    createId?: number;
    createName?: string; // 制单员
    createTime?: number; // 制单时间
    approveId?: number;
    approveName?: string; // 审核员
    approveTime?: number; // 审核时间
    accountNumber?: string; // 卡号
    carNum?: string; // 车牌号
    carId?: number; // 车辆ID
    totalMoney?: number; // 总金额
    totalNum?: number; // 总数量
    deliveryPersons?: UserRespVO[]; // 配送人员
    loadingPersons?: UserRespVO[]; // 装货人员
    logisticsName?: string; // 物流名称
    logisticsNumber?: string; // 物流单号
    remark?: string; // 备注
    version?: number; // 版本号
  }

  /** 配送订单搜索参数 */
  export interface DeliveryOrderSearchParam {
    code?: string; // 配送流水号
    carId?: number; // 车辆ID
    statusFlag?: number; // 配送状态
    startTime?: number; // 开始时间
    endTime?: number; // 结束时间
    pageNum?: number; // 页码
    pageSize?: number; // 每页数量
    sortParam?: SortParam; // 排序参数
  }

  /** 配送订单添加参数 */
  export interface DeliveryOrderAdd {
    code?: string;
    carId?: number;
    accountNumber?: string;
    deliveryPersons?: UserRespVO[];
    loadingPersons?: UserRespVO[];
    logisticsName?: string;
    logisticsNumber?: string;
    remark?: string;
  }

  /** 审核参数 */
  export interface DeliveryOrderApproveParam {
    id: number;
    version: number;
  }

  /** 分页响应 */
  export interface DeliveryOrderPageResponse {
    code: number;
    msg: string;
    data: DeliveryOrderMainRespVO[];
    total: number;
    additionInfo?: string;
    requestTime?: number;
  }
}

/**
 * 获取配送订单列表
 */
export async function getDeliveryOrderList(
  params: DeliveryApi.DeliveryOrderSearchParam,
): Promise<DeliveryApi.DeliveryOrderPageResponse> {
  return requestClient.post('/sale/delivery/list', params);
}

/**
 * 获取配送订单详情
 */
export async function getDeliveryOrder(
  id: number,
): Promise<DeliveryApi.DeliveryOrderMainRespVO> {
  return requestClient.get(`/sale/delivery/get/${id}`);
}

/**
 * 创建配送订单
 */
export async function createDeliveryOrder(
  params: DeliveryApi.DeliveryOrderAdd,
): Promise<{ code: number; data?: any; msg: string }> {
  return requestClient.post('/sale/delivery/add', params);
}

/**
 * 更新配送订单
 */
export async function updateDeliveryOrder(
  params: DeliveryApi.DeliveryOrderAdd & { id: number; version: number },
): Promise<{ code: number; data?: any; msg: string }> {
  return requestClient.post('/sale/delivery/update', params);
}

/**
 * 删除配送订单
 */
export async function deleteDeliveryOrderById(params: { id: number }): Promise<{
  code: number;
  msg: string;
}> {
  return requestClient.post('/sale/delivery/delete', params);
}

/**
 * 批量删除配送订单
 */
export async function deleteDeliveryOrderByIds(params: {
  ids: number[];
}): Promise<{
  code: number;
  msg: string;
}> {
  return requestClient.post('/sale/delivery/delete/batch', params);
}

/**
 * 审核配送订单
 */
export async function approveDeliveryOrder(
  params: DeliveryApi.DeliveryOrderApproveParam,
): Promise<{ code: number; msg: string }> {
  return requestClient.post('/sale/delivery/approve', params);
}

/**
 * 反审配送订单
 */
export async function reverseApproveDeliveryOrder(
  params: DeliveryApi.DeliveryOrderApproveParam,
): Promise<{ code: number; msg: string }> {
  return requestClient.post('/sale/delivery/reverse-approve', params);
}

/**
 * 获取配送流水号
 */
export async function getDeliveryCode(): Promise<{
  additionInfo?: string;
  code: number;
  data: string;
  msg: string;
  requestTime?: number;
  total?: number;
}> {
  return requestClient.get('/sale/getDomCode');
}
