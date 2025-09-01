import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

// 移库状态映射
export const statusFlagMap: Record<
  number,
  { color: 'danger' | 'info' | 'primary' | 'success' | 'warning'; name: string }
> = {
  1: { name: '草稿', color: 'info' },
  2: { name: '待审批', color: 'warning' },
  3: { name: '移库完成', color: 'success' },
  4: { name: '驳回', color: 'danger' },
};

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Select',
      fieldName: 'transferMethod',
      label: '移库方式',
      rules: 'required',
      componentProps: {
        placeholder: '请选择移库方式',
        clearable: true,
        options: [
          { label: '修正货位', value: '修正货位' },
          { label: '移动货位', value: '移动货位' },
        ],
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'orderDate',
      label: '制单日期',
      componentProps: {
        type: 'date',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
        placeholder: '制单日期',
        readonly: false,
      },
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: '单号',
      componentProps: {
        readonly: true,
        placeholder: '系统自动生成',
      },
    },
    {
      component: 'Input',
      fieldName: 'orderCreator',
      label: '制单人员',
      componentProps: {
        readonly: true,
        placeholder: '当前用户',
      },
    },
    {
      component: 'Input',
      fieldName: 'remark',
      label: '备注',
      componentProps: {
        placeholder: '请输入备注',
        clearable: true,
        type: 'textarea',
      },
      formItemClass: 'col-span-4',
    },
  ];
}

export function useDetailColumns(): VxeTableGridOptions['columns'] {
  return [
    { align: 'center', title: '', type: 'checkbox', width: 40 },
    { title: '排序', type: 'seq', width: 60 },
    {
      field: 'productName',
      title: '产品名称',
      width: 200,
      showOverflow: 'tooltip',
    },
    {
      field: 'attachment',
      title: '附件',
      width: 100,
      showOverflow: 'tooltip',
    },
    {
      field: 'origin',
      title: '产地',
      width: 120,
      showOverflow: 'tooltip',
    },
    {
      field: 'oldWarehouseName',
      title: '旧库名称',
      width: 120,
      sortable: true,
      showOverflow: 'tooltip',
    },
    {
      field: 'oldWarehouseLocation',
      title: '旧库库位',
      width: 120,
      sortable: true,
      showOverflow: 'tooltip',
    },
    {
      field: 'transferQuantity',
      title: '移库数量',
      width: 100,
      align: 'right',
      sortable: true,
      editRender: {
        name: 'ElInputNumber',
        props: {
          min: 0,
          precision: 0,
          placeholder: '0',
        },
      },
      formatter: ({ cellValue }: { cellValue: number }) => {
        return cellValue || 0;
      },
    },
    {
      field: 'newWarehouse',
      title: '新库',
      width: 120,
      sortable: true,
      showOverflow: 'tooltip',
    },
    {
      field: 'newWarehouseLocation',
      title: '新库库位',
      width: 120,
      sortable: true,
      showOverflow: 'tooltip',
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'code',
      label: '单号',
      componentProps: {
        placeholder: '请输入单号',
      },
    },
    {
      component: 'Select',
      fieldName: 'fashion',
      label: '移库方式',
      componentProps: {
        placeholder: '全部',
        clearable: true,
        options: [
          { label: '全部', value: '' },
          { label: '修正货位', value: 'CORRECT' },
          { label: '移库货位', value: 'MOVE' },
        ],
      },
    },
    {
      component: 'Select',
      fieldName: 'statusFlag',
      label: '移库状态',
      componentProps: {
        placeholder: '全部',
        clearable: true,
        options: [
          { label: '全部', value: '' },
          { label: '草稿', value: 1 },
          { label: '待审批', value: 2 },
          { label: '移库完成', value: 3 },
          { label: '驳回', value: 4 },
        ],
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'dateRange',
      label: '制单日期',
      componentProps: {
        type: 'daterange',
        placeholder: ['开始日期', '结束日期'],
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
        rangeSeparator: '至',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
      },
    },
  ];
}

export function useDetailSchema() {
  return [
    { fieldName: 'code', label: '移库单号' },
    { fieldName: 'statusFlag', label: '移库状态' },
    { fieldName: 'totalNum', label: '总数量' },
    { fieldName: 'createName', label: '操作员' },
    { fieldName: 'createTime', label: '操作日期' },
    { fieldName: 'approveName', label: '审批人' },
    { fieldName: 'remark', label: '备注' },
  ];
}

export function useColumns(): VxeTableGridOptions['columns'] {
  return [
    { align: 'center', title: '', type: 'radio', width: 40 },
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'code',
      title: '移库单号',
      width: 180,
      showOverflow: 'tooltip',
      sortable: true,
    },
    {
      field: 'statusFlag',
      title: '移库状态',
      width: 120,
      slots: { default: 'statusFlag' },
      sortable: true,
    },

    {
      field: 'totalNum',
      title: '总数量',
      width: 100,
      align: 'right',
      sortable: true,
      formatter: ({ cellValue }: { cellValue: number }) => {
        return cellValue || 0;
      },
    },
    {
      field: 'createName',
      title: '操作员',
      width: 120,
      showOverflow: 'tooltip',
      sortable: true,
    },
    {
      field: 'createTime',
      title: '操作日期',
      width: 150,
      sortable: true,
      formatter: ({ cellValue }: { cellValue: number }) => {
        return cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm') : '-';
      },
    },
    {
      field: 'approveName',
      title: '审批人',
      width: 120,
      showOverflow: 'tooltip',
      sortable: true,
    },
    {
      field: 'approveTime',
      title: '审批日期',
      width: 150,
      sortable: true,
      formatter: ({ cellValue }: { cellValue: number }) => {
        return cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm') : '-';
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
