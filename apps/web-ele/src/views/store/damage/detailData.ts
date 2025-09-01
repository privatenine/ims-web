import type { VxeTableGridOptions } from '#/adapter/vxe-table';

export function useDetailColumns(): VxeTableGridOptions['columns'] {
  return [
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'productName',
      title: '商品名称',
      width: 200,
      showOverflow: 'tooltip',
    },
    {
      field: 'attachment',
      title: '附件',
      width: 150,
      showOverflow: 'tooltip',
    },
    {
      field: 'origin',
      title: '产地',
      width: 120,
      showOverflow: 'tooltip',
    },
    {
      field: 'warehouseName',
      title: '仓库',
      width: 120,
      showOverflow: 'tooltip',
    },
    {
      field: 'binLocation',
      title: '库位',
      width: 120,
      showOverflow: 'tooltip',
    },
    {
      field: 'inventoryQuantity',
      title: '盘点数量',
      width: 120,
      align: 'right',
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '-';
      },
    },
    {
      field: 'actualQuantity',
      title: '实际数量',
      width: 120,
      align: 'right',
      formatter: ({ cellValue }) => {
        return cellValue ? Number(cellValue).toLocaleString() : '-';
      },
    },
    {
      field: 'unitPrice',
      title: '单价',
      width: 100,
      align: 'right',
      formatter: ({ cellValue }) => {
        return cellValue ? `￥${Number(cellValue).toFixed(2)}` : '-';
      },
    },
    {
      field: 'totalPrice',
      title: '总价',
      width: 120,
      align: 'right',
      formatter: ({ cellValue }) => {
        return cellValue ? `￥${Number(cellValue).toFixed(2)}` : '-';
      },
    },
    {
      field: 'supplierName',
      title: '供应商',
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

export const statusFlagMap = {
  1: { name: '草稿', color: 'info' },
  2: { name: '待审批', color: 'warning' },
  3: { name: '审核通过', color: 'success' },
  4: { name: '驳回', color: 'danger' },
};
