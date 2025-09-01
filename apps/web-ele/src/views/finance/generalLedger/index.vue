<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { GeneralLedgerApi } from '#/api';

import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import dayjs from 'dayjs';
import {
  ElButton,
  ElButtonGroup,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
} from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getGeneralLedgerList } from '#/api';
import { inComeStatusFlagMap, useMenuRights } from '#/utils';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';
import PrintMonth from './modules/printMonth.vue';
import PrintSta from './modules/printSta.vue';
import PrintTotal from './modules/printTotal.vue';

const { rights } = useMenuRights(useRouter().currentRoute.value.fullPath);
console.warn('rights', rights);

const [FormModel, formModelApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
    wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
    fieldMappingTime: [['rangePicker', ['startTime', 'endTime'], 'x']],
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
          return await getGeneralLedgerList({
            ...formValues,
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            typeName: 1,
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
  } as VxeTableGridOptions<GeneralLedgerApi.GeneralLedger>,
  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: InComeApi.InCome }) {
    //   selectRow.value = row;
    // },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<GeneralLedgerApi.GeneralLedger>,
});
const [PrintStaModel, printStaModelApi] = useVbenModal({
  connectedComponent: PrintSta,
  destroyOnClose: true,
});
const [PrintTotalModel, printTotalModelApi] = useVbenModal({
  connectedComponent: PrintTotal,
  destroyOnClose: true,
});
const [PrintMonthModel, printMontModelApi] = useVbenModal({
  connectedComponent: PrintMonth,
  destroyOnClose: true,
});
</script>
<template>
  <Page auto-content-height>
    <FormModel @success="() => gridApi.query()" />
    <PrintStaModel />
    <PrintTotalModel />
    <PrintMonthModel />
    <Grid table-title="总分类账列表">
      <template #statusFlag="{ row }">
        {{ inComeStatusFlagMap[row.statusFlag] || '--' }}
      </template>
      <template #createTime="{ row }">
        {{ row.createTime ? dayjs(row.createTime).format('YYYY-MM-DD') : '' }}
      </template>
      <template #appTime="{ row }">
        {{ row.appTime ? dayjs(row.appTime).format('YYYY-MM-DD') : '' }}
      </template>
      <template #toolbar-tools>
        <ElButtonGroup class="ml-4">
          <ElButton
            type="primary"
            @click="() => formModelApi.setData({}).open()"
            disabled
            v-if="rights.includes('手工单')"
          >
            <IconifyIcon
              icon="akar-icons:pointer-hand"
              class="size-5"
              style="margin-right: 4px"
            />
            手工单
          </ElButton>
          <ElButton type="primary" disabled v-if="rights.includes('下载')">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:download-rounded"
            />
            下载数据
          </ElButton>
          <ElButton
            type="primary"
            @click="() => printStaModelApi.open()"
            v-if="rights.includes('资产统计')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:print-outline-rounded"
            />
            资产统计
          </ElButton>

          <ElDropdown
            split-button
            type="primary"
            @click="() => printTotalModelApi.open()"
            v-if="rights.includes('打印')"
          >
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="material-symbols:print-outline-rounded"
            />
            统计
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem @click="() => printTotalModelApi.open()">
                  分类统计
                </ElDropdownItem>
                <ElDropdownItem @click="() => printMontModelApi.open()">
                  按月统计
                </ElDropdownItem>
                <ElDropdownItem disabled> 季度统计 </ElDropdownItem>
                <ElDropdownItem disabled> 年度统计 </ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
        </ElButtonGroup>
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
