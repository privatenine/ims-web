import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace InStorageApi {
  export interface ProductAttParam {
    id: number; // 附件id ,
    name?: string; // 附件名称
  }
  export interface InStorage {
    id: number;
    approveId: number; // 审批id ,
    approveName: string; // 审批名字 ,
    approveTime: number; // 审批时间 ,
    arrivalId: number; // 到货方式id ,
    code: string; // 入库编号 ,
    companyId: number; // 公司id ,
    createId: number; // 创建用户id ,
    createName: string; // 创建用户名字 ,
    createTime: number; // 创建时间 ,
    freight: number; // 运费 ,
    pickUpCarId: number; // 提货车id ,
    pickUpCarNum: string; // 提货车牌号 ,
    printFlag: number; // 打印次数 ,
    remark: string; // 备注 ,
    saleOrderId: number; // 订单id ,
    statusFlag: number; // 订单状态 1草稿状态 2待入库 3已完成 4存档 5驳回 6已结算 ,
    storeId: number; // 仓库id ,
    storeName: string; // 仓库名称 ,
    storeSiteName: string; // 临时货位 ,
    supplierId: number; // 供应商id ,
    supplierName: string; // 供应商名字 ,
    totalMoney: number; // 总金额 ,
    totalNum: number; // 总数量 ,
    typeFlag: number; // 0 采购入库 1 一般入库 ,
    unloadingId: number; // 卸货方式id ,
    updateTime: number; // 修改时间 ,
    version: number;
  }

  export interface InStorageSub {
    id: number;
    actiNum: number; // 实际到货数量 ,
    addWarehousingMainParam?: InStorage | null; // 新增入库单信息 ,
    batchPrice: number; // 最低销售价 ,
    code: string; // 入库单号 ,
    isDefault: boolean; // 是否设置为默认货位 ,
    price: number; // 实际价格 ,
    priceReference: number; // 参考价格 ,
    priceShow: number; // 展示价格（伪装价格） ,
    printLabel: number; // 打印标签 ,
    productAttList: Array<ProductAttParam>; // 附件信息 ,
    productId: number;
    productName: string; // 产品名称 ,
    productPlaceId: number; // 产品产地id ,
    productPlaceName: string; // 产品产地名称 ,
    purchaseCode: string; // 采购单号 ,
    remark: string; // 备注 ,
    siteName: string; // 货位名称 ,
    storeId: number; // 仓库id ,
    storeName: string; // 仓库名称库存对比条件2 ,
    supplierId: number; // 供应商id ,
    supplierName: string; // 供应商名字 ,
    warehousingId: number; // 入库id
    totalPrice: number; // 总价
    productAttachmentIds: string;
    productAttachmentNames: string;
  }

  export interface InStorageSub1 {
    baseName: string; // 基础资料名称;
    carModelName: string; // 车型名称;
    carSeriesName: string; // 车系名称;
    carTypeName: string; // 类型名称;
    jianPinCode: string; // 简拼码;
    name: string; // 产品名称;
    positionName: string; // 安装位置名称;
    price: number; // 参考价;
    productId: number; // 产品id;
    warehousingId: number;
  }

  export interface InStorageSubVo {
    id: number;
    actiNum: number; // 实际到货数量 ,
    claimPrice: number; // 理赔价 ,
    code: string; // 入库单号 ,
    createTime: number; // 创建时间 ,
    filePath: string; // 入库二维码路径 ,
    installPrice: number; // 安装价 ,
    isDefault: boolean; // 是否设置为默认货位 ,
    price: number; // 实际价格 ,
    priceReference: number; // 参考价格 ,
    priceShow: number; // 展示价格（伪装价格） ,
    printLabel: number; // 打印标签 ,
    productAttachmentIds: string; // 产品附件id组合 ,
    productAttachmentNames: string; // 产品附件名称组合 ,
    productId: number; // 产品id ,
    productName: string; // 产品名称 ,
    productPlaceId: number; // 产品产地id ,
    productPlaceName: string; // 产品产地名称 ,
    purchaseCode: string; // 采购单号 ,
    remark: string; // 备注 ,
    retailPrice: number; // 零售价 ,
    siteName: string; // 货位名称 ,
    spotPrice: number; // 调货价 ,
    storeId: number; // 仓库id ,
    storeName: string; // 仓库名称 ,
    supplierId: number; // 供应商id ,
    supplierName: string; // 供应商名字 ,
    totalPrice: number; // 总金额 ,
    tradePrice1: number; // 批发价1 ,
    tradePrice2: number; // 批发价2 ,
    tradePrice3: number; // 批发价3 ,
    tradePrice4: number; // 批发价4 ,
    updateTime: number; // 修改时间 ,
    warehousingId: number; // 入库id ,
    // warehousingMainRespVO :WarehousingMainRespVO;     // 入库单信息
  }
  export interface InStorageQuery extends CommApi.PageParam {
    arrivalId: number; // 到货方式id 1自提 2送货 3物流送货 ,
    code: string; // 单号 ,
    endTime: number; // 结束时间 ,
    pickUpCarId: number; // 提货车id ,
    sort: number; // 排序参数 默认是0 创建时间排序，1 单号排序 ,
    sortType: number; // 排序方式 默认是-1 倒序，1 正序 ,
    startTime: number; // 开始时间 ,
    statusFlag: number; // 订单状态 1草稿状态 2待入库 3已完成 4存档 5驳回 6已结算 ,
    supplierId: number; // 供应商id
  }

  export interface InStorageSubQuery extends CommApi.PageParam {
    carModelId?: number; // 车型id ,
    carModelName?: string; // 车型名称 ,
    carSeriesId?: number; // 车系id ,
    carSeriesName?: string; // 车系名称 ,
    carTypeId?: number; // 类型id ,
    carTypeName?: string; // 类型名称 ,
    isFuzzy?: number; // 是否是模糊查询 1 是 0否 ,
    jianPinCode?: string; // 简拼码 ,
    name?: string; // 产品名称 ,
    pageNum?: number; // 页码, 默认1 ,
    pageSize?: number; // 每页数量, 默认20 ,
    positionId?: number; // 安装位置id ,
    positionName?: string; // 安装位置名称 ,
    warehousingId?: number; // 入库id
  }

  export interface InStorageStore {
    buyPrice: number; // 进货价 ,
    isDefault: boolean; // 是否为默认货位 ,
    productAttachmentIds: string; // 产品附件id组合 ,
    productAttachmentNames: string; // 产品附件名称组合 ,
    productId: number; // 产品id ,
    productPlaceId: number; // 产品产地id ,
    productPlaceName: string; // 产品产地名称 ,
    siteName: string; // 货位名称 ,
    storeId: number; // 仓库id ,
    storeName: string; // 仓库名称库存对比条件2 ,
    supplierId: number; // 供应商id
  }

  export interface InStorageSettlement {
    bankId: number; // 结算账户ID;
    bankName: string; // 结算账户名;
    discountMoney: number; // 优惠金额;
    fkCode: string; // 收款流水号;
    formCode: string; // 核销单据;
    formId: number; // 核销单据id;
    remark: string; // 备注;
    supplierId: number; // 供应商ID;
    supplierName: string; // 供应商名字;
    totalMoney: number; // 实付金额;
    version: number; // 乐观锁;
    warehousingId: number; // 入库单id;
  }

  export interface InStorageStoreQuery {
    buyPrice?: number; // 进货价 ,
    productAttachmentIds?: string; // 产品附件id组合 ,
    productId?: number; // 产品id ,
    productPlaceId?: number; // 产品产地id ,
    supplierId?: number; // 供应商id
  }
}

