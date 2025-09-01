import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace VehicleTypeApi {
  export interface VehicleType {
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
async function getVehicleTypeList() {
  return requestClient.get<CommApi.Response<VehicleTypeApi.VehicleType[]>>(
    `/product/getCarTypeList`,
  );
}

async function getVehicleType(id: number) {
  return requestClient.get<CommApi.Response<VehicleTypeApi.VehicleType>>(
    `/product/getCarTypeById?id=${id}`,
  );
}

/**
 * 创建
 * @param data 数据
 */
async function createVehicleType(data: Omit<VehicleTypeApi.VehicleType, 'id'>) {
  return requestClient.post('/product/addCarType', data);
}

/**
 * 更新
 *
 * @param id  ID
 * @param data 数据
 */
async function updateVehicleType(data: VehicleTypeApi.VehicleType) {
  return requestClient.put(`/product/updateCarTypeById`, data);
}

/**
 * 批量删除
 */
async function deleteVehicleTypeByIds(data: { id: number[] }) {
  return requestClient.post(`/product/deleteCarTypeByIds`, data);
}
export {
  createVehicleType,
  deleteVehicleTypeByIds,
  getVehicleType,
  getVehicleTypeList,
  updateVehicleType,
};
