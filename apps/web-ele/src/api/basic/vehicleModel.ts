import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace VehicleModelApi {
  export interface VehicleModel {
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
async function getVehicleModelList() {
  return requestClient.get<CommApi.Response<VehicleModelApi.VehicleModel[]>>(
    `/product/getCarModelList`,
  );
}

async function getVehicleModel(id: number) {
  return requestClient.get<CommApi.Response<VehicleModelApi.VehicleModel>>(
    `/product/getCarModelById?id=${id}`,
  );
}

/**
 * 创建
 * @param data 数据
 */
async function createVehicleModel(
  data: Omit<VehicleModelApi.VehicleModel, 'id'>,
) {
  return requestClient.post('/product/addCarModel', data);
}

/**
 * 更新
 *
 * @param id  ID
 * @param data 数据
 */
async function updateVehicleModel(data: VehicleModelApi.VehicleModel) {
  return requestClient.put(`/product/updateCarModelById`, data);
}

/**
 * 批量删除
 */
async function deleteVehicleModelByIds(data: { id: number[] }) {
  return requestClient.post(`/product/deleteCarModelByIds`, data);
}
export {
  createVehicleModel,
  deleteVehicleModelByIds,
  getVehicleModel,
  getVehicleModelList,
  updateVehicleModel,
};
