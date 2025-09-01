<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { GeneralLedgerApi } from '#/api';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getGeneralLedgerTotal } from '#/api';

import { usePrintTotalColums } from '../data';

const [Modal, modalApi] = useVbenModal({
  // fullscreen: true,
  // fullscreenButton: true,
  showCancelButton: false,
  showConfirmButton: true,
  draggable: true,
  confirmText: '关闭',
  onConfirm: async () => {
    modalApi.close();
  },
  // onOpenChange(isOpen: boolean) {},
  title: '统计分类账',
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: usePrintTotalColums(),
    height: 'auto',
    keepSource: true,
    showOverflow: false,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      response: {
        result: 'data',
        total: 'total',
        list: 'data',
      },
      ajax: {
        query: async ({ page, sort }, formValues) => {
          const { data } = await getGeneralLedgerTotal({
            ...formValues,
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            sortParam: {
              field: sort.field,
              type: sort.order === 'asc' ? 1 : -1, // 排序类型, 1 正序 -1 倒序
            },
          });
          return {
            data,
            total: data.length,
          };
        },
      },
    },
    rowConfig: {
      keyField: 'monthField',
      isCurrent: true,
      isHover: true,
    },
    radioConfig: {
      // labelField: 'name',
      trigger: 'row',
    },
    footerConfig: {
      showFooter: true,
      // 自定义合计行样式
      className: 'grid-footer',
    },
    sortConfig: {
      trigger: 'cell',
      remote: true,
    },
    // toolbarConfig: {
    //   custom: true,
    //   export: false,
    //   refresh: { code: 'query' },
    //   search: true,
    //   zoom: true,
    // },
    showFooter: true,
    footerMethod(params) {
      const { data } = params;

      const colunms = usePrintTotalColums();
      const footSum = {};
      for (const currentValue of colunms) {
        footSum[currentValue.field] = 0;
      }
      for (const item of data) {
        for (const key in item) {
          footSum[key] += Number(item[key] || 0);
        }
      }
      return [{ ...footSum, monthField: '合计' }];
    },
  } as VxeTableGridOptions<GeneralLedgerApi.GeneralLedgerTotal>,
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
  } as VxeGridListeners<GeneralLedgerApi.GeneralLedgerTotal>,
});
const printArea = { id: 'printArea' };
</script>
<template>
  <Modal class="w-[800px]">
    <div id="printArea" class="w-full">
      <Grid table-title="总分类账列表" class="h-[500px]" />
    </div>
    <template #append-footer>
      <ElButton type="primary" v-print="printArea">
        <IconifyIcon
          class="size-5"
          style="margin-right: 4px"
          icon="material-symbols:print-outline-rounded"
        />打印
      </ElButton>
    </template>
  </Modal>
</template>
<style lang="css" scoped>
:deep(.el-descriptions__title) {
  width: 100%;
  text-align: center;
}
</style>
