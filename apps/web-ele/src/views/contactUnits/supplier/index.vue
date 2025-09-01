<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SupplierApi } from '#/api';

import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup, ElMessage, ElTag } from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteSupplierByIds, getSupplierList } from '#/api';
import { GenderMap, useMenuRights } from '#/utils';

import { useColumns, useGridFormSchema } from './data';
import Detail from './modules/detail.vue';
import Form from './modules/form.vue';

const { rights } = useMenuRights(useRouter().currentRoute.value.fullPath);
console.warn('rights', rights);

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
    wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
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
          return await getSupplierList({
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
  } as VxeTableGridOptions<SupplierApi.Supplier>,
  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: SupplierApi.Supplier }) {
    //   selectRow.value = row;
    // },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<SupplierApi.Supplier>,
});

const [FormDrawer, formDrawerApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});
const [DetailModel, detailModelApi] = useVbenModal({
  connectedComponent: Detail,
  destroyOnClose: true,
});
function editSelectRow() {
  useSelectedRow(gridApi.grid.getRadioRecord())(
    onEdit as (data: SupplierApi.Supplier | undefined) => void,
  );
}
function deleteSelectRow() {
  useSelectedRow(gridApi.grid.getRadioRecord())(
    onDelete as (data: SupplierApi.Supplier | undefined) => void,
    true,
  );
}

function detailSelectRow() {
  useSelectedRow(gridApi.grid.getRadioRecord())((data) => {
    detailModelApi.setData(data).open();
  });
}
function onCreate() {
  formDrawerApi.setData({}).open();
}
function onEdit(row: SupplierApi.Supplier) {
  formDrawerApi.setData(row).open();
}
function onDelete(row: SupplierApi.Supplier) {
  const hideLoading = ElMessage({
    message: `正在删除...`,
    type: 'info',
    plain: true,
    duration: 0,
  });
  deleteSupplierByIds({ ids: [row.id] })
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
</script>
<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <DetailModel />
    <Grid table-title="供应商列表">
      <template #gender="{ row }">
        <ElTag :type="GenderMap[row.gender]?.color || 'danger'">
          {{ GenderMap[row.gender]?.name || '未知' }}
        </ElTag>
      </template>
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
            @click="deleteSelectRow"
            v-if="rights.includes('删除')"
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
            @click="detailSelectRow"
            v-if="rights.includes('详情')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="fluent:apps-list-detail-20-regular"
            />
            详情
          </ElButton>
          <ElButton type="primary" disabled v-if="rights.includes('下载')">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols-light:download"
            />
            下载模板
          </ElButton>
          <ElButton type="primary" disabled v-if="rights.includes('下载')">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols-light:download"
            />
            下载数据
          </ElButton>
          <ElButton type="primary" disabled v-if="rights.includes('上传')">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:upload-rounded"
            />
            上传数据
          </ElButton>
        </ElButtonGroup>
      </template>
    </Grid>
  </Page>
</template>
