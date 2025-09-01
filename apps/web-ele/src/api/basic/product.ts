import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace ProductApi {
  export interface Product {
    id: number;
    area: number; // 面积 ,
    baseId: number; // 基础资料id ,
    baseName: string; // 基础资料名称 ,
    carModelId: number; // 车型id ,
    carModelName: string; // 车型名称 ,
    carSeriesId: number; // 车系id ,
    carSeriesName: string; // 车系名称 ,
    carTypeId: number; // 类型id ,
    carTypeName: string; // 类型名称 ,
    dataCompanyId: number; // 产品资料公司id ,
    dataCreateTime: number; // 产品资料创建时间 ,
    dataEnable: number; // 产品资料（用户无法修改此状态）是否再用 1 启用 0 停用 ,
    dataId: number; // 产品资料id   id,
    remark: string; // dataRemark
    dataRemark: string; // 产品资料备注 ,
    settingRemark: string; // 产品资料辅助表备注
    settingsRemark: string; // 产品资料辅助表备注 ,
    dataUpdateTime: number; // 产品资料修改时间 ,
    diagonal: number; // 对角 ,
    downLength: number; // 下长 ,
    img_path_45_h: string; // 后45度照片 ,
    img_path_45_q: string; // 前45度照片 ,
    img_path_location: string; // 产品安装位置照片 ,
    img_path_other: string; // 前挡后视镜区域特写 ,
    img_path_product: string; // 产品照片 ,
    jianPinCode: string; // 简拼码 ,
    listYear: number; // 上市年份 ,
    lowerLimit: number; // 下限 ,
    middleLength: number; // 中高 ,
    name: string; // 产品名称 ,
    norms: string; // 规格 ,
    positionId: number; // 安装位置id ,
    positionName: string; // 安装位置名称 ,
    settingsCreateTime: number; // 产品资料辅助表创建时间 ,
    settingsEnable: number; // 产品资料辅助表是否再用 1 启用 0 停用 ,
    settingsId: number; // 产品资料辅助表id ,
    settingsUpdateTime: number; // 产品资料辅助表修改时间 ,
    stopYear: number; // 停产年份 ,
    upperLimit: number; // 上限
  }

  export interface ProductQuery extends CommApi.PageParam {
    baseName: string; // 基础资料名称 ,
    carModelId: number; // 车型id ,
    carModelName: string; // 车型名称 ,
    carSeriesId: number; // 车系id ,
    carSeriesName: string; // 车系名称 ,
    carTypeId: number; // 类型id ,
    carTypeName: string; // 类型名称 ,
    enable: number; // 是否再用 1 启用 0 停用 ,
    exclude: string; // 名字中不包含 ,
    isFuzzy: number; // 是否是模糊查询 1 是 0否 ,
    isPublic: number; // 只显示公用 1 只显示公有 0 只显示私有 ,
    jianPinCode: string; // 简拼码 ,
    name: string; // 产品名称 ,
    positionId: number; // 安装位置id ,
    positionName: string; // 安装位置名称 ,
  }
}

/**
 * 列表
 */
async function getProductList(data: ProductApi.ProductQuery) {
  return requestClient.post<CommApi.Response<ProductApi.Product[]>>(
    '/product/findDataList',
    data,
  );
}
/**
 * 新增
 * @param data
 * @returns
 */

async function createProduct(data: Omit<ProductApi.Product, 'id'>) {
  return requestClient.post('/product/addData', data);
}

/**
 * 更新
 *
 * @param id  ID
 * @param data 数据
 */
async function updateProduct(data: ProductApi.Product) {
  return requestClient.put(`/product/updateDataById`, data);
}

/**
 * 批量删除
 */
async function deleteProductByIds(data: { ids: number[] }) {
  return requestClient.post(`/product/deleteDataByIds`, data);
}

/**
 * 重新生成简拼码
 * @param params
 * @returns
 */
async function updateProjectJPM(params: { id: number }) {
  return requestClient.post('/product/buildJpm', null, { params });
}

/**
 * 停用
 * @param params
 * @returns
 */
async function updateProjectDisable(params: { id: number }) {
  return requestClient.post('/product/disableData', null, { params });
}

/**
 * 启用
 * @param params
 * @returns
 */
async function updateProjectEnable(params: { id: number }) {
  return requestClient.post('/product/enableData', null, { params });
}

export {
  createProduct,
  deleteProductByIds,
  getProductList,
  updateProduct,
  updateProjectDisable,
  updateProjectEnable,
  updateProjectJPM,
};
