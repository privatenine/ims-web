import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { CommApi } from '#/api';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'supplierName',
      label: '供应商',
      rules: 'required',
      componentProps: {
        placeholder: '请选择',
        readonly: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: '单号',
      componentProps: {
        readonly: true,
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'createTime',
      label: '制单日期',
      defaultValue: new Date(),
      componentProps: {
        type: 'date',
        placeholder: '请选择制单日期',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
    },
    {
      component: 'Input',
      fieldName: 'pickerName',
      label: '拣货人员',
      componentProps: {
        placeholder: '请点击选择拣货人员',
        readonly: true,
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'loaderName',
      label: '装货人员',
      componentProps: {
        placeholder: '请点击选择装货人员',
        readonly: true,
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'createName',
      label: '制单员',
      componentProps: {
        placeholder: '制单员',
        readonly: true,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'totalMoney',
      label: '金额',
      defaultValue: 0,
      componentProps: {
        clearable: true,
        readonly: true,
        disabled: true,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'totalNum',
      label: '数量',
      defaultValue: 0,
      componentProps: {
        clearable: true,
        readonly: true,
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'remark',
      label: '备注',
      componentProps: {
        placeholder: '请输入备注',
        clearable: true,
        type: 'textarea',
      },
      formItemClass: 'col-span-4',
    },
    {
      component: 'Input',
      fieldName: 'supplierId',
      label: '',
      componentProps: {
        type: 'hidden',
      },
    },
    {
      component: 'Input',
      fieldName: 'id',
      label: '',
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
      label: '单号',
      componentProps: {
        clearable: true,
        placeholder: '请输入单号',
      },
    },
    {
      component: 'Input',
      fieldName: 'supplierName',
      label: '供应商',
      componentProps: {
        clearable: true,
        placeholder: '请点击选择供应商',
        readonly: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'statusFlag',
      label: '单据状态',
      componentProps: {
        clearable: true,
        placeholder: '请选择单据状态',
        options: [
          { label: '全部', value: '' },
          { label: '草稿', value: 1 },
          { label: '待审批', value: 2 },
          { label: '已完成', value: 3 },
          { label: '驳回', value: 4 },
        ],
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'dateRange',
      label: '日期范围',
      componentProps: {
        type: 'daterange',
        placeholder: ['开始日期', '结束日期'],
        format: 'YYYY-MM-DD',
        valueFormat: 'x',
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
      title: '单号',
      width: 200,
      sortable: true,
    },
    {
      field: 'statusFlag',
      title: '状态',
      width: 100,
      sortable: true,
      formatter: ({ cellValue }) => {
        const statusMap: Record<number, string> = {
          1: '草稿',
          2: '待审批',
          3: '已完成',
          4: '驳回',
        };
        return statusMap[cellValue] || '未知';
      },
    },
    {
      field: 'supplierName',
      title: '供应商',
      width: 200,
      sortable: true,
    },
    {
      field: 'createName',
      title: '制单员工',
      width: 120,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '制单日期',
      width: 150,
      sortable: true,
      formatter: ({ cellValue }) => {
        if (!cellValue) return '-';
        return new Date(cellValue).toLocaleDateString('zh-CN');
      },
    },
    {
      field: 'totalMoney',
      title: '金额',
      width: 120,
      sortable: true,
      formatter: ({ cellValue }) => {
        return cellValue ? `¥${Number(cellValue).toFixed(2)}` : '¥0.00';
      },
    },
    {
      field: 'totalNum',
      title: '数量',
      width: 100,
      sortable: true,
    },
    {
      field: 'approveTime',
      title: '审批日期',
      width: 150,
      sortable: true,
      formatter: ({ cellValue }) => {
        if (!cellValue) return '-';
        return new Date(cellValue).toLocaleDateString('zh-CN');
      },
    },
    {
      field: 'approveName',
      title: '审批员工',
      width: 120,
      sortable: true,
    },
    {
      field: 'remark',
      title: '备注',
      width: 200,
      showOverflow: 'tooltip',
    },
  ];
}

// 详情页面使用的 schema
export function useDetailSchema(): CommApi.ColumnType[] {
  const form1 = useFormSchema();
  return form1
    .filter((n) => n.componentProps?.type !== 'hidden')
    .map(({ fieldName, label }) => ({
      fieldName,
      label: label ? (typeof label === 'string' ? label : '') : '',
    }));
}

// 子表单列配置
export function useSubFormColumns(): VxeTableGridOptions['columns'] {
  return [
    { align: 'center', title: '', type: 'radio', width: 40 },
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'productName',
      title: '产品名称',
      width: 140,
      sortable: true,
    },
    {
      field: 'productCode',
      title: '产品编码',
      width: 120,
      sortable: true,
    },
    {
      field: 'spec',
      title: '规格',
      width: 100,
      sortable: true,
    },
    {
      field: 'unit',
      title: '单位',
      width: 80,
      sortable: true,
    },
    {
      field: 'num',
      title: '数量',
      width: 100,
      sortable: true,
    },
    {
      field: 'price',
      title: '单价',
      width: 100,
      sortable: true,
      formatter: ({ cellValue }) => {
        return cellValue ? `¥${Number(cellValue).toFixed(2)}` : '¥0.00';
      },
    },
    {
      field: 'totalPrice',
      title: '总价',
      width: 120,
      sortable: true,
      formatter: ({ cellValue }) => {
        return cellValue ? `¥${Number(cellValue).toFixed(2)}` : '¥0.00';
      },
    },
    {
      field: 'siteName',
      title: '货位',
      width: 100,
      sortable: true,
      slots: { default: 'siteName' },
    },
    {
      field: 'remark',
      title: '备注',
      width: 150,
      showOverflow: 'tooltip',
    },
  ];
}

// 子表列配置
export function useSubColumns(): VxeTableGridOptions['columns'] {
  return [
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'productName',
      title: '产品名称',
      width: 140,
      sortable: true,
    },
    {
      field: 'productCode',
      title: '产品编码',
      width: 120,
      sortable: true,
    },
    {
      field: 'spec',
      title: '规格',
      width: 100,
      sortable: true,
    },
    {
      field: 'unit',
      title: '单位',
      width: 80,
      sortable: true,
    },
    {
      field: 'num',
      title: '数量',
      width: 100,
      sortable: true,
    },
    {
      field: 'price',
      title: '单价',
      width: 100,
      sortable: true,
      formatter: ({ cellValue }) => {
        return cellValue ? `¥${Number(cellValue).toFixed(2)}` : '¥0.00';
      },
    },
    {
      field: 'totalPrice',
      title: '总价',
      width: 120,
      sortable: true,
      formatter: ({ cellValue }) => {
        return cellValue ? `¥${Number(cellValue).toFixed(2)}` : '¥0.00';
      },
    },
    {
      field: 'siteName',
      title: '货位',
      width: 100,
      sortable: true,
    },
    {
      field: 'remark',
      title: '备注',
      width: 150,
      showOverflow: 'tooltip',
    },
  ];
}
