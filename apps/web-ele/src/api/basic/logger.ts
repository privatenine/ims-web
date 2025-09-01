import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace LoggerApi {
  export interface Logger {
    id: number;
    companyId: number; // 公司id ,
    companyName: string; // 公司名称 ,
    createTime: number; // 操作时间 ,
    duration: number; // 操作耗时:毫秒) ,
    endTime: number; // 结束时间 ,
    ip: string; // IP地址 ,
    message: string; // 消息 ,
    phoneNum: string; // 手机号 ,
    title: string; // 操作标题 ,
    userId: number; // 用户id ,
    username: string; // 用户名
  }
  export interface LoggerQuery extends CommApi.PageParam {
    endTime: number; // 结束时间 ,
    message: string; // 消息 ,
    startTime: number; // 开始时间 ,
    title: string; // 操作标题 ,
    username: string; // 用户名
  }
}
/**
 * 获取列表数据
 */
function getLoggerList(data: Record<string, any>) {
  return requestClient.post<CommApi.Response<LoggerApi.Logger[]>>(
    `/login/findOpeLog`,
    data,
  );
}
export { getLoggerList };
