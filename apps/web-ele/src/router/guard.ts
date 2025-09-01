import type { Router } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { preferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';
import { startProgress, stopProgress } from '@vben/utils';

import { accessRoutes, coreRouteNames } from '#/router/routes';
import { useAuthStore } from '#/store';

import { generateAccess } from './access';

/**
 * 通用守卫配置
 * @param router
 */
function setupCommonGuard(router: Router) {
  // 记录已经加载的页面
  const loadedPaths = new Set<string>();

  router.beforeEach((to) => {
    to.meta.loaded = loadedPaths.has(to.path);

    // 页面加载进度条
    if (!to.meta.loaded && preferences.transition.progress) {
      startProgress();
    }
    return true;
  });

  router.afterEach((to) => {
    // 记录页面是否加载,如果已经加载，后续的页面切换动画等效果不在重复执行

    loadedPaths.add(to.path);

    // 关闭页面加载进度条
    if (preferences.transition.progress) {
      stopProgress();
    }
  });
}

/**
 * 权限访问守卫配置
 * @param router
 */
function setupAccessGuard(router: Router) {
  router.beforeEach(async (to, from) => {
    const accessStore = useAccessStore();
    const userStore = useUserStore();
    const authStore = useAuthStore();

    // 基本路由，这些路由不需要进入权限拦截
    if (coreRouteNames.includes(to.name as string)) {
      if (to.path === LOGIN_PATH && accessStore.accessToken) {
        return decodeURIComponent(
          (to.query?.redirect as string) ||
            userStore.userInfo?.homePath ||
            preferences.app.defaultHomePath,
        );
      }
      return true;
    }

    // accessToken 检查
    if (!accessStore.accessToken) {
      // 明确声明忽略权限访问权限，则可以访问
      if (to.meta.ignoreAccess) {
        return true;
      }

      // 没有访问权限，跳转登录页面
      if (to.fullPath !== LOGIN_PATH) {
        return {
          path: LOGIN_PATH,
          // 如不需要，直接删除 query
          query:
            to.fullPath === preferences.app.defaultHomePath
              ? {}
              : { redirect: encodeURIComponent(to.fullPath) },
          // 携带当前跳转的页面，登录后重新跳转该页面
          replace: true,
        };
      }
      return to;
    }

    // 是否已经生成过动态路由
    if (accessStore.isAccessChecked) {
      console.log('路由已检查过，但检查菜单状态...');
      // 检查菜单是否为空，如果为空则重新加载
      if (!accessStore.accessMenus || accessStore.accessMenus.length === 0) {
        console.log('菜单为空，重置检查状态并重新加载');
        accessStore.setIsAccessChecked(false);
        // 继续执行下面的菜单加载逻辑
      } else {
        console.log('菜单状态正常，直接返回');
        return true;
      }
    }

    console.log('开始进行权限检查和菜单加载...');
    const userInfoStr = localStorage.getItem('userInfo');
    const nUserInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

    // 生成路由表
    // 当前登录用户拥有的角色标识列表
    let userInfo = userStore.userInfo || nUserInfo;

    // 如果没有用户信息，尝试获取
    if (!userInfo || !userInfo.userId) {
      console.log('用户信息不存在，尝试获取用户信息...');
      try {
        userInfo = await authStore.fetchUserInfo();
      } catch (error) {
        console.error('获取用户信息失败:', error);
        return {
          path: LOGIN_PATH,
          replace: true,
        };
      }
    }

    console.log('当前用户信息:', userInfo);
    // const userInfo =
    //   userStore.userInfo || {
    //     userId: 1,
    //     realName: '李四',
    //     permissions: [
    //       'logger:list',
    //       'role:list',
    //       'role:add',
    //       'role:update',
    //       'role:delete',
    //       'storage:list',
    //       'storage:add',
    //       'storage:update',
    //       'storage:delete',
    //     ],
    //     username: 'lisi',
    //     homePath: '/basedata/logger',
    //   } ||
    //   (await authStore.fetchUserInfo());

    const modules = import.meta.glob('../views/**/*.vue');
    interface MenuItem {
      name: string;
      path: string;
      icon?: string;
      sort?: number;
      component?: string;
      children?: MenuItem[];
    }
    const toRouters = (list: MenuItem[]): MenuItem[] => {
      if (!Array.isArray(list)) {
        console.error('Expected an array but got:', list);
        return [];
      }
      return list
        .filter((n) => n.path)
        .map((item) => ({
          name: item.name,
          path: item.path,
          meta: {
            icon: item.icon,
            title: item.name,
            order: item.sort,
          },
          children: (item.children || [])
            .filter((n) => n.path && n.component)
            .map((child) => ({
              name: child.name,
              path: child.path,
              component: modules[`../views/${child.component}.vue`],
              meta: {
                affixTab: false,
                icon: item.icon,
                title: child.name,
              },
            })),
        }));
    };
    const userRoles = userInfo.roles ?? [];
    let routerList = [];
    try {
      const menuData = await authStore.fetchMeunList();
      routerList = toRouters(menuData.data);
      console.log('获取菜单数据成功:', menuData.data);
    } catch (error) {
      console.error('获取菜单数据失败:', error);
      // 如果菜单获取失败，尝试重新获取用户信息和菜单
      try {
        console.log('尝试重新获取菜单数据...');
        const retryMenuData = await authStore.fetchMeunList();
        routerList = toRouters(retryMenuData.data);
        console.log('重新获取菜单数据成功:', retryMenuData.data);
      } catch (retryError) {
        console.error('重新获取菜单数据仍然失败:', retryError);
        // 如果仍然失败，设置为空数组，避免阻塞
        routerList = [];
      }
    }
    // console.log('menuList', menuList, accessRoutes);

    const newRouterList = [...accessRoutes, ...routerList];
    // console.log('menuList', menuData, accessRoutes, newRouterList);
    // 生成菜单和路由
    const { accessibleMenus, accessibleRoutes } = await generateAccess({
      roles: userRoles,
      router,
      // 则会在菜单中显示，但是访问会被重定向到403
      routes: newRouterList,
    });
    // console.log('menuList11', accessibleMenus, accessibleRoutes);
    // 保存菜单信息和路由信息
    accessStore.setAccessMenus(accessibleMenus);
    accessStore.setAccessRoutes(accessibleRoutes);
    accessStore.setIsAccessChecked(true);

    console.log('菜单设置完成:', accessibleMenus);
    console.log('路由设置完成:', accessibleRoutes);

    // 确保菜单状态已更新 - 使用 nextTick 确保 DOM 更新
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log('菜单状态延迟更新完成');
        resolve(void 0);
      }, 100);
    });
    const redirectPath = (from.query.redirect ??
      (to.path === preferences.app.defaultHomePath
        ? userInfo.homePath || preferences.app.defaultHomePath
        : to.fullPath)) as string;

    return {
      ...router.resolve(decodeURIComponent(redirectPath)),
      replace: true,
    };
  });
}

/**
 * 项目守卫配置
 * @param router
 */
function createRouterGuard(router: Router) {
  /** 通用 */
  setupCommonGuard(router);
  /** 权限访问 */
  setupAccessGuard(router);
}

export { createRouterGuard };
