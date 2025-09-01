import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'custName',
      label: '客户',
      rules: 'required',
      componentProps: {
        clearable: true,
        placeholder: '请输入客户名称',
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'createTime',
      label: '退货日期',
      rules: 'required',
      componentProps: {
        clearable: true,
        placeholder: '请选择退货日期',
        type: 'date',
      },
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: '退货单号',
      componentProps: {
        clearable: true,
        disabled: true,
        placeholder: '系统自动生成',
      },
    },
    {
      component: 'Select',
      fieldName: 'storeId',
      label: '退货仓库',
      rules: 'required',
      componentProps: {
        clearable: true,
        placeholder: '请选择退货仓库',
        options: [], // 需要从接口获取仓库列表
      },
    },
    {
      component: 'Input',
      fieldName: 'siteName',
      label: '站点名称',
      componentProps: {
        clearable: true,
        placeholder: '请输入站点名称',
      },
    },
    {
      component: 'Input',
      fieldName: 'totalNum',
      label: '退货数量',
      componentProps: {
        clearable: true,
        disabled: true,
        placeholder: '自动计算',
      },
    },
    {
      component: 'Input',
      fieldName: 'totalMoney',
      label: '退货金额',
      componentProps: {
        clearable: true,
        disabled: true,
        placeholder: '自动计算',
      },
    },
    {
      component: 'Input',
      fieldName: 'createName',
      label: '制单员工',
      componentProps: {
        clearable: true,
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'remark',
      label: '备注',
      componentProps: {
        clearable: true,
        placeholder: '请输入备注信息',
        type: 'textarea',
        rows: 3,
      },
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'custName',
      label: '客户',
      componentProps: {
        clearable: true,
        placeholder: '请输入客户名称',
      },
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: '单号',
      componentProps: {
        clearable: true,
        placeholder: '请输入单号',
      },
    },
    {
      component: 'Select',
      fieldName: 'statusFlag',
      label: '订单状态',
      componentProps: {
        clearable: true,
        placeholder: '请选择订单状态',
        options: [
          { label: '草稿', value: 1 },
          { label: '待审批', value: 2 },
          { label: '已审批', value: 3 },
          { label: '已完成', value: 4 },
          { label: '已作废', value: 5 },
        ],
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'dateRange',
      label: '开单日期',
      componentProps: {
        clearable: true,
        type: 'daterange',
        placeholder: '请选择日期范围',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
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
      title: '单号',
      width: 150,
    },
    {
      field: 'custName',
      title: '客户名称',
      width: 150,
    },
    {
      field: 'statusFlag',
      title: '订单状态',
      width: 100,
      formatter: ({ cellValue }) => {
        const statusMap: Record<number, string> = {
          1: '草稿',
          2: '待审批',
          3: '已审批',
          4: '已完成',
          5: '已作废',
        };
        return statusMap[cellValue] || '未知';
      },
    },
    {
      field: 'totalNum',
      title: '数量',
      width: 80,
    },
    {
      field: 'totalMoney',
      title: '金额(元)',
      width: 100,
      formatter: ({ cellValue }) => {
        return cellValue ? `¥${cellValue.toFixed(2)}` : '¥0.00';
      },
    },
    {
      field: 'storeName',
      title: '仓库',
      width: 120,
    },
    {
      field: 'siteName',
      title: '站点',
      width: 120,
    },
    {
      field: 'createTime',
      title: '制单日期',
      width: 150,
      formatter: ({ cellValue }) => {
        return cellValue ? new Date(cellValue).toLocaleString() : '';
      },
    },
    {
      field: 'createName',
      title: '制单员工',
      width: 100,
    },
    {
      field: 'approveName',
      title: '审核员工',
      width: 100,
    },
    {
      field: 'approveTime',
      title: '审核日期',
      width: 150,
      formatter: ({ cellValue }) => {
        return cellValue ? new Date(cellValue).toLocaleString() : '';
      },
    },
    {
      field: 'remark',
      title: '备注',
      width: 150,
    },
    {
      field: 'totalBuyPrice',
      title: '销售成本',
      width: 100,
      formatter: ({ cellValue }) => {
        return cellValue ? `¥${cellValue.toFixed(2)}` : '¥0.00';
      },
    },
    {
      field: 'region1',
      title: '区域1',
      width: 100,
    },
    {
      field: 'region2',
      title: '区域2',
      width: 100,
    },
    {
      field: 'region3',
      title: '区域3',
      width: 100,
    },
    {
      field: 'saleId',
      title: '关联销售单',
      width: 120,
    },
  ];
}
export function useSubColumns(): VxeTableGridOptions['columns'] {
  return [
    { align: 'center', title: '', type: 'radio', width: 40 },
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'code',
      title: '产品名称',
      width: 200,
    },
    {
      field: 'custName',
      title: '附件',
      width: 200,
    },
    {
      field: 'statusFlag',
      title: '产地',
      width: 200,
    },
    {
      field: 'totalNum',
      title: '退货数量',
      width: 200,
    },
    {
      field: 'totalMoney',
      title: '退货价格(元)',
      width: 200,
    },
    {
      field: 'createTime',
      title: '总金额(元)',
      width: 200,
    },
    {
      field: 'createName',
      title: '仓库',
      width: 200,
    },
    {
      field: 'distribution',
      title: '库位',
      width: 200,
    },
    {
      field: 'distribution',
      title: '销售编号',
      width: 200,
    },
    {
      field: 'remark',
      title: '备注',
      width: 200,
    },
    {
      field: 'remark',
      title: '进货价',
      width: 200,
    },
    {
      field: 'remark',
      title: '销售价',
      width: 200,
    },
    {
      field: 'remark',
      title: '销售数量',
      width: 200,
    },
  ];
}
