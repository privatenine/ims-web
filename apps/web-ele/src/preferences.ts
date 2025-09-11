import { defineOverridesPreferences } from '@vben/preferences';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides

  theme: {
    mode: 'light',
    semiDarkHeader: true,
    semiDarkSidebar: true,
  },
  app: {
    name: import.meta.env.VITE_APP_TITLE,
    // theme: {
    //   mode: 'light',
    // },
    defaultAvatar:
      'https://unpkg.com/@vbenjs/static-source@0.1.7/source/avatar-v1.webp',
    defaultHomePath: '/home',
    enableCheckUpdates: false,
  },
  breadcrumb: {
    enable: false,
  },
  copyright: {
    companyName: '磐领汽车玻璃系统',
    companySiteLink: 'http://www.gmrjkj.com/',
    date: '2016-2018',
    icp: '鄂ICP备19004546号-1',
  },
  footer: {
    enable: true,
  },
  widget: {
    globalSearch: false,
    languageToggle: false,
    themeToggle: false,
  },
  logo: {
    enable: true,
    fit: 'contain',
    source: 'https://unpkg.com/@vbenjs/static-source@0.1.7/source/logo-v1.webp',
  },
});
