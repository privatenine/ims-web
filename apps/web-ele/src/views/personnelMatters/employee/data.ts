import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'jobNum',
      label: '工号',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'realName',
      label: '姓名',
      rules: 'required',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'username',
      label: '登录名',
      rules: 'required',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'VbenInputPassword',
      fieldName: 'password',
      label: '密码',
      rules: 'required',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'VbenInputPassword',
      fieldName: 'confirmPwd',
      label: '确认密码',
      rules: 'required',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'gender',
      label: '性别',
      componentProps: {
        allowClear: true,
        clearable: true,
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
      component: 'Select',
      fieldName: 'bloodType',
      label: '血型',
      componentProps: {
        allowClear: true,
        clearable: true,
        options: [
          {
            label: '不详',
            value: '不详',
          },
          {
            label: 'A',
            value: 'A',
          },
          {
            label: 'B',
            value: 'B',
          },
          {
            label: 'O',
            value: 'O',
          },
          {
            label: 'AB',
            value: 'AB',
          },
        ],
        placeholder: '请选择',
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'birthday',
      label: '生日',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'gender',
      label: '婚姻状况',
      componentProps: {
        allowClear: true,
        clearable: true,
        options: [
          {
            label: '不详',
            value: 0,
          },
          {
            label: '未婚',
            value: 1,
          },
          {
            label: '已婚',
            value: 2,
          },
          {
            label: '离异',
            value: 3,
          },
        ],
        placeholder: '请选择',
      },
    },
    {
      component: 'Input',
      fieldName: 'height',
      label: '身高',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'weight',
      label: '体重',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'workingYear',
      label: '工作年限',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'positionCategory',
      label: '职位类别',
      componentProps: {
        allowClear: true,
        clearable: true,
        options: [
          {
            label: '考勤岗位',
            value: '考勤岗位',
          },
          {
            label: '兼职岗位',
            value: '兼职岗位',
          },
        ],
        placeholder: '请选择',
      },
    },
    {
      component: 'Input',
      fieldName: 'phoneNum',
      label: '移动电话',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'officePhone',
      label: '办公电话',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'wechat',
      label: '微信',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: '邮箱',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'qq',
      label: 'QQ',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'educational',
      label: '学历',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'departmentName',
      label: '部门',
      componentProps: {
        allowClear: true,
        clearable: true,
        options: [],
        placeholder: '请选择',
      },
    },
    {
      component: 'Select',
      fieldName: 'positionName',
      label: '职位',
      componentProps: {
        clearable: true,
        allowClear: true,
        options: [
          {
            label: '不详',
            value: 0,
          },
          {
            label: '安装工',
            value: 1,
          },
        ],
        placeholder: '请选择',
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'entryTime',
      label: '入职日期',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'isSignedContract ',
      label: '是否签订合同',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'contractExpirationTime',
      label: '合同到期日',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'group',
      label: '班组',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'confirmationTime',
      label: '转正日期',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'departTime',
      label: '离职日期',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'school',
      label: '毕业学校',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'nativePlace ',
      label: '籍贯',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'RadioGroup',
      fieldName: 'isLocked',
      label: '登录权限',
      componentProps: {
        clearable: true,
        options: [
          {
            label: '无',
            value: 0,
          },
          {
            label: '有',
            value: 1,
          },
        ],
      },
    },
    {
      component: 'Input',
      fieldName: 'userIdCard',
      label: '身份证号',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'departTime',
      label: '身份证地址',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'currentAddress',
      label: '现住址',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'major',
      label: '专业',
      componentProps: {
        clearable: true,
      },
    },
  ];
}

export function useForm1Schema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'emergencyContact',
      label: '紧急联系人',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'emergencyPhone',
      label: '紧急联系电话',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'familyIntroduction',
      label: '家庭描述',
      formItemClass: 'col-span-2',
      componentProps: {
        clearable: true,
        maxLength: 50,
        rows: 3,
        showCount: true,
        type: 'textarea',
      },
    },
    {
      component: 'Input',
      fieldName: 'hobby',
      label: '爱好',
      formItemClass: 'col-span-2 items-baseline',
      componentProps: {
        clearable: true,
        maxLength: 50,
        rows: 3,
        showCount: true,
        type: 'textarea',
      },
    },
    {
      component: 'Input',
      fieldName: 'workExperience',
      label: '在职经历',
      formItemClass: 'col-span-2 items-baseline',
      componentProps: {
        clearable: true,
        maxLength: 50,
        rows: 3,
        showCount: true,
        type: 'textarea',
      },
    },
  ];
}

