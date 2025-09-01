import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace BasicProjectApi {
  export interface BasicProject {
    id: number;
    listYear: number; // 上市年份 ,
    name: string; // 名称 ,
    remark: string; // 备注 ,
    stopYear: number; // 停产年份

    createTime: number; // 创建时间 ,
    jianPinCode: string; // 简拼码 ,
    updateTime: number; // 修改时间
  }

  export interface BasicProjectQuery extends CommApi.PageParam {
    jianPinCode?: string;
    name?: string;
  }
}

/**
 * 获取列表数据
 */
async function getBasicProjectList(data: BasicProjectApi.BasicProjectQuery) {
  return requestClient.post<CommApi.Response<BasicProjectApi.BasicProject[]>>(
    `/product/findBaseList`,
    data,
  );
}

async function getBasicProject(id: number) {
  return requestClient.get<CommApi.Response<BasicProjectApi.BasicProject>>(
    `/product/findBaseById?id=${id}`,
  );
}

/**
 * 创建
 * @param data 数据
 */
async function createBasicProject(
  data: Omit<BasicProjectApi.BasicProject, 'id'>,
) {
  return requestClient.post('/product/addBase', data);
}

/**
 * 更新
 *
 * @param id  ID
 * @param data 数据
 */
async function updateBasicProject(data: BasicProjectApi.BasicProject) {
  return requestClient.put(`/product/updateBaseById`, data);
}

/**
 * 批量删除
 */
async function deleteBasicProjectByIds(data: { id: number[] }) {
  return requestClient.post(`/product/deleteBaseByIds`, data);
}
export {
  createBasicProject,
  deleteBasicProjectByIds,
  getBasicProject,
  getBasicProjectList,
  updateBasicProject,
};
