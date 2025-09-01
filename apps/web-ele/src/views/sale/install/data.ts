import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

// 安装状态映射
export const installStatusMap: Record<number, { color: string; name: string }> =
  {
    1: { name: '草稿', color: 'warning' },
    2: { name: '待审批', color: 'info' },
    3: { name: '安装完成', color: 'success' },
    4: { name: '驳回', color: 'danger' },
  };

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'customerName',
      label: '客户',
      componentProps: {
        placeholder: '请输入客户名称',
      },
    },
    {
      component: 'Input',
      fieldName: 'productName',
      label: '产品名称',
      componentProps: {
        placeholder: '请输入产品名称',
      },
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: '状态',
      componentProps: {
        placeholder: '请选择状态',
        clearable: true,
        options: [
          { label: '等待安装', value: 1 },
          { label: '安装中', value: 2 },
          { label: '安装完成', value: 3 },
          { label: '已验收', value: 4 },
          { label: '已取消', value: 5 },
        ],
      },
    },
    {
      component: 'Input',
      fieldName: 'installCode',
      label: '安装单号',
      componentProps: {
        placeholder: '请输入安装单号',
      },
    },
    {
      component: 'Input',
      fieldName: 'saleCode',
      label: '销售单号',
      componentProps: {
        placeholder: '请输入销售单号',
      },
    },
    {
      component: 'Input',
      fieldName: 'servicePlate',
      label: '服务车牌',
      componentProps: {
        placeholder: '请输入服务车牌',
      },
    },
    {
      component: 'RangePicker',
      fieldName: 'rangePicker',
      label: '制单日期',
      componentProps: {
        placeholder: ['开始日期', '结束日期'],
        format: 'YYYY-MM-DD',
        valueFormat: 'X',
      },
    },
    {
      component: 'Input',
      fieldName: 'installTechnician',
      label: '安装技工',
      componentProps: {
        placeholder: '请输入安装技工',
      },
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'code',
      label: '安装单号',
      componentProps: {
        placeholder: '请输入安装单号',
      },
    },
    {
      component: 'Input',
      fieldName: 'productName',
      label: '产品名称',
      componentProps: {
        placeholder: '请输入产品名称',
      },
    },
    {
      component: 'Select',
      fieldName: 'statusFlag',
      label: '状态',
      componentProps: {
        placeholder: '请选择状态',
        clearable: true,
        options: [
          { label: '草稿', value: 1 },
          { label: '待审批', value: 2 },
          { label: '安装完成', value: 3 },
          { label: '驳回', value: 4 },
        ],
      },
    },
    {
      component: 'Input',
      fieldName: 'saleCode',
      label: '销售单号',
      componentProps: {
        placeholder: '请输入销售单号',
      },
    },
    {
      component: 'Input',
      fieldName: 'installCarNum',
      label: '安装车牌',
      componentProps: {
        placeholder: '请输入安装车牌',
      },
    },
    {
      component: 'RangePicker',
      fieldName: 'rangePicker',
      label: '制单日期',
      componentProps: {
        placeholder: ['开始日期', '结束日期'],
        format: 'YYYY-MM-DD',
        valueFormat: 'X',
      },
    },
  ];
}

export function useColumns(): VxeTableGridOptions['columns'] {
  return [
    { align: 'center', title: '', type: 'radio', width: 40 },
    { title: '序号', type: 'seq', width: 60 },
    {
      field: 'code',
      title: '安装单号',
      width: 180,
      showOverflow: 'tooltip',
    },
    {
      field: 'saleCode',
      title: '销售单号',
      width: 180,
      showOverflow: 'tooltip',
    },
    {
      field: 'custName',
      title: '客户名称',
      width: 150,
      showOverflow: 'tooltip',
    },
    {
      field: 'productName',
      title: '产品名称',
      width: 200,
      showOverflow: 'tooltip',
    },
    {
      field: 'statusFlag',
      title: '状态',
      width: 100,
      slots: { default: 'statusFlag' },
    },
    {
      field: 'price',
      title: '价格',
      width: 100,
      align: 'right',
      formatter: ({ cellValue }: { cellValue: number }) => {
        return cellValue ? `¥${cellValue.toFixed(2)}` : '¥0.00';
      },
    },
    {
      field: 'paymentMoney',
      title: '支付金额',
      width: 100,
      align: 'right',
      formatter: ({ cellValue }: { cellValue: number }) => {
        return cellValue ? `¥${cellValue.toFixed(2)}` : '¥0.00';
      },
    },
    {
      field: 'discountMoney',
      title: '折扣金额',
      width: 100,
      align: 'right',
      formatter: ({ cellValue }: { cellValue: number }) => {
        return cellValue ? `¥${cellValue.toFixed(2)}` : '¥0.00';
      },
    },
    {
      field: 'installCarNum',
      title: '安装车牌',
      width: 120,
      showOverflow: 'tooltip',
    },
    {
      field: 'anzhuangPersons',
      title: '安装人员',
      width: 150,
      formatter: ({ cellValue }: { cellValue: any[] }) => {
        if (Array.isArray(cellValue) && cellValue.length > 0) {
          return cellValue.map((person) => person.realName).join(', ');
        }
        return '';
      },
    },
    {
      field: 'createName',
      title: '制单员',
      width: 100,
    },
    {
      field: 'createTime',
      title: '制单日期',
      width: 150,
      formatter: ({ cellValue }: { cellValue: number }) => {
        return cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm') : '-';
      },
    },
    {
      field: 'approveName',
      title: '审核员',
      width: 100,
    },
    {
      field: 'approveTime',
      title: '审核日期',
      width: 150,
      formatter: ({ cellValue }: { cellValue: number }) => {
        return cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm') : '-';
      },
    },
    {
      field: 'siteName',
      title: '站点名称',
      width: 150,
      showOverflow: 'tooltip',
    },
    {
      field: 'remark',
      title: '备注',
      width: 200,
      showOverflow: 'tooltip',
    },
  ];
}