/**
 * 获取列表数据
 */
async function getInStorageList(data: InStorageApi.InStorageQuery) {
  return requestClient.post<CommApi.Response<InStorageApi.InStorage[]>>(
    `/warehousing/findMainList`,
    data,
  );
}

/**
 * 获取数据
 */
async function getInStorage(id: number) {
  return requestClient.get<CommApi.Response<InStorageApi.InStorage>>(
    `/warehousing/findAllById?mainId=${id}`,
  );
}

/**
 * 创建
 * @param data 数据
 */
async function createInStorage(data: Omit<InStorageApi.InStorage, 'id'>) {
  return requestClient.post('/warehousing/addMain', data);
}

/**
 * 更新
 *
 * @param id  ID
 * @param data 数据
 */
async function updateInStorage(data: InStorageApi.InStorage) {
  return requestClient.put(`/warehousing/updateMainById`, data);
}

/**
 * 批量删除
 */
async function deleteInStorageById(params: { id: number }) {
  return requestClient.post(
    `/warehousing/deleteMainById?id=${params.id}`,
    null,
    { params },
  );
}

/**
 * 获取数据
 */
async function getInStorageCode() {
  return requestClient.get<CommApi.Response<string>>(`/warehousing/getCode`);
}

/**
 * 创建入库明细 ，
 * @param data 数据
 */
async function createInStorageSub(data: Omit<InStorageApi.InStorageSub, 'id'>) {
  return requestClient.post<CommApi.Response<InStorageApi.InStorageSub>>(
    '/warehousing/addSub',
    data,
  );
}

