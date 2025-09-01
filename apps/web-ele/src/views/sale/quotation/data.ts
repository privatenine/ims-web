import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '客户',
      rules: 'required',
      componentProps: {
        clearable: true,
        placeholder: '请输入客户',
      },
    },
    {
      component: 'Select',
      fieldName: 'carNum',
      label: '运输类别',
      rules: 'required',
      componentProps: {
        clearable: true,
        placeholder: '请选择运输类别',
        options: [
          {
            label: '自提',
            value: 125,
          },
          {
            label: '送货',
            value: 126,
          },
          {
            label: '物流发货',
            value: 127,
          },
          {
            label: '安装',
            value: 128,
          },
        ],
      },
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: '单号',
      componentProps: {
        clearable: true,
        disabled: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'priceLevel',
      label: '价格级别',
      componentProps: {
        clearable: true,
        readonly: true,
        // onClick: openPersonList,
        placeholder: '请选择价格级别',
        options: [
          {
            label: '一级',
            value: 1,
          },
          {
            label: '二级',
            value: 2,
          },
        ],
      },
    },
    {
      component: 'Select',
      fieldName: 'businessType',
      label: '业务类型',
      componentProps: {
        clearable: true,
        readonly: true,
        // onClick: openPersonList,
        placeholder: '请选择业务类型',
        options: [
          {
            label: '销售',
            value: 1,
          },
          {
            label: '租赁',
            value: 2,
          },
        ],
      },
    },
    {
      component: 'Input',
      fieldName: 'totalNum',
      label: '数量',
      componentProps: {
        clearable: true,
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'totalMoney',
      label: '金额',
      componentProps: {
        clearable: true,
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'salesperson',
      label: '业务员',
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
        disabled: true,
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
      fieldName: 'saleCode',
      label: '销售流水号',
      componentProps: {
        clearable: true,
        placeholder: '请输入销售流水号',
      },
    },
    {
      component: 'Select',
      fieldName: 'deliveryType',
      label: '配送类型',
      componentProps: {
        clearable: true,
        placeholder: '请选择配送类型',
        options: [
          { label: '自提', value: 1 },
          { label: '送货', value: 2 },
          { label: '物流发货', value: 3 },
        ],
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'deliveryDate',
      label: '预计到货日期',
      componentProps: {
        clearable: true,
        placeholder: '预计到货日期',
      },
    },
    {
      component: 'Select',
      fieldName: 'businessType',
      label: '业务类型',
      componentProps: {
        clearable: true,
        placeholder: '业务类型',
        options: [
          { label: '销售', value: 1 },
          { label: '租赁', value: 2 },
        ],
      },
    },
    {
      component: 'Input',
      fieldName: 'salesperson',
      label: '业务员',
      componentProps: {
        clearable: true,
        placeholder: '业务员',
      },
    },
    {
      component: 'Select',
      fieldName: 'priceLevel',
      label: '价格级别',
      componentProps: {
        clearable: true,
        placeholder: '价格级别',
        options: [
          { label: '一级', value: 1 },
          { label: '二级', value: 2 },
        ],
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'discountAmount',
      label: '优惠金额',
      componentProps: {
        clearable: true,
        placeholder: '优惠金额',
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'totalMoney',
      label: '总金额',
      componentProps: {
        clearable: true,
        placeholder: '总金额',
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'totalNum',
      label: '总数量',
      componentProps: {
        clearable: true,
        placeholder: '总数量',
      },
    },
    {
      component: 'Input',
      fieldName: 'remark',
      label: '备注',
      componentProps: {
        clearable: true,
        placeholder: '备注',
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
      title: '报价流水号',
      width: 200,
    },
    {
      field: 'statusFlag',
      title: '订单状态',
      width: 200,
    },
    {
      field: 'custName',
      title: '客户',
      width: 200,
    },
    {
      field: 'totalMoney',
      title: '金额(元)',
      width: 200,
    },
    {
      field: 'totalNum',
      title: '数量',
      width: 200,
    },
    {
      field: 'discountAmount',
      title: '优惠金额(元)',
      width: 200,
    },
    {
      field: 'carNum',
      title: '汽车车牌',
      width: 200,
    },
    {
      field: 'orderEmployee',
      title: '下单员工',
      width: 200,
    },
    {
      field: 'approveName',
      title: '审批人',
      width: 200,
    },
    {
      field: 'approveTime',
      title: '审批日期',
      width: 200,
      formatter: ({ cellValue }) => {
        return cellValue ? new Date(cellValue).toLocaleDateString() : '';
      },
    },
    {
      field: 'businessType',
      title: '业务类型',
      width: 200,
    },
    {
      field: 'deliveryType',
      title: '配送类型',
      width: 200,
    },
    {
      field: 'freight',
      title: '运费',
      width: 200,
    },
    {
      field: 'prepaidAmount',
      title: '已付预付款',
      width: 200,
    },
    {
      field: 'createTime',
      title: '制单日期',
      width: 200,
      formatter: ({ cellValue }) => {
        return cellValue ? new Date(cellValue).toLocaleDateString() : '';
      },
    },
    {
      field: 'createName',
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
export function useSubColumns(): VxeTableGridOptions['columns'] {
  return [
    { align: 'center', title: '', type: 'radio', width: 40 },
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'code',
      title: '产品名称',
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
      title: '数量',
      width: 200,
    },
    {
      field: 'totalMoney',
      title: '单价(元)',
      width: 200,
    },
    {
      field: 'createTime',
      title: '金额(元)',
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
      field: 'remark',
      title: '备注',
      width: 200,
    },
  ];
}
