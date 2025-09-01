import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace PromoApi {
  // 促销信息查询参数
  export interface PromoSearchParam extends CommApi.PageParam {
    productName?: string; // 产品名称
    contactPhone?: string; // 联系方式
    publishStatus?: number; // 发布状态 1:已发布 0:已下架
    category?: string; // 类别
    startTime?: number; // 开始时间
    endTime?: number; // 结束时间
  }

  // 促销信息实体
  export interface PromoInfo {
    id: number;
    productName: string; // 产品名称
    publishQuantity: number; // 发布数量
    contactPhone: string; // 联系方式
    deadline: number; // 截止日期
    category: string; // 类别
    remark?: string; // 备注
    status: number; // 发布状态 1:已发布 0:已下架
    isPublished: number; // 是否发布 1:发布 0:下架
    publishTime?: number; // 发布时间

    // 基础字段
    createId?: number;
    createName?: string;
    createTime?: number;
    updateTime?: number;
    version?: number;
  }

  // 发布/下架参数
  export interface PublishParam {
    id: number;
    status: number; // 1:发布 0:下架
  }

  // 促销信息列表查询结果
  export interface PromoPageResponse {
    items: PromoInfo[];
    total: number;
  }
}

/**
 * 获取促销信息列表数据
 */
async function findPromoList(data: PromoApi.PromoSearchParam) {
  return requestClient.post<CommApi.Response<PromoApi.PromoInfo[]>>(
    `/sale/findPromoList`,
    data,
  );
}

/**
 * 获取促销信息详情
 */
async function getPromoInfo(id: number) {
  return requestClient.get<CommApi.Response<PromoApi.PromoInfo>>(
    `/sale/findPromoById?id=${id}`,
  );
}

/**
 * 创建促销信息
 */
async function createPromoInfo(data: Omit<PromoApi.PromoInfo, 'id'>) {
  return requestClient.post<CommApi.Response<PromoApi.PromoInfo>>(
    '/sale/addPromo',
    data,
  );
}

/**
 * 更新促销信息
 */
async function updatePromoInfo(data: PromoApi.PromoInfo) {
  return requestClient.put<CommApi.Response<PromoApi.PromoInfo>>(
    `/sale/updatePromoById`,
    data,
  );
}

/**
 * 发布/下架促销信息
 */
async function publishPromoInfo(data: PromoApi.PublishParam) {
  return requestClient.post<CommApi.Response<PromoApi.PromoInfo>>(
    `/sale/publishPromo`,
    data,
  );
}

/**
 * 删除促销信息
 */
async function deletePromoInfo(id: number) {
  return requestClient.delete<CommApi.Response<void>>(
    `/sale/deletePromoById?id=${id}`,
  );
}

/**
 * 批量删除促销信息
 */
async function deletePromoInfoByIds(ids: number[]) {
  return requestClient.post<CommApi.Response<void>>(`/sale/deletePromoByIds`, {
    ids,
  });
}

export {
  createPromoInfo,
  deletePromoInfo,
  deletePromoInfoByIds,
  findPromoList,
  getPromoInfo,
  publishPromoInfo,
  updatePromoInfo,
};
