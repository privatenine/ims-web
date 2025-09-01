import type { VxeTableGridOptions } from '#/adapter/vxe-table';

export function useDetailColumns(): VxeTableGridOptions['columns'] {
  return [
    { align: 'center', title: '', type: 'checkbox', width: 40 },
    { title: '排序', type: 'seq', width: 50 },
    {
      field: 'flowNo',
      title: '报损流水号',
      width: 120,
    },
    {
      field: 'productName',
      title: '产品',
      width: 150,
    },
    {
      field: 'damageProcess',
      title: '报损工序',
      width: 100,
    },
    {
      field: 'damageType',
      title: '报损类别',
      width: 100,
    },
    {
      field: 'manufacturerName',
      title: '厂家名称',
      width: 120,
    },
    {
      field: 'damageNum',
      title: '报损数量',
      width: 100,
      formatter: ({ cellValue }) => {
        return cellValue || 0;
      },
    },
    {
      field: 'factoryPrice',
      title: '出厂价',
      width: 100,
      formatter: ({ cellValue }) => {
        return cellValue ? `￥${Number(cellValue).toFixed(2)}` : '-';
      },
    },
    {
      field: 'amount',
      title: '金额',
      width: 100,
      formatter: ({ cellValue }) => {
        return cellValue ? `￥${Number(cellValue).toFixed(2)}` : '-';
      },
    },
    {
      field: 'originalQuality',
      title: '原合格',
      width: 80,
    },
    {
      field: 'bracket',
      title: '支架',
      width: 80,
    },
    {
      field: 'color',
      title: '颜色',
      width: 80,
    },
    {
      field: 'deformation',
      title: '形变',
      width: 80,
    },
    {
      field: 'printEdge',
      title: '印边',
      width: 80,
    },
    {
      field: 'nightVision',
      title: '夜视',
      width: 80,
    },
    {
      field: 'lens',
      title: '镜头',
      width: 80,
    },
    {
      field: 'rainSensor',
      title: '雨感',
      width: 80,
    },
    {
      field: 'originalCode',
      title: '原编码',
      width: 120,
    },
    {
      field: 'originalPrice',
      title: '原价位',
      width: 100,
    },
    {
      field: 'trademark',
      title: '商标',
      width: 80,
    },
    {
      field: 'remark',
      title: '备注',
      width: 150,
    },
  ];
}
