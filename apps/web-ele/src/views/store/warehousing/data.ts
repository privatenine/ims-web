import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getStorageOptions } from '#/utils/storage';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '客户全称',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'carNum',
      label: '简拼码',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'carNum',
      label: '库位',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'carNum',
      label: '仓管电话',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'carNum',
      label: '仓库状态',
      rules: 'required',
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '产品简拼',
    },
    {
      component: 'Input',
      fieldName: 'productName',
      label: '产品名称',
    },
    {
      component: 'Select',
      fieldName: 'storeId',
      label: '仓库',
      componentProps: {
        placeholder: '请选择仓库',
        clearable: true,
        options: getStorageOptions(),
      },
    },
    {
      component: 'Input',
      fieldName: 'siteName',
      label: '货位',
    },
    {
      component: 'Input',
      fieldName: 'productPlaceName',
      label: '产地',
    },
    {
      component: 'Select',
      fieldName: 'isLocked',
      label: '盘点锁',
      componentProps: {
        placeholder: '请选择状态',
        clearable: true,
        options: [
          { label: '已锁定', value: 1 },
          { label: '未锁定', value: 0 },
        ],
      },
    },
    {
      component: 'Select',
      fieldName: 'isZero',
      label: '排零',
      componentProps: {
        placeholder: '请选择状态',
        clearable: true,
        options: [
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ],
      },
    },
  ];
}

export function useColumns(): VxeTableGridOptions['columns'] {
  return [
    { align: 'center', title: '', type: 'radio', width: 40 },
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'name',
      title: '通用车型',
      width: 100,
    },
    {
      field: 'productName',
      title: '产品名称',
      width: 100,
    },
    {
      field: 'productAttachmentNames',
      title: '附件',
      width: 200,
    },
    {
      field: 'productPlaceName',
      title: '产地',
      width: 200,
    },
    {
      field: 'actiNum',
      title: '数量',
      width: 200,
    },
    {
      field: 'storeName',
      title: '仓库',
      width: 200,
    },
    {
      field: 'siteName',
      title: '库位',
      width: 200,
    },
    {
      field: 'buyPrice',
      title: '进货价',
      width: 200,
    },
    {
      field: 'batchPrice',
      title: '最低销售价',
      width: 200,
    },
    {
      field: 'priceReference',
      title: '进货参考价',
      width: 200,
    },
    {
      field: 'isDefault',
      title: '默认货位',
      width: 200,
    },
  ];
}
