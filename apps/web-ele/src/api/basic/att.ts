import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace AttApi {
  export interface Att {
    id: number;
    childList: Att[]; // 子级附件 ,
    companyId: number; // 公司id ,
    createTime: number; // 创建时间 ,
    name: string; // 附件名称 ,
    parentId: number; // 上级id ,
    updateTime: number; // 修改时间
  }
}

/**
 * 获取所有
 */
export async function getAttList() {
  return requestClient.get<CommApi.Response<AttApi.Att[]>>(
    '/product/getAttList',
  );
}
