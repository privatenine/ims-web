<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { BasicRoleApi } from '#/api';

import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup, ElMessage } from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteBasicRoleByIds, getBasicRoleList } from '#/api';
import { useMenuRights } from '#/utils';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const { rights } = useMenuRights(useRouter().currentRoute.value.fullPath);
console.warn('rights', rights);

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
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
          return getBasicRoleList({
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
  } as VxeTableGridOptions<BasicRoleApi.Role>,
  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: BasicRoleApi.Role }) {
    //   selectRow.value = row;
    // },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<BasicRoleApi.Role>,
});

function handleUpdate() {
  useSelectedRow(gridApi.grid.getRadioRecord())((row) =>
    formModelApi.setData(row).open(),
  );
}
function deleteSelectRow() {
  useSelectedRow(gridApi.grid.getRadioRecord())(
    onDelete as (data: BasicRoleApi.Role | undefined) => void,
    true,
  );
}

function onDelete(row: BasicRoleApi.Role) {
  const hideLoading = ElMessage({
    message: `正在删除...`,
    type: 'info',
    plain: true,
    duration: 0,
  });
  deleteBasicRoleByIds({ ids: [row.id] })
    .then(() => {
      ElMessage({
        message: `删除成功!`,
        type: 'success',
        plain: true,
      });
      onRefresh();
    })
    .finally(() => {
      hideLoading.close();
    });
}
function onRefresh() {
  gridApi.query();
}
function onCreate() {
  formModelApi.setData({}).open();
}

const [FormModel, formModelApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});
</script>
<template>
  <Page auto-content-height>
    <FormModel @success="onRefresh" />
    <Grid table-title="权限列表">
      <template #toolbar-tools>
        <ElButtonGroup class="ml-4">
          <ElButton
            type="primary"
            @click="onCreate"
            v-if="rights.includes('新增角色')"
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
            @click="handleUpdate"
            v-if="rights.includes('修改角色')"
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
            @click="deleteSelectRow"
            v-if="rights.includes('删除角色')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="mdi:trash-can-outline"
            />
            删除
          </ElButton>
        </ElButtonGroup>
      </template>
    </Grid>
  </Page>
</template>
