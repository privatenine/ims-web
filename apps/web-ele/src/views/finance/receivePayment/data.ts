import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

const userInfoStr = localStorage.getItem('userInfo');
const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'code',
      label: '单号',
      // rules: 'required',
      componentProps: {
        placeholder: '请输入单号',
        clearable: true,
        disabled: true,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'userMoney',
      label: '金额',
      rules: 'required',
      componentProps: {
        placeholder: '请输入金额',
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'formCode',
      label: '免单单号',
      componentProps: {
        // placeholder: '请输入金额',
        clearable: true,
        readonly: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'custName',
      label: '来往单位',
      rules: 'required',
      componentProps: {
        // placeholder: '请输入金额',
        clearable: true,
        readonly: true,
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'createTime',
      label: '制单日期',
      defaultValue: new Date(),
      componentProps: {
        clearable: true,
        placeholder: '请输入制单日期',
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'createName',
      label: '制单人',
      defaultValue: userInfo.username,
      componentProps: {
        clearable: true,
        // placeholder: '请输入制单日期',
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'remark',
      label: '备注',
      formItemClass: 'col-span-2',
      componentProps: {
        placeholder: '请输入备注',
        clearable: true,
        type: 'textarea',
      },
    },
    // {
    //   component: 'Input',
    //   fieldName: 'typeName',
    //   defaultValue: 1,
    //   componentProps: {
    //     type: 'hidden',
    //   },
    // },
    // {
    //   component: 'Input',
    //   fieldName: 'custId',
    //   componentProps: {
    //     type: 'hidden',
    //   },
    // },
    // {
    //   component: 'Input',
    //   fieldName: 'formId',
    //   componentProps: {
    //     type: 'hidden',
    //   },
    // },
    // {
    //   component: 'Input',
    //   fieldName: 'bankId',
    //   componentProps: {
    //     type: 'hidden',
    //   },
    // },
    // {
    //   component: 'Input',
    //   fieldName: 'bankAccount',
    //   componentProps: {
    //     type: 'hidden',
    //   },
    // },
  ];
}

export function useAuditSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '单号',
      // rules: 'required',
      componentProps: {
        placeholder: '请输入单号',
        clearable: true,
        disabled: true,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'userMoney',
      label: '金额',
      rules: 'required',
      componentProps: {
        placeholder: '请输入金额',
        clearable: true,
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'formCode',
      label: '免单单号',
      componentProps: {
        // placeholder: '请输入金额',
        clearable: true,
        readonly: true,
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'custName',
      label: '来往单位',
      rules: 'required',
      componentProps: {
        // placeholder: '请输入金额',
        clearable: true,
        readonly: true,
        disabled: true,
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'createTime',
      label: '制单日期',
      defaultValue: new Date(),
      componentProps: {
        clearable: true,
        placeholder: '请输入制单日期',
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'createName',
      label: '制单人',
      defaultValue: userInfo.username,
      componentProps: {
        clearable: true,
        // placeholder: '请输入制单日期',
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'remark',
      label: '备注',
      formItemClass: 'col-span-2',
      componentProps: {
        placeholder: '请输入备注',
        clearable: true,
        type: 'textarea',
      },
    },
    // {
    //   component: 'Input',
    //   fieldName: 'typeName',
    //   defaultValue: 1,
    //   componentProps: {
    //     type: 'hidden',
    //   },
    // },
    // {
    //   component: 'Input',
    //   fieldName: 'custId',
    //   componentProps: {
    //     type: 'hidden',
    //   },
    // },
    // {
    //   component: 'Input',
    //   fieldName: 'formId',
    //   componentProps: {
    //     type: 'hidden',
    //   },
    // },
    // {
    //   component: 'Input',
    //   fieldName: 'bankId',
    //   componentProps: {
    //     type: 'hidden',
    //   },
    // },
    // {
    //   component: 'Input',
    //   fieldName: 'bankAccount',
    //   componentProps: {
    //     type: 'hidden',
    //   },
    // },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'custName',
      label: '客户名称',
      componentProps: {
        placeholder: '请输入客户名称',
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'formCode',
      label: '免单单号',
      componentProps: {
        placeholder: '请输入免单单号',
        clearable: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'statusFlag',
      label: '状态',
      componentProps: {
        placeholder: '请选择状态',
        clearable: true,
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
            label: '已完成',
            value: 3,
          },
          {
            label: '存档',
            value: 4,
          },
          {
            label: '驳回',
            value: 5,
          },
        ],
      },
    },
    // {
    //   component: 'Select',
    //   fieldName: 'typeName',
    //   label: '类别',
    //   componentProps: {
    //     placeholder: '请选择类别',
    //     clearable: true,
    //     options: [
    //       {
    //         label: '免收单',
    //         value: 1,
    //       },
    //       {
    //         label: '免付单',
    //         value: 2,
    //       },
    //     ],
    //   },
    // },
    {
      component: 'Input',
      fieldName: 'code',
      label: '单号',
      componentProps: {
        placeholder: '请输入单号',
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
      field: 'code',
      title: '单号',
      width: 160,
    },
    {
      field: 'custName',
      title: '来往单位',
      width: 100,
    },
    {
      field: 'statusFlag',
      title: '状态',
      width: 80,
      slots: { default: 'statusFlag' },
    },
    {
      field: 'formCode',
      title: '免单单号',
      width: 160,
    },
    // {
    //   field: 'typeName',
    //   title: '类别',
    //   width: 80,
    // },
    {
      field: 'userMoney',
      title: '金额(元)',
      width: 80,
    },
    {
      field: 'createName',
      title: '制单人',
      width: 80,
    },
    // {
    //   field: 'bankAccount',
    //   title: '银行类别',
    //   width: 100,
    // },
    {
      field: 'createTime',
      title: '制单日期',
      width: 100,
      slots: { default: 'createTime' },
    },
    {
      field: 'managerTime',
      title: '审批日期',
      width: 100,
      slots: { default: 'managerTime' },
    },
    {
      field: 'managerName',
      title: '审批主管',
      width: 80,
    },
    {
      field: 'remark',
      title: '备注',
    },
  ];
}
