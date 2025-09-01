import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'code',
      label: '配送流水号',
      componentProps: {
        clearable: true,
        placeholder: '请输入配送流水号',
      },
    },
    {
      component: 'Select',
      fieldName: 'carId',
      label: '车牌号',
      componentProps: {
        clearable: true,
        placeholder: '请选择车牌号',
        options: [
          { label: '叉车', value: 1 },
          { label: '货车1', value: 2 },
          { label: '货车2', value: 3 },
        ],
      },
    },
    {
      component: 'Select',
      fieldName: 'statusFlag',
      label: '配送状态',
      componentProps: {
        clearable: true,
        placeholder: '请选择配送状态',
        options: [
          { label: '草稿', value: 1 },
          { label: '待审批', value: 2 },
          { label: '配送结束', value: 3 },
          { label: '驳回', value: 4 },
        ],
      },
    },
    {
      component: 'RangePicker',
      fieldName: 'rangePicker',
      label: '制单日期',
      componentProps: {
        clearable: true,
        placeholder: ['开始日期', '结束日期'],
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
      title: '配送流水号',
      width: 180,
    },
    {
      field: 'statusFlag',
      title: '配送状态',
      width: 100,
      slots: { default: 'statusFlag' },
    },
    {
      field: 'createName',
      title: '制单员',
      width: 100,
    },
    {
      field: 'createTime',
      title: '制单日期',
      width: 120,
      formatter: ({ cellValue }) => {
        return cellValue ? new Date(cellValue).toLocaleDateString() : '';
      },
    },
    {
      field: 'approveName',
      title: '审核员',
      width: 100,
    },
    {
      field: 'approveTime',
      title: '审核日期',
      width: 120,
      formatter: ({ cellValue }) => {
        return cellValue ? new Date(cellValue).toLocaleDateString() : '';
      },
    },
    {
      field: 'accountNumber',
      title: '卡号',
      width: 120,
    },
    {
      field: 'carNum',
      title: '车牌',
      width: 100,
    },
    {
      field: 'totalMoney',
      title: '总金额',
      width: 100,
      formatter: ({ cellValue }) => {
        return cellValue ? `¥${cellValue.toFixed(2)}` : '¥0.00';
      },
    },
    {
      field: 'totalNum',
      title: '总数量',
      width: 80,
    },
    {
      field: 'deliveryPersons',
      title: '配送人员',
      width: 120,
      formatter: ({ cellValue }) => {
        if (Array.isArray(cellValue) && cellValue.length > 0) {
          return cellValue.map((person) => person.realName).join(', ');
        }
        return '';
      },
    },
    {
      field: 'loadingPersons',
      title: '装货人员',
      width: 120,
      formatter: ({ cellValue }) => {
        if (Array.isArray(cellValue) && cellValue.length > 0) {
          return cellValue.map((person) => person.realName).join(', ');
        }
        return '';
      },
    },
    {
      field: 'logisticsName',
      title: '物流名称',
      width: 120,
    },
    {
      field: 'logisticsNumber',
      title: '物流单号',
      width: 150,
    },
    {
      field: 'remark',
      title: '备注',
      width: 200,
    },
  ];
}
