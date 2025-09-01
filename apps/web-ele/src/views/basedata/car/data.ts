import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '车辆名称',
      rules: 'required',
      componentProps: {
        clearable: true,
        placeholder: '请输入车辆名称',
      },
    },
    {
      component: 'Input',
      fieldName: 'carNum',
      label: '车辆车牌',
      rules: 'required',
      componentProps: {
        clearable: true,
        placeholder: '请输入车辆车牌',
      },
    },
    {
      component: 'Input',
      fieldName: 'driverName',
      label: '驾驶员',
      componentProps: {
        clearable: true,
        readonly: true,
        // onClick: openPersonList,
        placeholder: '请选择驾驶员',
      },
    },
    {
      component: 'Input',
      fieldName: 'driverId',
      hideLabel: true,
      label: '驾驶员',
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
      label: '车辆名称',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'carNum',
      label: '车辆车牌',
      componentProps: {
        clearable: true,
      },
    },
  ];
}

export function useColumns(): VxeTableGridOptions['columns'] {
  return [
    { align: 'left', title: '', type: 'radio', width: 40 },
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'name',
      title: '车辆名称',
    },
    // {
    //   field: 'id',
    //   title: '车辆Id',
    //   width: 200,
    // },
    {
      field: 'carNum',
      title: '车辆车牌',
      width: 200,
    },
    {
      field: 'driverName',
      title: '驾驶员',
      width: 200,
    },
    // {
    //   field: 'createTime',
    //   title: '创建时间',
    //   width: 200,
    // },
    // {
    //   cellRender: {
    //     attrs: {
    //       onClick: onActionClick,
    //       nameField: 'name',
    //       nameTitle: '车辆',
    //     },
    //     name: 'CellOperation',
    //   },
    //   field: 'action',
    //   fixed: 'right',
    //   title: '操作',
    //   width: 130,
    // },
  ];
}
