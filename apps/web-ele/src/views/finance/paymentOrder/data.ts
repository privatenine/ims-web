import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { CommApi } from '#/api';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'supplierName',
      label: '供应商',
      rules: 'required',
      componentProps: {
        clearable: true,
        // onClick: openSupplierList,
        // onClear: clearSupplierName,
      },
    },
    {
      component: 'Select',
      fieldName: 'typeName',
      label: '结算账户',
      rules: 'required',
      componentProps: {
        clearable: true,
        options: [],
      },
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: '付款流水号',
      componentProps: {
        clearable: true,
        readonly: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'formCode',
      label: '核销单据',
      componentProps: {
        clearable: true,
        readonly: true,
        // onClick: openPayableList,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'balanceMoney', // amountPaid',
      label: '付款金额',
      defaultValue: 0,
      componentProps: {
        clearable: true,
        readonly: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'bb',
      label: '入库单号',
      componentProps: {
        clearable: true,
        readonly: true,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'countMoney',
      label: '优惠金额',
      defaultValue: 0,
      componentProps: {
        clearable: true,
        // readonly: true,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'aa',
      label: '合计应付',
      defaultValue: 0,
      componentProps: {
        clearable: true,
        readonly: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'remark',
      label: '备注',
      formItemClass: 'col-span-2',
      componentProps: {
        clearable: true,
        type: 'textarea',
      },
    },
    {
      component: 'Input',
      fieldName: 'supplierId',
      hideLabel: true,
      componentProps: {
        type: 'hidden',
      },
    },
    {
      component: 'Input',
      fieldName: 'mainId',
      hideLabel: true,
      componentProps: {
        type: 'hidden',
      },
    },
    {
      component: 'Input',
      fieldName: 'formId',
      hideLabel: true,
      componentProps: {
        type: 'hidden',
      },
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'code',
      label: '付款单号',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'formCode',
      label: ' 核销单据',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'statusFlag',
      label: '付款状态',
      componentProps: {
        clearable: true,
        options: [
          { label: '草稿', value: 1 },
          { label: '待结算', value: 2 },
          { label: '结算成功', value: 3 },
          { label: '结算驳回', value: 4 },
        ],
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
      title: '付款单号',
      width: 160,
    },
    {
      field: 'statusFlag',
      title: '收款状态',
      width: 80,
      slots: { default: 'statusFlag' },
    },
    {
      field: 'supplierName',
      title: '单位',
      width: 100,
    },
    {
      field: 'balanceMoney',
      title: '付款金额',
      width: 80,
    },
    {
      field: 'remark',
      title: '备注',
      width: 200,
    },
    {
      field: 'formCode',
      title: '核销单据',
      width: 140,
    },
    {
      field: 'approveName',
      title: '审核员',
      width: 80,
    },
    {
      field: 'countMoney',
      title: '优惠金额',
      width: 80,
    },
    {
      field: 'amountPaid',
      title: '已付金额',
      width: 80,
    },
    {
      field: 'amountUnpaid',
      title: '未付金额',
      width: 80,
    },
    {
      field: 'typeName',
      title: '结算账户',
      width: 100,
      slots: { default: 'typeName' },
    },
    {
      field: 'a',
      title: '单据类型',
      width: 100,
    },
    {
      field: 'totalNum',
      title: '单据总量',
      width: 100,
    },
    {
      field: 'createTime',
      title: '操作日期',
      width: 120,
      slots: { default: 'createTime' },
    },
    {
      field: 'createName',
      title: '操作员',
      width: 100,
    },
    {
      field: 'monthField',
      title: '年月',
      width: 80,
    },
    {
      field: 'approveTime',
      title: '审核日期',
      width: 100,
      slots: { default: 'approveTime' },
    },
  ];
}

export function useDetailSchema(): CommApi.ColumnType[] {
  const form1 = useFormSchema();
  return form1
    .filter((n) => n.componentProps?.type !== 'hidden')
    .map(({ fieldName, label }, index) => ({
      fieldName,
      label: label ? (typeof label === 'string' ? label : '') : '',
    }));
}
