import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace OutboundApi {
  export interface Outbound {
    id: number;
  }

  export interface OutboundQuery extends CommApi.PageParam {
    name: string;
  }
}

/**
 * 获取列表数据
 */
async function getOutboundList(data: OutboundApi.OutboundQuery) {
  return requestClient.post<CommApi.Response<OutboundApi.Outbound[]>>(
    `/car/findList`,
    data,
  );
}

/**
 * 获取数据
 */
async function getOutbound(id: number) {
  return requestClient.get<CommApi.Response<OutboundApi.Outbound>>(
    `/personnelMatters/findEmployeeById?userId=${id}`,
  );
}

/**
 * 创建
 * @param data 数据
 */
async function createOutbound(data: Omit<OutboundApi.Outbound, 'id'>) {
  return requestClient.post('/car/addCar', data);
}

/**
 * 更新
 *
 * @param id  ID
 * @param data 数据
 */
async function updateOutbound(data: OutboundApi.Outbound) {
  return requestClient.put(`/car/updateById`, data);
}
/**
 * 批量删除
 */
async function deleteOutboundByIds(data: { id: number[] }) {
  return requestClient.post(`/car/deleteByIds`, data);
}
export {
  createOutbound,
  deleteOutboundByIds,
  getOutbound,
  getOutboundList,
  updateOutbound,
};
