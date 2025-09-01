<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { WarehousingApi } from '#/api';

import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  ElButton,
  ElButtonGroup,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
} from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getWarehousingList } from '#/api';
import { useMenuRights } from '#/utils';

import { useColumns, useGridFormSchema } from './data';
import EditLocationForm from './modules/editLocationForm.vue';

const { rights } = useMenuRights(useRouter().currentRoute.value.fullPath);
console.warn('rights', rights);

// 修改货位模态框
const [EditLocationModal, editLocationModalApi] = useVbenModal({
  connectedComponent: EditLocationForm,
  destroyOnClose: true,
  centered: true,
});

// 修改货位功能
function onEditLocation() {
  const selectData = gridApi.grid.getRadioRecord();
  useSelectedRow(selectData)((data) => {
    editLocationModalApi.setData(data).open();
  });
}

// 刷新列表
function onRefresh() {
  gridApi.grid.clearRadioRow();
  gridApi.query();
}

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
          return await getWarehousingList({
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
  } as VxeTableGridOptions<WarehousingApi.Warehousing>,
  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: WarehousingApi.Warehousing }) {
    //   selectRow.value = row;
    // },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<WarehousingApi.Warehousing>,
});

// function onRefresh() {
//   gridApi.query();
// }
</script>
<template>
  <Page auto-content-height>
    <EditLocationModal @success="onRefresh" />
    <Grid table-title="库存列表">
      <template #toolbar-tools>
        <ElButtonGroup class="ml-4">
          <ElButton type="primary" v-if="rights.includes('统计')">
            <IconifyIcon
              icon="prime:chart-line"
              class="size-5"
              style="margin-right: 4px"
            />
            统计数据
          </ElButton>
          <ElButton type="primary" v-if="rights.includes('下载')">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:download-rounded"
            />
            下载数据
          </ElButton>
          <ElButton
            type="primary"
            @click="onEditLocation"
            v-if="rights.includes('改货位')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="line-md:edit-twotone"
            />
            修改货位
          </ElButton>
          <ElButton type="primary" v-if="rights.includes('改进位')">
            <IconifyIcon
              icon="line-md:edit-twotone"
              class="size-5"
              style="margin-right: 4px"
            />
            改价
          </ElButton>
          <ElButton type="primary" disabled v-if="rights.includes('解锁')">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="fluent:lock-open-24-regular"
            />
            解锁
          </ElButton>
          <ElButton type="primary" disabled v-if="rights.includes('打印')">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:print-outline-rounded"
            />
            打印标签
          </ElButton>

          <ElButton type="primary" disabled v-if="rights.includes('明细')">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="fluent:apps-list-detail-20-regular"
            />
            库存明细
          </ElButton>
          <ElButton type="primary" disabled v-if="rights.includes('改售价')">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="line-md:edit-twotone"
            />
            批量改价
          </ElButton>
          <ElButton type="primary" v-if="rights.includes('加关联')">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="line-md:edit-twotone"
            />
            加关联
          </ElButton>
        </ElButtonGroup>
        <ElDropdown split-button type="primary">
          <IconifyIcon
            class="size-5"
            style="margin-right: 4px"
            icon="material-symbols:print-outline-rounded"
          />
          打印标签
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem>单一标签</ElDropdownItem>
              <ElDropdownItem>全部标签</ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </template>
    </Grid>
  </Page>
</template>
<style scoped lang="css">
.el-button-group .el-button--primary:last-child {
  border-radius: 0;
}

:deep(.el-dropdown .el-button-group .el-button--primary:first-child) {
  border-left: var(--el-button-divide-border-color) 1px solid;
  border-radius: 0;
}
</style>
