import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

const userInfoStr = localStorage.getItem('userInfo');
const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'code',
      label: '收款流水号',
      componentProps: {
        clearable: true,
        placeholder: '请输入收款流水号',
        disabled: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'bankId',
      label: '收款方式',
      componentProps: {
        clearable: true,
        placeholder: '请选择收款方式',
        options: [],
      },
    },
    {
      component: 'Input',
      fieldName: 'formCode',
      label: '收款单据',
      componentProps: {
        clearable: true,
        placeholder: '请输入收款单据',
      },
    },
    {
      component: 'Input',
      fieldName: 'typeName',
      label: '类别',
      componentProps: {
        clearable: true,
        placeholder: '请输入类别',
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'totalNum',
      label: '单据总数',
      rules: 'required',
      componentProps: {
        clearable: true,
        placeholder: '请输入单据总数',
        min: 0,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'balanceMoney',
      label: '实收金额',
      rules: 'required',
      componentProps: {
        clearable: true,
        placeholder: '请输入实收金额',
        min: 0,
      },
    },
    {
      component: 'Input',
      fieldName: 'createName',
      label: '制单员',
      defaultValue: userInfo.username,
      componentProps: {
        clearable: true,
        placeholder: '请输入制单员',
        disabled: true,
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'createTime',
      label: '制单日期',
      defaultValue: new Date(),
      componentProps: {
        clearable: true,
        placeholder: '请输入制单日期',
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'remark',
      label: '备注',
      formItemClass: 'col-span-2',
      componentProps: {
        clearable: true,
        placeholder: '请输入备注',
        type: 'textarea',
      },
    },
    {
      component: 'Input',
      fieldName: 'bankAccount',
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
      label: '收款流水号',
      componentProps: {
        placeholder: '请输入收款流水号',
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'formCode',
      label: '收款单据',
      componentProps: {
        placeholder: '请输入收款单据',
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'typeName',
      label: '类别',
      componentProps: {
        placeholder: '请输入类别',
        clearable: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'statusFlag',
      label: '付款状态',
      componentProps: {
        placeholder: '请选择付款状态',
        clearable: true,
        options: [
          {
            label: '草稿',
            value: 1,
          },
          {
            label: '待结算',
            value: 2,
          },
          {
            label: '结算成功',
            value: 3,
          },
          {
            label: '结算驳回',
            value: 4,
          },
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
      title: '收款流水号',
      width: 160,
    },
    {
      field: 'statusFlag',
      title: '付款状态',
      width: 80,
      slots: { default: 'statusFlag' },
    },
    {
      field: 'bankAccount',
      title: '资金账号',
      width: 100,
    },
    {
      field: 'balanceMoney',
      title: '总金额(元)',
      width: 80,
    },
    {
      field: 'createName',
      title: '操作员',
      width: 80,
    },
    {
      field: 'createTime',
      title: '操作日期',
      width: 100,
      slots: { default: 'createTime' },
    },
    {
      field: 'approveName',
      title: '审核员',
      width: 80,
    },
    {
      field: 'approveTime',
      title: '审核日期',
      width: 100,
      slots: { default: 'approveTime' },
    },
    {
      field: 'formCode',
      title: '收款单据',
      width: 100,
    },
    {
      field: 'totalNum',
      title: '单据总数',
      width: 80,
    },
    {
      field: 'typeName',
      title: '类别',
      width: 80,
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
