import type { BasicMenuApi, CommApi, EmployeeApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace BasicRoleApi {
  export interface Role {
    id: number;
    companyId: number;
    createTime: number; // 创建时间 ,
    description: string;
    loginList: Array<EmployeeApi.Employee>;
    menuList: Array<BasicMenuApi.Menu>;
    name: string;
    type: string;
    updateTime: number; // 修改时间
    menuIds: number[]; // 权限id列表 ,
    userIds: number[]; // 用户id列表
  }

  export interface RoleQuery extends CommApi.PageParam {
    name: string;
    type: string; // 角色类型 = ['system', 'user']stringEnum:"system", "user"
  }
}

/**
 * 获取列表数据
 */
function getBasicRoleList(data: BasicRoleApi.RoleQuery) {
  return requestClient.post<CommApi.Response<BasicRoleApi.Role[]>>(
    '/login/findRoleList',
    data,
  );
}

/**
 * 详情
 * @param id
 * @returns
 */
function getBasicRole(id: number) {
  return requestClient.get<CommApi.Response<BasicRoleApi.Role>>(
    `/login/getRoleDetail?roleId=${id}`,
  );
}

/**
 * 创建
 * @param data 数据
 */
function createBasicRole(data: Omit<BasicRoleApi.Role, 'id'>) {
  return requestClient.post('/login/addRole', data);
}
/**
 * 更新
 *
 * @param id  ID
 * @param data 数据
 */
async function updateBasicRole(data: BasicRoleApi.Role) {
  return requestClient.post(`/login/updateRole`, data);
}

/**
 * 批量删除
 */
async function deleteBasicRoleByIds(data: { ids: number[] }) {
  return requestClient.post(`/login/deleteRoleByIds`, data);
}

export {
  createBasicRole,
  deleteBasicRoleByIds,
  getBasicRole,
  getBasicRoleList,
  updateBasicRole,
};
