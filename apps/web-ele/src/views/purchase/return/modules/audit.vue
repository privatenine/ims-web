<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { InStorageApi } from '#/api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  ElButton,
  ElButtonGroup,
  ElDescriptions,
  ElDescriptionsItem,
} from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  approveInstorage,
  getInStorageSubByMainId,
  rejectInstorage,
} from '#/api';

import { useDetailSchema, useSubColumns } from '../data';

const emits = defineEmits(['success']);
const detailData = ref<InStorageApi.InStorage>();
const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  showCancelButton: false,
  draggable: true,
  centered: true,
  confirmText: '关闭',
  onConfirm: async () => {
    modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<InStorageApi.InStorage>();
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
            warehousingId: detailData.value?.id,
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
  } as VxeGridListeners<InStorageApi.InStorageSub>,
});

function uptStatus(flag: number) {
  modalApi.lock();
  const params = {
    mainId: detailData.value?.id,
    version: detailData.value?.version,
  };
  (flag ? approveInstorage(params) : rejectInstorage(params))
    .then(() => {
      emits('success');
      modalApi.close();
    })
    .finally(() => {
      modalApi.unlock();
    });
}
</script>
<template>
  <Modal class="max-h-5/6 mr-0 w-4/5">
    <ElDescriptions
      :column="4"
      border
      title="入库单基本信息"
      label-width="110"
      style="margin-bottom: 10px"
    >
      <ElDescriptionsItem
        label-align="right"
        v-for="{ fieldName, label } in useDetailSchema()"
        :key="fieldName"
      >
        <template #label>
          <div class="cell-item">{{ label }}</div>
        </template>
        {{ detailData[fieldName] }}
      </ElDescriptionsItem>
    </ElDescriptions>
    <ElButtonGroup class="ml-4">
      <ElButton type="primary" @click="uptStatus(0)">
        <IconifyIcon
          icon="mdi:selection-remove"
          class="size-5"
          style="margin-right: 4px"
        />
        驳回
      </ElButton>
      <ElButton type="primary" @click="uptStatus(1)">
        <IconifyIcon
          icon="material-symbols:select-check-box-rounded"
          class="size-5"
          style="margin-right: 4px"
        />
        入库
      </ElButton>
    </ElButtonGroup>
    <Grid table-title="明细列表" class="vp-raw h-[500px] w-full" />
  </Modal>
</template>
<style lang="css" scoped></style>
