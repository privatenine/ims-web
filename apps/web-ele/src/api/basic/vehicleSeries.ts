import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace VehicleSeriesApi {
  export interface VehicleSeries {
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
async function getVehicleSeriesList() {
  return requestClient.get<CommApi.Response<VehicleSeriesApi.VehicleSeries[]>>(
    `/product/getCarSeriesList`,
  );
}

async function getVehicleSeries(id: number) {
  return requestClient.get<CommApi.Response<VehicleSeriesApi.VehicleSeries>>(
    `/product/getCarSeriesById?id=${id}`,
  );
}

/**
 * 创建
 * @param data 数据
 */
async function createVehicleSeries(
  data: Omit<VehicleSeriesApi.VehicleSeries, 'id'>,
) {
  return requestClient.post('/product/addCarSeries', data);
}

/**
 * 更新
 *
 * @param id  ID
 * @param data 数据
 */
async function updateVehicleSeries(data: VehicleSeriesApi.VehicleSeries) {
  return requestClient.put(`/product/updateCarSeriesById`, data);
}

/**
 * 批量删除
 */
async function deleteVehicleSeriesByIds(data: { id: number[] }) {
  return requestClient.post(`/product/deleteCarSeriesByIds`, data);
}
export {
  createVehicleSeries,
  deleteVehicleSeriesByIds,
  getVehicleSeries,
  getVehicleSeriesList,
  updateVehicleSeries,
};
