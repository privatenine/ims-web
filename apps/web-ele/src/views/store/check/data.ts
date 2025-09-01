import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

import { getStorageOptions } from '#/utils/storage';

// 盘点状态映射
export const statusFlagMap: Record<
  number,
  { color: 'danger' | 'info' | 'primary' | 'success' | 'warning'; name: string }
> = {
  1: { name: '草稿', color: 'info' },
  2: { name: '盘点进行中', color: 'warning' },
  3: { name: '盘点完成', color: 'success' },
  4: { name: '存档', color: 'primary' },
  5: { name: '驳回', color: 'danger' },
};

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'code',
      label: '盘点单号',
      componentProps: {
        readonly: true,
        placeholder: '系统自动生成',
      },
    },
    {
      component: 'Select',
      fieldName: 'storeId',
      label: '仓库选择',
      rules: 'required',
      componentProps: {
        placeholder: '请选择仓库',
        clearable: true,
        options: [
          {
            label: '请选择仓库',
            value: undefined,
            disabled: true,
          },
          ...getStorageOptions(),
        ],
      },
    },
    {
      component: 'Textarea',
      fieldName: 'remark',
      label: '备注',
      colProps: {
        span: 24,
      },
      componentProps: {
        placeholder: '请输入备注信息',
        rows: 4,
        maxlength: 500,
        showWordLimit: true,
        resize: 'vertical',
      },
    },
  ];
}

export function useDetailColumns(): VxeTableGridOptions['columns'] {
  return [
    { align: 'center', title: '', type: 'checkbox', width: 40 },
    { title: '排序', type: 'seq', width: 60 },
    {
      field: 'productName',
      title: '产品',
      width: 250,
      showOverflow: 'tooltip',
    },
    {
      field: 'attachment1',
      title: '附件',
      width: 100,
      showOverflow: 'tooltip',
    },
    {
      field: 'origin1',
      title: '产地',
      width: 120,
      showOverflow: 'tooltip',
    },
    {
      field: 'inventoryQuantity',
      title: '盘点数量',
      width: 150,
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
      field: 'attachment2',
      title: '附件',
      width: 100,
      showOverflow: 'tooltip',
    },
    {
      field: 'origin2',
      title: '产地',
      width: 120,
      showOverflow: 'tooltip',
    },
    {
      field: 'actualQuantity',
      title: '实际数量',
      width: 100,
      align: 'right',
      sortable: true,
      formatter: ({ cellValue }: { cellValue: number }) => {
        return cellValue || 0;
      },
    },
    {
      field: 'warehouseName',
      title: '仓库',
      width: 120,
      showOverflow: 'tooltip',
    },
    {
      field: 'binLocation',
      title: '仓位',
      width: 100,
      sortable: true,
      showOverflow: 'tooltip',
    },
    {
      field: 'remark',
      title: '备注',
      width: 150,
      showOverflow: 'tooltip',
      editRender: {
        name: 'ElInput',
        props: {
          placeholder: '备注',
        },
      },
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'code',
      label: '盘点流水号',
      componentProps: {
        placeholder: '请输入盘点流水号',
      },
    },
    {
      component: 'Select',
      fieldName: 'statusFlag',
      label: '盘点状态',
      componentProps: {
        placeholder: '请选择盘点状态',
        clearable: true,
        options: [
          { label: '草稿', value: 1 },
          { label: '盘点进行中', value: 2 },
          { label: '盘点完成', value: 3 },
          { label: '存档', value: 4 },
          { label: '驳回', value: 5 },
        ],
      },
    },
    {
      component: 'Select',
      fieldName: 'storeId',
      label: '仓库名称',
      componentProps: {
        placeholder: '请选择仓库',
        clearable: true,
        options: getStorageOptions(),
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
      title: '盘点流水号',
      width: 180,
      showOverflow: 'tooltip',
    },
    {
      field: 'statusFlag',
      title: '盘点状态',
      width: 120,
      slots: { default: 'statusFlag' },
    },
    {
      field: 'createName',
      title: '操作员',
      width: 120,
      showOverflow: 'tooltip',
    },
    {
      field: 'createTime',
      title: '操作日期',
      width: 150,
      formatter: ({ cellValue }: { cellValue: number }) => {
        return cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm') : '-';
      },
    },
    {
      field: 'totalNum',
      title: '账面总数',
      width: 100,
      align: 'right',
      formatter: ({ cellValue }: { cellValue: number }) => {
        return cellValue || 0;
      },
    },
    {
      field: 'totalActiNum',
      title: '实际总数',
      width: 100,
      align: 'right',
      formatter: ({ cellValue }: { cellValue: number }) => {
        return cellValue || 0;
      },
    },
    {
      field: 'storeName',
      title: '仓库名称',
      width: 150,
      showOverflow: 'tooltip',
    },
    {
      field: 'approveName',
      title: '审批人',
      width: 120,
      showOverflow: 'tooltip',
    },
    {
      field: 'approveTime',
      title: '审批日期',
      width: 150,
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
