import type { CommApi } from '../core';

import { requestClient } from '#/api/request';

export namespace VehiclePlaceApi {
  export interface VehiclePlace {
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
async function getVehiclePlaceList() {
  return requestClient.get<CommApi.Response<VehiclePlaceApi.VehiclePlace[]>>(
    `/product/getCarPlaceList`,
  );
}

async function getVehiclePlace(id: number) {
  return requestClient.get<CommApi.Response<VehiclePlaceApi.VehiclePlace>>(
    `/product/getCarPlaceById?id=${id}`,
  );
}

/**
 * 创建
 * @param data 数据
 */
async function createVehiclePlace(
  data: Omit<VehiclePlaceApi.VehiclePlace, 'id'>,
) {
  return requestClient.post('/product/addCarPlace', data);
}

/**
 * 更新
 *
 * @param id  ID
 * @param data 数据
 */
async function updateVehiclePlace(data: VehiclePlaceApi.VehiclePlace) {
  return requestClient.put(`/product/updateCarPlaceById`, data);
}

/**
 * 批量删除
 */
async function deleteVehiclePlaceByIds(data: { id: number[] }) {
  return requestClient.post(`/product/deleteCarPlaceByIds`, data);
}
export {
  createVehiclePlace,
  deleteVehiclePlaceByIds,
  getVehiclePlace,
  getVehiclePlaceList,
  updateVehiclePlace,
};