/**
 * 新增明细时的产品搜索
 */
async function getInStorageSubList(data: InStorageApi.InStorageSubQuery) {
  return requestClient.post<CommApi.Response<InStorageApi.InStorageSub1[]>>(
    `/warehousing/findProductList`,
    data,
  );
}

function getInStorageSub(id: number) {
  return requestClient.get<CommApi.Response<InStorageApi.InStorageSub>>(
    `/warehousing/findSubById?id=${id}`,
  );
}

/**
 * 删除明细
 * @param params
 * @returns
 */
function deleteInStorageSubById(params: { id: number }) {
  return requestClient.post(`/warehousing/deleteSubById?id=${params.id}`);
}

/**
 * 根据入库Id 获取入库单下所有明细
 * @param data
 * @returns
 */
function getInStorageSubByMainId(data: InStorageApi.InStorageSubQuery) {
  return requestClient.post<CommApi.Response<InStorageApi.InStorageSub>>(
    `/warehousing/findSubList`,
    data,
  );
}

/**
 * 修改入库明细
 * @param data
 * @returns
 */
async function updateInStorageSub(data: InStorageApi.InStorageSub) {
  return requestClient.put(`/warehousing/updateSubById`, data);
}
/**
 * 根据产品、供应商、进货价、产地、附件查询仓库和库位
 * @param data
 * @returns
 */
function getInStorageStoreBy(data: InStorageApi.InStorageStoreQuery) {
  return requestClient.post<CommApi.Response<InStorageApi.InStorageStore>>(
    `/warehousing/findStoreByParam`,
    data,
  );
}

/**
 * 审核入库单
 */
function approveInstorage(params: { mainId: number; version: number }) {
  return requestClient.post<CommApi.Response<InStorageApi.InStorageStore>>(
    `/warehousing/approveMain?mainId=${params.mainId}&version=${params.version}`,
  );
}

/**
 * 驳回入库单
 */
function rejectInstorage(params: { mainId: number; version: number }) {
  return requestClient.post<CommApi.Response<InStorageApi.InStorageStore>>(
    `/warehousing/rejectMain?mainId=${params.mainId}&version=${params.version}`,
  );
}

/**
 * 结算
 * @param data 数据
 */
async function settlementInStorage(data: InStorageApi.InStorageSettlement) {
  return requestClient.post('/warehousing/settlementWarehousing', data);
}

/**
 * 结算页面数据展示接口
 * @param params
 * @returns
 */
function getInStorageSettlement({
  warehousingId,
  code,
}: {
  code: string;
  warehousingId: number;
}) {
  return requestClient.get<CommApi.Response<Record<string, any>>>(
    `/warehousing/swParam?warehousingId=${warehousingId}&code=${code}`,
  );
}

/**
 * 查询库存列表（采购退货用）
 * @param data 查询参数
 * @returns
 */
function findPurchaseBalanceList(data: {
  pageNum?: number;
  pageSize?: number;
  productJpm?: string;
  productName?: string;
  sortParam?: {
    field: string;
    type: number;
  };
  supplierId?: number;
}) {
  return requestClient.post<
    CommApi.Response<
      Array<{
        actiNum: number;
        baseId: number;
        baseName: string;
        batchPrice: number;
        buyPrice: number;
        carModelId: number;
        carModelName: string;
        carSeriesId: number;
        carSeriesName: string;
        carTypeId: number;
        carTypeName: string;
        createTime: number;
        id: number;
        inventoryLock: number;
        isDefault: boolean;
        positionId: number;
        positionName: string;
        priceReference: number;
        productAttachmentIds: string;
        productAttachmentNames: string;
        productId: number;
        productName: string;
        productPlaceId: number;
        productPlaceName: string;
        siteName: string;
        storeId: number;
        storeName: string;
        supplierId: number;
        supplierName: string;
        tradePrice1: number;
        tradePrice2: number;
        tradePrice3: number;
        tradePrice4: number;
        updateTime: number;
      }>
    >
  >(`/purchase/findBalanceList`, data);
}

export {
  approveInstorage,
  createInStorage,
  createInStorageSub,
  deleteInStorageById,
  deleteInStorageSubById,
  findPurchaseBalanceList,
  getInStorage,
  getInStorageCode,
  getInStorageList,
  getInStorageSettlement,
  getInStorageStoreBy,
  getInStorageSub,
  getInStorageSubByMainId,
  getInStorageSubList,
  rejectInstorage,
  settlementInStorage,
  updateInStorage,
  updateInStorageSub,
};
