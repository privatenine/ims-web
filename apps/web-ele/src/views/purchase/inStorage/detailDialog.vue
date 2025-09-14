<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { InStorageApi } from '#/api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElDescriptions, ElDescriptionsItem } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getInStorageSubByMainId } from '#/api';

import { useDetailSchema, useSubColumns } from './data';

const detailData = ref<Record<string, any>>({});
const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  showCancelButton: false,
  draggable: true,
  centered: true,
  width: 900,
  confirmText: '关闭',
  onConfirm: async () => {
    modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<Record<string, any>>();
      if (values) {
        detailData.value = values;
      }
    }
  },
  title: '入库详情',
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useSubColumns(),
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
        query: ({ page, sort }) => {
          return getInStorageSubByMainId({
            warehousingId: detailData.value.id,
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
  } as VxeTableGridOptions<InStorageApi.InStorageSub>,
  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: InStorageApi.InStorage }) {
    //   selectRow.value = row;
    // },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<InStorageApi.InStorage>,
});
</script>
<template>
  <Modal class="max-h-5/6 h-5/6">
    <ElDescriptions
      :column="4"
      border
      title="入库单基本信息"
      label-width="120"
    >
      <ElDescriptionsItem
        label-align="right"
        v-for="{ fieldName, label } in useDetailSchema()"
        :key="fieldName"
        label-class-name="my-label"
        class-name="my-content"
      >
        <template #label>
          <div>{{ label }}</div>
        </template>
        <div>
          {{ detailData[fieldName] }}
        </div>
      </ElDescriptionsItem>
    </ElDescriptions>

    <Grid table-title="明细列表" class="vp-raw h-full w-full" />
  </Modal>
</template>
<style lang="css" scoped>
:deep(.my-label) {
  width: 120px;
}

:deep(.my-content) {
  width: 200px;
}
</style>
