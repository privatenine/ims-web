import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  CommApi,
  VehicleModelApi,
  VehiclePositionApi,
  VehicleSeriesApi,
  VehicleTypeApi,
} from '#/api';

import {
  getVehicleModelList,
  getVehiclePositionList,
  getVehicleSeriesList,
  getVehicleTypeList,
} from '#/api';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '产品名称',
      rules: 'required',
      formItemClass: 'col-span-2 col-start-1',
      componentProps: {
        clearable: true,
      },
    },

    {
      component: 'RadioGroup',
      fieldName: 'enable',
      label: '启用/停用',
      componentProps: {
        options: [
          { value: 0, label: '停用' },
          { value: 1, label: '启用' },
        ],
      },
    },
    {
      component: 'Select',
      fieldName: 'carModelId',
      label: '车型',
      componentProps: {
        clearable: true,
        readonly: true,
        options: [],
      },
    },
    {
      component: 'Select',
      fieldName: 'carSeriesId',
      label: '车系',
      componentProps: {
        clearable: true,
        readonly: true,
        options: [],
      },
    },
    {
      component: 'Select',
      fieldName: 'positionId',
      label: '安装位置',
      componentProps: {
        clearable: true,
        readonly: true,
        options: [],
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'middleLength',
      label: '中高',
      defaultValue: 0,
      componentProps: {
        clearable: true,
        min: 0,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'downLength',
      label: '下长',
      defaultValue: 0,
      componentProps: {
        clearable: true,
        min: 0,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'diagonal',
      label: '对角',
      defaultValue: 0,
      componentProps: {
        clearable: true,
        min: 0,
      },
    },

    {
      component: 'Select',
      fieldName: 'carTypeId',
      label: '类型',
      componentProps: {
        clearable: true,
        readonly: true,
        options: [],
      },
    },

    {
      component: 'InputNumber',
      fieldName: 'listYear',
      label: '上市年份',
      defaultValue: 2010,
      componentProps: {
        clearable: true,
        min: 0,
      },
    },

    {
      component: 'InputNumber',
      fieldName: 'stopYear',
      label: '停产年份',
      defaultValue: 2010,
      componentProps: {
        clearable: true,
        min: 0,
      },
    },

    {
      component: 'Input',
      fieldName: 'norms',
      label: '规格',
      componentProps: {
        clearable: true,
        placeholder: '请输入',
        disabled: true,
      },
    },

    {
      component: 'Input',
      fieldName: 'remark',
      label: '产品资料备注',
      formItemClass: 'col-span-2  ',
      componentProps: {
        placeholder: '请输入',
        clearable: true,
        // type: 'textarea',
      },
    },

    {
      component: 'InputNumber',
      fieldName: 'upperLimit',
      label: '上限',
      defaultValue: 0,
      componentProps: {
        clearable: true,
        min: 0,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'lowerLimit',
      label: '下限',
      defaultValue: 0,
      componentProps: {
        clearable: true,
        min: 0,
      },
    },

    {
      component: 'Input',
      fieldName: 'settingRemark',
      label: '辅助资料备注',
      componentProps: {
        placeholder: '请输入',
        clearable: true,
        // type: 'textarea',
      },
    },
    {
      component: 'Select',
      fieldName: 'baseId',
      label: '通用车型',
      rules: 'required',
      formItemClass: 'col-span-3  ',
      componentProps: {
        clearable: true,
        readonly: true,
        options: [],
      },
    },

    {
      fieldName: 'img_path_45_h',
      label: '后45度照片',
      component: 'Upload',
      componentProps: {
        // 更多属性见：https://ant.design/components/upload-cn
        accept: '.png,.jpg,.jpeg',
        // 自动携带认证信息
        // customRequest: upload_file,
        disabled: false,
        maxCount: 1,
        multiple: false,
        showUploadList: true,
        // 上传列表的内建样式，支持四种基本样式 text, picture, picture-card 和 picture-circle
        listType: 'picture-card',
      },
      renderComponentContent: () => {
        return {
          default: () => '后45度照片',
        };
      },
    },
    {
      fieldName: 'img_path_45_q',
      label: '前45度照片',
      component: 'Upload',
      componentProps: {
        // 更多属性见：https://ant.design/components/upload-cn
        accept: '.png,.jpg,.jpeg',
        // 自动携带认证信息
        // customRequest: upload_file,
        disabled: false,
        maxCount: 1,
        multiple: false,
        showUploadList: true,
        // 上传列表的内建样式，支持四种基本样式 text, picture, picture-card 和 picture-circle
        listType: 'picture-card',
      },
      renderComponentContent: () => {
        return {
          default: () => '前45度照片',
        };
      },
    },
    {
      fieldName: 'img_path_location',
      label: '安装位置照片',
      component: 'Upload',
      componentProps: {
        // 更多属性见：https://ant.design/components/upload-cn
        accept: '.png,.jpg,.jpeg',
        // 自动携带认证信息
        // customRequest: upload_file,
        disabled: false,
        maxCount: 1,
        multiple: false,
        showUploadList: true,
        // 上传列表的内建样式，支持四种基本样式 text, picture, picture-card 和 picture-circle
        listType: 'picture-card',
      },
      renderComponentContent: () => {
        return {
          default: () => '安装位置照片',
        };
      },
    },
    {
      fieldName: 'img_path_other',
      label: '前挡后视镜区域特写',
      component: 'Upload',
      componentProps: {
        // 更多属性见：https://ant.design/components/upload-cn
        accept: '.png,.jpg,.jpeg',
        // 自动携带认证信息
        // customRequest: upload_file,
        disabled: false,
        maxCount: 1,
        multiple: false,
        showUploadList: true,
        // 上传列表的内建样式，支持四种基本样式 text, picture, picture-card 和 picture-circle
        listType: 'picture-card',
      },
      renderComponentContent: () => {
        return {
          default: () => '前挡后视镜区域特写',
        };
      },
    },
    {
      fieldName: 'img_path_product',
      label: '产品照片',
      component: 'Upload',
      componentProps: {
        // 更多属性见：https://ant.design/components/upload-cn
        accept: '.png,.jpg,.jpeg',
        // 自动携带认证信息
        // customRequest: upload_file,
        disabled: false,
        maxCount: 1,
        multiple: false,
        showUploadList: true,
        // 上传列表的内建样式，支持四种基本样式 text, picture, picture-card 和 picture-circle
        listType: 'picture-card',
      },
      renderComponentContent: () => {
        return {
          default: () => '产品照片',
        };
      },
    },

    // {
    //   component: 'Input',
    //   fieldName: 'baseName',
    //   componentProps: {
    //     type: 'hidden',
    //   },
    // },

    // {
    //   component: 'Input',
    //   fieldName: 'carSeriesName',
    //   componentProps: {
    //     type: 'hidden',
    //   },
    // },

    // {
    //   component: 'Input',
    //   fieldName: 'carModelName',
    //   componentProps: {
    //     type: 'hidden',
    //   },
    // },

    // {
    //   component: 'Input',
    //   fieldName: 'carTypeName',
    //   componentProps: {
    //     type: 'hidden',
    //   },
    // },
    // {
    //   component: 'Input',
    //   fieldName: 'positionName',
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
      fieldName: 'jianPinCode',
      label: '简拼码',
      componentProps: {
        placeholder: '请输入简拼码',
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '产品名称',
      componentProps: {
        placeholder: '请输入产品名称',
        clearable: true,
      },
    },
    // {
    //   component: 'Input',
    //   fieldName: 'jianPinCode',
    //   label: '名称中包含',
    //   componentProps: {
    //     placeholder: '请输入简拼码',
    //     clearable: true,
    //   },
    // },
    {
      component: 'Input',
      fieldName: 'exclude',
      label: '排除名称中包含',
      componentProps: {
        placeholder: '请输入',
        clearable: true,
      },
    },
    // {
    //   component: 'Input',
    //   fieldName: 'baseName',
    //   label: '通用车型',
    //   componentProps: {
    //     placeholder: '请选择',
    //     clearable: true,
    //   },
    // },
    {
      component: 'ApiSelect',
      fieldName: 'carSeriesId',
      label: '车系',
      componentProps: {
        clearable: true,
        placeholder: '请选择车系',
        api: getVehicleSeriesList,
        afterFetch: ({
          data,
        }: {
          data: Array<VehicleSeriesApi.VehicleSeries>;
        }) => {
          return data.map((item: VehicleSeriesApi.VehicleSeries) => ({
            label: item.name,
            value: item.id,
          }));
        },
      },
    },
    {
      component: 'ApiSelect',
      fieldName: 'carModelId',
      label: '车型',
      componentProps: {
        clearable: true,
        placeholder: '请选择车型',
        api: getVehicleModelList,
        afterFetch: ({
          data,
        }: {
          data: Array<VehicleModelApi.VehicleModel>;
        }) => {
          return data.map((item: VehicleModelApi.VehicleModel) => ({
            label: item.name,
            value: item.id,
          }));
        },
      },
    },
    {
      component: 'ApiSelect',
      fieldName: 'positionId',
      label: '安装位置',
      componentProps: {
        clearable: true,
        placeholder: '请选择安装位置',
        api: getVehiclePositionList,
        afterFetch: ({
          data,
        }: {
          data: Array<VehiclePositionApi.VehiclePosition>;
        }) => {
          return data.map((item: VehiclePositionApi.VehiclePosition) => ({
            label: item.name,
            value: item.id,
          }));
        },
      },
    },
    {
      component: 'ApiSelect',
      fieldName: 'carTypeId',
      label: '类别1',
      componentProps: {
        clearable: true,
        placeholder: '请选择类别',
        api: getVehicleTypeList,
        afterFetch: ({ data }: { data: Array<VehicleTypeApi.VehicleType> }) => {
          return data.map((item: VehicleTypeApi.VehicleType) => ({
            label: item.name,
            value: item.id,
          }));
        },
      },
    },
    {
      component: 'Select',
      fieldName: 'enable',
      label: '是否在用',
      componentProps: {
        placeholder: '请选择',
        clearable: true,
        options: [
          { label: '启用', value: 1 },
          { label: '停用', value: 0 },
        ],
      },
    },
    {
      component: 'Select',
      fieldName: 'isPublic',
      label: '只显示公用',
      componentProps: {
        placeholder: '请选择',
        clearable: true,
        options: [
          { label: '公有', value: 1 },
          { label: '私有', value: 0 },
        ],
      },
    },
    {
      component: 'Select',
      fieldName: 'isFuzzy',
      label: '是否是模糊查询',
      componentProps: {
        placeholder: '请选择',
        clearable: true,
        options: [
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ],
      },
    },
  ];
}

export function useColumns(): VxeTableGridOptions['columns'] {
  return [
    { align: 'left', title: '', type: 'radio', width: 40 },
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'name',
      title: '产品名称',
      width: 200,
    },
    {
      field: 'baseName',
      title: '通用车型',
      width: 100,
    },
    {
      field: 'carModelName',
      title: '车型名称',
      width: 100,
    },
    {
      field: 'carSeriesName',
      title: '车系名称',
      width: 100,
    },
    {
      field: 'carTypeName',
      title: '类型名称',
      width: 100,
    },
    {
      field: 'dataEnable',
      title: '状态',
      width: 80,
      slots: { default: 'dataEnable' },
    },
    {
      field: 'dataRemark',
      title: '备注',
      width: 200,
    },
    {
      field: 'dataUpdateTime',
      title: '修改时间',
      width: 100,
      slots: { default: 'dataUpdateTime' },
    },
    {
      field: 'diagonal',
      title: '对角',
      width: 80,
    },
    {
      field: 'downLength',
      title: '下长',
      width: 80,
    },
    {
      field: 'jianPinCode',
      title: '简拼码',
      width: 200,
    },
    {
      field: 'listYear',
      title: '上市年份',
      width: 80,
    },
    {
      field: 'lowerLimit',
      title: '下限',
      width: 80,
    },
    {
      field: 'middleLength',
      title: '中高',
      width: 80,
    },
    {
      field: 'norms',
      title: '规格',
      width: 80,
    },
    {
      field: 'positionName',
      title: '安装位置名称',
      width: 100,
    },
    {
      field: 'settingsCreateTime',
      title: '辅助表创建时间',
      width: 110,
      slots: { default: 'settingsCreateTime' },
    },
    {
      field: 'settingsEnable',
      title: '是否再用',
      width: 80,
      slots: { default: 'settingsEnable' },
    },
    {
      field: 'settingsRemark',
      title: '辅助表备注',
      width: 200,
    },
    {
      field: 'settingsUpdateTime',
      title: '辅助表修改时间',
      width: 110,
      slots: { default: 'settingsUpdateTime' },
    },
    {
      field: 'stopYear',
      title: '停产年份',
      width: 80,
    },
    {
      field: 'upperLimit',
      title: '上限',
      width: 80,
    },
  ];
}
export function useDetailSchema(): CommApi.ColumnType[] {
  return [
    {
      fieldName: 'name',
      label: '产品名称',
    },
    {
      fieldName: 'baseName',
      label: '通用车型',
    },

    {
      fieldName: 'carModelName',
      label: '车型',
    },
    {
      fieldName: 'carSeriesName',
      label: '车系',
    },

    {
      fieldName: 'carTypeName',
      label: '类型',
    },
    {
      fieldName: 'positionName',
      label: '安装位置',
    },
    {
      fieldName: 'enable',
      label: '启用/停用',
    },
    {
      fieldName: 'diagonal',
      label: '对角',
    },
    {
      fieldName: 'downLength',
      label: '下长',
    },

    {
      fieldName: 'middleLength',
      label: '中高',
    },
    {
      fieldName: 'norms',
      label: '规格',
    },
    {
      fieldName: 'listYear',
      label: '上市年份',
    },
    {
      fieldName: 'lowerLimit',
      label: '下限',
    },
    {
      fieldName: 'stopYear',
      label: '停产年份',
    },

    {
      fieldName: 'upperLimit',
      label: '上限',
    },
    {
      fieldName: 'remark',
      label: '产品资料备注',
    },
    {
      fieldName: 'settingRemark',
      label: '辅助资料备注',
    },

    {
      fieldName: 'img_path_45_h',
      label: '后45度照片',
    },
    {
      fieldName: 'img_path_45_q',
      label: '前45度照片',
    },
    {
      fieldName: 'img_path_location',
      label: '安装位置照片',
    },
    {
      fieldName: 'img_path_other',
      label: '前挡后视镜区域特写',
    },
    {
      fieldName: 'img_path_product',
      label: '产品照片',
    },
  ];
}
