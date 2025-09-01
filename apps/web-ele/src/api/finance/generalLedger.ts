import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace GeneralLedgerApi {
  export interface GeneralLedger {
    id: number;
    accountId: number; // 资金账户ID ,
    accountMoney: number; // 资产 ,
    accountName: string; // 资金账户名 ,
    accountPrice: number; // 账户资金（计算毛利需要该字段） ,
    addMoney: number; // 应收款 ,
    appId: number; // 审核员ID ,
    appName: string; // 审核员名称 ,
    appTime: number; // 审核时间 ,
    code: string; // 单号 ,
    consumables: number; // 耗材 ,
    createTime: number; // 创建时间 ,
    custId: number; // 往来单位id ,
    custName: string; // 往来单位名称 ,
    fixedAsset: number; // 固定资产 ,
    minusMoney: number; // 应付款 ,
    moneyPer: number; // 毛利 ,
    outbound: number; // 销售待出库 ,
    remark: string; // 备注 ,
    title: string; // 标题 ,
    totalMoney: number; // 库存金额 ,
    totalNum: number; // 总数 ,
    typeName: string; // 类别 = ['Product_Loss_Review', 'Accounts_Payable_Manual', 'Free_Payment', 'Free_Billing', 'Warehouse_Receipt_Review', 'Inventory_Return_Review', 'Other_Income', 'Settlement_Of_Other_Payable_Bills', 'Other_Accounts_Receivable', 'Accounts_Receivable_Manual_Form', 'Accounts_Receivable_Settlement', 'Audit_Of_Inventory_Gains_And_Losses', 'Settlement_Of_Expense_Statement', 'Manual_Form_For_Fund_Account', 'Sales_Approve', 'Sales_Cancel', 'Sales_Order_Outbound', 'Sales_Return_Review', 'Consumable_Requisition', 'Consumable_Storage']stringEnum:"Product_Loss_Review", "Accounts_Payable_Manual", "Free_Payment", "Free_Billing", "Warehouse_Receipt_Review", "Inventory_Return_Review", "Other_Income", "Settlement_Of_Other_Payable_Bills", "Other_Accounts_Receivable", "Accounts_Receivable_Manual_Form", "Accounts_Receivable_Settlement", "Audit_Of_Inventory_Gains_And_Losses", "Settlement_Of_Expense_Statement", "Manual_Form_For_Fund_Account", "Sales_Approve", "Sales_Cancel", "Sales_Order_Outbound", "Sales_Return_Review", "Consumable_Requisition", "Consumable_Storage",
    typeNameZh: string; // 类别中文 ,
    updateTime: number; // 修改时间
  }

  export interface GeneralLedgerMonth {
    id: number;
    accountsPayableManual: number; // 付应付款单手工单 ,
    accountsReceivableManualForm: number; // 收应收款单手工单 ,
    accountsReceivableSettlement: number; // 收应收款单结算 ,
    auditOfInventoryGainsAndLosses: number; // 盘盈盘亏审核 ,
    companyId: number; // 公司id ,
    consumableRequisition: number; // 耗材领用 ,
    consumableStorage: number; // 耗材入库 ,
    createTime: number; // 创建时间 ,
    freeBilling: number; // 免收单结算 ,
    freePayment: number; // 免付单结算 ,
    inventoryReturnReview: number; // 入库退货审核 ,
    manualFormForFundAccount: number; // 资金账户手工单 ,
    moneyPer: number; // 毛利 ,
    monthField: string; // 年月:yyyyMM) ,
    otherAccountsReceivable: number; // 其它收应收款单结算 ,
    otherIncome: number; // 其他收入结算 ,
    productLossReview: number; // 产品报损审核 ,
    salesApprove: number; // 销售单审核 ,
    salesOrderOutbound: number; // 销售单出库 ,
    salesReturnReview: number; // 销售退货审核 ,
    settlementOfExpenseStatement: number; // 费用开支单结算 ,
    settlementOfOtherPayableBills: number; // 其它付应付款单结算 ,
    updateTime: number; // 修改时间 ,
    warehouseReceiptReview: number; // 入库单审核
  }

  export interface GeneralLedgerSta {
    id: number;
    accountMoney: number; // 资产 ,
    accountPrice: number; // 账户资金（计算毛利需要该字段） ,
    addMoney: number; // 应收款 ,
    companyId: number; // 公司id ,
    consumables: number; // 耗材 ,
    createTime: number; // 创建时间 ,
    fixedAsset: number; // 固定资产 ,
    minusMoney: number; // 应付款 ,
    moneyPer: number; // 毛利 ,
    outbound: number; // 销售待出库 ,
    totalMoney: number; // 库存金额 ,
    totalNum: number; // 总数 ,
    updateTime: number; // 修改时间
  }
  export interface GeneralLedgerTotal {
    id: number;
    accountsPayableManual: number; // 付应付款单手工单 ,
    accountsReceivableManualForm: number; // 收应收款单手工单 ,
    accountsReceivableSettlement: number; // 收应收款单结算 ,
    auditOfInventoryGainsAndLosses: number; // 盘盈盘亏审核 ,
    companyId: number; // 公司id ,
    consumableRequisition: number; // 耗材领用 ,
    consumableStorage: number; // 耗材入库 ,
    createTime: number; // 创建时间 ,
    freeBilling: number; // 免收单结算 ,
    freePayment: number; // 免付单结算 ,
    inventoryReturnReview: number; // 入库退货审核 ,
    manualFormForFundAccount: number; // 资金账户手工单 ,
    moneyPer: number; // 毛利 ,
    monthField: string; // 年月:yyyyMM) ,
    otherAccountsReceivable: number; // 其它收应收款单结算 ,
    otherIncome: number; // 其他收入结算 ,
    productLossReview: number; // 产品报损审核 ,
    salesApprove: number; // 销售单审核 ,
    salesOrderOutbound: number; // 销售单出库 ,
    salesReturnReview: number; // 销售退货审核 ,
    settlementOfExpenseStatement: number; // 费用开支单结算 ,
    settlementOfOtherPayableBills: number; // 其它付应付款单结算 ,
    updateTime: number; // 修改时间 ,
    warehouseReceiptReview: number; // 入库单审核
  }

  export interface GeneralLedgerQuery extends CommApi.PageParam {
    code: string; // 单号 ,
    endTime: number; // 结束时间 ,
    startTime: number; // 开始时间 ,
    title: string; // 标题 ,
    typeName: string; // 类别 = ['Product_Loss_Review', 'Accounts_Payable_Manual', 'Free_Payment', 'Free_Billing', 'Warehouse_Receipt_Review', 'Inventory_Return_Review', 'Other_Income', 'Settlement_Of_Other_Payable_Bills', 'Other_Accounts_Receivable', 'Accounts_Receivable_Manual_Form', 'Accounts_Receivable_Settlement', 'Audit_Of_Inventory_Gains_And_Losses', 'Settlement_Of_Expense_Statement', 'Manual_Form_For_Fund_Account', 'Sales_Approve', 'Sales_Cancel', 'Sales_Order_Outbound', 'Sales_Return_Review', 'Consumable_Requisition', 'Consumable_Storage']stringEnum:"Product_Loss_Review", "Accounts_Payable_Manual", "Free_Payment", "Free_Billing", "Warehouse_Receipt_Review", "Inventory_Return_Review", "Other_Income", "Settlement_Of_Other_Payable_Bills", "Other_Accounts_Receivable", "Accounts_Receivable_Manual_Form", "Accounts_Receivable_Settlement", "Audit_Of_Inventory_Gains_And_Losses", "Settlement_Of_Expense_Statement", "Manual_Form_For_Fund_Account", "Sales_Approve", "Sales_Cancel", "Sales_Order_Outbound", "Sales_Return_Review", "Consumable_Requisition", "Consumable_Storage"
    monthField: string; // 年月(YYYYMM) ,
  }
}

