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
      fieldName: 'code',
      label: '盘盈号',
    },
    {
      component: 'Select',
      fieldName: 'statusFlag',
      label: '盘点状态',
      componentProps: {
        options: [
          { label: '草稿', value: 1 },
          { label: '待审批', value: 2 },
          { label: '审批通过', value: 3 },
          { label: '驳回', value: 4 },
        ],
      },
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
      component: 'DatePicker',
      fieldName: 'startTime',
      label: '开始日期',
      componentProps: {
        type: 'date',
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'endTime',
      label: '结束日期',
      componentProps: {
        type: 'date',
      },
    },
  ];
}

export function useColumns(): VxeTableGridOptions['columns'] {
  return [
    { align: 'center', title: '', type: 'radio', width: 40 },
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'code',
      title: '盘盈号',
      width: 180,
      sortable: true,
    },
    {
      field: 'action',
      title: '盘点动作',
      width: 120,
    },
    {
      field: 'statusFlag',
      title: '状态',
      width: 100,
      formatter: ({ cellValue }) => {
        const statusMap = {
          1: '草稿',
          2: '待审批',
          3: '审批通过',
          4: '驳回',
        };
        return statusMap[cellValue as keyof typeof statusMap] || cellValue;
      },
    },
    {
      field: 'totalNum',
      title: '数量',
      width: 100,
      sortable: true,
    },
    {
      field: 'totalPrice',
      title: '总计成本',
      width: 120,
      sortable: true,
      formatter: ({ cellValue }) => {
        return cellValue ? `￥${Number(cellValue).toFixed(2)}` : '-';
      },
    },
    {
      field: 'storeName',
      title: '仓库',
      width: 120,
    },
    {
      field: 'storeSiteName',
      title: '货位',
      width: 120,
    },
    {
      field: 'createName',
      title: '制单员工',
      width: 100,
    },
    {
      field: 'createTime',
      title: '制单日期',
      width: 150,
      sortable: true,
      formatter: ({ cellValue }) => {
        return cellValue ? new Date(cellValue).toLocaleDateString() : '-';
      },
    },
    {
      field: 'approveName',
      title: '审批员工',
      width: 100,
    },
    {
      field: 'approveTime',
      title: '审批日期',
      width: 150,
      formatter: ({ cellValue }) => {
        return cellValue ? new Date(cellValue).toLocaleDateString() : '-';
      },
    },
    {
      field: 'remark',
      title: '备注',
      width: 200,
    },
  ];
}

// 状态映射
export const statusFlagMap = {
  1: { name: '草稿', color: 'info' },
  2: { name: '待审批', color: 'warning' },
  3: { name: '审批通过', color: 'success' },
  4: { name: '驳回', color: 'danger' },
};
