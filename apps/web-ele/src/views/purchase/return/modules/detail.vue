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
import {
  getPurchaseReturnPrmById,
  getPurchaseReturnPrmSubListForDetail,
} from '#/api/purchase/return';

import { useDetailSchema, useSubColumns } from '../data';

const detailData = ref<Record<string, any>>({});
const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  showCancelButton: false,
  draggable: true,
  centered: true,
  width: 1500, // 增加宽度到1500px
  confirmText: '关闭',
  onConfirm: async () => {
    modalApi.close();
  },
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<Record<string, any>>();

      if (values && values.id) {
        // 如果有ID，调用API获取详细信息
        try {
          const response = await getPurchaseReturnPrmById(values.id);
          // 处理员工信息显示
          const pickerNames =
            response.data.pickingPersons
              ?.map((p: any) => p.realName || p.username)
              .join(', ') || '';
          const loaderNames =
            response.data.loadingPersons
              ?.map((p: any) => p.realName || p.username)
              .join(', ') || '';

          detailData.value = {
            ...values,
            ...response.data,
            pickerName: pickerNames,
            loaderName: loaderNames,
            pickingPersons: response.data.pickingPersons,
            loadingPersons: response.data.loadingPersons,
          };

          // 加载明细数据
          setTimeout(() => {
            gridApi.query();
          }, 100);
        } catch (error) {
          console.error('获取退货单详情失败:', error);
          detailData.value = values;
          // 加载明细数据
          setTimeout(() => {
            gridApi.query();
          }, 100);
        }
      } else if (values) {
        detailData.value = values;
        // 加载明细数据
        setTimeout(() => {
          gridApi.query();
        }, 100);
      }
    }
  },
  title: '退货详情',
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
          if (detailData.value?.id) {
            return getPurchaseReturnPrmSubListForDetail({
              mainId: detailData.value.id,
              code: detailData.value.code,
              pageNum: page.currentPage,
              pageSize: page.pageSize,
              sortParam: {
                field: sort.field || 'createTime',
                type: sort.order === 'asc' ? 1 : -1, // 排序类型, 1 正序 -1 倒序
              },
            });
          }
          return { data: [], total: 0 };
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
  <Modal class="max-h-5/6 h-5/6 w-[1000px]">
    <ElDescriptions :column="4" border title="" label-width="120">
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
