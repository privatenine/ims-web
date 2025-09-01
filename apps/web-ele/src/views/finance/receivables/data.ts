import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { CommApi } from '#/api';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '客户全称',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'carNum',
      label: '简拼码',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'carNum',
      label: '库位',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'carNum',
      label: '仓管电话',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'carNum',
      label: '仓库状态',
      rules: 'required',
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    // {
    //   component: 'Input',
    //   fieldName: 'name',
    //   label: '简拼码',
    //   componentProps: {
    //     // placeholder: '请输入简拼码',
    //     clearable: true,
    //   },
    // },
    {
      component: 'Input',
      fieldName: 'name',
      label: '单位名称',
      componentProps: {
        // placeholder: '请输入简拼码',
        clearable: true,
      },
    },
    // {
    // component: 'Input',
    // fieldName: 'carNum',
    // label: '业务片区',
    // componentProps: {
    //   // placeholder: '请输入简拼码',
    //   clearable: true,
    // },
    // },
    // {
    //   component: 'DatePicker',
    //   fieldName: 'carNum',
    //   label: '所属业务员',
    //   componentProps: {
    //     // placeholder: '请输入简拼码',
    //     clearable: true,
    //   },
    // },
    {
      component: 'Checkbox',
      fieldName: 'isExcludeZero',
      label: '排除余零',
      componentProps: {
        // placeholder: '请输入简拼码',
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
      field: 'customerName',
      title: '来往单位',
    },
    {
      field: 'shortName',
      title: '单位简称',
      width: 100,
    },
    {
      field: 'totalMoney',
      title: '合计金额',
      width: 100,
    },
    {
      field: 'creditLimit',
      title: '挂帐限额',
      width: 100,
    },
    {
      field: 'carNum',
      title: '所属业务员',
      width: 80,
    },
    {
      field: 'region1',
      title: '业务区域一',
      width: 200,
    },
    {
      field: 'region2',
      title: '业务区域二',
      width: 200,
    },
    {
      field: 'region3',
      title: '业务区域三',
      width: 200,
    },
    {
      field: 'contact',
      title: '联系人',
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
    // {
    //   field: 'carNum',
    //   title: '简拼码',
    //   width: 200,
    // },
  ];
}
export function useDetailSchema(): CommApi.ColumnType[] {
  // const form1 = useFormSchema();
  // return form1.map(({ fieldName, label }, index) => ({
  //   fieldName,
  //   label: label ? (typeof label === 'string' ? label : '') : '',
  //   sign: index > 24 ? 2 : 1,
  // }));
  return [];
}
