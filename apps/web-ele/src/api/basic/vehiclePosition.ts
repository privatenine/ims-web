import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace VehiclePositionApi {
  export interface VehiclePosition {
    id: number;
    companyId: number; // 公司id ,
    createTime: number; // 创建时间 ,
    name: string; // 车系名称 ,
    updateTime: number; // 修改时间
  }

  // export interface CarQuery extends ParamApi.PageParam {
  //   name: string;
  //   carNum: string;
  // }
}

/**
 * 获取列表数据
 */
async function getVehiclePositionList() {
  return requestClient.get<
    CommApi.Response<VehiclePositionApi.VehiclePosition[]>
  >(`/product/getCarPositionList`);
}

async function getVehiclePosition(id: number) {
  return requestClient.get<
    CommApi.Response<VehiclePositionApi.VehiclePosition>
  >(`/product/getCarPositionById?id=${id}`);
}

/**
 * 创建
 * @param data 数据
 */
async function createVehiclePosition(
  data: Omit<VehiclePositionApi.VehiclePosition, 'id'>,
) {
  return requestClient.post('/product/addCarPosition', data);
}

/**
 * 更新
 *
 * @param id  ID
 * @param data 数据
 */
async function updateVehiclePosition(data: VehiclePositionApi.VehiclePosition) {
  return requestClient.put(`/product/updatePositionById`, data);
}

/**
 * 批量删除
 */
async function deleteVehiclePositionByIds(data: { id: number[] }) {
  return requestClient.post(`/product/deleteCarPositionByIds`, data);
}
export {
  createVehiclePosition,
  deleteVehiclePositionByIds,
  getVehiclePosition,
  getVehiclePositionList,
  updateVehiclePosition,
};
