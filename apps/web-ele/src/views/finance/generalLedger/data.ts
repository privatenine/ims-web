import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

const userInfoStr = localStorage.getItem('userInfo');
const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'code',
      label: '标题',
      componentProps: {
        clearable: true,
        placeholder: '请输入标题',
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'bankId',
      label: '库存金额',
      componentProps: {
        clearable: true,
        placeholder: '请输入库存金额',
        min: 0,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'formCode',
      label: '库存数量',
      componentProps: {
        clearable: true,
        placeholder: '请输入库存数量',
        min: 0,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'typeName',
      label: '资金账户',
      componentProps: {
        clearable: true,
        placeholder: '请输入资金账户',
        min: 0,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'totalNum',
      label: '应收欠款',
      rules: 'required',
      componentProps: {
        clearable: true,
        placeholder: '请输入应收欠款',
        min: 0,
      },
    },
    {
      component: 'Input',
      fieldName: 'balanceMoney',
      label: '单号',
      componentProps: {
        clearable: true,
        placeholder: '请输入单号',
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'createName',
      label: '库存耗材',
      componentProps: {
        clearable: true,
        placeholder: '请输入库存耗材',
        min: 0,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'createTime',
      label: '固定资产',
      componentProps: {
        clearable: true,
        placeholder: '请输入固定资产',
        min: 0,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'remark',
      label: '资产',
      componentProps: {
        clearable: true,
        placeholder: '请输入资产',
        min: 0,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'remark',
      label: '应付欠款',
      componentProps: {
        clearable: true,
        placeholder: '请输入应付欠款',
        min: 0,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'remark',
      label: '毛利率',
      componentProps: {
        clearable: true,
        placeholder: '请输入毛利率',
        min: 0,
      },
    },
    {
      component: 'Input',
      fieldName: 'remark',
      label: '类别',
      componentProps: {
        clearable: true,
        placeholder: '请输入类别',
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'remark',
      label: '制单日期',
      defaultValue: new Date(),
      componentProps: {
        clearable: true,
        placeholder: '请输入制单日期',
      },
    },
    {
      component: 'Input',
      fieldName: 'remark',
      label: '备注',
      componentProps: {
        clearable: true,
        placeholder: '请输入备注',
        type: 'textarea',
      },
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'DatePicker',
      fieldName: 'rangePicker',
      label: '日期',
      componentProps: {
        placeholder: '请输入日期',
        clearable: true,
        type: 'daterange',
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
      fieldName: 'code',
      label: '单号',
      componentProps: {
        placeholder: '请输入单号',
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'typeName',
      label: '类别',
      componentProps: {
        placeholder: '请输入类别',
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
      field: 'title',
      title: '标题',
      width: 160,
    },
    {
      field: 'typeNameZh',
      title: '类别',
      width: 160,
    },
    {
      field: 'code',
      title: '单号',
      width: 160,
    },
    {
      field: 'custName',
      title: '往来单位',
      width: 80,
    },
    {
      field: 'addMoney',
      title: '应收款',
      width: 80,
    },
    {
      field: 'minusMoney',
      title: '应付款',
      width: 100,
    },
    {
      field: 'fixedAsset',
      title: '固定资产',
      width: 80,
    },
    {
      field: 'consumables',
      title: '库存耗材',
      width: 100,
    },
    {
      field: 'accountPrice',
      title: '账号资金',
      width: 100,
    },
    {
      field: 'totalMoney',
      title: '库存金额',
      width: 80,
    },
    {
      field: 'totalNum',
      title: '库存数量',
      width: 80,
    },
    // {
    //   field: 'monthField',
    //   title: '实际资产',
    //   width: 100,
    // },
    {
      field: 'createTime',
      title: '制单日期',
      slots: { default: 'createTime' },
    },
    {
      field: 'appTime',
      title: '审核日期',
      slots: { default: 'appTime' },
    },
    {
      field: 'appName',
      title: '审核人',
    },
    {
      field: 'remark',
      title: '备注',
    },
  ];
}
export function usePrintTotalColums(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'monthField',
      title: '标题',
      width: 160,
    },
    {
      field: 'typeNameZh',
      title: '资金余额',
      width: 160,
    },
    {
      field: 'typeNameZh',
      title: '应收余额',
      width: 160,
    },
    {
      field: 'typeNameZh',
      title: '应付余额',
      width: 160,
    },
    {
      field: 'typeNameZh',
      title: '耗材余额',
      width: 160,
    },
    {
      field: 'typeNameZh',
      title: '固定资产余额',
      width: 160,
    },
    {
      field: 'typeNameZh',
      title: '库存数量余额',
      width: 160,
    },
    {
      field: 'typeNameZh',
      title: '库存成本余额',
      width: 160,
    },
    {
      field: 'typeNameZh',
      title: '累计毛利润',
      width: 160,
    },
  ];
}
export function usePrintMonthColums(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'monthField',
      title: '时间',
      width: 80,
      fixed: 'left',
    },
    {
      field: 'accountsPayableManual',
      title: '付应付款单手工单',
      width: 80,
    },
    {
      field: 'accountsReceivableManualForm',
      title: '收应收款单手工单',
      width: 80,
    },
    {
      field: 'accountsReceivableSettlement',
      title: '收应收款单结算',
      width: 80,
    },
    {
      field: 'auditOfInventoryGainsAndLosses',
      title: '盘盈盘亏审核',
      width: 80,
    },
    {
      field: 'consumableRequisition',
      title: '耗材领用',
      width: 80,
    },
    {
      field: 'consumableStorage',
      title: '耗材入库',
      width: 80,
    },
    {
      field: 'freeBilling',
      title: '免收单结算',
      width: 80,
    },
    {
      field: 'freePayment',
      title: '免付单结算',
      width: 80,
    },
    {
      field: 'inventoryReturnReview',
      title: '入库退货审核',
      width: 80,
    },
    {
      field: 'manualFormForFundAccount',
      title: '资金账户手工单',
      width: 80,
    },
    {
      field: 'otherAccountsReceivable',
      title: '其它收应收款单结算',
      width: 80,
    },
    {
      field: 'otherIncome',
      title: '其他收入结算',
      width: 80,
    },
    {
      field: 'productLossReview',
      title: '产品报损审核',
      width: 80,
    },
    {
      field: 'salesApprove',
      title: '销售单审核',
      width: 80,
    },
    {
      field: 'salesOrderOutbound',
      title: '销售单出库',
      width: 80,
    },
    {
      field: 'salesReturnReview',
      title: '销售退货审核',
      width: 80,
    },
    {
      field: 'settlementOfExpenseStatement',
      title: '费用开支单结算',
      width: 80,
    },
    {
      field: 'settlementOfOtherPayableBills',
      title: '其它付应付款单结算',
      width: 80,
    },
    {
      field: 'warehouseReceiptReview',
      title: '入库单审核',
      width: 80,
    },
  ];
}
