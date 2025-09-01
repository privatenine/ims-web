import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace CarApi {
  export interface Car {
    id: number;
    name: string;
    carNum?: string;
    driverId: number;
    driverName: string;
    companyId: number;
    createTime: number;
    updateTime: number;
  }

  export interface CarQuery extends CommApi.PageParam {
    name: string;
    carNum: string;
  }
}

/**
 * 获取列表数据
 */
async function getCarList(name?: string, carNum?: string) {
  return requestClient.get<CommApi.Response<CarApi.Car[]>>(
    `/car/findList?name=${name || ''}&carNum=${carNum || ''}`,
  );
}

/**
 * 创建
 * @param data 数据
 */
async function createCar(data: Omit<CarApi.Car, 'id'>) {
  return requestClient.post('/car/addCar', data);
}

/**
 * 更新
 *
 * @param id ID
 * @param data 数据
 */
// async function updateCarById(id: string, data: Omit<CarApi.Car, 'id'>) {
//   return requestClient.put(`/car/updateById/${id}`, data);
// }

/**
 * 更新
 *
 * @param id  ID
 * @param data 数据
 */
async function updateCar(data: CarApi.Car) {
  return requestClient.put(`/car/updateById`, data);
}

// /**
//  * 删除
//  * @param id  ID
//  */
// async function deleteCar(id: string) {
//   return requestClient.delete(`/system/dept/${id}`);
// }
/**
 * 批量删除
 */
async function deleteCarByIds(data: { ids: number[] }) {
  return requestClient.post(`/car/deleteByIds`, data);
}
export {
  createCar,
  // deleteCar,
  deleteCarByIds,
  getCarList,
  updateCar,
  // updateCarById,
};
