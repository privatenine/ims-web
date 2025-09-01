import type { CommApi } from '#/api';

import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
    deviceType?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
    token: string;
    username: string;
    nickname: string;
    permissions: string[];
    id: number | string;
    deviceType: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<CommApi.Response<AuthApi.LoginResult>>(
    '/login/doLogin',
    data,
  );
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh', {
    withCredentials: true,
  });
}

/**
 * 退出登录
 */
export async function logoutApi() {
  // return baseRequestClient.post('/auth/logout', {
  //   withCredentials: true,
  // });
  return baseRequestClient.post('/login/logout');
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth/codes');
}

/**
 * 获取所有菜单
 */
// export async function getMenuList1() {
//   return requestClient.get('/login/getAllMenuTree');
// }
