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
        placeholder: '请输入客户全称',
      },
    },
    {
      component: 'Input',
      fieldName: 'shortName',
      label: '简称',
      componentProps: {
        clearable: true,
        placeholder: '请输入简称',
      },
    },
    {
      component: 'RadioGroup',
      fieldName: 'isCompany',
      label: '是否企业',
      componentProps: {
        clearable: true,
        placeholder: '请输入是否企业',
        options: [
          {
            label: '个人',
            value: 0,
          },
          {
            label: '企业',
            value: 1,
          },
        ],
      },
    },
    // {
    //   component: 'Input',
    //   fieldName: '',
    //   label: '账号',
    // },
    // {
    //   component: 'VbenInputPassword',
    //   fieldName: '',
    //   label: '密码',
    // },
    // {
    //   component: 'VbenInputPassword',
    //   fieldName: '',
    //   label: '确认密码',
    // },
    // {
    //   component: 'Input',
    //   fieldName: '',
    //   label: '简拼码',
    // },
    {
      component: 'Input',
      fieldName: 'taxNumber',
      label: '税号',
      componentProps: {
        clearable: true,
        placeholder: '请输入税号',
      },
    },
    {
      component: 'Input',
      fieldName: 'address',
      label: '地址',
      componentProps: {
        clearable: true,
        placeholder: '请输入地址',
      },
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: '代码',
      componentProps: {
        clearable: true,
        placeholder: '请输入代码',
      },
    },
    {
      component: 'Input',
      fieldName: 'bank1',
      label: '开户行',
      componentProps: {
        clearable: true,
        placeholder: '请输入开户行',
      },
    },
    {
      component: 'Input',
      fieldName: 'bankAccount1',
      label: '账户',
      componentProps: {
        clearable: true,
        placeholder: '请输入账户',
      },
    },
    {
      component: 'Input',
      fieldName: 'bankAccountName1',
      label: '户名',
      componentProps: {
        clearable: true,
        placeholder: '请输入户名',
      },
    },
    {
      component: 'Input',
      fieldName: 'bank2',
      label: '开户行2',
      componentProps: {
        clearable: true,
        placeholder: '请输入开户行2',
      },
    },
    {
      component: 'Input',
      fieldName: 'bankAccount2',
      label: '账号2',
      componentProps: {
        clearable: true,
        placeholder: '请输入账号2',
      },
    },
    {
      component: 'Input',
      fieldName: 'bankAccountName2',
      label: '户名2',
      componentProps: {
        clearable: true,
        placeholder: '请输入户名2',
      },
    },
    {
      component: 'Input',
      fieldName: 'businessType',
      label: '业务类',
      componentProps: {
        clearable: true,
        placeholder: '请输入业务类',
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'creditLimit ',
      label: '挂账限额',
      componentProps: {
        clearable: true,
        min: 0,
        placeholder: '请输入挂账限额',
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'assets',
      label: '客户资产',
      componentProps: {
        clearable: true,
        min: 0,
        placeholder: '请输入客户资产',
      },
    },
    {
      component: 'Input',
      fieldName: 'carType',
      label: '客户车型',
      componentProps: {
        clearable: true,
        placeholder: '请输入客户车型',
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
      fieldName: 'customerType',
      label: '客户类型',
      componentProps: {
        clearable: true,
        placeholder: '请选择客户类型',
        options: [],
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'discountRate',
      label: '优惠率',
      componentProps: {
        clearable: true,
        min: 0,
        max: 100,
        placeholder: '请输入优惠率',
      },
    },
    {
      component: 'Input',
      fieldName: 'logistics',
      label: '常用物流',
      componentProps: {
        clearable: true,
        placeholder: '请输入常用物流',
      },
    },
    {
      component: 'Select',
      fieldName: 'payMethod',
      label: '支付方式',
      componentProps: {
        clearable: true,
        placeholder: '请选择支付方式',
        options: [],
      },
    },
    {
      component: 'Select',
      fieldName: 'transportType',
      label: '运输方式',
      componentProps: {
        clearable: true,
        placeholder: '请选择运输方式',
        options: [],
      },
    },
    {
      component: 'Input',
      fieldName: 'fax',
      label: '传真',
      componentProps: {
        clearable: true,
        placeholder: '请输入传真',
      },
    },
    {
      component: 'Input',
      fieldName: 'telephone',
      label: '电话',
      componentProps: {
        clearable: true,
        placeholder: '请输入电话',
      },
    },
    {
      component: 'Input',
      fieldName: 'region1',
      label: '区域一',
      componentProps: {
        clearable: true,
        placeholder: '请输入区域一',
      },
    },
    {
      component: 'Input',
      fieldName: 'region2',
      label: '区域二',
      componentProps: {
        clearable: true,
        placeholder: '请输入区域二',
      },
    },
    {
      component: 'Input',
      fieldName: 'region3',
      label: '区域三',
      componentProps: {
        clearable: true,
        placeholder: '请输入区域三',
      },
    },
    {
      component: 'Input',
      fieldName: 'remark',
      label: '备注',
      componentProps: {
        clearable: true,
        placeholder: '请输入备注',
      },
    },
  ];
}

export function useFormSchema1(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'contact',
      label: '联系人',
      componentProps: {
        clearable: true,
        placeholder: '请输入联系人',
      },
    },
    {
      component: 'Input',
      fieldName: 'idCard',
      label: '证件号',
      componentProps: {
        clearable: true,
        placeholder: '请输入证件号',
      },
    },
    {
      component: 'Input',
      fieldName: 'mobilePhone',
      label: '手机',
      componentProps: {
        clearable: true,
        placeholder: '请输入手机',
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
        placeholder: '请选择性别',
      },
    },
    {
      component: 'Input',
      fieldName: 'postCode',
      label: '邮编',
      componentProps: {
        clearable: true,
        placeholder: '请输入邮编',
      },
    },
    {
      component: 'Input',
      fieldName: 'salesmanId',
      label: '所属业务员',
      componentProps: {
        clearable: true,
        placeholder: '请输入所属业务员',
      },
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    // {
    //   component: 'Input',
    //   fieldName: 'name',
    //   label: '简拼码',
    // },
    {
      component: 'Input',
      fieldName: 'fullName',
      label: ' 客户名称',
      componentProps: {
        clearable: true,
        placeholder: '请输入客户名称',
      },
    },
    {
      component: 'Input',
      fieldName: 'bank',
      label: ' 开户行',
      componentProps: {
        clearable: true,
        placeholder: '请输入开户行',
      },
    },
    {
      component: 'Input',
      fieldName: 'bankAccount ',
      label: '开户行帐户',
      componentProps: {
        clearable: true,
        placeholder: '请输入开户行帐户',
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
      title: '客户全称',
      width: 100,
    },
    {
      field: '',
      title: '应收金额',
      width: 80,
    },
    {
      field: 'businessType',
      title: '业务类别',
      width: 80,
    },
    {
      field: 'address',
      title: '地址',
      width: 160,
    },
    {
      field: 'logistics',
      title: '常用物流',
      width: 100,
    },
    {
      field: 'region1',
      title: '区域一',
      width: 100,
    },
    {
      field: 'region2',
      title: '区域二',
      width: 100,
    },
    {
      field: 'region3',
      title: '区域三',
      width: 100,
    },
    {
      field: 'salesmanName',
      title: '所属业务员',
      width: 80,
    },
    {
      field: 'bank1',
      title: '开户行',
      width: 100,
    },
    {
      field: 'taxNumber',
      title: '税号',
      width: 100,
    },
    {
      field: 'bankAccount1',
      title: '帐户',
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
      width: 80,
    },
    {
      field: 'fax',
      title: '传真',
      width: 100,
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
  ];
}

export function useDetailSchema(): CommApi.ColumnType[] {
  const form = useFormSchema();
  const form1 = useFormSchema1();
  return [
    ...form.map(({ fieldName, label }) => ({
      fieldName,
      label: label ? (typeof label === 'string' ? label : '') : '',
      sign: 1,
    })),
    ...form1.map(({ fieldName, label }) => ({
      fieldName,
      label: label ? (typeof label === 'string' ? label : '') : '',
      sign: 2,
    })),
  ];
}
