import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '仓库名称',
      rules: 'required',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'jianPinCode',
      label: '简拼码',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'address',
      label: '仓库地址',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: '仓库状态',
      componentProps: {
        clearable: true,
        options: [
          {
            label: '在用',
            value: 1,
          },
          {
            label: '停用',
            value: 2,
          },
        ],
      },
    },
    {
      component: 'Input',
      fieldName: 'storeOperName',
      label: '仓管员',
      componentProps: {
        clearable: true,
        readonly: true,
        // onClick: openPersonList,
      },
    },
    {
      component: 'Input',
      fieldName: 'telephone',
      label: '仓管电话',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'storeOperId',
      label: '仓管员',
      hideLabel: true,
      componentProps: {
        clearable: true,
        readonly: true,
        type: 'hidden',
      },
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '仓库名称',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'jianPinCode',
      label: '简拼码',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'address',
      label: '仓库地址',
      componentProps: {
        clearable: true,
      },
    },
    // {
    //   component: 'Input',
    //   fieldName: 'storeOperName',
    //   label: '仓管员',
    //   componentProps: {
    //     clearable: true,
    //   },
    // },
    {
      component: 'Input',
      fieldName: 'telephone',
      label: '仓管电话',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: '仓库状态',
      componentProps: {
        allowClear: true,
        clearable: true,
        options: [
          {
            label: '在用',
            value: 1,
          },
          {
            label: '停用',
            value: 2,
          },
        ],
        placeholder: '请选择',
      },
    },
  ];
}

export function useColumns(): VxeTableGridOptions['columns'] {
  return [
    { align: 'center', title: '', type: 'radio', width: 40 },
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'name',
      title: '仓库名称',
      width: 100,
    },
    {
      field: 'jianPinCode',
      title: '简拼码',
      width: 100,
    },
    {
      field: 'address',
      title: '仓库地址',
    },
    {
      field: 'storeOperName',
      title: '仓管员',
      width: 80,
    },
    {
      field: 'telephone',
      title: '仓库电话',
      width: 120,
    },
    {
      field: 'status',
      title: '仓库状态',
      width: 80,
      slots: {
        default: (scope: any) => {
          return scope.row.status === 1 ? '在用' : '停用';
        },
      },
    },
  ];
}
