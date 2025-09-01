import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'username',
      label: '用户',
      componentProps: {
        placeholder: '请输入用户名',
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'title',
      label: '标题',
      componentProps: {
        placeholder: '请输入标题',
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'message',
      label: '消息',
      componentProps: {
        placeholder: '请输入消息',
        clearable: true,
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'rangePicker',
      label: '开始时间',
      componentProps: {
        placeholder: '请选择开始时间',
        clearable: true,
        type: 'daterange',
      },
    },
  ];
}

export function useColumns(): VxeTableGridOptions['columns'] {
  return [
    // { align: 'left', title: '', type: 'radio', width: 40 },
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'username',
      title: '用户',
      width: 100,
      sortable: true,
    },
    {
      field: 'companyId',
      title: '公司Id',
      width: 100,
      sortable: true,
    },
    {
      field: 'companyName',
      title: '公司名称',
      width: 100,
      sortable: true,
    },
    {
      field: 'title',
      title: '标题',
      width: 200,
      sortable: true,
    },
    {
      field: 'message',
      title: '消息',
      sortable: true,
    },
    {
      field: 'ip',
      title: '登录IP',
      width: 120,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '开始时间',
      width: 120,
      sortable: true,
      formatter: ({ cellValue }) =>
        cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : '',
    },
    {
      field: 'endTime',
      title: '结束时间',
      width: 120,
      sortable: true,
      formatter: ({ cellValue }) =>
        cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : '',
    },
  ];
}
