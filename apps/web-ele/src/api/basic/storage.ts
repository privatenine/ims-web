import type { CommApi, EmployeeApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace StorageApi {
  export interface Storage {
    id: number;
    name: string;
    address: string; // 仓库地址 ,
    createTime: number; // 创建时间 ,
    jianPinCode: string; // 仓库简拼码 ,
    status: number; // 1 在用 2 停用 ,
    storeOperId: number; // 库管员ID ,
    storeOperName: string; // 库管员名称 ,
    telephone: string; // 仓库电话 ,
    type: number; // 1 临时仓库 2 正常仓库 ,
    updateTime: number; // 修改时间
  }

  export interface StorageQuery extends CommApi.PageParam {
    address?: string; // 仓库地址 ,
    jianPinCode?: string; // 仓库简拼码 ,
    name?: string; // 仓库名称 ,
    // sortParam :SortParam;      // 排序参数 ,
    status?: number; // 1 在用 2 停用 ,
    telephone?: string; // 仓库电话 ,
    type?: number; // 0 临时仓库 1 正常仓库
  }
}
/**
 * 获取列表数据
 */
async function getStorageList(data: StorageApi.StorageQuery) {
  return requestClient.post<CommApi.Response<StorageApi.Storage[]>>(
    `/storage/findStorageList`,
    data,
  );
}

/**
 * 创建部门
 * @param data 部门数据
 */
async function createStorage(data: Omit<StorageApi.Storage, 'id'>) {
  return requestClient.post('/storage/addStorage', data);
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
async function updateStorage(data: StorageApi.Storage) {
  return requestClient.put(`/storage/updateStorageById`, data);
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
// async function deleteStorageByIds(data: any) {
//   return requestClient.post(`/car/deleteByIds`, data);
// }

async function getStorageEmployeeList(data: EmployeeApi.EmployeeQuery) {
  return requestClient.post<CommApi.Response<EmployeeApi.Employee[]>>(
    `/login/findUserList`,
    data,
  );
}

export {
  createStorage,
  getStorageEmployeeList,
  //  deleteStorageByIds,
  getStorageList,
  updateStorage,
};
