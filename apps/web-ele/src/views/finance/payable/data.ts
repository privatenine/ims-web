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
    // {
    //   component: 'Input',
    //   fieldName: 'name',
    //   label: '简拼码',
    //   componentProps: {
    //     placeholder: '请输入简拼码',
    //     clearable: true,
    //   },
    // },
    {
      component: 'Input',
      fieldName: 'name',
      label: '单位名称',
      componentProps: {
        placeholder: '请输入单位名称',
        clearable: true,
      },
    },
    {
      component: 'Checkbox',
      fieldName: 'isExcludeZero',
      label: '排除余零',
      componentProps: {
        // placeholder: '请输入简拼码',
        clearable: true,
      },
    },
  ];
}

export function useColumns(): VxeTableGridOptions['columns'] {
  return [
    { align: 'center', title: '', type: 'radio', width: 40 },
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'supplierName',
      title: '来往单位',
    },
    {
      field: 'shortName',
      title: '单位简称',
      width: 100,
    },
    {
      field: 'totalMoney',
      title: '合计金额(元)',
      width: 100,
    },
    {
      field: 'contact',
      title: '联系人',
      width: 100,
    },
    {
      field: 'telephone',
      title: '电话',
      width: 100,
    },
    {
      field: 'mobilePhone',
      title: '手机',
      width: 100,
    },
  ];
}
