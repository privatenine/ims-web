import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { CommApi } from '#/api';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'customerName',
      label: '客户名称',
      rules: 'required',
      componentProps: {
        clearable: true,
        // onClick: openSupplierList,
      },
    },
    {
      component: 'Input',
      fieldName: 'typeName',
      label: '收款方式',
      rules: 'required',
      componentProps: {
        clearable: true,
        readonly: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'formId',
      label: '收款流水号',
      componentProps: {
        clearable: true,
        readonly: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'formCode',
      label: '收款单据',
      componentProps: {
        clearable: true,
        readonly: true,
        // onClick: openPayableList,
      },
    },
    {
      component: 'Input',
      fieldName: 'countMoney',
      label: '优惠金额',
      componentProps: {
        readonly: true,
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'formId',
      label: '销售单号',
      componentProps: {
        clearable: true,
        readonly: true,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'countMoney',
      label: '实收金额',
      componentProps: {
        clearable: true,
        // readonly: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'balanceMoney',
      label: '客户应付',
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
      fieldName: 'customerId',
      label: '客户Id',
      rules: 'required',
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
      fieldName: 'formId',
      label: '收款单号',
      componentProps: {
        placeholder: '请选择',
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: '单据编码',
      componentProps: {
        placeholder: '请选择',
        clearable: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'statusFlag',
      label: '收款状态',
      componentProps: {
        placeholder: '请选择',
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
      field: 'formId',
      title: '收款流水号',
      width: 200,
    },
    {
      field: 'statusFlag',
      title: '收款状态',
      width: 200,
      slots: { default: 'statusFlag' },
    },
    {
      field: 'code',
      title: '收款编码',
      width: 200,
    },
    {
      field: 'customerName',
      title: '客户名称',
      width: 200,
    },
    // {
    //   field: 'carNum',
    //   title: '应收金额',
    //   width: 200,
    // },
    {
      field: 'countMoney',
      title: '优惠金额',
      width: 200,
    },
    {
      field: 'amountPaid',
      title: '实收金额',
      width: 200,
    },
    {
      field: 'amountUnpaid',
      title: '未收金额',
      width: 200,
    },
    // {
    //   field: 'carNum',
    //   title: '收款方式',
    //   width: 200,
    // },
    {
      field: 'totalNum',
      title: '单据总数',
      width: 100,
    },
    {
      field: 'createName',
      title: '制单人',
      width: 100,
    },
    {
      field: 'createTime',
      title: '制单日期',
      width: 100,
      slots: { default: 'createTime' },
    },
    {
      field: 'approveName',
      title: '审核员',
      width: 100,
    },
    {
      field: 'approveTime',
      title: '审核日期',
      width: 100,
      slots: { default: 'approveTime' },
    },
    {
      field: 'typeName',
      title: '单据类别',
      width: 100,
    },
    {
      field: 'monthField',
      title: '年月',
      width: 100,
    },
    {
      field: 'remark',
      title: '备注',
    },
  ];
}

export function useDetailSchema(): CommApi.ColumnType[] {
  // const form1 = useFormSchema();
  // return form1.map(({ fieldName, label }, index) => ({
  //   fieldName,
  //   label: label ? (typeof label === 'string' ? label : '') : '',
  //   sign: index > 24 ? 2 : 1,
  // }));
  return [];
}
