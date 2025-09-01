import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

// 雨感器状态映射
export const rainSensorMap: Record<string, { color: string; name: string }> = {
  '1': { name: '有', color: 'success' },
  '0': { name: '无', color: 'info' },
  '': { name: '-', color: 'info' },
};

// 胶条状态映射
export const sealantMap: Record<string, { color: string; name: string }> = {
  '1': { name: '有', color: 'success' },
  '0': { name: '无', color: 'info' },
  '': { name: '-', color: 'info' },
};

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'productJpm',
      label: '产品简拼',
      componentProps: {
        placeholder: '请输入产品简拼',
      },
    },
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
      fieldName: 'specification',
      label: '规格',
      componentProps: {
        placeholder: '请输入规格',
      },
    },
    {
      component: 'Select',
      fieldName: 'productPlaceId',
      label: '产地',
      componentProps: {
        placeholder: '请选择产地',
        clearable: true,
        options: [
          { label: '山西利虎', value: 1 },
          { label: '德国', value: 2 },
          { label: '中国', value: 3 },
          // 可以通过API动态加载
        ],
      },
    },
    {
      component: 'Input',
      fieldName: 'supplierName',
      label: '公司',
      componentProps: {
        placeholder: '请输入公司名称',
      },
    },
    {
      component: 'Select',
      fieldName: 'source',
      label: '来源',
      componentProps: {
        placeholder: '请选择来源',
        clearable: true,
        options: [
          { label: '采购入库', value: 'purchase' },
          { label: '调拨入库', value: 'transfer' },
          { label: '盘点调整', value: 'inventory' },
          { label: '其他入库', value: 'other' },
        ],
      },
    },
    {
      component: 'Input',
      fieldName: 'storeName',
      label: '仓库',
      componentProps: {
        placeholder: '请输入仓库名称',
      },
    },
    {
      component: 'Input',
      fieldName: 'siteName',
      label: '库位',
      componentProps: {
        placeholder: '请输入库位',
      },
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'productJpm',
      label: '产品简拼',
      componentProps: {
        placeholder: '请输入产品简拼',
      },
    },
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
      fieldName: 'specification',
      label: '规格',
      componentProps: {
        placeholder: '请输入规格',
      },
    },
    {
      component: 'Select',
      fieldName: 'productPlaceId',
      label: '产地',
      componentProps: {
        placeholder: '请选择产地',
        clearable: true,
        options: [
          { label: '山西利虎', value: 1 },
          { label: '德国', value: 2 },
          { label: '中国', value: 3 },
        ],
      },
    },
    {
      component: 'Input',
      fieldName: 'supplierName',
      label: '公司',
      componentProps: {
        placeholder: '请输入公司名称',
      },
    },
    {
      component: 'Select',
      fieldName: 'source',
      label: '来源',
      componentProps: {
        placeholder: '请选择来源',
        clearable: true,
        options: [
          { label: '采购入库', value: 'purchase' },
          { label: '调拨入库', value: 'transfer' },
          { label: '盘点调整', value: 'inventory' },
          { label: '其他入库', value: 'other' },
        ],
      },
    },
  ];
}

export function useColumns(): VxeTableGridOptions['columns'] {
  return [
    { align: 'center', title: '', type: 'radio', width: 40 },
    { title: '序号', type: 'seq', width: 60 },
    {
      field: 'operation',
      title: '操作',
      width: 80,
      slots: { default: 'operation' },
    },
    {
      field: 'productName',
      title: '产品名称',
      width: 280,
      showOverflow: 'tooltip',
    },
    {
      field: 'supplierName',
      title: '公司名称',
      width: 120,
      showOverflow: 'tooltip',
    },
    {
      field: 'productPlaceName',
      title: '产地',
      width: 100,
      showOverflow: 'tooltip',
    },
    {
      field: 'storeName',
      title: '仓库',
      width: 100,
      showOverflow: 'tooltip',
    },
    {
      field: 'siteName',
      title: '库位',
      width: 100,
      slots: { default: 'siteName' },
    },
    {
      field: 'actiNum',
      title: '数量',
      width: 80,
      align: 'right',
      formatter: ({ cellValue }: { cellValue: number }) => {
        return cellValue || 0;
      },
    },
    {
      field: 'rainSensor',
      title: '雨感',
      width: 80,
      slots: { default: 'rainSensor' },
    },
    {
      field: 'sealant',
      title: '胶条',
      width: 80,
      slots: { default: 'sealant' },
    },
    {
      field: 'trademark',
      title: '商标',
      width: 100,
      showOverflow: 'tooltip',
    },
    {
      field: 'bracket',
      title: '支架',
      width: 100,
      showOverflow: 'tooltip',
    },
    {
      field: 'color',
      title: '颜色',
      width: 100,
      showOverflow: 'tooltip',
    },
    {
      field: 'ribbon',
      title: '彩带',
      width: 100,
      showOverflow: 'tooltip',
    },
    {
      field: 'featureCode',
      title: '特征码',
      width: 120,
      showOverflow: 'tooltip',
    },
    {
      field: 'edge',
      title: '印边',
      width: 100,
      showOverflow: 'tooltip',
    },
    {
      field: 'createTime',
      title: '创建时间',
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
