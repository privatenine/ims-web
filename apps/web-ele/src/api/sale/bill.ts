import type { BillSubApi, CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace BillApi {
  export interface Bill {
    id: number;
    approveId: number; // 审核员ID ,
    approveName: string; // 审核员 ,
    approveTime: number; // 审核日期 ,
    businessType: number; // 业务类型 122:零售 123:批发 124:其它 ,
    businessTypeZh: string; // 业务类型中文 ,
    code: string; // 销售编号 ,
    createId: number; // 创建用户id ,
    createName: string; // 创建用户名字 ,
    createTime: number; // 创建时间 ,
    custId: number; // 客户ID ,
    custName: string; // 客户名字 ,
    discountMoney: number; // 优惠金额 ,
    distribution: number; // 配送类型 125:自提 126:送货 127:物流发货 128:安装 ,
    distributionZh: string; // 配送类型中文 ,
    freight: number; // 运费 ,
    hadPayment: number; // 已付预付款 ,
    logisticsName: string; // 物流名称 ,
    nextShowFlag: string; // 核销标识 ,
    orderTime: number; // 订货日期 ,
    outboundId: number; // 出库员工ID ,
    outboundName: string; // 出库员工名称 ,
    outboundTime: number; // 出库日期 ,
    planPayment: number; // 计划预付定金 ,
    planTime: number; // 预计到货日期 ,
    printFlag: number; // 打印次数 ,
    printLabel: number; // 打印标签 ,
    profit: number; // 利润 ,
    profitMargin: string; // 利润率 ,
    receiveId: number; // 收款方式 ,
    remark: string; // 备注 ,
    settlementId: number; // 结算员ID ,
    settlementName: string; // 结算员工名称 ,
    settlementTime: number; // 结算日期 ,
    statusFlag: number; // 销售状态 1:草稿 2:待审批 3:待出库 4:出库完成 5:存档 6:退货 7:作废 8:驳回 9:已结算 ,
    totalMoney: number; // 总金额 ,
    totalNum: number; // 总数量 ,
    totalPrice: number; // 成本金额 ,
    updateTime: number; // 修改时间 ,
    version: number; // 乐观锁
    subList: BillSubApi.BillSub[];
  }

  export interface BillAdd {
    id?: number;
    businessType: number; // 业务类型 122:零售 123:批发 124:其它 ,
    code: string; // 销售编号 ,
    custId: number; // 客户ID ,
    custName: string; // 客户名字 ,
    distribution: number; // 配送类型 125:自提 126:送货 127:物流发货 128:安装 ,
    remark: string; // 备注 ,
    statusFlag: number; // 销售状态 1:草稿 2:待审批 3:待出库 4:出库完成 5:存档 6:退货 7:作废 8:驳回 9:已结算
  }

  export interface BillQuery extends CommApi.PageParam {
    code: string; // 销售编号 ,
    custId: number; // 客户ID ,
    distribution: number; // 配送类型 125:自提 126:送货 127:物流发货 128:安装 ,
    endTime: number; // 结束时间 ,
    startTime: number; // 开始时间 ,
    statusFlag: number; // 销售状态 1:草稿 2:待审批 3:待出库 4:出库完成 5:存档 6:退货 7:作废 8:驳回 9:已结算
  }
}

/**
 * 获取列表数据
 */
async function getBillList(data: BillApi.BillQuery) {
  return requestClient.post<CommApi.Response<BillApi.Bill[]>>(
    `/sale/findSmList`,
    data,
  );
}

/**
 * 详情
 */
async function getBill(params: { id: number }) {
  return requestClient.get<CommApi.Response<BillApi.Bill>>(`/sale/findSmById`, {
    params,
  });
}

/**
 * 创建
 * @param data 数据
 */
async function createBill(data: BillApi.BillAdd) {
  return requestClient.post('/sale/addSm', data);
}

/**
 * 更新
 *
 * @param id ID
 * @param data data
 */
async function updateBill(data: BillApi.BillAdd) {
  return requestClient.put(`/sale/updateMainById`, data);
}

/**
 * 删除
 * @param id id
 */
async function deleteBillById(params: { id: number }) {
  return requestClient.post(`/sale/deleteSmById`, null, { params });
}

/**
 * 获取销售单号
 * @returns
 */
function getBillCode() {
  return requestClient.get<CommApi.Response<string>>(`/sale/getCode`);
}

/**
 * 查询某个销售单及其所有的明细
 */
function getBillAndSubListByMainId(mainId: number) {
  return requestClient.get<CommApi.Response<BillApi.Bill>>(
    `/sale/findAllSsBySmId?mainId=${mainId}`,
  );
}

/**
 * 审核销售单
 */
async function approveBill(data: any) {
  return requestClient.post(
    `/sale/approveSm?mainId=${data.mainId}&version=${data.version}`,
  );
}

/**
 * 驳回销售单
 */
async function rejectBill(data: any) {
  return requestClient.post(
    `/sale/rejectSm?mainId=${data.mainId}&version=${data.version}`,
  );
}

/**
 * 取消销售单
 */
async function cancelBill(data: any) {
  return requestClient.post(
    `/sale/cancelSm?mainId=${data.mainId}&version=${data.version}`,
  );
}

/**
 * 出库销售单
 */
async function outboundBill(data: any) {
  return requestClient.post(
    `/sale/outboundSm?mainId=${data.mainId}&version=${data.version}`,
  );
}

export {
  approveBill,
  cancelBill,
  createBill,
  deleteBillById,
  getBill,
  getBillAndSubListByMainId,
  getBillCode,
  getBillList,
  outboundBill,
  rejectBill,
  updateBill,
};
