// 定义映射项的类型
interface GenderMapItem {
  color: string;
  name: string;
}

// 定义映射对象的类型
type NameColorMapType = Record<number, GenderMapItem>;

type KeyValueMapType = Record<number, string>;

// 声明常量并指定类型
export const GenderMap: NameColorMapType = {
  0: { color: 'danger', name: '未知' },
  1: { color: 'primary', name: '男' },
  2: { color: 'warning', name: '女' },
};

export const EmployedStatusMap: NameColorMapType = {
  0: { name: '离职', color: 'success' },
  1: { name: '在职', color: 'primary' },
  2: { name: '挂职', color: 'warning' },
  3: { name: '未知', color: 'danger' },
};
export const IsSignedContractMap: NameColorMapType = {
  0: { name: '不详', color: 'danger' },
  1: { name: '签订', color: 'primary' },
  2: { name: '未签', color: 'warning' },
};

export const PaymentOrderStatusMap: NameColorMapType = {
  1: { name: '草稿', color: 'info' },
  2: { name: '待结算', color: 'primary' },
  3: { name: '结算成功', color: 'success' },
  4: { name: '结算驳回', color: 'warning' },
};

export const statusFlagMap: NameColorMapType = {
  1: { name: '草稿', color: 'info' },
  2: { name: '待审批', color: 'primary' },
  3: { name: '已完成', color: 'success' },
  4: { name: '驳回', color: 'danger' },
};

export const payableSubStatusFlagMap: NameColorMapType = {
  1: { name: '待结算', color: 'info' },
  2: { name: '存档', color: 'success' },
  3: { name: '驳回', color: 'warning' },
};

export const productDataEnableMap: NameColorMapType = {
  0: { color: 'danger', name: '停用' },
  1: { color: 'primary', name: '启用' },
};

// export const arrivalMap: NameColorMapType = {
//   1: { name: '自提', color: 'primary' },
//   2: { name: '送货', color: 'warning' },
//   3: { name: '物流送货', color: 'danger' },
// };

export const arrivalMap: KeyValueMapType = {
  1: '自提',
  2: '送货',
  3: '物流送货',
};
export const unloadingMap: KeyValueMapType = {
  1: '机械',
  2: '人工',
};

export const inComeStatusFlagMap: KeyValueMapType = {
  1: '草稿',
  2: '待结算',
  3: '结算成功',
  4: '结算驳回',
};

export const receivePaymentStatusFlagMap: KeyValueMapType = {
  1: '草稿',
  2: '待审批',
  3: '已完成',
  4: '存档',
  5: '驳回',
};

export const billStatusFlagMap: KeyValueMapType = {
  1: '草稿',
  2: '待审批',
  3: '待出库',
  4: '出库完成',
  5: '存档',
  6: '退货',
  7: '作废',
  8: '驳回',
  9: '已结算',
};
export const billDistributionFlagMap: KeyValueMapType = {
  125: '自提',
  126: '送货',
  127: '物流发货',
  128: '安装',
};
