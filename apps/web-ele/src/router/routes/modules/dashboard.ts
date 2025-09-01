import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'ims-home',
    path: '/home',
    component: () => import('#/views/home/index.vue'),
    meta: {
      icon: 'mdi:home',
      title: '我的桌面',
      order: -1,
      affixTab: true,
    },
  },
  // {
  //   meta: {
  //     icon: 'lucide:layout-dashboard',
  //     order: 11,
  //     title: '统计分析',
  //   },
  //   name: 'Dashboard',
  //   path: '/dashboard',
  //   children: [
  //     {
  //       name: 'Analytics1',
  //       path: '/analytics1',
  //       component: () => import('#/views/dashboard/analytics/index.vue'),
  //       meta: {
  //         icon: 'lucide:area-chart',
  //         title: '营业统计分析',
  //       },
  //     },
  //     {
  //       name: 'Analytics2',
  //       path: '/analytics2',
  //       component: () => import('#/views/dashboard/workspace/index.vue'),
  //       meta: {
  //         icon: 'carbon:workspace',
  //         title: '费用查询统计',
  //       },
  //     },
  //     {
  //       name: 'Analytics3',
  //       path: '/analytics3',
  //       component: () => import('#/views/dashboard/analytics/index.vue'),
  //       meta: {
  //         icon: 'lucide:area-chart',
  //         title: '免收免付统计',
  //       },
  //     },
  //     {
  //       name: 'Analytics4',
  //       path: '/analytics4',
  //       component: () => import('#/views/dashboard/workspace/index.vue'),
  //       meta: {
  //         icon: 'carbon:workspace',
  //         title: '其他收入分析',
  //       },
  //     },
  //     {
  //       name: 'Analytics5',
  //       path: '/analytics5',
  //       component: () => import('#/views/dashboard/analytics/index.vue'),
  //       meta: {
  //         icon: 'lucide:area-chart',
  //         title: '收款统计查询',
  //       },
  //     },
  //     {
  //       name: 'Analytics6',
  //       path: '/analytics6',
  //       component: () => import('#/views/dashboard/workspace/index.vue'),
  //       meta: {
  //         icon: 'carbon:workspace',
  //         title: '付款查询分析',
  //       },
  //     },
  //     {
  //       name: 'Analytics7',
  //       path: '/analytics7',
  //       component: () => import('#/views/dashboard/analytics/index.vue'),
  //       meta: {
  //         icon: 'lucide:area-chart',
  //         title: '盘盈盘亏报表',
  //       },
  //     },
  //     {
  //       name: 'Analytics8',
  //       path: '/analytics8',
  //       component: () => import('#/views/dashboard/workspace/index.vue'),
  //       meta: {
  //         icon: 'carbon:workspace',
  //         title: '安装统计分析',
  //       },
  //     },
  //     {
  //       name: 'Analytics9',
  //       path: '/analytics9',
  //       component: () => import('#/views/dashboard/workspace/index.vue'),
  //       meta: {
  //         icon: 'carbon:workspace',
  //         title: '入库查询分析',
  //       },
  //     },
  //     {
  //       name: 'Analytics10',
  //       path: '/analytics10',
  //       component: () => import('#/views/dashboard/workspace/index.vue'),
  //       meta: {
  //         icon: 'carbon:workspace',
  //         title: '采购统计分析',
  //       },
  //     },
  //     // {
  //     //   name: 'Analytics',
  //     //   path: '/analytics',
  //     //   component: () => import('#/views/dashboard/analytics/index.vue'),
  //     //   meta: {
  //     //     affixTab: true,
  //     //     icon: 'lucide:area-chart',
  //     //     title: $t('page.dashboard.analytics'),
  //     //   },
  //     // },
  //     // {
  //     //   name: 'Workspace',
  //     //   path: '/workspace',
  //     //   component: () => import('#/views/dashboard/workspace/index.vue'),
  //     //   meta: {
  //     //     icon: 'carbon:workspace',
  //     //     title: $t('page.dashboard.workspace'),
  //     //   },
  //     // },
  //   ],
  // },
];

export default routes;
