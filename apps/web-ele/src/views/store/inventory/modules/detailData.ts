import type { VxeTableGridOptions } from '#/adapter/vxe-table';

export function useDetailColumns(): VxeTableGridOptions['columns'] {
  return [
    { align: 'center', title: '', type: 'checkbox', width: 40 },
    { title: '排序', type: 'seq', width: 50 },
    {
      field: 'productName',
      title: '产品',
      width: 200,
    },
    {
      field: 'productAttachmentNames',
      title: '附件',
      width: 100,
    },
    {
      field: 'productPlaceName',
      title: '产地',
      width: 100,
    },
    {
      field: 'num',
      title: '数量',
      width: 100,
      formatter: ({ cellValue }) => cellValue || 0,
    },
    {
      field: 'buyPrice',
      title: '成本单价',
      width: 120,
      formatter: ({ cellValue }) => {
        return cellValue ? `￥${Number(cellValue).toFixed(2)}` : '-';
      },
    },
    {
      field: 'totalBuyPrice',
      title: '总成本',
      width: 120,
      formatter: ({ cellValue }) => {
        return cellValue ? `￥${Number(cellValue).toFixed(2)}` : '-';
      },
    },
    {
      field: 'storeName',
      title: '仓库',
      width: 100,
    },
    {
      field: 'storeSiteName',
      title: '库位',
      width: 100,
    },
    {
      field: 'supplierName',
      title: '供应商',
      width: 120,
    },
    {
      field: 'remark',
      title: '备注',
      width: 200,
    },
  ];
}
