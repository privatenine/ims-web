<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { InStorageApi } from '#/api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getInStorageSubByMainId } from '#/api';
import { statusFlagMap } from '#/utils';

const detailData = ref<Record<string, any>>({});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  showCancelButton: false,
  draggable: true,
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
  title: '应收账单产品明细',
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { align: 'center', title: '', type: 'radio', width: 40 },
      { title: '序号', type: 'seq', width: 50 },
      {
        field: 'code',
        title: '核销单据',
        width: 160,
      },

      {
        field: 'productName',
        title: '产品名称',
        width: 160,
      },
      {
        field: 'actiNum',
        title: '数量',
        width: 80,
      },
      {
        field: 'price',
        title: '单价',
        width: 80,
      },
      {
        field: 'totalPrice',
        title: '金额',
        width: 80,
      },
      {
        field: 'a',
        title: '单据类型',
        width: 80,
        formatter: () => detailData.value?.typeNameZh || '',
      },
      {
        field: 'supplierName',
        title: '供应商',
        width: 80,
      },
      // {
      //   field: 'amountUnpaid',
      //   title: '产品简称',
      //   width: 80,
      // },
      {
        field: 'status',
        title: '单据状态',
        width: 80,
        slots: { default: 'status' },
      },
      // {
      //   field: 'amountUnpaid',
      //   title: '单据总量',
      //   width: 80,
      // },
      // {
      //   field: 'amountUnpaid',
      //   title: '应付金额',
      //   width: 80,
      // },
      // {
      //   field: 'amountUnpaid',
      //   title: '已付金额',
      //   width: 80,
      // },
      // {
      //   field: 'amountUnpaid',
      //   title: '未付金额',
      //   width: 80,
      // },
      // {
      //   field: 'amountUnpaid',
      //   title: '未付金额',
      //   width: 80,
      // },
      // {
      //   field: 'amountUnpaid',
      //   title: '付款流水号',
      //   width: 80,
      // },
      // {
      //   field: 'amountUnpaid',
      //   title: '备注',
      //   width: 80,
      // },
      {
        field: 'productPlaceName',
        title: '产地',
        width: 80,
      },
      {
        field: 'productAttachmentNames',
        title: '附件',
        // width: 90,
      },
    ],
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
          return await getInStorageSubByMainId({
            ...formValues,
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            warehousingId: detailData.value?.formId,
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
  } as VxeTableGridOptions<InStorageApi.InStorageSubVo>,
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
  } as VxeGridListeners<InStorageApi.InStorageSubVo>,
});
</script>
<template>
  <Modal class="w-4/5">
    <Grid table-title="应收款账单列表" class="h-[500px] w-full">
      <template #status="{ row }">
        {{ statusFlagMap[row.warehousingMainRespVO?.statusFlag || 0]?.name }}
      </template>
    </Grid>
  </Modal>
</template>
<style lang="css" scoped></style>
