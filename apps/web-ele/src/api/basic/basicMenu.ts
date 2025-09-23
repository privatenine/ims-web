import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace BasicMenuApi {
  export interface Menu {
    id: number;
    children: Array<Menu>; // 子节点 ,
    component: string; //
    icon: string; // 图标 ,
    menuType: number; // 类型 1:目录 2:菜单 3:按钮 ,
    name: string; // 名称 ,
    parentId: number; // 父级id ,
    path: string; // 菜单路径 ,
    permission: string; // 授权标识 ,
    remark: string; // 备注 ,
    sort: number; // 菜单排序，值越高排的越后 ,
    status: number; // 状态 0 启用 1 禁用
  }
}

/**
 * 获取所有菜单
 */
export async function getMenuList1() {
  return requestClient.get<CommApi.Response<BasicMenuApi.Menu[]>>(
    '/login/getAllMenuTree',
  );
}

/**
 * 当前用户按钮权限
 */
export async function getMenuButtonRights(component: string) {
  return requestClient.get<CommApi.Response<BasicMenuApi.Menu[]>>(
    `/login/getMenuByCom?component=${component}`,
  );
}

/**
 * 当前用户按钮权限
 */
export async function getMenuButtonRightsByPath(path: string) {
  return requestClient.get<CommApi.Response<BasicMenuApi.Menu[]>>(
    `/login/getMenuByPath?path=${path}`,
  );
}

export async function findUserSysSettings() {
  return requestClient.get<any>(`/login/findUserSysSettings`);
}
