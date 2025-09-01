<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { StorageApi } from '#/api';

import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup } from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getStorageList, updateStorage } from '#/api';
import { useMenuRights } from '#/utils';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const { rights } = useMenuRights(useRouter().currentRoute.value.fullPath);
console.warn('rights', rights);

onMounted(() => {});
const [FormModel, formModelApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
    wrapperClass: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
  },
  gridOptions: {
    columns: useColumns(),
    height: 'auto',
    keepSource: true,
    showOverflow: false,
    proxyConfig: {
      response: {
        result: 'data',
        total: 'total',
        list: 'data',
      },
      ajax: {
        query: async ({ page, sort }, formValues) => {
          // console.log('formValues', formValues);
          return await getStorageList({
            ...formValues,
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            sortParam: {
              field: sort.field,
              type: sort.order === 'asc' ? 1 : -1, // 排序类型, 1 正序 -1 倒序
            },
          });
        },
      },
    },

    rowConfig: {
      keyField: 'id',
      isCurrent: true,
      isHover: true,
    },
    radioConfig: {
      // labelField: 'name',
      trigger: 'row',
    },
    sortConfig: {
      trigger: 'cell',
      remote: true,
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<StorageApi.Storage>,
  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: StorageApi.Storage }) {
    //   selectRow.value = row;
    // },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<StorageApi.Storage>,
});

function onCreate() {
  formModelApi.setData({}).open();
}
function onEdit(row: StorageApi.Storage) {
  formModelApi.setData(row).open();
}
function onRefresh() {
  gridApi.query();
}

// function onDelete(row: StorageApi.Storage) {
//   const hideLoading = ElMessage({
//     message: `正在删除...`,
//     type: 'info',
//     plain: true,
//     duration: 0,
//   });
//   deleteStorageByIds({ ids: [row.id] })
//     .then(() => {
//       ElMessage({
//         message: `删除成功!`,
//         type: 'success',
//         plain: true,
//       });
//       onRefresh();
//     })
//     .finally(() => {
//       hideLoading.close();
//     });
// }

function editSelectRow() {
  useSelectedRow(gridApi.grid.getRadioRecord())(
    onEdit as (data: StorageApi.Storage | undefined) => void,
  );
}
function editSelectRowStatus() {
  useSelectedRow(gridApi.grid.getRadioRecord())((data) => {
    if (data) {
      updateStorage({
        ...data,
        status: data.status === 1 ? 2 : 1,
      }).then(() => {
        onRefresh();
        gridApi.grid.clearRadioRow();
        // const a = gridApi.grid.getFullData();
        // console.warn(333, a);
      });
    }
  });
}
</script>
<template>
  <Page auto-content-height>
    <FormModel @success="onRefresh" />
    <Grid table-title="仓库列表">
      <template #toolbar-tools>
        <ElButtonGroup class="ml-4">
          <ElButton
            type="primary"
            @click="onCreate"
            v-if="rights.includes('新增')"
          >
            <IconifyIcon
              icon="ant-design:plus-outlined"
              class="size-5"
              style="margin-right: 4px"
            />
            新增
          </ElButton>
          <ElButton
            type="primary"
            @click="editSelectRow"
            v-if="rights.includes('修改')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="line-md:edit-twotone"
            />
            修改
          </ElButton>
          <ElButton
            type="primary"
            @click="editSelectRow"
            v-if="rights.includes('删除')"
            disabled
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="mdi:trash-can-outline"
            />
            删除
          </ElButton>
          <ElButton
            type="primary"
            @click="editSelectRowStatus"
            v-if="rights.includes('启/停')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="line-md:edit-twotone"
            />
            启用/停用
          </ElButton>
        </ElButtonGroup>
      </template>
    </Grid>
  </Page>
</template>
