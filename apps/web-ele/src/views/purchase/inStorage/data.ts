import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { CarApi, CommApi } from '#/api';

import { getCarList } from '#/api';

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
      component: 'Select',
      fieldName: 'arrivalId',
      label: '到货方式',
      componentProps: {
        placeholder: '请选择',
        clearable: true,
        options: [
          {
            label: '自提',
            value: 1,
          },
          {
            label: '送货',
            value: 2,
          },
          {
            label: '物流送货',
            value: 3,
          },
        ],
      },
    },
    {
      component: 'ApiSelect',
      fieldName: 'pickUpCarId',
      label: '提货车牌',
      componentProps: {
        afterFetch: ({ data }: { data: Array<CarApi.Car> }) => {
          return data.map((item: CarApi.Car) => ({
            label: item.carNum || '',
            value: item.id,
          }));
        },
        // 菜单接口
        api: () => getCarList(),
        clearable: true,
        placeholder: '请选择',
      },
    },
    {
      component: 'Select',
      fieldName: 'unloadingId',
      label: '卸货方式',
      componentProps: {
        placeholder: '请选择',
        clearable: true,
        options: [
          {
            label: '机械',
            value: 1,
          },
          {
            label: '人工',
            value: 2,
          },
        ],
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
      },
    },
    {
      component: 'Input',
      fieldName: 'supplierName',
      label: '供应商',
      componentProps: {
        clearable: true,
        readonly: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'statusFlag',
      label: '订单状态',
      componentProps: {
        clearable: true,
        readonly: true,
        options: [
          { label: '草稿', value: 1 },
          { label: '待入库', value: 2 },
          { label: '已完成', value: 3 },
          { label: '存档', value: 4 },
          { label: '驳回', value: 5 },
          { label: '已结算', value: 6 },
        ],
      },
    },
    {
      component: 'ApiSelect',
      fieldName: 'pickUpCarId',
      label: '提货车牌',
      componentProps: {
        // 菜单接口转options格式
        afterFetch: ({ data }: { data: Array<CarApi.Car> }) => {
          return data.map((item: CarApi.Car) => ({
            label: item.carNum || '',
            value: item.id,
          }));
        },
        // 菜单接口
        api: () => getCarList(),
        clearable: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'arrivalId',
      label: '到货方式',
      componentProps: {
        clearable: true,
        options: [
          { label: '自提', value: 1 },
          { label: '送货', value: 2 },
          { label: '物流送货', value: 3 },
        ],
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'rangePicker',
      label: '开单日期',
      componentProps: { type: 'daterange' },
    },
    {
      component: 'Input',
      fieldName: 'supplierId',
      componentProps: {
        clearable: true,
        readonly: true,
        type: 'hidden',
      },
    },
  ];
}

export function useColumns(): VxeTableGridOptions['columns'] {
  return [
    { align: 'center', title: '', type: 'radio', width: 40 },
    { title: '序号', type: 'seq', width: 50, field: 'seq' },
    {
      field: 'code',
      title: '单号',
      width: 200,
      sortable: true,
    },
    {
      field: 'statusFlag',
      title: '订单状态',
      width: 120,
      slots: { default: 'statusFlag' },
      sortable: true,
    },
    {
      field: 'supplierName',
      title: '供应商',
      width: 200,
      sortable: true,
    },
    {
      field: 'totalNum',
      title: '数量',
      width: 80,
      sortable: true,
    },
    {
      field: 'totalMoney',
      title: '金额',
      width: 80,
      sortable: true,
    },
    {
      field: 'printFlag',
      title: '打印次数',
      width: 100,
      sortable: true,
    },
    {
      field: 'storeName',
      title: '临时仓库',
      width: 100,
      sortable: true,
    },
    {
      field: 'storeSiteName',
      title: '临时货位',
      width: 100,
      slots: { default: 'storeSiteName' },
      sortable: true,
    },
    {
      field: 'createName',
      title: '制单员',
      width: 100,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '入库日期',
      width: 100,
      slots: { default: 'createTime' },
      sortable: true,
    },
    {
      field: 'approveName',
      title: '审批人',
      width: 100,
      sortable: true,
    },
    {
      field: 'pickUpCarNum',
      title: '提货车牌号',
      width: 120,
      sortable: true,
    },
    {
      field: 'unloadingId',
      title: '卸货方式',
      width: 100,
      slots: { default: 'unloadingId' },
      sortable: true,
    },
    {
      field: 'remark',
      title: '备注',
      sortable: true,
      width: 200,
    },
  ];
}

export function useDetailSchema(): CommApi.ColumnType[] {
  const form1 = useFormSchema();
  return form1
    .filter((n) => n.componentProps?.type !== 'hidden')
    .map(({ fieldName, label }, index) => ({
      fieldName,
      label: label ? (typeof label === 'string' ? label : '') : '',
    }));
}
export function useSubColumns(): VxeTableGridOptions['columns'] {
  return [
    { align: 'center', title: '', type: 'radio', width: 40 },
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'productName',
      title: '产品名称',
      width: 200,
    },
    {
      field: 'productAttachmentNames',
      title: '附件',
      width: 200,
    },
    {
      field: 'productPlaceName',
      title: '产地',
      width: 100,
    },
    {
      field: 'actiNum',
      title: '数量',
      width: 80,
    },
    {
      field: 'price',
      title: '单价',
      width: 80,
    },
    {
      field: 'totalPrice',
      title: '总金额',
      width: 80,
    },
    {
      field: 'storeName',
      title: '仓库',
      width: 100,
    },
    {
      field: 'siteName',
      title: '库位',
      width: 100,
    },
    {
      field: 'remark',
      title: '备注',
      width: 300,
    },
    {
      field: 'priceReference',
      title: '参考价格',
      width: 100,
    },
    {
      field: 'purchaseCode',
      title: '采购编号',
      width: 80,
    },
  ];
}

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
      field: 'productAttachmentNames',
      title: '附件',
      // width: 80,
      sortable: true,
    },
    {
      field: 'productPlaceName',
      title: '产地',
      width: 100,
      sortable: true,
    },
    {
      field: 'actiNum',
      title: '数量',
      width: 80,
      sortable: true,
    },
    {
      field: 'price',
      title: '单价',
      width: 80,
      sortable: true,
    },
    {
      field: 'totalPrice',
      title: '总金额',
      width: 80,
      sortable: true,
    },
    {
      field: 'storeName',
      title: '仓库',
      width: 100,
      sortable: true,
    },
    {
      field: 'siteName',
      title: '库位',
      width: 100,
      slots: { default: 'siteName' },
      sortable: true,
    },
    {
      field: 'priceReference',
      title: '参考价格',
      width: 100,
      sortable: true,
    },
    // {
    //   field: 'approveName',
    //   title: '胶条',
    //   width: 80,
    // },
    {
      field: 'printLabel',
      title: '商标',
      width: 80,
      sortable: true,
    },

    {
      field: 'remark',
      title: '备注',
      width: 80,
      sortable: true,
    },
  ];
}