/**
 * 获取列表数据
 */
async function getGeneralLedgerList(data: GeneralLedgerApi.GeneralLedgerQuery) {
  return requestClient.post<CommApi.Response<GeneralLedgerApi.GeneralLedger[]>>(
    `/finance/findGeneralLedgeList`,
    data,
  );
}

/**
 * 总分类账月度列表
 */
async function getGeneralLedgerListByMonth(
  data: GeneralLedgerApi.GeneralLedgerQuery,
) {
  return requestClient.post<
    CommApi.Response<GeneralLedgerApi.GeneralLedgerMonth[]>
  >(`/finance/findGlmList`, data);
}

/**
 *  总分类账资产统计
 */
async function getGeneralLedgerStaList() {
  return requestClient.get<CommApi.Response<GeneralLedgerApi.GeneralLedgerSta>>(
    `/finance/findGlmStaList`,
  );
}

/**
 * 总分类账统计
 */
async function getGeneralLedgerTotal() {
  return requestClient.post<
    CommApi.Response<GeneralLedgerApi.GeneralLedgerTotal[]>
  >(`/finance/findAllGlmList`);
}

export {
  getGeneralLedgerList,
  getGeneralLedgerListByMonth,
  getGeneralLedgerStaList,
  getGeneralLedgerTotal,
};
