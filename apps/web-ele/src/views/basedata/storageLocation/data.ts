import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'storageName',
      label: '仓库名称',
      rules: 'required',
      componentProps: {
        clearable: true,
        readonly: true,
        // onClick: openModel,
        placeholder: '请选择仓库',
      },
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '仓库位置',
      rules: 'required',
      componentProps: {
        clearable: true,
        placeholder: '请输入仓库位置',
      },
    },
    // {
    //   component: 'Input',
    //   fieldName: 'carNum',
    //   label: '简拼码',
    //   rules: 'required',
    // },
    {
      component: 'Input',
      fieldName: 'storageId',
      hideLabel: true,
      componentProps: {
        type: 'hidden',
        readonly: true,
      },
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'storageName',
      label: '仓库名称',
      componentProps: {
        clearable: true,
        placeholder: '请选择仓库',
      },
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '库位',
      componentProps: {
        clearable: true,
        placeholder: '请输入库位',
      },
    },
    // { component: 'Input', fieldName: 'carNum', label: '简拼码' },
    // { component: 'DatePicker', fieldName: 'carNum', label: '货位类型' },
    {
      component: 'Input',
      fieldName: 'storageId',
      hideLabel: true,
      componentProps: {
        type: 'hidden',
        readonly: true,
      },
    },
  ];
}

export function useColumns(): VxeTableGridOptions['columns'] {
  return [
    { align: 'left', title: '', type: 'radio', width: 40 },
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'storageName',
      title: '仓库名称',
    },
    {
      field: 'name',
      title: '库位',
    },
  ];
}
