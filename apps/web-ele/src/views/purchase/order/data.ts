import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { h } from 'vue';

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
      fieldName: 'shortCode',
      label: '简拼码',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'location',
      label: '库位',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'managerPhone',
      label: '仓管电话',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'status',
      label: '仓库状态',
      rules: 'required',
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'orderNo',
      label: '单号',
    },
    { component: 'Input', fieldName: 'orderStatus', label: '订单状态' },
    {
      component: 'Input',
      fieldName: 'supplierName',
      label: '供应商',
      componentProps: {
        readonly: true,
        placeholder: '点击选择供应商',
        suffix: () =>
          h('i', {
            class: 'i-ep:search',
            style: 'cursor: pointer',
          }),
      },
    },
    { component: 'DatePicker', fieldName: 'orderDate', label: '订货日期' },
    { component: 'Input', fieldName: 'creator', label: '制单人' },
  ];
}

export function useColumns(): VxeTableGridOptions['columns'] {
  return [
    { align: 'center', title: '', type: 'radio', width: 40 },
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'orderNo',
      title: '单号',
      width: 200,
    },
    {
      field: 'orderStatus',
      title: '订单状态',
      width: 200,
    },
    {
      field: 'supplierName',
      title: '供应商',
      width: 200,
    },
    {
      field: 'totalAmount',
      title: '总金额',
      width: 200,
    },
    {
      field: 'totalQuantity',
      title: '总数量',
      width: 200,
    },
    {
      field: 'orderDate',
      title: '订货日期',
      width: 200,
    },
    {
      field: 'bankAccount',
      title: '银行账号',
      width: 200,
    },
    {
      field: 'currency',
      title: '币种',
      width: 200,
    },
    {
      field: 'paidAdvance',
      title: '已付预付款',
      width: 200,
    },
    {
      field: 'creator',
      title: '制单员',
      width: 200,
    },
    {
      field: 'remark',
      title: '备注',
      width: 200,
    },
  ];
}
