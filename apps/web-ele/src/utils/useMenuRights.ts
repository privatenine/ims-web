import { ref } from 'vue';

import { getMenuButtonRightsByPath } from '#/api';

export const useMenuRights = (path: string) => {
  const rights = ref<string[]>([]);

  if (path) {
    getMenuButtonRightsByPath(path).then(({ data }) => {
      rights.value =
        data?.length > 0
          ? data[0]?.children
              ?.filter((n) => n.status === 0)
              ?.map((n) => n.name) || []
          : [];
    });
  }

  return { rights };
};
