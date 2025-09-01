import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '客户全称',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'carNum',
      label: '简拼码',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'carNum',
      label: '库位',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'carNum',
      label: '仓管电话',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'carNum',
      label: '仓库状态',
      rules: 'required',
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '收款单号',
    },
    { component: 'Input', fieldName: 'carNum', label: '单据编码' },
    { component: 'Input', fieldName: 'carNum', label: '收款状态' },
  ];
}

export function useColumns(): VxeTableGridOptions['columns'] {
  return [
    { align: 'center', title: '', type: 'radio', width: 40 },
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'name',
      title: '收款流水号',
      width: 200,
    },
    {
      field: 'carNum',
      title: '收款状态',
      width: 200,
    },
    {
      field: 'carNum',
      title: '收款编码',
      width: 200,
    },
    {
      field: 'carNum',
      title: '客户名称',
      width: 200,
    },
    {
      field: 'carNum',
      title: '应收金额',
      width: 200,
    },
    {
      field: 'carNum',
      title: '优惠金额',
      width: 200,
    },
    {
      field: 'carNum',
      title: '实收金额',
      width: 200,
    },
    {
      field: 'carNum',
      title: '未收金额',
      width: 200,
    },
    {
      field: 'carNum',
      title: '收款方式',
      width: 200,
    },
    {
      field: 'carNum',
      title: '单据总数',
      width: 200,
    },
    {
      field: 'carNum',
      title: '制单人',
      width: 200,
    },
    {
      field: 'carNum',
      title: '制单日期',
      width: 200,
    },
    {
      field: 'carNum',
      title: '审核员',
      width: 200,
    },
    {
      field: 'carNum',
      title: '审核日期',
      width: 200,
    },
    {
      field: 'carNum',
      title: '单据类别',
      width: 200,
    },
    {
      field: 'carNum',
      title: '年月',
      width: 200,
    },
    {
      field: 'carNum',
      title: '备注',
      width: 200,
    },
  ];
}
