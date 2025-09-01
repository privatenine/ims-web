import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'orderCode',
      label: '单号',
      componentProps: {
        clearable: true,
        placeholder: '请输入单号',
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'rangePicker',
      label: '制单日期',
      componentProps: {
        type: 'daterange',
        clearable: true,
        placeholder: ['开始日期', '结束日期'],
      },
    },
    {
      component: 'Select',
      fieldName: 'carPlate',
      label: '汽车车牌',
      componentProps: {
        clearable: true,
        placeholder: '全部',
        options: [
          { label: '全部', value: '' },
          { label: '叉车', value: 'forklift' },
          { label: '货车', value: 'truck' },
          { label: '小轿车', value: 'car' },
        ],
      },
    },
    {
      component: 'Select',
      fieldName: 'shipmentStatus',
      label: '发货状态',
      componentProps: {
        clearable: true,
        placeholder: '全部',
        options: [
          { label: '全部', value: '' },
          { label: '发货结束', value: 'finished' },
          { label: '草稿', value: 'draft' },
        ],
      },
    },
  ];
}

export function useColumns(): VxeTableGridOptions['columns'] {
  return [
    { align: 'center', title: '', type: 'radio', width: 40 },
    { title: '排序', field: 'sort', width: 60, sortable: true },
    {
      field: 'shipmentCode',
      title: '发货流水号',
      width: 180,
      sortable: true,
    },
    {
      field: 'shipmentStatus',
      title: '发货状态',
      width: 100,
      sortable: true,
      formatter: ({ cellValue }) => {
        const statusMap = {
          finished: '发货结束',
          draft: '草稿',
        };
        return statusMap[cellValue as keyof typeof statusMap] || cellValue;
      },
    },
    {
      field: 'createName',
      title: '制单员',
      width: 100,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '制单日期',
      width: 120,
      sortable: true,
      formatter: ({ cellValue }) => {
        return cellValue ? new Date(cellValue).toLocaleDateString() : '-';
      },
    },
    {
      field: 'approveName',
      title: '审批人',
      width: 100,
      sortable: true,
    },
    {
      field: 'approveTime',
      title: '审批日期',
      width: 120,
      sortable: true,
      formatter: ({ cellValue }) => {
        return cellValue ? new Date(cellValue).toLocaleDateString() : '-';
      },
    },
    {
      field: 'cardNumber',
      title: '卡号',
      width: 80,
      sortable: true,
    },
    {
      field: 'carPlate',
      title: '汽车车牌',
      width: 100,
      sortable: true,
    },
    {
      field: 'totalAmount',
      title: '总金额',
      width: 100,
      sortable: true,
      formatter: ({ cellValue }) => {
        return cellValue ? `￥${Number(cellValue).toFixed(2)}` : '-';
      },
    },
    {
      field: 'totalQuantity',
      title: '总数量',
      width: 100,
      sortable: true,
    },
    {
      field: 'remark',
      title: '备注',
      width: 200,
      sortable: true,
    },
  ];
}
