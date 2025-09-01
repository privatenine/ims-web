import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

import { billDistributionFlagMap, billStatusFlagMap } from '#/utils';

const userInfoStr = localStorage.getItem('userInfo');
const nUserInfo = userInfoStr ? JSON.parse(userInfoStr) : {};
export function useFormSchema(): VbenFormSchema[] {
  return [
    // 第一行：基本信息
    {
      component: 'Input',
      fieldName: 'code',
      label: '单号',
      componentProps: {
        clearable: true,
        disabled: true,
        placeholder: '系统自动生成',
      },
    },
    {
      component: 'Input',
      fieldName: 'custName',
      label: '客户名称',
      rules: 'required',
      componentProps: {
        clearable: true,
        readonly: true,
        placeholder: '点击选择客户',
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'orderTime',
      label: '下单日期',
      defaultValue: new Date(),
      componentProps: {
        clearable: true,
        placeholder: '选择下单日期',
        type: 'date',
      },
    },

    // 第二行：业务信息
    {
      component: 'Select',
      fieldName: 'businessType',
      label: '业务类型',
      rules: 'required',
      componentProps: {
        clearable: true,
        placeholder: '请选择业务类型',
        options: [
          {
            label: '零售',
            value: 122,
          },
          {
            label: '批发',
            value: 123,
          },
          {
            label: '其它',
            value: 124,
          },
        ],
      },
    },
    {
      component: 'Select',
      fieldName: 'distribution',
      label: '配送类型',
      rules: 'required',
      componentProps: {
        clearable: true,
        placeholder: '请选择配送类型',
        options: [
          {
            label: '自提',
            value: 125,
          },
          {
            label: '送货',
            value: 126,
          },
          {
            label: '物流发货',
            value: 127,
          },
          {
            label: '安装',
            value: 128,
          },
        ],
      },
    },
    {
      component: 'Input',
      fieldName: 'createName',
      label: '业务员',
      defaultValue: nUserInfo.realName,
      componentProps: {
        clearable: true,
        readonly: true,
        placeholder: '点击选择业务员',
      },
    },

    // 第三行：金额统计
    {
      component: 'InputNumber',
      fieldName: 'totalNum',
      label: '总数量',
      defaultValue: 0,
      componentProps: {
        clearable: true,
        disabled: true,
        precision: 0,
        min: 0,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'totalMoney',
      label: '总金额',
      defaultValue: 0,
      componentProps: {
        clearable: true,
        disabled: true,
        precision: 2,
        min: 0,
        formatter: (value: number) =>
          `¥ ${value}`.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ','),
        parser: (value: string) => value.replaceAll(/¥\s?|(,*)/g, ''),
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'discountMoney',
      label: '优惠金额',
      defaultValue: 0,
      componentProps: {
        clearable: true,
        precision: 2,
        min: 0,
        placeholder: '输入优惠金额',
        formatter: (value: number) =>
          `¥ ${value}`.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ','),
        parser: (value: string) => value.replaceAll(/¥\s?|(,*)/g, ''),
      },
    },

    // 第四行：收货信息
    {
      component: 'Input',
      fieldName: 'receiveAddress',
      label: '收货地址',
      componentProps: {
        clearable: true,
        placeholder: '请输入收货地址',
      },
    },
    {
      component: 'Input',
      fieldName: 'receiveName',
      label: '收货人',
      componentProps: {
        clearable: true,
        placeholder: '请输入收货人姓名',
      },
    },
    {
      component: 'Input',
      fieldName: 'receivePhone',
      label: '联系电话',
      componentProps: {
        clearable: true,
        placeholder: '请输入联系电话',
      },
    },

    // 第五行：备注
    {
      component: 'Textarea',
      fieldName: 'remark',
      label: '备注信息',
      componentProps: {
        clearable: true,
        placeholder: '请输入备注信息',
        rows: 3,
      },
    },

    // 隐藏字段
    {
      component: 'Input',
      fieldName: 'custId',
      componentProps: {
        type: 'hidden',
      },
    },
    {
      component: 'Input',
      fieldName: 'createId',
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
      fieldName: 'custName',
      label: '客户',
      componentProps: {
        clearable: true,
        placeholder: '请输入客户名称',
        readonly: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'custId',
      componentProps: {
        type: 'hidden',
      },
    },
    // {
    //   component: 'Input',
    //   fieldName: 'carNum',
    //   label: '业务员',
    //   componentProps: {
    //     clearable: true,
    //     placeholder: '请输入业务员名称',
    //   },
    // },
    // {
    //   component: 'Input',
    //   fieldName: 'carNum',
    //   label: '业务片区',
    //   componentProps: {
    //     clearable: true,
    //     placeholder: '请输入业务片区',
    //   },
    // },
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
      component: 'Select',
      fieldName: 'distribution',
      label: '配送类型',
      componentProps: {
        clearable: true,
        placeholder: '请选择配送类型',
        options: [
          {
            label: '自提',
            value: 125,
          },
          {
            label: '送货',
            value: 126,
          },
          {
            label: '物流发货',
            value: 127,
          },
          {
            label: '安装',
            value: 128,
          },
        ],
      },
    },
    {
      component: 'Select',
      fieldName: 'statusFlag',
      label: '销售状态',
      componentProps: {
        clearable: true,
        placeholder: '请选择销售状态',
        options: [
          {
            label: '草稿',
            value: 1,
          },
          {
            label: '待审批',
            value: 2,
          },
          {
            label: '待出库',
            value: 3,
          },
          {
            label: '出库完成',
            value: 4,
          },
          {
            label: '存档',
            value: 5,
          },
          {
            label: '退货',
            value: 6,
          },
          {
            label: '作废',
            value: 7,
          },
          {
            label: '驳回',
            value: 8,
          },
          {
            label: '已结算',
            value: 9,
          },
        ],
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'rangePicker',
      label: '开单日期',
      componentProps: {
        clearable: true,
        // placeholder: '请输入业务员名称',
        type: 'daterange',
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
      width: 160,
      sortable: true,
    },
    {
      field: 'custName',
      title: '客户',
      width: 100,
      sortable: true,
    },
    {
      field: 'statusFlag',
      title: '订单状态',
      width: 100,
      sortable: true,
      formatter: ({ cellValue }) => billStatusFlagMap[cellValue] || '',
    },
    {
      field: 'totalNum',
      title: '数量',
      width: 100,
      sortable: true,
    },
    {
      field: 'totalMoney',
      title: '金额(元)',
      width: 100,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '制单日期',
      width: 100,
      sortable: true,
      formatter: ({ cellValue }) =>
        cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : '',
    },
    {
      field: 'createName',
      title: '制单员工',
      width: 100,
      sortable: true,
    },
    {
      field: 'distribution',
      title: '配送类型',
      width: 200,
      sortable: true,
      formatter: ({ cellValue }) => billDistributionFlagMap[cellValue] || '',
    },

    // {
    //   field: 'totalMoney',
    //   title: '业务员',
    //   width: 200,
    // },
    // {
    //   field: 'totalMoney',
    //   title: '配送车牌',
    //   width: 200,
    // },
    {
      field: 'businessTypeZh',
      title: '业务类型',
      width: 100,
      sortable: true,
    },
    {
      field: 'approveName',
      title: '审批员工',
      width: 100,
      sortable: true,
    },
    {
      field: 'outboundName',
      title: '出库员工',
      width: 100,
      sortable: true,
    },
    {
      field: 'updateTime',
      title: '最后修改时间',
      width: 140,
      sortable: true,
      formatter: ({ cellValue }) =>
        cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : '',
    },
    // {
    //   field: 'outboundName',
    //   title: '物流单号',
    //   width: 100,
    //   sortable: true,
    // },
    {
      field: 'logisticsName',
      title: '物流名称',
      width: 100,
      sortable: true,
    },
    // {
    //   field: 'outboundName',
    //   title: '价格级别',
    //   width: 200,
    // },
    {
      field: 'totalPrice',
      title: '成本金额',
      width: 100,
      sortable: true,
    },
    {
      field: 'profit',
      title: '利润',
      width: 100,
      sortable: true,
    },
    {
      field: 'profitMargin',
      title: '利润率',
      width: 100,
      sortable: true,
    },
    {
      field: 'remark',
      title: '订单备注',
      width: 300,
      sortable: true,
    },
  ];
}
export function useSubColumns(): VxeTableGridOptions['columns'] {
  return [
    { align: 'center', title: '', type: 'radio', width: 40 },
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'productName',
      title: '产品名称',
      sortable: true,
      width: 200,
    },
    {
      field: 'productAttachmentNames',
      title: '附件',
      width: 300,
      sortable: true,
    },
    {
      field: 'productPlaceName',
      title: '产地',
      width: 100,
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
      title: '单价(元)',
      width: 100,
      sortable: true,
    },
    {
      field: 'totalPrice',
      title: '金额(元)',
      width: 100,
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
      sortable: true,
      formatter: ({ cellValue }) => (cellValue ? `#${cellValue}` : ''),
    },
    {
      field: 'remark',
      title: '备注',
      width: 300,
      sortable: true,
    },
  ];
}
