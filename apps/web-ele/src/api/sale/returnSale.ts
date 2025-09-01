import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace ReturnSaleApi {
  export interface ReturnSale {
    id: number;
    approveId: number; // 审核员ID
    approveName: string; // 审核员
    approveTime: number; // 审核日期
    code: string; // 退货编号
    createId: number; // 创建用户id
    createName: string; // 创建用户名字
    createTime: number; // 创建时间
    custId: number; // 客户ID
    custName: string; // 客户名字
    printFlag: number; // 打印次数
    printLabel: number; // 打印标签
    region1: string; // 区域1
    region2: string; // 区域2
    region3: string; // 区域3
    remark: string; // 备注
    saleId: number; // 销售单ID
    siteName: string; // 站点名称
    statusFlag: number; // 退货状态
    storeId: number; // 仓库ID
    storeName: string; // 仓库名称
    totalBuyPrice: number; // 总进货价
    totalMoney: number; // 总金额
    totalNum: number; // 总数量
    totalPriceReference: number; // 总参考价
    version: number; // 乐观锁
  }

  export interface ReturnSaleQuery extends CommApi.PageParam {
    code?: string; // 退货编号
    custId?: number; // 客户ID
    endTime?: number; // 结束时间
    startTime?: number; // 开始时间
    statusFlag?: number; // 退货状态
  }

  export interface ReturnSaleAdd {
    id?: number;
    code: string; // 退货编号
    custId: number; // 客户ID
    custName: string; // 客户名字
    remark?: string; // 备注
    statusFlag: number; // 退货状态
    storeId: number; // 仓库ID
    storeName: string; // 仓库名称
  }
}

/**
 * 获取销售退货列表数据
 */
async function getReturnSaleList(data: ReturnSaleApi.ReturnSaleQuery) {
  return requestClient.post<CommApi.Response<ReturnSaleApi.ReturnSale[]>>(
    `/sale/findSrmList`,
    data,
  );
}

/**
 * 获取销售退货详情
 */
async function getReturnSale(params: { id: number }) {
  return requestClient.get<CommApi.Response<ReturnSaleApi.ReturnSale>>(
    `/sale/findSrmById`,
    { params },
  );
}

/**
 * 创建销售退货
 */
async function createReturnSale(data: ReturnSaleApi.ReturnSaleAdd) {
  return requestClient.post('/sale/addSrm', data);
}

/**
 * 更新销售退货
 */
async function updateReturnSale(data: ReturnSaleApi.ReturnSaleAdd) {
  return requestClient.put('/sale/updateSrmById', data);
}

/**
 * 删除销售退货
 */
async function deleteReturnSaleById(params: { id: number }) {
  return requestClient.post('/sale/deleteSrmById', null, { params });
}

/**
 * 获取销售退货单号
 */
function getReturnSaleCode() {
  return requestClient.get<CommApi.Response<string>>('/sale/getSrmCode');
}

export {
  createReturnSale,
  deleteReturnSaleById,
  getReturnSale,
  getReturnSaleCode,
  getReturnSaleList,
  updateReturnSale,
};
