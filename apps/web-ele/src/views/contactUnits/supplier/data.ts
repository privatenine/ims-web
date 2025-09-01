import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { CommApi } from '#/api';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'fullName',
      label: '客户全称',
      rules: 'required',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'shortName',
      label: '简称',
      rules: 'required',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'taxNumber',
      label: '供应商税号',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'address',
      label: '供应商地址',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: '代码',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'bank1',
      label: '供应商开户行',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'bankAccount1',
      label: '供应商帐户',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'bank2',
      label: '供应商开户行2',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'bankAccount2',
      label: '供应商帐户2',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'businessType',
      label: '业务类',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'creditLimit',
      label: '挂帐限额',
      componentProps: {
        clearable: true,
        min: 0,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'assets',
      label: '供应商资产',
      componentProps: {
        clearable: true,
        min: 0,
      },
    },
    {
      component: 'Input',
      fieldName: 'carType',
      label: '供应商车型',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'priceLevel',
      label: '价格级别',
      componentProps: {
        clearable: true,
        placeholder: '请选择价格级别',
        options: [],
      },
    },
    {
      component: 'Select',
      fieldName: 'supplierType',
      label: '供应商类型',
      componentProps: {
        clearable: true,
        placeholder: '请选择供应商类型',
        options: [],
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'discountRate',
      label: '供应商优惠率',
      componentProps: {
        clearable: true,
        min: 0,
      },
    },
    {
      component: 'Input',
      fieldName: 'device',
      label: '拥有设备',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'payMethod',
      label: '供应商支付方式',
      componentProps: {
        clearable: true,
        placeholder: '请选择',
        options: [],
      },
    },
    {
      component: 'Select',
      fieldName: 'transportType',
      label: '运输方式',
      componentProps: {
        clearable: true,
        placeholder: '请选择',
        options: [],
      },
    },
    {
      component: 'Input',
      fieldName: 'fax',
      label: '传真',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'telephone',
      label: '电话',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'region1',
      label: '区域一',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'region2',
      label: '区域二',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'region3',
      label: '区域三',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'remark',
      label: '备注',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'contact ',
      label: '联系人',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'idCard',
      label: '证件号',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'mobilePhone',
      label: '手机',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'gender',
      label: '性别',
      componentProps: {
        clearable: true,
        allowClear: true,
        options: [
          {
            label: '未知',
            value: '0',
          },
          {
            label: '男',
            value: 1,
          },
          {
            label: '女',
            value: 2,
          },
        ],
        placeholder: '请选择',
      },
    },
    {
      component: 'Input',
      fieldName: 'postCode',
      label: '邮编',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'salesmanId',
      label: '所属业务员',
      componentProps: {
        clearable: true,
      },
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'shortName',
      label: '简称',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'fullName',
      label: '供应商',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'taxNumber',
      label: '税号',
      componentProps: {
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
      field: 'fullName',
      title: '供应商',
      width: 100,
    },
    {
      field: 'shortName',
      title: '简称',
      width: 100,
    },
    {
      field: 'transportType',
      title: '运输方式',
      width: 100,
    },
    {
      field: 'address',
      title: '通信地址',
      width: 200,
    },
    {
      field: '',
      title: '欠款余额',
      width: 100,
    },
    {
      field: 'bank1',
      title: '开户行',
      width: 100,
    },
    {
      field: 'bankAccount1',
      title: '账户',
      width: 100,
    },
    {
      field: 'taxNumber',
      title: '税号',
      width: 100,
    },
    {
      field: 'contact',
      title: '联系人',
      width: 80,
    },
    {
      field: 'gender',
      title: '性别',
      width: 60,
      slots: { default: 'gender' },
    },
    {
      field: 'idCard',
      title: '证件号',
      width: 100,
    },
    {
      field: 'carNum',
      title: 'fax',
      width: 80,
    },
    {
      field: 'telephone',
      title: '电话',
      width: 100,
    },
    {
      field: 'mobilePhone',
      title: '手机',
      width: 100,
    },
    {
      field: 'remark',
      title: '备注',
      width: 200,
    },
    {
      field: 'creditLimit',
      title: '挂账限额',
      width: 100,
    },
    // {
    //   field: 'carNum',
    //   title: '简拼码',
    //   width: 100
    // },
  ];
}

export function useDetailSchema(): CommApi.ColumnType[] {
  const form1 = useFormSchema();
  return form1.map(({ fieldName, label }, index) => ({
    fieldName,
    label: label ? (typeof label === 'string' ? label : '') : '',
    sign: index > 24 ? 2 : 1,
  }));
}
