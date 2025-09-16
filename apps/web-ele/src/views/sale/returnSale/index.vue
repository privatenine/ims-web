<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ReturnSaleApi } from '#/api';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup, ElMessage } from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteReturnSaleById, getReturnSaleList } from '#/api';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const userInfoStr = localStorage.getItem('userInfo');
const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};
// const selectRow = ref<ReturnSaleApi.ReturnSale>({});
const [FormModel, formModelApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid<ReturnSaleApi.ReturnSale>({
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
          // 处理日期范围
          let endTime, startTime;
          if (formValues.dateRange && formValues.dateRange.length === 2) {
            startTime = new Date(formValues.dateRange[0]).getTime();
            endTime = new Date(formValues.dateRange[1]).getTime();
          }

          return await getReturnSaleList({
            ...formValues,
            startTime,
            endTime,
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
      export: true,
      refresh: { code: 'query' },
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<ReturnSaleApi.ReturnSale>,

  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: ReturnSaleApi.ReturnSale }) {
    //   selectRow.value = row;
    // },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<ReturnSaleApi.ReturnSale>,
});

// onmounted(() => {
//   gridApi.updateGridFormSchema();
// });

function handleUpdate() {
  useSelectedRow(gridApi.grid.getRadioRecord())(
    onEdit as (data: ReturnSaleApi.ReturnSale | undefined) => void,
  );
}
function deleteSelectRow() {
  useSelectedRow(gridApi.grid.getRadioRecord())(
    onDelete as (data: ReturnSaleApi.ReturnSale | undefined) => void,
    true,
  );
}

function onEdit(row: ReturnSaleApi.ReturnSale) {
  formModelApi.setData(row).open();
}

function onDelete(row: ReturnSaleApi.ReturnSale) {
  const hideLoading = ElMessage({
    message: `正在删除...`,
    type: 'info',
    plain: true,
    duration: 0,
  });
  deleteReturnSaleById({ id: row.id })
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
</script>
<template>
  <Page auto-content-height>
    <FormModel @success="onRefresh" />
    <Grid table-title="销售退货列表">
      <template #toolbar-tools>
        <ElButtonGroup class="ml-4">
          <ElButton type="primary" @click="onCreate">
            <IconifyIcon
              icon="ant-design:plus-outlined"
              class="size-5"
              style="margin-right: 4px"
            />
            新增
          </ElButton>
          <ElButton type="primary" @click="handleUpdate">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="line-md:edit-twotone"
            />
            修改
          </ElButton>
          <ElButton type="primary" disabled>
            <IconifyIcon
              icon="line-md:edit-twotone"
              class="size-5"
              style="margin-right: 4px"
            />
            收货
          </ElButton>
          <ElButton type="primary" @click="deleteSelectRow">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="mdi:trash-can-outline"
            />
            删除
          </ElButton>
          <ElButton type="primary" disabled>
            <IconifyIcon
              icon="fluent:apps-list-detail-20-regular"
              class="size-5"
              style="margin-right: 4px"
            />
            详情
          </ElButton>

          <ElButton type="primary" disabled>
            <IconifyIcon
              icon="material-symbols:download-rounded"
              class="size-5"
              style="margin-right: 4px"
            />下载
          </ElButton>
          <ElButton type="primary" disabled>
            <IconifyIcon
              icon="line-md:edit-twotone"
              class="size-5"
              style="margin-right: 4px"
            />改货位
          </ElButton>
          <ElButton type="primary" disabled>
            <IconifyIcon
              icon="material-symbols:print-outline-rounded"
              class="size-5"
              style="margin-right: 4px"
            />打印
          </ElButton>
        </ElButtonGroup>
      </template>
    </Grid>
  </Page>
</template>
