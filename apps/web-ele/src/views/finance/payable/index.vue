<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { PayableApi } from '#/api';

import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton, ElButtonGroup } from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getPayableList } from '#/api';
import { useMenuRights } from '#/utils';

import { useColumns, useGridFormSchema } from './data';
import Detail from './modules/detail.vue';
import Form from './modules/form.vue';
import Total from './modules/total.vue';

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
          return await getPayableList({
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
  } as VxeTableGridOptions<PayableApi.Payable>,
  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: PayableApi.Payable }) {
    //   selectRow.value = row;
    // },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<PayableApi.Payable>,
});

// function onRefresh() {
//   gridApi.query();
// }

const [DetailModel, detailModelApi] = useVbenModal({
  connectedComponent: Detail,
  destroyOnClose: true,
});
function detailSelectRow() {
  useSelectedRow(gridApi.grid.getRadioRecord())((data) => {
    detailModelApi.setData(data).open();
  });
}

const [FormModel, formModelApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

function openForm() {
  useSelectedRow(gridApi.grid.getRadioRecord())((data) =>
    formModelApi.setData(data).open(),
  );
}

const [TotalModel, totalModelApi] = useVbenModal({
  connectedComponent: Total,
  destroyOnClose: true,
});
function openTotal() {
  totalModelApi.setData({}).open();
}
</script>
<template>
  <Page auto-content-height>
    <DetailModel />
    <FormModel />
    <TotalModel />
    <Grid table-title="应付账款列表">
      <template #toolbar-tools>
        <ElButtonGroup class="ml-4">
          <ElButton
            type="primary"
            @click="detailSelectRow"
            v-if="rights.includes('明细')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="fluent:apps-list-detail-20-regular"
            />
            详情
          </ElButton>
          <ElButton type="primary" disabled v-if="rights.includes('打印')">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:print-outline-rounded"
            />
            打印明细
          </ElButton>
          <ElButton type="primary" disabled v-if="rights.includes('打印')">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:print-outline-rounded"
            />
            打印应付款
          </ElButton>
          <ElButton
            type="primary"
            @click="openForm"
            v-if="rights.includes('手工单')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="akar-icons:pointer-hand"
            />
            手工单
          </ElButton>
          <ElButton
            type="primary"
            @click="openTotal"
            v-if="rights.includes('合计')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="famicons:bar-chart-sharp"
            />
            累计
          </ElButton>
        </ElButtonGroup>
      </template>
    </Grid>
  </Page>
</template>
