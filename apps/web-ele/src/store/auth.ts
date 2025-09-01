import type { Recordable, UserInfo } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { preferences } from '@vben/preferences';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { ElNotification } from 'element-plus';
import { defineStore } from 'pinia';

import { getMenuList1, getUserInfoApi, loginApi, logoutApi } from '#/api';
import { getStorageList } from '#/api/basic/storage';
import { getEmployeeList } from '#/api/personnelMatters/employee';
import { $t } from '#/locales';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref(false);

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   * @param params 登录表单数据
   */
  async function authLogin(
    params: Recordable<any>,
    onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let userInfo: null | UserInfo = null;
    try {
      loginLoading.value = true;

      const {
        token: accessToken,
        username,
        nickname: realName,
        permissions,
        id: userId,
        deviceType,
      } = await loginApi({ ...params, deviceType: 'PC' });

      // 如果成功获取到 accessToken
      if (accessToken) {
        // 将 accessToken 存储到 accessStore 中
        accessStore.setAccessToken(accessToken);

        // 获取用户信息并存储到 accessStore 中
        // const [fetchUserInfoResult, accessCodes] = await Promise.all([
        //   fetchUserInfo(),
        //   getAccessCodesApi(),
        // ]);

        // userInfo = fetchUserInfoResult;

        // userStore.setUserInfo(userInfo);
        // accessStore.setAccessCodes(accessCodes);

        userInfo = {
          userId,
          realName,
          permissions,
          username,
          // homePath: '/basedata/logger',
          token: accessToken,
          avatar: '',
        };
        userStore.setUserInfo(userInfo);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        // 获取并缓存仓库信息
        await fetchAndCacheStorageList();

        // 获取并缓存员工信息
        await fetchAndCacheEmployeeList();

        if (accessStore.loginExpired) {
          accessStore.setLoginExpired(false);
        } else {
          onSuccess
            ? await onSuccess?.()
            : await router.push(
                userInfo.homePath || preferences.app.defaultHomePath,
              );
        }

        if (userInfo?.realName) {
          ElNotification({
            message: `${$t('authentication.loginSuccessDesc')}:${userInfo?.realName}`,
            title: $t('authentication.loginSuccess'),
            type: 'success',
          });
        }
      }
    } finally {
      loginLoading.value = false;
    }

    return {
      userInfo,
    };
  }

  async function logout(redirect: boolean = true) {
    try {
      await logoutApi();
    } catch {
      // 不做任何处理
    }
    resetAllStores();
    accessStore.setLoginExpired(false);
    localStorage.removeItem('userInfo');

    // 清除缓存
    localStorage.removeItem('storageList');
    localStorage.removeItem('employeeList');

    // 回登录页带上当前路由地址
    await router.replace({
      path: LOGIN_PATH,
      query: redirect
        ? {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          }
        : {},
    });
  }

  async function fetchUserInfo() {
    let userInfo: null | UserInfo = null;
    userInfo = await getUserInfoApi();
    userStore.setUserInfo(userInfo);
    return userInfo;
  }

  async function fetchMeunList() {
    return await getMenuList1();
  }

  /**
   * 获取仓库信息并缓存到本地
   */
  async function fetchAndCacheStorageList() {
    try {
      const response = await getStorageList({
        pageNum: 1,
        pageSize: 1000, // 获取所有仓库
      });

      if (response.data) {
        // 将仓库信息缓存到localStorage
        const storageList = response.data.map((storage) => ({
          id: storage.id,
          name: storage.name,
          code: storage.jianPinCode, // 仓库编号
        }));

        localStorage.setItem('storageList', JSON.stringify(storageList));
        console.log('仓库信息已缓存:', storageList);
      }
    } catch (error) {
      console.error('获取仓库信息失败:', error);
    }
  }

  function $reset() {
    loginLoading.value = false;
  }

  /**
   * 获取员工信息并缓存到本地
   */
  async function fetchAndCacheEmployeeList() {
    try {
      const response = await getEmployeeList({
        pageNum: 1,
        pageSize: 40,
        sortParam: {
          field: 'realName',
          type: -1,
        },
      });
      console.log(response);
      if (response.data) {
        // 缓存员工信息到localStorage
        localStorage.setItem(
          'employeeList',
          JSON.stringify(
            response.data.map((item) => {
              return {
                username: item.username,
                realName: item.realName,
                userId: item.userId,
              };
            }),
          ),
        );
        console.log('员工信息缓存成功，共', response.data.length, '条');
      }
    } catch (error) {
      console.error('获取员工信息失败:', error);
    }
  }

  /**
   * 从本地缓存获取仓库信息
   */
  function getCachedStorageList() {
    try {
      const cached = localStorage.getItem('storageList');
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('获取缓存仓库信息失败:', error);
      return [];
    }
  }

  /**
   * 从本地缓存获取员工信息
   */
  function getCachedEmployeeList() {
    try {
      const cached = localStorage.getItem('employeeList');
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('获取缓存员工信息失败:', error);
      return [];
    }
  }

  /**
   * 根据员工ID获取员工信息
   */
  function getEmployeeById(employeeId: number) {
    const employeeList = getCachedEmployeeList();
    return employeeList.find(
      (employee: any) => employee.employeeId === employeeId,
    );
  }

  /**
   * 根据用户ID获取员工信息
   */
  function getEmployeeByUserId(userId: number) {
    const employeeList = getCachedEmployeeList();
    return employeeList.find((employee: any) => employee.userId === userId);
  }

  /**
   * 根据真实姓名获取员工信息
   */
  function getEmployeeByRealName(realName: string) {
    const employeeList = getCachedEmployeeList();
    return employeeList.find((employee: any) => employee.realName === realName);
  }

  /**
   * 获取员工选项（用于下拉选择）
   */
  function getEmployeeOptions() {
    const employeeList = getCachedEmployeeList();
    return employeeList.map((employee: any) => ({
      label: employee.realName || employee.username,
      value: employee.employeeId,
      data: employee,
    }));
  }

  /**
   * 检查是否有缓存的员工信息
   */
  function hasCachedEmployeeList() {
    try {
      const cached = localStorage.getItem('employeeList');
      return !!cached && JSON.parse(cached).length > 0;
    } catch {
      return false;
    }
  }

  /**
   * 清除员工缓存
   */
  function clearEmployeeCache() {
    try {
      localStorage.removeItem('employeeList');
    } catch (error) {
      console.error('清除员工缓存失败:', error);
    }
  }

  return {
    $reset,
    authLogin,
    fetchUserInfo,
    loginLoading,
    logout,
    fetchMeunList,
    fetchAndCacheStorageList,
    getCachedStorageList,

    // 员工缓存相关方法
    fetchAndCacheEmployeeList,
    getCachedEmployeeList,
    getEmployeeById,
    getEmployeeByUserId,
    getEmployeeByRealName,
    getEmployeeOptions,
    hasCachedEmployeeList,
    clearEmployeeCache,
  };
});
