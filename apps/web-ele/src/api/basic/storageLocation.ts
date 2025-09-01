import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace StorageLocationApi {
  export interface StorageLocation {
    id: number;
    name: string;
    storageId: string;
    storageName: string;
    createTime: number;
    updateTime: number;
  }
  export interface StorageLocationQuery {
    jianPinCode: string; // 简拼码 ,
    name: string; // 库位名称 ,
    storageId: number; // 仓库id
  }
}
/**
 * 获取列表数据
 */
async function getStorageLocationList(
  data: StorageLocationApi.StorageLocationQuery,
) {
  return requestClient.post<
    CommApi.Response<StorageLocationApi.StorageLocation[]>
  >(`/storage/findSlList`, data);
}
/**
 * 详情
 */
async function getStorageLocation(id: number) {
  return requestClient.get<
    CommApi.Response<StorageLocationApi.StorageLocation>
  >(`/storage/findSlById?id=${id}`);
}

/**
 * 创建部门
 * @param data 部门数据
 */
async function createStorageLocation(
  data: Omit<StorageLocationApi.StorageLocation, 'id'>,
) {
  return requestClient.post('/storage/addSl', data);
}

// /**
//  * 更新部门
//  *
//  * @param id 部门 ID
//  * @param data 部门数据
//  */
// async function updateStorageById(id: string, data: Omit<CarApi.Car, 'id'>) {
//   return requestClient.put(`/car/updateById/${id}`, data);
// }

/**
 * 更新部门
 *
 * @param id 部门 ID
 * @param data 部门数据
 */
async function updateStorageLocation(data: StorageLocationApi.StorageLocation) {
  return requestClient.put(`/storage/updateSlById`, data);
}

// /**
//  * 删除部门
//  * @param id 部门 ID
//  */
// async function deleteStorage(id: string) {
//   return requestClient.delete(`/system/dept/${id}`);
// }
/**
 * 批量删除部门
 */
async function deleteStorageLocationByIds(data: any) {
  return requestClient.post(`/storage/deleteSlByIds`, data);
}
export {
  createStorageLocation,
  deleteStorageLocationByIds,
  getStorageLocation,
  getStorageLocationList,
  // getStorageLocationListByStorageId,
  updateStorageLocation,
};
