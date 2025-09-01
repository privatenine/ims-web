<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { PayableApi } from '#/api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  ElButton,
  ElButtonGroup,
  ElMessage,
  ElMessageBox,
  ElTag,
} from 'element-plus';

import { useSelectedRow, useVbenVxeGrid } from '#/adapter/vxe-table';
import { cavPayableSub, cavPayableSubBatch, getPayableSubList } from '#/api';
import { payableSubStatusFlagMap } from '#/utils';

import DetailSub from './detailSub.vue';

const detailData = ref<PayableApi.Payable>();

const [Modal, modalApi] = useVbenModal({
  fullscreen: false,
  fullscreenButton: true,
  showCancelButton: false,
  confirmText: '关闭',
  draggable: true,
  onConfirm: async () => {
    modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<PayableApi.Payable>();
      if (values) {
        detailData.value = values;
      }
    }
  },
  title: '应付款账单列表',
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: [
      {
        component: 'Input',
        fieldName: 'code',
        label: '付款流水号',
        componentProps: {
          placeholder: '请输入付款流水号',
          clearable: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'formCode',
        label: '核销单号',
        componentProps: {
          placeholder: '请输入核销单号',
          clearable: true,
        },
      },
      {
        component: 'Select',
        fieldName: 'statusFlag',
        label: '单据状态',
        componentProps: {
          placeholder: '请输入单据状态',
          clearable: true,
          options: [
            { label: '待结算', value: 1 },
            { label: '存档', value: 2 },
            { label: '驳回', value: 3 },
          ],
        },
      },
    ],
    submitOnChange: true,
    wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  },
  gridOptions: {
    columns: [
      { align: 'left', title: '', type: 'checkbox', width: 40 },
      { title: '序号', type: 'seq', width: 50 },
      {
        field: 'code',
        title: '付款流水号',
      },
      // {
      //   field: 'supplierName',
      //   title: '供应商',
      // },
      {
        field: 'typeNameZh',
        title: '单据类型',
        width: 80,
      },
      {
        field: 'statusFlag',
        title: '单据状态',
        width: 80,
        slots: { default: 'statusFlag' },
      },
      {
        field: 'totalNum',
        title: '单据总量',
        width: 80,
      },
      {
        field: 'balanceMoney',
        title: '应付金额(元)',
        width: 100,
      },
      {
        field: 'amountPaid',
        title: '已付金额(元)',
        width: 100,
      },
      {
        field: 'amountUnpaid',
        title: '未付金额(元)',
        width: 100,
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
          return await getPayableSubList({
            ...formValues,
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            mainId: detailData.value?.id,
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
    checkboxConfig: {
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
  } as VxeTableGridOptions<PayableApi.PayableSub>,
  gridEvents: {
    // cellClick: ({ row }) => {
    //   // message.info(`cell-click: ${row.name}`);
    // },
    // radioChange({ row }: { row: PayableApi.PayableSub }) {
    //   selectRow.value = row;
    // },
    sortChange({ column }) {
      const field = column?.field;
      const order = column?.order;

      if (field && order) {
        gridApi.query();
      }
    },
  } as VxeGridListeners<PayableApi.PayableSub>,
});

const [DetailSubModel, detailSubModelApi] = useVbenModal({
  connectedComponent: DetailSub,
  destroyOnClose: true,
});
function detailSubSelectRow() {
  const checkboxList = gridApi.grid.getCheckboxRecords();
  if (checkboxList.length > 1) {
    ElMessage({
      message: '只能查看一条数据的明细',
      type: 'warning',
    });
    return;
  }
  useSelectedRow(checkboxList[0])((data) => {
    detailSubModelApi.setData(data).open();
  });
}

function onCavPayableSub() {
  const checkboxList = gridApi.grid.getCheckboxRecords();
  if (!checkboxList) {
    ElMessage({
      message: '请选择要核销的数据',
      type: 'warning',
    });
    return;
  }

  const sum = checkboxList
    .map((n) => n.balanceMoney)
    .reduce((a, b) => a + b, 0);
  if (sum !== 0) {
    ElMessage({
      message: '选中单据金额总数不为0',
      type: 'error',
    });
    return;
  }

  cavPayableSub({ ids: checkboxList.map((n) => n.id) }).then(() => {
    ElMessage({
      message: '核销成功',
      type: 'success',
    });
  });
}

function onCavPayableSubBatch() {
  ElMessageBox.confirm('请确认是否要核销全部数据', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    detailData.value?.id &&
      cavPayableSubBatch({ mainId: detailData.value?.id }).then(() => {
        ElMessage({
          message: '核销成功',
          type: 'success',
        });
      });
  });
}
</script>
<template>
  <Modal class="w-4/5">
    <DetailSubModel />
    <Grid table-title="应付款账单列表" class="h-[500px] w-full">
      <template #statusFlag="{ row }">
        <ElTag
          :type="payableSubStatusFlagMap[row.statusFlag]?.color || 'danger'"
        >
          {{ payableSubStatusFlagMap[row.statusFlag]?.name || '未知' }}
        </ElTag>
      </template>
      <template #toolbar-tools>
        <ElButtonGroup class="ml-4">
          <ElButton type="primary" @click="onCavPayableSub">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="lucide:check"
            />
            核销
          </ElButton>
          <ElButton type="primary" @click="onCavPayableSubBatch">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="lucide:check-line"
            />
            一键核销
          </ElButton>
          <ElButton type="primary" @click="detailSubSelectRow">
            <IconifyIcon
              class="size-5"
              style="margin-right: 4px"
              icon="bx:detail"
            />
            产品明细
          </ElButton>
        </ElButtonGroup>
      </template>
    </Grid>
  </Modal>
</template>
<style lang="css" scoped></style>
