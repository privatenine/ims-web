import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getMenuList1, getStorageEmployeeList } from '#/api';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '角色名称',
      rules: 'required',
      componentProps: {
        placeholder: '请输入角色名称',
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'description',
      label: '描述',
      componentProps: {
        placeholder: '请输入描述',
        clearable: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'type',
      label: '角色类型',
      rules: 'required',
      defaultValue: 'user',
      componentProps: {
        placeholder: '请选择角色类型',
        clearable: true,
        options: [
          {
            label: '系统角色',
            value: 'system',
          },
          {
            label: '用户角色',
            value: 'user',
          },
        ],
      },
    },
    {
      component: 'ApiTreeSelect',
      // 对应组件的参数
      componentProps: {
        // 菜单接口
        api: getMenuList1,
        afterFetch: (data: { data: Record<string, any>[]; total: number }) => {
          return data.data;
        },
        childrenField: 'children',
        // 菜单接口转options格式
        labelField: 'name',
        valueField: 'id',
        // lazy: true,
        showCheckbox: true,
        // nodeKey: 'id',
        onCheckChange: () => {},
        checkstrictly: true,
        multiple: true,
      },
      // 字段名
      fieldName: 'menuIds',
      // 界面显示的label
      label: '菜单',
    },
    {
      component: 'ApiSelect',
      // 对应组件的参数
      componentProps: {
        // 菜单接口
        api: getStorageEmployeeList,
        afterFetch: (data: { data: Record<string, any>[]; total: number }) => {
          return data.data;
        },
        childrenField: 'children',
        // 菜单接口转options格式
        labelField: 'username',
        valueField: 'id',
        // lazy: true,
        multiple: true,
        // onCheckChange: null,
      },
      // 字段名
      fieldName: 'userIds',
      // 界面显示的label
      label: '用户',
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '角色名称',
      componentProps: {
        placeholder: '请输入角色名称',
        clearable: true,
      },
    },
    // { component: 'Input', fieldName: 'carNum', label: '描述' },
    {
      component: 'Select',
      fieldName: 'type',
      label: '角色类型',
      componentProps: {
        placeholder: '请选择角色类型',
        clearable: true,
        options: [
          {
            label: '系统角色',
            value: 'system',
          },
          {
            label: '用户角色',
            value: 'user',
          },
        ],
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
      title: '角色名称',
      width: 200,
    },
    {
      field: 'description',
      title: '描述',
    },
    {
      field: 'type',
      title: '角色类型',
      width: 200,
    },
  ];
}
