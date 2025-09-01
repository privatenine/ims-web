import type { CommApi } from '#/api';

import { requestClient } from '#/api/request';

export namespace EmployeeApi {
  export interface Employee {
    id: number;
    employeeId: number;
    userId: number;
    birthday: string; // 生日 ,
    bloodType: string; // 血型 ,
    confirmPwd: string; // 确认密码 ,
    confirmationTime: number; // 转正时间 ,
    contractExpirationTime: number; // 合同到期时间 ,
    currentAddress: string; // 现住址 ,
    departTime: number; // 离职时间 ,
    departmentId: number; // 部门Id ,
    departmentName: string; // 部门名称 ,
    educational: string; // 员工学历 ,
    email: string; // 用户邮箱 ,
    emergencyContact: string; // 紧急联系人 ,
    emergencyPhone: string; // 紧急联系电话 ,
    employedStatus: number; // 在职状态:0 离职, 1 在职, 2 挂职 ,
    entryTime: number; // 入职时间 ,
    expireTime: number; // 到期时间 ,
    familyIntroduction: string; // 家庭简述 ,
    gender: number; // 性别:0未知 1 男 2 女 ,
    group: string; // 班组 ,
    height: number; // 身高（厘米），保留两位小数，例如160.20 ,
    hobby: string; // 爱好 ,
    identity: string; // 身份证号 ,
    identityBack: string; // 身份证反面地址 ,
    identityFront: string; // 身份证正面地址 ,
    isSignedContract: number; // 是否签订合同:0 不详, 1 签订, 2 未签订 ,
    jobNum: string; // 工号 ,
    major: string; // 专业 ,
    maritalStatus: number; // 婚姻状况:0 不详, 1 已婚, 2 未婚 ,
    nativePlace: string; // 籍贯 ,
    nickname: string; // 用户昵称 ,
    officePhone: string; // 办公电话 ,
    paperImage: string; // 证件照 ,
    password: string; // 密码 ,
    phoneNum: string; // 用户手机号 ,
    positionCategory: string; // 职位类别 ,
    positionId: number; // 职位Id ,
    positionName: string; // 职位名称 ,
    qq: string; // QQ ,
    realName: string; // 用户真实姓名 ,
    remark1: string; // 备注1 ,
    remark2: string; // 备注2 ,
    school: string; // 毕业学校 ,
    username: string; // 用户名 ,
    wechat: string; // 微信 ,
    weight: number; // 体重（千克），保留两位小数，例如63.20 ,
    workExperience: string; // 在职经历 ,
    workingYear: number; // 工作年限（年），保留一位小数，例如4.0
    userIdCard: string; // 身份证号
  }
  export interface EmployeeVo {
    employeeId: number; // 员工ID
    userId: number; // 用户ID
    jobNum: string; // 工号
    username: string; // 用户名
    realName: string; // 用户真实姓名
    phoneNum: string; // 用户手机号
    nickname: string; // 用户昵称
    educational: string; // 员工学历
    email: string; // 用户邮箱
    gender: number; // 0未知 1 男 2 女
    employedStatus: number; // 在职状态:0 离职, 1 在职, 2 挂职
    positionCategory: string; // 职位类别
    departmentId: number; // 部门Id
    departmentName: string; // 部门名称
    departTime: number; // 离职时间
    loginCount: number; // 登录次数
    positionId: number; // 职位Id
    positionName: string; // 职位名称
    birthday: string; // 生日
    bloodType: string; // 血型
    group: string; // 班组
    entryTime: number; // 入职时间
    isSignedContract: number; // 是否签订合同:0 不详, 1 签订, 2 未签订
    contractExpirationTime: number; // 合同到期时间
    isLocked: boolean; // 是否锁定
  }

  export interface EmployeeQuery extends CommApi.PageParam {
    departmentId: number; // 部门Id ,
    employedStatus: number; // 在职状态:0 离职, 1 在职, 2 挂职 ,
    isLocked: boolean; // 是否锁定 ,
    jobNum: string; // 工号 ,
    positionId: number; // 职位Id ,
    realName: string; // 用户真实姓名 ,
    username: string; // 员工信息对应用户名
  }
}

/**
 * 获取列表数据
 */
async function getEmployeeList(data: EmployeeApi.EmployeeQuery) {
  return requestClient.post<CommApi.Response<EmployeeApi.EmployeeVo[]>>(
    `/personnelMatters/findEmployeeList`,
    data,
  );
}

/**
 * 获取数据
 */
async function getEmployee(id: number) {
  return requestClient.get<CommApi.Response<EmployeeApi.EmployeeVo>>(
    `/personnelMatters/findEmployeeById?userId=${id}`,
  );
}

/**
 * 创建
 * @param data 部门数据
 */
async function createEmployee(data: Omit<EmployeeApi.Employee, 'id'>) {
  return requestClient.post('/personnelMatters/addEmployee', data);
}

/**
 * 更新
 *
 * @param id ID
 * @param data 数据
 */
// async function updateEmployeeById(
//   id: string,
//   data: Omit<EmployeeApi.Employee, 'id'>,
// ) {
//   return requestClient.put(`/personnelMatters/updateById/${id}`, data);
// }

/**
 * 更新
 *
 * @param id  ID
 * @param data 数据
 */
async function updateEmployee(data: EmployeeApi.Employee) {
  return requestClient.put(`/personnelMatters/updateEmployeeById`, data);
}

// /**
//  * 删除
//  * @param id  ID
//  */
// async function deleteEmployee(id: string) {
//   return requestClient.delete(`/personnelMatters/${id}`);
// }
/**
 * 批量删除
 */
async function deleteEmployeeByIds(data: any) {
  return requestClient.post(`/personnelMatters/deleteEmployeeByIds`, data);
}

/**
 * 员工复职
 */
async function uptEmployeeStatusById(params: any) {
  return requestClient.post(`/personnelMatters/reinstated`, null, {
    params,
  });
}

/**
 * 员工离职
 */
async function uptEmployeeStatusResignById(params: any) {
  return requestClient.post(`/personnelMatters/resign`, null, {
    params,
  });
}

/**
 * 授权
 */
async function uptEmployeeAuthorizeById(params: any) {
  return requestClient.post(`/personnelMatters/authorize`, null, {
    params,
  });
}

/**
 * 收权
 */
async function uptEmployeeUnAuthorizeById(params: any) {
  return requestClient.post(`/personnelMatters/unAuthorize`, null, {
    params,
  });
}

export {
  createEmployee,
  // deleteEmployee,
  deleteEmployeeByIds,
  getEmployee,
  getEmployeeList,
  updateEmployee,
  uptEmployeeAuthorizeById,
  // updateEmployeeById,
  uptEmployeeStatusById,
  uptEmployeeStatusResignById,
  uptEmployeeUnAuthorizeById,
};
