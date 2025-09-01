import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

// 发布状态映射
export const publishStatusMap: Record<number, { color: string; name: string }> =
  {
    1: { name: '已发布', color: 'success' },
    0: { name: '已下架', color: 'danger' },
  };

// 类别选项
export const categoryOptions = [
  { label: '新增商品', value: '新增商品' },
  { label: '积压处理', value: '积压处理' },
  { label: '促销活动', value: '促销活动' },
  { label: '清仓处理', value: '清仓处理' },
  { label: '限时特惠', value: '限时特惠' },
];

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'productName',
      label: '产品名称',
      componentProps: {
        placeholder: '请输入产品名称',
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'publishQuantity',
      label: '发布数量',
      componentProps: {
        placeholder: '请输入发布数量',
        min: 1,
        style: { width: '100%' },
      },
    },
    {
      component: 'Input',
      fieldName: 'contactPhone',
      label: '联系方式',
      componentProps: {
        placeholder: '请输入联系方式',
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'deadline',
      label: '截止日期',
      componentProps: {
        placeholder: '年/月/日',
        format: 'YYYY/MM/DD',
        valueFormat: 'X',
        style: { width: '100%' },
      },
    },
    {
      component: 'Select',
      fieldName: 'category',
      label: '类别',
      componentProps: {
        placeholder: '请选择类别',
        options: categoryOptions,
        style: { width: '100%' },
      },
    },
    {
      component: 'Input',
      fieldName: 'remark',
      label: '备注',
      componentProps: {
        placeholder: '请输入备注',
        type: 'textarea',
        rows: 3,
      },
    },
    {
      component: 'RadioGroup',
      fieldName: 'status',
      label: '是否发布',
      componentProps: {
        options: [
          { label: '发布', value: 1 },
          { label: '下架', value: 0 },
        ],
      },
      defaultValue: 1,
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'productName',
      label: '产品名称',
      componentProps: {
        placeholder: '请输入产品名称',
      },
    },
    {
      component: 'Input',
      fieldName: 'contactPhone',
      label: '联系方式',
      componentProps: {
        placeholder: '请输入联系方式',
      },
    },
    {
      component: 'Select',
      fieldName: 'publishStatus',
      label: '发布状态',
      componentProps: {
        placeholder: '请选择发布状态',
        clearable: true,
        options: [
          { label: '已发布', value: 1 },
          { label: '已下架', value: 0 },
        ],
      },
    },
    {
      component: 'Select',
      fieldName: 'category',
      label: '类别',
      componentProps: {
        placeholder: '请选择类别',
        clearable: true,
        options: categoryOptions,
      },
    },
    {
      component: 'RangePicker',
      fieldName: 'rangePicker',
      label: '发布时间',
      componentProps: {
        placeholder: ['开始日期', '结束日期'],
        format: 'YYYY-MM-DD',
        valueFormat: 'X',
      },
    },
  ];
}

export function useColumns(): VxeTableGridOptions['columns'] {
  return [
    { align: 'center', title: '', type: 'radio', width: 40 },
    { title: '排序', type: 'seq', width: 60 },
    {
      field: 'productName',
      title: '产品名称',
      width: 250,
      showOverflow: 'tooltip',
    },
    {
      field: 'publishQuantity',
      title: '发布数量',
      width: 120,
      align: 'right',
    },
    {
      field: 'contactPhone',
      title: '联系方式',
      width: 150,
      showOverflow: 'tooltip',
    },
    {
      field: 'status',
      title: '发布状态',
      width: 100,
      slots: { default: 'status' },
    },
    {
      field: 'category',
      title: '类别',
      width: 120,
      showOverflow: 'tooltip',
    },
    {
      field: 'deadline',
      title: '截止日期',
      width: 150,
      formatter: ({ cellValue }: { cellValue: number }) => {
        return cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : '-';
      },
    },
    {
      field: 'publishTime',
      title: '发布时间',
      width: 150,
      formatter: ({ cellValue }: { cellValue: number }) => {
        return cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : '-';
      },
    },
    {
      field: 'remark',
      title: '备注',
      width: 200,
      showOverflow: 'tooltip',
    },
  ];
}
