import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace InstallApi {
  // 用户响应VO
  export interface UserRespVO {
    realName?: string; // 真实姓名
    userId?: number; // 用户ID
    userType?: number; // 用户类型
    username?: string; // 用户名
  }

  // 安装订单响应VO
  export interface InstallOrderRespVO {
    accountNumber?: string; // 卡号
    actiNum?: number; // 活动数量
    anzhuangPersons?: UserRespVO[]; // 安装人员列表
    approveId?: number; // 审核员ID
    approveName?: string; // 审核员
    approveTime?: number; // 审核日期
    balanceId?: number; // 余额ID
    businessType?: number; // 业务类型
    code?: string; // 安装流水号
    createId?: number; // 制单用户id
    createName?: string; // 制单员
    createTime?: number; // 制单日期
    custId?: number; // 客户ID
    custName?: string; // 客户名称
    discountMoney?: number; // 折扣金额
    distribution?: number; // 配送
    featureCode?: string; // 特征码
    freight?: number; // 运费
    id?: number;
    imagePath1?: string; // 图片路径1
    imagePath2?: string; // 图片路径2
    imagePath3?: string; // 图片路径3
    imagePath4?: string; // 图片路径4
    imagePath5?: string; // 图片路径5
    imagePath6?: string; // 图片路径6
    installCarNum?: string; // 安装车牌号
    orderTime?: number; // 订单时间
    paymentMoney?: number; // 支付金额
    price?: number; // 价格
    printFlag?: number; // 打印次数
    printLabel?: number; // 打印标签
    productAttachmentIds?: string; // 产品附件ID
    productAttachmentNames?: string; // 产品附件名称
    productId?: number; // 产品ID
    productName?: string; // 产品名称
    productPlaceId?: number; // 产品位置ID
    productPlaceName?: string; // 产品位置名称
    receiveId?: number; // 接收ID
    remark?: string; // 备注
    saleCode?: string; // 销售流水号
    saleId?: number; // 销售ID
    saleSubId?: number; // 销售子ID
    siteName?: string; // 站点名称
    statusFlag?: number; // 状态 1:草稿 2:待审批 3:安装完成 4:驳回
    storeId?: number; // 仓库ID
    storeName?: string; // 仓库名称
    updateTime?: number; // 更新时间
    version?: number; // 乐观锁
  }

  // 排序参数
  export interface SortParam {
    field?: string; // 要排序的字段
    type?: number; // 排序类型, 0 或其他值
  }

  // 安装订单搜索参数
  export interface InstallOrderSearchParam extends CommApi.PageParam {
    code?: string; // 安装流水号
    custId?: number; // 客户ID
    endTime?: number; // 结束时间
    installCarNum?: string; // 安装车牌号
    productName?: string; // 产品名称
    saleCode?: string; // 销售流水号
    sortParam?: SortParam; // 排序参数
    startTime?: number; // 开始时间
    statusFlag?: number; // 状态 1:草稿 2:待审批 3:安装完成 4:驳回
  }

  // 安装订单创建/更新参数
  export interface InstallOrderAdd {
    id?: number;
    code?: string; // 安装流水号
    custId?: number; // 客户ID
    custName?: string; // 客户名称
    productId?: number; // 产品ID
    productName?: string; // 产品名称
    installCarNum?: string; // 安装车牌号
    saleCode?: string; // 销售流水号
    statusFlag?: number; // 状态
    anzhuangPersons?: UserRespVO[]; // 安装人员列表
    remark?: string; // 备注
  }
}

/**
 * 获取安装订单列表
 */
async function getInstallOrderList(data: InstallApi.InstallOrderSearchParam) {
  return requestClient.post<{
    additionInfo?: string;
    code: number;
    data: InstallApi.InstallOrderRespVO[];
    msg: string;
    requestTime?: number;
    total: number;
  }>(`/sale/findSiList`, data);
}

/**
 * 获取安装订单详情
 */
async function getInstallOrder(params: { id: number }) {
  return requestClient.get<CommApi.Response<InstallApi.InstallOrderRespVO>>(
    `/sale/findSiById`,
    { params },
  );
}

/**
 * 创建安装订单
 */
async function createInstallOrder(data: InstallApi.InstallOrderAdd) {
  return requestClient.post('/sale/addSi', data);
}

/**
 * 更新安装订单
 */
async function updateInstallOrder(data: InstallApi.InstallOrderAdd) {
  return requestClient.put('/sale/updateSiById', data);
}

/**
 * 删除安装订单
 */
async function deleteInstallOrderById(params: { id: number }) {
  return requestClient.post('/sale/deleteSiById', null, { params });
}

/**
 * 审核安装订单
 */
async function approveInstallOrder(params: { id: number; version: number }) {
  return requestClient.post('/sale/approveSi', null, { params });
}

/**
 * 反审安装订单
 */
async function reverseApproveInstallOrder(params: {
  id: number;
  version: number;
}) {
  return requestClient.post('/sale/reverseApproveSi', null, { params });
}

/**
 * 获取安装订单编号
 */
function getInstallOrderCode() {
  return requestClient.get<CommApi.Response<string>>('/sale/getSiCode');
}

export {
  approveInstallOrder,
  createInstallOrder,
  deleteInstallOrderById,
  getInstallOrder,
  getInstallOrderCode,
  getInstallOrderList,
  reverseApproveInstallOrder,
  updateInstallOrder,
};