export function useForm2Schema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'photo1',
      label: '身份证正面',
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
          default: () => '身份证正面',
        };
      },
    },
    {
      component: 'Upload',
      fieldName: 'photo2',
      label: '身份证反面',
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
          default: () => '身份证反面',
        };
      },
    },
    {
      component: 'Upload',
      fieldName: 'photo3',
      label: '近照预览',
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
          default: () => '近照预览',
        };
      },
    },
    {
      component: 'Upload',
      fieldName: 'photo4',
      label: '其他证件照片',
      formItemClass: 'col-span-3 items-baseline',
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
          default: () => '其他证件照片',
        };
      },
    },
    {
      component: 'Input',
      fieldName: 'remark1',
      label: '备注1',
      formItemClass: 'col-span-3 items-baseline',
      componentProps: {
        clearable: true,
        maxLength: 50,
        rows: 3,
        showCount: true,
        type: 'textarea',
      },
    },
    {
      component: 'Input',
      fieldName: 'remark2',
      label: '备注2',
      formItemClass: 'col-span-3 items-baseline',
      componentProps: {
        clearable: true,
        maxLength: 50,
        rows: 3,
        showCount: true,
        type: 'textarea',
      },
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Select',
      fieldName: 'departmentId',
      label: '部门',
      componentProps: {
        allowClear: true,
        clearable: true,
        options: [],
        placeholder: '请选择',
      },
    },
    {
      component: 'Select',
      fieldName: 'positionId ',
      label: '职位',
      componentProps: {
        allowClear: true,
        clearable: true,
        options: [
          {
            label: '不详',
            value: 0,
          },
          {
            label: '安装工',
            value: 1,
          },
        ],
        placeholder: '请选择',
      },
    },
    {
      component: 'Select',
      fieldName: 'employedStatus',
      label: '是否在职',
      componentProps: {
        allowClear: true,
        clearable: true,
        options: [
          {
            label: '离职',
            value: 0,
          },
          {
            label: '在职',
            value: 1,
          },
          {
            label: '挂职',
            value: 2,
          },
          {
            label: '未知',
            value: 3,
          },
        ],
        placeholder: '请选择',
      },
    },
    {
      component: 'Select',
      fieldName: 'isLocked',
      label: '是否锁定',
      componentProps: {
        clearable: true,
        allowClear: true,
        options: [
          {
            label: '未锁',
            value: 0,
          },
          {
            label: '已锁',
            value: 1,
          },
        ],
        placeholder: '请选择',
      },
    },
    {
      component: 'Input',
      fieldName: 'jobNum',
      label: '工号',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'username',
      label: '账号名称',
      componentProps: {
        clearable: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'realName',
      label: '姓名',
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
      field: 'jobNum',
      title: '工号',
      width: 80,
    },
    {
      field: 'realName',
      title: '员工姓名',
      width: 80,
    },
    {
      field: 'username',
      title: '登录名称',
      width: 80,
    },
    {
      field: 'phoneNum',
      title: '移动电话',
      width: 100,
    },
    {
      field: 'educational',
      title: '学历',
      width: 60,
    },
    {
      field: 'email',
      title: '邮箱',
      width: 120,
    },
    {
      field: 'gender',
      title: '性别',
      width: 60,
      slots: { default: 'gender' },
    },
    {
      field: 'employedStatus',
      title: '在职状态',
      width: 80,
      slots: { default: 'employedStatus' },
    },
    {
      field: 'isLocked',
      title: '账套',
      width: 80,
      slots: { default: 'isLocked' },
    },
    {
      field: 'positionCategory',
      title: '职位类别',
      width: 80,
    },
    {
      field: 'departmentName',
      title: '部门',
      width: 100,
    },
    {
      field: 'departTime',
      title: '离职日期',
      width: 120,
      slots: { default: 'departTime' },
    },
    // {
    //   field: 'carNum',
    //   title: '离职图片',
    //   width: 200,
    // },
    // {
    //   field: 'carNum',
    //   title: '离职原因',
    //   width: 120,
    // },
    {
      field: 'loginCount',
      title: '登录次数',
      width: 80,
    },
    {
      field: 'positionName',
      title: '职位',
      width: 80,
    },
    {
      field: 'birthday',
      title: '生日',
      width: 100,
    },
    {
      field: 'bloodType',
      title: '血型',
      width: 60,
    },
    {
      field: 'group',
      title: '班组',
      width: 80,
    },
    {
      field: 'entryTime',
      title: '入职日期',
      width: 100,
      slots: { default: 'entryTime' },
    },
    {
      field: 'isSignedContract',
      title: '是否签订合同',
      width: 110,
      slots: { default: 'isSignedContract' },
    },
    {
      field: 'contractExpirationTime',
      title: '合同到期日',
      width: 120,
      slots: { default: 'contractExpirationTime' },
    },
  ];
}
